"use client";
import { Plus } from "lucide-react";
import SearchInput from "@/components/ui/SearchInput";
import KeuanganCards from "@/components/keuangan/KeuanganCards";
import KeuanganTable from "@/components/keuangan/KeuanganTable";
import KeuanganFormModal from "@/components/keuangan/KeuanganFormModal";
import { useKeuangan } from "@/hooks/useKeuangan";

export default function KeuanganPage() {
    const {
        transaksi,
        loading,
        searchQuery,
        setSearchQuery,
        modalFormOpen,
        setModalFormOpen,
        formData,
        setFormData,
        totalSaldo,
        totalPemasukan,
        totalPengeluaran,
        handleAdd,
        handleSubmit,
        formatRupiah,
    } = useKeuangan();

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-[24px] md:text-[28px] font-bold text-gray-900 tracking-tight m-0">
                    Keuangan
                </h1>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Menggunakan format onChange yang sudah benar agar tidak error string */}
                    <SearchInput
                        value={searchQuery}
                        onChange={(val) => setSearchQuery(val)}
                        placeholder="Cari deskripsi..."
                    />

                    <button
                        onClick={handleAdd}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#6C9E78] text-white px-5 py-2.5 rounded-xl hover:bg-[#5a8664] transition-colors shadow-sm font-medium border-0 cursor-pointer">
                        <Plus className="w-5 h-5" />
                        <span>Tambah Transaksi</span>
                    </button>
                </div>
            </div>

            <KeuanganCards
                saldo={formatRupiah(totalSaldo)}
                pemasukan={formatRupiah(totalPemasukan)}
                pengeluaran={formatRupiah(totalPengeluaran)}
            />

            {loading && transaksi.length === 0 ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#6C9E78] border-t-transparent" />
                </div>
            ) : (
                <KeuanganTable
                    transaksi={transaksi}
                    formatRupiah={formatRupiah}
                />
            )}

            <KeuanganFormModal
                isOpen={modalFormOpen}
                onClose={() => setModalFormOpen(false)}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                loading={loading}
            />
        </div>
    );
}
