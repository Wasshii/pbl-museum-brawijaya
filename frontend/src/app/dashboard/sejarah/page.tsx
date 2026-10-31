"use client";
import { Plus } from "lucide-react";
import SearchInput from "@/components/ui/SearchInput";
import SejarahTable from "@/components/sejarah/SejarahTable";
import SejarahFormModal from "@/components/sejarah/SejarahFormModal";
import SejarahDetailModal from "@/components/sejarah/SejarahDetailModal";
import SejarahDeleteModal from "@/components/sejarah/SejarahDeleteModal";
import { useSejarah } from "@/hooks/useSejarah";

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
        <div className="w-full animate-in fade-in duration-500 pb-10">
            <h2 className="text-[26px] font-bold text-black mb-8">
                Koleksi Sejarah
            </h2>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="w-full md:w-[380px]">
                    <SearchInput
                        value={searchQuery}
                        onChange={(val) => setSearchQuery(val)}
                        placeholder="Cari Berdasarkan Token / Nama Benda"
                    />
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-[#222222] hover:bg-black text-white px-6 py-3 rounded-full font-bold text-[14px] transition-colors cursor-pointer shadow-sm border-0">
                    <Plus className="w-5 h-5" /> Tambahkan Koleksi
                </button>
            </div>

            {loading && koleksi.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#222222] border-t-transparent" />
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

            <SejarahDeleteModal
                isOpen={modalDeleteOpen}
                onClose={() => setModalDeleteOpen(false)}
                onConfirm={confirmDelete}
                itemName={selectedItem?.nama ?? ""}
            />
        </div>
    );
}
