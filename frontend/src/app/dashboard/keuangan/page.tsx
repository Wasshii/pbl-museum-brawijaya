"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Upload, Download, Search, X } from "lucide-react";
import KeuanganCards from "@/components/keuangan/KeuanganCards";
import KeuanganTable from "@/components/keuangan/KeuanganTable";
import RentangTanggalPicker from "@/components/keuangan/RentangTanggalPicker";
import KeuanganIsiSaldoModal from "@/components/keuangan/KeuanganIsiSaldoModal";
import KeuanganPencairanModal from "@/components/keuangan/KeuanganPencairanModal";
import KeuanganDetailModal from "@/components/keuangan/KeuanganDetailModal";
import { useKeuangan, type TabKeuangan } from "@/hooks/useKeuangan";

const TOMBOL_AKSI =
    "flex flex-col items-center justify-center bg-[#222222] hover:bg-black transition-all hover:scale-[1.02] w-full max-w-[120px] h-[110px] rounded-[20px] text-white cursor-pointer border-0 shadow-sm";

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

function KeuanganContent() {
    const {
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
    } = useKeuangan();

    // Buka tab langsung lewat alamat: /dashboard/keuangan?tab=keluar
    const tabQuery = useSearchParams().get("tab");
    useEffect(() => {
        if (tabQuery === "masuk" || tabQuery === "keluar") {
            setTab(tabQuery as TabKeuangan);
        }
    }, [tabQuery, setTab]);

    return (
        <div className="w-full flex flex-col font-sans animate-in fade-in duration-500 pb-10">
            <h2 className="text-[26px] font-bold text-black mb-8">Keuangan</h2>

            {/* Kartu atas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <KeuanganCards
                    pemasukan={summary.totalPemasukan}
                    pengeluaran={summary.totalPengeluaran}
                />

                <div className="bg-white rounded-[24px] p-6 flex items-center justify-center gap-5 shadow-sm border border-gray-100">
                    <button
                        onClick={() => setModalAktif("pencairan")}
                        className={TOMBOL_AKSI}>
                        <Upload className="w-6 h-6 mb-2" />
                        <span className="font-semibold text-[13px]">
                            Pencairan
                        </span>
                    </button>
                    <button
                        onClick={() => setModalAktif("isiSaldo")}
                        className={TOMBOL_AKSI}>
                        <Download className="w-6 h-6 mb-2" />
                        <span className="font-semibold text-[13px]">
                            Isi Saldo
                        </span>
                    </button>
                </div>
            </div>

            {/* Tab dan filter */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
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

            {loading && jumlahMasuk + jumlahKeluar === 0 ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#6C9E78] border-t-transparent" />
                </div>
            ) : (
                <KeuanganTable
                    tab={tab}
                    transaksi={daftar}
                    onDetail={setDetail}
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
            />

            <KeuanganDetailModal
                data={detail}
                onClose={() => setDetail(null)}
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
