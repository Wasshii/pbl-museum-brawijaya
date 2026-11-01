"use client";
import { useState, useMemo } from "react";
import { useToast } from "@/context/ToastContext";
import { useCache } from "@/hooks/useCache";
import { getErrorMessage } from "@/lib/api";
import { CACHE_KEYS, removeCache } from "@/lib/cache";
import { formatRupiah } from "@/lib/format";
import * as keuanganService from "@/services/keuangan.service";
import type {
    BatasPencairan,
    IsiSaldoInput,
    KeuanganResponse,
    KeuanganSummary,
    PencairanInput,
    Tarif,
    TransaksiData,
    TransaksiInput,
} from "@/types/keuangan";

// Tetap diekspor dari sini supaya import lama
// (import { TransaksiData } from "@/hooks/useKeuangan") tidak error.
export type { TransaksiData };

export type ModalKeuangan = "isiSaldo" | "pencairan" | null;
export type TabKeuangan = "masuk" | "keluar";
export interface RentangTanggal {
    dari: string; // yyyy-mm-dd, kosong = tanpa batas
    sampai: string;
}

const TRANSAKSI_KOSONG: TransaksiData[] = [];
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

export function useKeuangan() {
    const { notify } = useToast();

    // Satu paket data dari GET /api/keuangan (transaksi, ringkasan, tarif, batas):
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

    const [submitting, setSubmitting] = useState(false);

    const [tab, setTab] = useState<TabKeuangan>("masuk");
    const [rentang, setRentang] = useState<RentangTanggal>({
        dari: "",
        sampai: "",
    });
    const [searchQuery, setSearchQuery] = useState("");

    const [modalAktif, setModalAktif] = useState<ModalKeuangan>(null);
    const [detail, setDetail] = useState<TransaksiData | null>(null);

    // Filter tanggal + cari Id Trx. Kartu di atas TIDAK ikut filter (total keseluruhan);
    // angka di tab dan isi tabel ikut filter. Tanggal dibandingkan sebagai teks
    // yyyy-mm-dd, jadi batasnya inklusif dan tidak bergeser karena zona waktu.
    const tersaring = useMemo(() => {
        const q = searchQuery.trim();
        return transaksi.filter((item) => {
            if (rentang.dari && item.tanggal < rentang.dari) return false;
            if (rentang.sampai && item.tanggal > rentang.sampai) return false;
            if (q && !(item.idTrx ?? "").includes(q)) return false;
            return true;
        });
    }, [transaksi, rentang, searchQuery]);

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
                    message: `Pencairan dana sebesar ${formatRupiah(hasil.jumlah)} berhasil diproses via ${payload.jenisPencairan}.`,
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

    const handleIsiSaldo = (data: IsiSaldoInput) => kirim(data);
    const handlePencairan = (data: PencairanInput) => kirim(data);

    return {
        daftar,
        jumlahMasuk,
        jumlahKeluar,
        summary,
        tarif,
        batas,
        loading,
        submitting,
        tab,
        setTab,
        rentang,
        setRentang,
        searchQuery,
        setSearchQuery,
        modalAktif,
        setModalAktif,
        detail,
        setDetail,
        handleIsiSaldo,
        handlePencairan,
    };
}
