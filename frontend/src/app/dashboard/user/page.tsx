"use client";

import { useState } from "react";
import { Search, ArrowRight, Trash2, Edit3, X, Plus } from "lucide-react";

// Tipe Data User
interface User {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    createdAt: string;
    status: "Online" | "Offline";
    avatar: string;
}

// 10 Data Dummy Berbeda
const initialUsers: User[] = [
    {
        id: 1,
        name: "Hendra Kedura",
        phone: "0812991817265",
        email: "hendra718@gmail.com",
        address: "Jl. Veteran No. 10, Malang",
        createdAt: "12 Agustus 2025",
        status: "Online",
        avatar: "/avatar1.jpg", // Pastikan ada gambar di folder public, atau ganti dengan link gambar
    },
    {
        id: 2,
        name: "Evisa Hermina",
        phone: "081928776218",
        email: "jajakke4415@gmail.com",
        address: "Jl. Soekarno Hatta No. 4, Malang",
        createdAt: "15 Agustus 2025",
        status: "Offline",
        avatar: "/avatar2.jpg",
    },
    {
        id: 3,
        name: "Budi Santoso",
        phone: "082133445566",
        email: "budisantoso@gmail.com",
        address: "Jl. Ijen Boulevard No. 12, Malang",
        createdAt: "20 Agustus 2025",
        status: "Online",
        avatar: "/avatar3.jpg",
    },
    {
        id: 4,
        name: "Siti Aminah",
        phone: "085677889900",
        email: "sitiaminah@yahoo.com",
        address: "Jl. MT Haryono No. 55, Malang",
        createdAt: "01 September 2025",
        status: "Online",
        avatar: "/avatar4.jpg",
    },
    {
        id: 5,
        name: "Agus Pratama",
        phone: "081122334455",
        email: "aguspratama99@gmail.com",
        address: "Jl. Kawi No. 8, Malang",
        createdAt: "10 September 2025",
        status: "Offline",
        avatar: "/avatar1.jpg",
    },
    {
        id: 6,
        name: "Rina Kartika",
        phone: "081999888777",
        email: "rinakartika.id@gmail.com",
        address: "Jl. Galunggung No. 22, Malang",
        createdAt: "12 September 2025",
        status: "Online",
        avatar: "/avatar2.jpg",
    },
    {
        id: 7,
        name: "Joko Anwar",
        phone: "082211223344",
        email: "jokoanwar_filmmaker@gmail.com",
        address: "Jl. Semeru No. 9, Malang",
        createdAt: "25 September 2025",
        status: "Offline",
        avatar: "/avatar3.jpg",
    },
    {
        id: 8,
        name: "Dewi Lestari",
        phone: "081344556677",
        email: "dewilestari@book.com",
        address: "Jl. Tlogomas No. 11, Malang",
        createdAt: "02 Oktober 2025",
        status: "Online",
        avatar: "/avatar4.jpg",
    },
    {
        id: 9,
        name: "Andi Wijaya",
        phone: "085712341234",
        email: "andiwijaya_cool@gmail.com",
        address: "Jl. S. Supriadi No. 7, Malang",
        createdAt: "05 Oktober 2025",
        status: "Offline",
        avatar: "/avatar1.jpg",
    },
    {
        id: 10,
        name: "Maya Sari",
        phone: "081233221144",
        email: "mayasari.beauty@gmail.com",
        address: "Jl. Dieng No. 15, Malang",
        createdAt: "10 Oktober 2025",
        status: "Online",
        avatar: "/avatar2.jpg",
    },
];

export default function DataUserPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");

    // Toggle Mode Edit di Table
    const [isEditMode, setIsEditMode] = useState(false);

    // State untuk Modals
    const [detailUser, setDetailUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);

    // Filter Pencarian
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Fungsi Hapus User
    const handleDeleteConfirm = () => {
        if (deleteUser) {
            setUsers(users.filter((u) => u.id !== deleteUser.id));
            setDeleteUser(null);
        }
    };

    // Fungsi Simpan Edit User
    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editUser) {
            setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
            setEditUser(null);
        }
    };

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold text-black mb-6">Data User</h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari Berdasarkan Nama"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#222222] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#B5852A] transition-all placeholder-gray-400"
                    />
                </div>

                {/* Tombol Tambahkan User (Muncul jika dalam mode Edit seperti di gambar referensi) */}
                {isEditMode && (
                    <button className="flex items-center gap-2 bg-[#222222] hover:bg-black text-white px-5 py-3 rounded-full transition-colors font-semibold shadow-sm">
                        <Plus className="w-5 h-5" />
                        Tambahkan User
                    </button>
                )}
            </div>

            {/* Tabel Container */}
            <div className="bg-white rounded-[24px] shadow-sm overflow-hidden p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="py-4 px-4 font-bold text-black whitespace-nowrap">
                                    Nama User
                                </th>
                                <th className="py-4 px-4 font-bold text-black whitespace-nowrap">
                                    Nomer Telepon
                                </th>
                                <th className="py-4 px-4 font-bold text-black whitespace-nowrap">
                                    Email
                                </th>
                                <th className="py-4 px-4 font-bold text-black whitespace-nowrap">
                                    Status
                                </th>
                                <th className="py-4 px-4 font-bold text-black whitespace-nowrap">
                                    Detail
                                </th>
                                <th className="py-4 px-4 font-bold text-black whitespace-nowrap text-right">
                                    <button
                                        onClick={() =>
                                            setIsEditMode(!isEditMode)
                                        }
                                        className={`px-6 py-2 rounded-full font-bold text-white transition-colors ${isEditMode ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`}>
                                        {isEditMode ? "Batal" : "Edit"}
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 text-black font-medium">
                                            {user.name}
                                        </td>
                                        <td className="py-4 px-4 text-black font-medium">
                                            {user.phone}
                                        </td>
                                        <td className="py-4 px-4 text-black font-medium">
                                            {user.email}
                                        </td>
                                        <td className="py-4 px-4 font-bold">
                                            <span
                                                className={
                                                    user.status === "Online"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                }>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() =>
                                                    setDetailUser(user)
                                                }
                                                className="text-black hover:text-gray-600 transition-colors cursor-pointer p-1">
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            {/* Action Buttons (Hapus & Edit) Muncul saat EditMode aktif */}
                                            {isEditMode && (
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() =>
                                                            setDeleteUser(user)
                                                        }
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hapus User">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setEditUser({
                                                                ...user,
                                                            })
                                                        }
                                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit User">
                                                        <Edit3 className="w-5 h-5" />
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
                                        className="py-8 text-center text-gray-500">
                                        Data user tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= MODALS ================= */}

            {/* 1. Pop-up Detail User */}
            {detailUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1f1f1f]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                        <button
                            onClick={() => setDetailUser(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col items-center mb-6 mt-4">
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-100">
                                <img
                                    src={detailUser.avatar}
                                    alt={detailUser.name}
                                    className="w-full h-full object-cover bg-gray-200 text-[10px] flex items-center justify-center"
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-black text-center">
                                {detailUser.name}
                            </h2>
                            <span
                                className={`px-3 py-1 mt-2 rounded-full text-sm font-bold ${detailUser.status === "Online" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                {detailUser.status}
                            </span>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="font-semibold text-gray-500">
                                    Nomer Tlp
                                </span>
                                <span className="col-span-2 text-black font-medium">
                                    {detailUser.phone}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="font-semibold text-gray-500">
                                    Email
                                </span>
                                <span className="col-span-2 text-black font-medium">
                                    {detailUser.email}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="font-semibold text-gray-500">
                                    Alamat
                                </span>
                                <span className="col-span-2 text-black font-medium">
                                    {detailUser.address}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b pb-2">
                                <span className="font-semibold text-gray-500">
                                    Dibuat Tgl
                                </span>
                                <span className="col-span-2 text-black font-medium">
                                    {detailUser.createdAt}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Pop-up Konfirmasi Hapus */}
            {deleteUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">
                            Hapus Akun?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda benar-benar ingin menghapus akun{" "}
                            <b>{deleteUser.name}</b>? Tindakan ini tidak dapat
                            dibatalkan.
                        </p>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setDeleteUser(null)}
                                className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors">
                                Tidak
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-6 py-2 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-md">
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Pop-up Form Edit Data */}
            {editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                        <button
                            onClick={() => setEditUser(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold text-black mb-6">
                            Edit Data User
                        </h2>

                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Nama User
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editUser.name}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Nomer Telepon
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editUser.phone}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={editUser.email}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Alamat
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    value={editUser.address}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            address: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Tanggal Akun Dibuat
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editUser.createdAt}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            createdAt: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setEditUser(null)}
                                    className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors">
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-md">
                                    Konfirmasi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
