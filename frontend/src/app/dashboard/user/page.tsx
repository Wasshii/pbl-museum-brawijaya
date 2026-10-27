"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ConfirmDeleteDialog from "@/components/ui/ConfirmDeleteDialog";
import SearchInput from "@/components/ui/SearchInput";
import UserDetailModal from "@/components/user/UserDetailModal";
import UserFormModal from "@/components/user/UserFormModal";
import UserTable from "@/components/user/UserTable";
import { useUsers } from "@/hooks/useUsers";
import type { User } from "@/types/user";

export default function DataUserPage() {
    // Data dan logika (cari, tambah, ubah, hapus) ada di hook
    const { users, search, setSearch, addUser, editUser, removeUser } =
        useUsers();

    // State yang murni tampilan tetap di halaman
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [detailUser, setDetailUser] = useState<User | null>(null);
    const [editTarget, setEditTarget] = useState<User | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

    return (
        <div className="w-full animate-in fade-in duration-500 pb-10">
            <h1 className="text-[26px] font-bold text-black mb-8">Data User</h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Cari Berdasarkan Nama / Email / No. Tlp"
                />

                {/* Tombol Tambahkan User muncul saat mode Edit aktif */}
                {isEditMode && (
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="flex items-center gap-2 bg-[#222222] hover:bg-black text-white px-5 py-3 rounded-full transition-all font-semibold shadow-sm text-[14px] cursor-pointer animate-in zoom-in-95 duration-200">
                        <Plus className="w-5 h-5" />
                        Tambahkan User
                    </button>
                )}
            </div>

            <UserTable
                users={users}
                isEditMode={isEditMode}
                onToggleEditMode={() => setIsEditMode((prev) => !prev)}
                onDetail={setDetailUser}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
            />

            {/* ================= MODALS ================= */}
            <UserDetailModal
                user={detailUser}
                onClose={() => setDetailUser(null)}
            />

            <ConfirmDeleteDialog
                open={!!deleteTarget}
                itemName={deleteTarget?.name ?? ""}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={async () => {
                    if (deleteTarget) await removeUser(deleteTarget);
                    setDeleteTarget(null);
                }}
            />

            <UserFormModal
                open={!!editTarget}
                mode="edit"
                initialValues={editTarget ?? undefined}
                onClose={() => setEditTarget(null)}
                onSubmit={async (values) => {
                    if (editTarget)
                        await editUser({ ...editTarget, ...values });
                    setEditTarget(null);
                }}
            />

            <UserFormModal
                open={isAddOpen}
                mode="add"
                onClose={() => setIsAddOpen(false)}
                onSubmit={async (values) => {
                    await addUser(values);
                    setIsAddOpen(false);
                }}
            />
        </div>
    );
}
