"use client";
import { Eye, Edit, Trash2 } from "lucide-react";

// Struktur data user menyesuaikan dari database-mu
interface UserData {
    id_user: number;
    username: string;
    email: string;
    no_telp: string;
    role: string;
}

interface Props {
    users: UserData[];
    onView: (user: UserData) => void;
    onEdit: (user: UserData) => void;
    onDelete: (id: number) => void;
}

export default function UserTable({ users, onView, onEdit, onDelete }: Props) {
    return (
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden mt-6 overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
                <thead>
                    <tr className="bg-[#6C9E78] text-white text-left">
                        <th className="py-4 px-6 font-semibold whitespace-nowrap">
                            No
                        </th>
                        <th className="py-4 px-6 font-semibold whitespace-nowrap">
                            Nama
                        </th>
                        <th className="py-4 px-6 font-semibold whitespace-nowrap">
                            Email
                        </th>
                        <th className="py-4 px-6 font-semibold whitespace-nowrap">
                            No. HP
                        </th>
                        <th className="py-4 px-6 font-semibold whitespace-nowrap">
                            Role
                        </th>
                        <th className="py-4 px-6 font-semibold text-center whitespace-nowrap">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr
                            key={user.id_user}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-6">{index + 1}</td>
                            <td className="py-4 px-6">{user.username}</td>
                            <td className="py-4 px-6">{user.email}</td>
                            <td className="py-4 px-6">{user.no_telp}</td>
                            <td className="py-4 px-6 capitalize">
                                {user.role}
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => onView(user)}
                                        className="bg-[#4a8a5b] text-white p-2 rounded-lg hover:bg-opacity-80 transition shadow-sm">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="bg-[#f0ad4e] text-white p-2 rounded-lg hover:bg-opacity-80 transition shadow-sm">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(user.id_user)}
                                        className="bg-[#d9534f] text-white p-2 rounded-lg hover:bg-opacity-80 transition shadow-sm">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td
                                colSpan={6}
                                className="py-12 text-center text-gray-500 font-medium">
                                Tidak ada data user yang ditemukan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
