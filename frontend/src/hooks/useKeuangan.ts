"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { useCache } from "@/hooks/useCache";
import { getErrorMessage } from "@/lib/api";
import { CACHE_KEYS, removeCache } from "@/lib/cache";
import { formatRupiah, todayISO } from "@/lib/format";
import { cocokPeriode } from "@/lib/keuangan";
import * as keuanganService from "@/services/keuangan.service";
import type {
    BatasPencairan,
    DaftarPenyedia,
    IsiSaldoInput,
    KeuanganResponse,
    KeuanganSummary,
    PencairanInput,
    PeriodeKeuangan,
    Tarif,
    TransaksiData,
    TransaksiInput,
} from "@/types/keuangan";

// Tetap diekspor dari sini supaya import lama
// (import { TransaksiData } from "@/hooks/useKeuangan") tidak error.
export type { TransaksiData, PeriodeKeuangan };

export type ModalKeuangan = "isiSaldo" | "pencairan" | null;
export type TabKeuangan = "masuk" | "keluar";
export interface RentangTanggal {
    dari: string; // yyyy-mm-dd, kosong = tanpa batas
    sampai: string;
}

// Jumlah baris per halaman tabel
export const BARIS_PER_HALAMAN = 10;

// Seberapa sering data diambil ulang dari server (pesanan baru dari mobile masuk kapan saja)
const SEGARKAN_MS = 15_000;

const TRANSAKSI_KOSONG: TransaksiData[] = [];
const RENTANG_KOSONG: RentangTanggal = { dari: "", sampai: "" };
const SUMMARY_KOSONG: KeuanganSummary = {
    totalPemasukan: 0,
    totalPengeluaran: 0,
    saldo: 0,
};
const TARIF_KOSONG: Tarif = { hargaTiket: 0, biayaPemandu: 0 };
const BATAS_KOSONG: BatasPencairan = {
    maksimumPerBulan: 0, // 0 = belum dimuat dari backend
    terpakaiBulanIni: 0,
    sisa: 0,
};
const PENYEDIA_KOSONG: DaftarPenyedia = { bank: [], eWallet: [] };

export function useKeuangan() {
    const { notify } = useToast();

    // Satu paket data dari GET /api/keuangan (transaksi, ringkasan, tarif, batas, penyedia):
    // dari cache (5 menit) bila ada, kalau tidak dari API
    const {
        data: respons,
        loading,
        refetch: fetchKeuangan,
    } = useCache<KeuanganResponse>(
        CACHE_KEYS.keuangan,
        keuanganService.getKeuangan,
        {
            onError: (error) =>
                notify({
                    type: "error",
                    title: "Gagal",
                    message: getErrorMessage(
                        error,
                        "Gagal memuat data keuangan",
                    ),
                }),
        },
    );
    const transaksi = respons?.data ?? TRANSAKSI_KOSONG;
    const summary = respons?.summary ?? SUMMARY_KOSONG;
    const tarif = respons?.tarif ?? TARIF_KOSONG;
    const batas = respons?.batasPencairan ?? BATAS_KOSONG;
    const penyedia = respons?.penyedia ?? PENYEDIA_KOSONG;

    const [submitting, setSubmitting] = useState(false);

    // Cache 5 menit terlalu lama untuk pesanan dari aplikasi mobile: data diambil ulang
    // saat halaman dibuka, lalu tiap 15 detik selama halaman ini terbuka.
    useEffect(() => {
        void fetchKeuangan();
        const timer = setInterval(() => {
            void fetchKeuangan();
        }, SEGARKAN_MS);
        return () => clearInterval(timer);
    }, [fetchKeuangan]);

    const [periode, setPeriodeState] = useState<PeriodeKeuangan>("bulan");
    const [tab, setTabState] = useState<TabKeuangan>("masuk");
    const [rentang, setRentangState] = useState<RentangTanggal>(RENTANG_KOSONG);
    const [searchQuery, setSearchState] = useState("");
    const [halaman, setHalaman] = useState(1);

    const [modalAktif, setModalAktif] = useState<ModalKeuangan>(null);
    const [detail, setDetail] = useState<TransaksiData | null>(null);

    // Setiap filter berubah -> kembali ke halaman 1.
    // Dibungkus useCallback supaya identitasnya stabil (page.tsx memakai setTab di useEffect).
    const setTab = useCallback((nilai: TabKeuangan) => {
        setTabState(nilai);
        setHalaman(1);
    }, []);

    // Pilih periode -> rentang kustom dibersihkan supaya dua filter tidak saling bentrok
    const setPeriode = useCallback((nilai: PeriodeKeuangan) => {
        setPeriodeState(nilai);
        setRentangState(RENTANG_KOSONG);
        setHalaman(1);
    }, []);

    // Pilih rentang kustom -> periode pindah ke "semua" supaya rentang tidak
    // terpotong lagi oleh "Hari Ini" / "Bulan Ini"
    const setRentang = useCallback((nilai: RentangTanggal) => {
        setRentangState(nilai);
        if (nilai.dari || nilai.sampai) setPeriodeState("semua");
        setHalaman(1);
    }, []);

    const setSearchQuery = useCallback((nilai: string) => {
        setSearchState(nilai);
        setHalaman(1);
    }, []);

    // Tanggal hari ini (zona waktu perangkat), yyyy-mm-dd
    const hariIni = todayISO();

    // Kartu atas: ikut menu periode (Hari Ini / Bulan Ini / Total Keseluruhan).
    // Hanya transaksi berstatus berhasil, sama seperti perhitungan backend.
    const ringkasanPeriode = useMemo(() => {
        if (periode === "semua") {
            return {
                pemasukan: summary.totalPemasukan,
                pengeluaran: summary.totalPengeluaran,
            };
        }
        let pemasukan = 0;
        let pengeluaran = 0;
        for (const item of transaksi) {
            if (item.status !== "berhasil") continue;
            if (!cocokPeriode(item.tanggal, periode, hariIni)) continue;
            if (item.tipe === "pemasukan") pemasukan += item.jumlah;
            else pengeluaran += item.jumlah;
        }
        return { pemasukan, pengeluaran };
    }, [transaksi, summary, periode, hariIni]);

    // Tabel: periode + rentang tanggal kustom + cari Id Trx.
    // Tanggal dibandingkan sebagai teks yyyy-mm-dd, jadi batasnya inklusif
    // dan tidak bergeser karena zona waktu.
    const tersaring = useMemo(() => {
        const q = searchQuery.trim();
        return transaksi.filter((item) => {
            if (!cocokPeriode(item.tanggal, periode, hariIni)) return false;
            if (rentang.dari && item.tanggal < rentang.dari) return false;
            if (rentang.sampai && item.tanggal > rentang.sampai) return false;
            if (q && !(item.idTrx ?? "").includes(q)) return false;
            return true;
        });
    }, [transaksi, periode, hariIni, rentang, searchQuery]);

    const jumlahMasuk = tersaring.filter((t) => t.tipe === "pemasukan").length;
    const jumlahKeluar = tersaring.length - jumlahMasuk;

    const daftar = useMemo(
        () =>
            tersaring.filter(
                (t) =>
                    t.tipe === (tab === "masuk" ? "pemasukan" : "pengeluaran"),
            ),
        [tersaring, tab],
    );

    // Pagination (di sisi klien, karena backend mengirim semua transaksi sekaligus)
    const totalHalaman = Math.max(1, Math.ceil(daftar.length / BARIS_PER_HALAMAN));
    const halamanAktif = Math.min(halaman, totalHalaman);
    const daftarHalaman = useMemo(
        () =>
            daftar.slice(
                (halamanAktif - 1) * BARIS_PER_HALAMAN,
                halamanAktif * BARIS_PER_HALAMAN,
            ),
        [daftar, halamanAktif],
    );

    // Kirim ke backend. Mengembalikan true kalau berhasil.
    // Saldo dicek lagi di backend, jadi aman walau data di layar sudah usang.
    const kirim = async (payload: TransaksiInput): Promise<boolean> => {
        setSubmitting(true);
        try {
            const hasil = await keuanganService.tambahKeuangan(payload);

            // Setelah berhasil, pindah ke tab yang relevan (sama seperti target)
            if (payload.tipe === "pemasukan") {
                notify({
                    type: "create",
                    title: "Transaksi Berhasil Ditambahkan!",
                    message: `Data transaksi untuk ${payload.nama} (${payload.jumlahTiket} tiket) senilai ${formatRupiah(hasil.jumlah)} berhasil dicatat.`,
                });
                setTab("masuk");
            } else {
                notify({
                    type: "success",
                    title: "Pencairan Berhasil!",
                    message: `Pencairan dana sebesar ${formatRupiah(hasil.jumlah)} ke ${payload.penyedia} berhasil diproses.`,
                });
                setTab("keluar");
            }

            setModalAktif(null);
            removeCache(CACHE_KEYS.dashboard); // saldo di dashboard ikut berubah
            await fetchKeuangan(); // ambil ulang, cache keuangan ikut diperbarui
            return true;
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: getErrorMessage(error, "Gagal memproses transaksi."),
            });
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    // Admin menyetujui pembayaran tunai dari aplikasi mobile
    const konfirmasi = async (item: TransaksiData) => {
        try {
            await keuanganService.konfirmasiKeuangan(item.id);
            notify({
                type: "success",
                title: "Pembayaran dikonfirmasi",
                message: `Pesanan ${item.idTrx ?? ""} atas nama ${item.nama ?? "-"} sudah dibayar.`,
            });
            setDetail(null);
            removeCache(CACHE_KEYS.dashboard);
            await fetchKeuangan();
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: getErrorMessage(error, "Gagal mengonfirmasi pembayaran."),
            });
        }
    };

    const handleIsiSaldo = (data: IsiSaldoInput) => kirim(data);
    const handlePencairan = (data: PencairanInput) => kirim(data);

    return {
        // data tabel
        daftar,
        daftarHalaman,
        adaData: transaksi.length > 0,
        jumlahMasuk,
        jumlahKeluar,
        // kartu & info
        summary,
        ringkasanPeriode,
        tarif,
        batas,
        penyedia,
        loading,
        submitting,
        // filter
        periode,
        setPeriode,
        tab,
        setTab,
        rentang,
        setRentang,
        searchQuery,
        setSearchQuery,
        // pagination
        halaman: halamanAktif,
        setHalaman,
        totalHalaman,
        // modal
        modalAktif,
        setModalAktif,
        detail,
        setDetail,
        handleIsiSaldo,
        handlePencairan,
        konfirmasi,
    };
}
