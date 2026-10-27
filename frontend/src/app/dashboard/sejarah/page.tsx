"use client";
import { Plus } from "lucide-react";
import SearchInput from "@/components/ui/SearchInput";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import SejarahTable from "@/components/sejarah/SejarahTable";
import SejarahFormModal from "@/components/sejarah/SejarahFormModal";
import SejarahDetailModal from "@/components/sejarah/SejarahDetailModal";
import { useSejarah } from "@/hooks/useSejarah"; // Pastikan hook ini sudah dibuat di Tahap 5

export default function SejarahPage() {
    const {
        koleksi,
        loading,
        searchQuery,
        setSearchQuery,
        formData,
        setFormData,
        isEdit,
        modalFormOpen,
        setModalFormOpen,
        modalDetailOpen,
        setModalDetailOpen,
        modalDeleteOpen,
        setModalDeleteOpen,
        selectedItem,
        handleAdd,
        handleEdit,
        handleDeleteClick,
        handleView,
        handleSubmit,
        confirmDelete,
    } = useSejarah();

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-[24px] md:text-[28px] font-bold text-gray-900 tracking-tight m-0">
                    Data Sejarah (Koleksi)
                </h1>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <SearchInput
                        value={searchQuery}
                        onChange={(val) => setSearchQuery(val)}
                        placeholder="Cari nama koleksi..."
                    />

                    <button
                        onClick={handleAdd}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#6C9E78] text-white px-5 py-2.5 rounded-xl hover:bg-[#5a8664] transition-colors shadow-sm font-medium border-0 cursor-pointer">
                        <Plus className="w-5 h-5" />
                        <span>Tambah Koleksi</span>
                    </button>
                </div>
            </div>

            {loading && koleksi.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#6C9E78] border-t-transparent" />
                </div>
            ) : (
                <SejarahTable
                    koleksi={koleksi}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            )}

            <SejarahFormModal
                isOpen={modalFormOpen}
                onClose={() => setModalFormOpen(false)}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isEdit={isEdit}
                loading={loading}
            />

            <SejarahDetailModal
                isOpen={modalDetailOpen}
                onClose={() => setModalDetailOpen(false)}
                item={selectedItem}
            />

            <ConfirmDeleteModal
                isOpen={modalDeleteOpen}
                onClose={() => setModalDeleteOpen(false)}
                onConfirm={confirmDelete}
                itemName={selectedItem?.nama_koleksi ?? ""}
            />
        </div>
    );
}
