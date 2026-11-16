"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Upload, Download, Search, X, Clock, Calendar } from "lucide-react";
import KeuanganCards from "@/components/keuangan/KeuanganCards";
import KeuanganTable from "@/components/keuangan/KeuanganTable";
import RentangTanggalPicker from "@/components/keuangan/RentangTanggalPicker";
import KeuanganIsiSaldoModal from "@/components/keuangan/KeuanganIsiSaldoModal";
import KeuanganPencairanModal from "@/components/keuangan/KeuanganPencairanModal";
import KeuanganDetailModal from "@/components/keuangan/KeuanganDetailModal";
import {
    BARIS_PER_HALAMAN,
    useKeuangan,
    type PeriodeKeuangan,
    type TabKeuangan,
} from "@/hooks/useKeuangan";
import { tanggalPanjang } from "@/lib/format";

function Tab({
    label,
    jumlah,
    aktif,
    onClick,
}: {
    label: string;
    jumlah: number;
    aktif: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`pb-2 cursor-pointer border-b-[3px] transition-colors border-0 bg-transparent p-0 ${
                aktif
                    ? "border-black text-black"
                    : "border-transparent text-[#888888] hover:text-black"
            }`}>
            <span className="text-[20px] font-bold">{label}</span>
            <span className="ml-2 text-xs py-0.5 px-2 bg-gray-100 text-gray-700 rounded-full font-bold">
                {jumlah}
            </span>
        </button>
    );
}

const MENU_PERIODE: {
    nilai: PeriodeKeuangan;
    label: string;
    ikon?: React.ReactNode;
}[] = [
    { nilai: "hari", label: "Hari Ini", ikon: <Clock className="w-3 h-3" /> },
    {
        nilai: "bulan",
        label: "Bulan Ini",
        ikon: <Calendar className="w-3 h-3" />,
    },
    { nilai: "semua", label: "Total Keseluruhan" },
];

// Tombol pilihan periode yang menyatu (segmented control)
function MenuPeriode({
    value,
    onChange,
}: {
    value: PeriodeKeuangan;
    onChange: (p: PeriodeKeuangan) => void;
}) {
    return (
        <div className="inline-flex items-center bg-[#f0f0f2] p-1 rounded-xl border border-gray-200/80 shadow-xs">
            {MENU_PERIODE.map((m) => (
                <button
                    key={m.nilai}
                    type="button"
                    onClick={() => onChange(m.nilai)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer border-0 ${
                        value === m.nilai
                            ? "bg-white text-black font-bold shadow-xs"
                            : "bg-transparent text-gray-500 hover:text-black font-medium"
                    }`}>
                    {m.ikon}
                    <span>{m.label}</span>
                </button>
            ))}
        </div>
    );
}

function KeuanganContent() {
    const {
        daftar,
        daftarHalaman,
        adaData,
        jumlahMasuk,
        jumlahKeluar,
        summary,
        ringkasanPeriode,
        tarif,
        batas,
        penyedia,
        loading,
        submitting,
        periode,
        setPeriode,
        tab,
        setTab,
        rentang,
        setRentang,
        searchQuery,
        setSearchQuery,
        halaman,
        setHalaman,
        totalHalaman,
        modalAktif,
        setModalAktif,
        detail,
        setDetail,
        handleIsiSaldo,
        handlePencairan,
        konfirmasi,
    } = useKeuangan();

    // Buka tab langsung lewat alamat: /dashboard/keuangan?tab=keluar
    const tabQuery = useSearchParams().get("tab");
    useEffect(() => {
        if (tabQuery === "masuk" || tabQuery === "keluar") {
            setTab(tabQuery as TabKeuangan);
        }
    }, [tabQuery, setTab]);

    const rentangAktif = Boolean(rentang.dari || rentang.sampai);
    const sekarang = new Date();
    const teksPeriode = rentangAktif
        ? "RENTANG KUSTOM"
        : periode === "hari"
          ? `HARI INI (${tanggalPanjang(sekarang)})`
          : periode === "bulan"
            ? `BULAN INI (${sekarang.toLocaleDateString("id-ID", { month: "long", year: "numeric" })})`
            : "TOTAL KESELURUHAN";

    return (
        <div className="w-full flex flex-col font-sans animate-in fade-in duration-500 pb-10">
            {/* Header: judul, tombol aksi, menu periode */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-7">
                <div>
                    <h2 className="text-[26px] font-bold text-black tracking-tight">
                        Keuangan Museum
                    </h2>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                        Monitoring arus kas pemasukan dan pengeluaran museum
                        Brawijaya
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setModalAktif("pencairan")}
                            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-black border border-gray-300 hover:border-black px-4 py-2 rounded-full font-bold text-xs transition-all shadow-xs cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Pencairan</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setModalAktif("isiSaldo")}
                            className="flex items-center gap-2 bg-[#222222] hover:bg-black text-white px-4 py-2 rounded-full font-bold text-xs transition-all shadow-xs cursor-pointer border-0">
                            <Download className="w-3.5 h-3.5" />
                            <span>Isi Saldo</span>
                        </button>
                    </div>

                    <div className="hidden sm:block h-6 w-px bg-gray-200" />

                    <MenuPeriode value={periode} onChange={setPeriode} />
                </div>
            </div>

            {/* Kartu ringkasan (ikut menu periode) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <KeuanganCards
                    pemasukan={ringkasanPeriode.pemasukan}
                    pengeluaran={ringkasanPeriode.pengeluaran}
                    periode={periode}
                />
            </div>

            {/* Tab dan filter */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3 gap-4">
                <div className="flex items-center gap-8">
                    <Tab
                        label="Uang Masuk"
                        jumlah={jumlahMasuk}
                        aktif={tab === "masuk"}
                        onClick={() => setTab("masuk")}
                    />
                    <Tab
                        label="Uang Keluar"
                        jumlah={jumlahKeluar}
                        aktif={tab === "keluar"}
                        onClick={() => setTab("keluar")}
                    />
                </div>

                <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto">
                    <RentangTanggalPicker
                        value={rentang}
                        onChange={setRentang}
                    />

                    <div className="flex items-center gap-3 bg-[#222222] text-white px-5 py-3 rounded-full flex-1 sm:w-[260px] shadow-sm">
                        <Search className="w-4 h-4 text-white/80 shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari Id Trx..."
                            className="bg-transparent border-none outline-none text-[13px] font-semibold text-white w-full placeholder:text-white/60"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-white/60 hover:text-white cursor-pointer bg-transparent border-none p-0 shrink-0">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Indikator filter aktif */}
            <div className="mb-4 flex items-center justify-between text-xs text-gray-500 font-medium px-1">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                    <span>
                        Filter Periode Aktif:{" "}
                        <b className="text-black">{teksPeriode}</b>
                    </span>
                </div>
                <span>Menampilkan {daftar.length} transaksi</span>
            </div>

            {loading && !adaData ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#6C9E78] border-t-transparent" />
                </div>
            ) : (
                <KeuanganTable
                    tab={tab}
                    transaksi={daftarHalaman}
                    onDetail={setDetail}
                    halaman={halaman}
                    totalHalaman={totalHalaman}
                    totalData={daftar.length}
                    perHalaman={BARIS_PER_HALAMAN}
                    onHalaman={setHalaman}
                />
            )}

            <KeuanganIsiSaldoModal
                isOpen={modalAktif === "isiSaldo"}
                onClose={() => setModalAktif(null)}
                onSubmit={handleIsiSaldo}
                submitting={submitting}
                tarif={tarif}
            />

            <KeuanganPencairanModal
                isOpen={modalAktif === "pencairan"}
                onClose={() => setModalAktif(null)}
                onSubmit={handlePencairan}
                submitting={submitting}
                saldo={summary.saldo}
                batas={batas}
                penyedia={penyedia}
            />

            <KeuanganDetailModal
                data={detail}
                onClose={() => setDetail(null)}
                onKonfirmasi={konfirmasi}
            />
        </div>
    );
}

// useSearchParams di Next.js wajib dibungkus Suspense
export default function KeuanganPage() {
    return (
        <Suspense>
            <KeuanganContent />
        </Suspense>
    );
}
