"use client";

import { ArrowRight, Edit3, Trash2 } from "lucide-react";
import StatusBadge from "@/components/user/StatusBadge";
import UserAvatar from "@/components/user/UserAvatar";
import type { User } from "@/types/user";

interface Props {
    users: User[];
    isEditMode: boolean;
    onToggleEditMode: () => void;
    onDetail: (user: User) => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

const TH =
    "py-4 px-4 font-bold text-black whitespace-nowrap text-[14px] bg-white";

export default function UserTable({
    users,
    isEditMode,
    onToggleEditMode,
    onDetail,
    onEdit,
    onDelete,
}: Props) {
    return (
        <div className="bg-white rounded-[24px] shadow-sm overflow-hidden border border-gray-100 flex flex-col">
            {/* max-h + overflow: tabel bisa di-scroll; glass-scroll: gaya scrollbar (ada di globals.css) */}
            <div className="max-h-[460px] overflow-y-auto overflow-x-auto glass-scroll">
                <table className="w-full text-left border-collapse min-w-[750px] font-sans">
                    <thead className="sticky top-0 z-20 bg-white shadow-[0_1px_0_0_#f0f0f0]">
                        <tr className="bg-white">
                            <th className="py-4 pl-6 pr-4 font-bold text-black whitespace-nowrap text-[14px] bg-white">
                                Nama User
                            </th>
                            <th className={TH}>Nomer Telepon</th>
                            <th className={TH}>Email</th>
                            <th className={TH}>Status</th>
                            <th className={`${TH} text-center`}>Detail</th>
                            <th className="py-4 pl-4 pr-6 font-bold text-black whitespace-nowrap text-right bg-white">
                                <button
                                    onClick={onToggleEditMode}
                                    className={`px-6 py-1.5 rounded-full font-bold text-white transition-colors cursor-pointer text-[13px] shadow-sm ${
                                        isEditMode
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    }`}>
                                    {isEditMode ? "Batal" : "Edit"}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                                    <td className="py-4 pl-6 pr-4 text-black font-semibold text-[14px]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                                <UserAvatar
                                                    src={user.avatar}
                                                    alt={user.name}
                                                />
                                            </div>
                                            <span>{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-gray-700 font-medium text-[14px]">
                                        {user.phone}
                                    </td>
                                    <td className="py-4 px-4 text-gray-700 font-medium text-[14px]">
                                        {user.email}
                                    </td>
                                    <td className="py-4 px-4 font-bold text-[13px]">
                                        <StatusBadge
                                            status={user.status}
                                            withDot
                                        />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button
                                            onClick={() => onDetail(user)}
                                            className="text-black hover:text-gray-600 hover:scale-110 transition-transform cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 border-0 bg-transparent"
                                            title="Lihat Detail User">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                    <td className="py-4 pl-4 pr-6 text-right">
                                        {/* Tombol Hapus & Edit hanya muncul saat mode edit aktif */}
                                        {isEditMode && (
                                            <div className="flex items-center justify-end gap-2 animate-in fade-in duration-200">
                                                <button
                                                    onClick={() =>
                                                        onDelete(user)
                                                    }
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
                                                    title="Hapus User">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onEdit(user)}
                                                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
                                                    title="Edit User">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-12 text-center text-gray-500 font-semibold text-[14px]">
                                    Data user tidak ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
