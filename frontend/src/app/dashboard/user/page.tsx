"use client";

import { useState } from "react";
import {
    Search,
    ArrowRight,
    Trash2,
    Edit3,
    X,
    Plus,
    User as UserIcon,
} from "lucide-react";

// Tipe Data User
export interface User {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    createdAt: string;
    status: "Online" | "Offline";
    avatar: string;
}

// 10 Data Dummy Berbeda dengan Avatar cadangan
const initialUsers: User[] = [
    {
        id: 1,
        name: "Hendra Kedura",
        phone: "0812991817265",
        email: "hendra718@gmail.com",
        address: "Jl. Veteran No. 10, Malang",
        createdAt: "12 Agustus 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 2,
        name: "Evisa Hermina",
        phone: "081928776218",
        email: "jajakke4415@gmail.com",
        address: "Jl. Soekarno Hatta No. 4, Malang",
        createdAt: "15 Agustus 2025",
        status: "Offline",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 3,
        name: "Budi Santoso",
        phone: "082133445566",
        email: "budisantoso@gmail.com",
        address: "Jl. Ijen Boulevard No. 12, Malang",
        createdAt: "20 Agustus 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 4,
        name: "Siti Aminah",
        phone: "085677889900",
        email: "sitiaminah@yahoo.com",
        address: "Jl. MT Haryono No. 55, Malang",
        createdAt: "01 September 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 5,
        name: "Agus Pratama",
        phone: "081122334455",
        email: "aguspratama99@gmail.com",
        address: "Jl. Kawi No. 8, Malang",
        createdAt: "10 September 2025",
        status: "Offline",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 6,
        name: "Rina Kartika",
        phone: "081999888777",
        email: "rinakartika.id@gmail.com",
        address: "Jl. Galunggung No. 22, Malang",
        createdAt: "12 September 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 7,
        name: "Joko Anwar",
        phone: "082211223344",
        email: "jokoanwar_filmmaker@gmail.com",
        address: "Jl. Semeru No. 9, Malang",
        createdAt: "25 September 2025",
        status: "Offline",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 8,
        name: "Dewi Lestari",
        phone: "081344556677",
        email: "dewilestari@book.com",
        address: "Jl. Tlogomas No. 11, Malang",
        createdAt: "02 Oktober 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 9,
        name: "Andi Wijaya",
        phone: "085712341234",
        email: "andiwijaya_cool@gmail.com",
        address: "Jl. S. Supriadi No. 7, Malang",
        createdAt: "05 Oktober 2025",
        status: "Offline",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 10,
        name: "Maya Sari",
        phone: "081233221144",
        email: "mayasari.beauty@gmail.com",
        address: "Jl. Dieng No. 15, Malang",
        createdAt: "10 Oktober 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 11,
        name: "Fajar Prasetyo",
        phone: "081277665544",
        email: "fajar.prasetyo@gmail.com",
        address: "Jl. Borobudur No. 20, Malang",
        createdAt: "15 Oktober 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 12,
        name: "Nurul Hidayati",
        phone: "085811223344",
        email: "nurul.hidayati@gmail.com",
        address: "Jl. Candi Mendut No. 5, Malang",
        createdAt: "18 Oktober 2025",
        status: "Offline",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
];

export default function DataUserPage() {
    const [users, setUsers] = useState<User[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("museum_users");
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return initialUsers;
                }
            }
        }
        return initialUsers;
    });

    const [searchQuery, setSearchQuery] = useState("");

    // Toggle Mode Edit di Table
    const [isEditMode, setIsEditMode] = useState(false);

    // State untuk Modals
    const [detailUser, setDetailUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    // Form Add User State
    const [newUserName, setNewUserName] = useState("");
    const [newUserPhone, setNewUserPhone] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserAddress, setNewUserAddress] = useState("");
    const [newUserStatus, setNewUserStatus] = useState<"Online" | "Offline">(
        "Online",
    );

    // Simpan ke localStorage saat berubah
    const updateUsersAndStore = (newUsers: User[]) => {
        setUsers(newUsers);
        if (typeof window !== "undefined") {
            localStorage.setItem("museum_users", JSON.stringify(newUsers));
        }
    };

    // Filter Pencarian
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery),
    );

    // Fungsi Hapus User
    const handleDeleteConfirm = () => {
        if (deleteUser) {
            updateUsersAndStore(users.filter((u) => u.id !== deleteUser.id));
            setDeleteUser(null);
        }
    };

    // Fungsi Simpan Edit User
    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editUser) {
            updateUsersAndStore(
                users.map((u) => (u.id === editUser.id ? editUser : u)),
            );
            setEditUser(null);
        }
    };

    // Fungsi Tambah User Baru
    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const d = new Date();
        const months = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];
        const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

        const newUser: User = {
            id: Date.now(),
            name: newUserName,
            phone: newUserPhone,
            email: newUserEmail,
            address: newUserAddress,
            createdAt: dateStr,
            status: newUserStatus,
            avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        };

        updateUsersAndStore([newUser, ...users]);
        setIsAddUserOpen(false);
        setNewUserName("");
        setNewUserPhone("");
        setNewUserEmail("");
        setNewUserAddress("");
    };

    return (
        <div className="w-full animate-in fade-in duration-500 pb-10">
            {/* INJEKSI CSS UNTUK GLASS SCROLLBAR */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .glass-scroll::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .glass-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 10px;
                }
                .glass-scroll::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.15); /* Transparan hitam (glass) */
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                .glass-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
            `,
                }}
            />

            <h1 className="text-[26px] font-bold text-black mb-8">Data User</h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari Berdasarkan Nama / Email / No. Tlp"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-10 py-3 bg-[#222222] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder-gray-400 text-[14px] font-semibold"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white cursor-pointer bg-transparent border-none">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Tombol Tambahkan User (Muncul jika dalam mode Edit seperti di gambar referensi) */}
                {isEditMode && (
                    <button
                        onClick={() => setIsAddUserOpen(true)}
                        className="flex items-center gap-2 bg-[#222222] hover:bg-black text-white px-5 py-3 rounded-full transition-all font-semibold shadow-sm text-[14px] cursor-pointer animate-in zoom-in-95 duration-200">
                        <Plus className="w-5 h-5" />
                        Tambahkan User
                    </button>
                )}
            </div>

            {/* Tabel Container dengan Scroll Glass */}
            <div className="bg-white rounded-[24px] shadow-sm overflow-hidden border border-gray-100 flex flex-col">
                {/* 
                    max-h-[460px]: Membatasi tinggi tabel agar bisa di-scroll 
                    overflow-y-auto overflow-x-auto: Menampilkan scrollbar vertikal & horizontal
                    glass-scroll: Efek custom scrollbar glass
                    Tanpa padding top/horizontal pada scroll container agar header sticky tepat di bibir atas tanpa celah
                */}
                <div className="max-h-[460px] overflow-y-auto overflow-x-auto glass-scroll">
                    <table className="w-full text-left border-collapse min-w-[750px] font-sans">
                        <thead className="sticky top-0 z-20 bg-white shadow-[0_1px_0_0_#f0f0f0]">
                            <tr className="bg-white">
                                <th className="py-4 pl-6 pr-4 font-bold text-black whitespace-nowrap text-[14px] bg-white">
                                    Nama User
                                </th>
                                <th className="py-4 px-4 font-bold text-black whitespace-nowrap text-[14px] bg-white">
                                    Nomer Telepon
                                </th>
                                <th className="py-4 px-4 font-bold text-black whitespace-nowrap text-[14px] bg-white">
                                    Email
                                </th>
                                <th className="py-4 px-4 font-bold text-black whitespace-nowrap text-[14px] bg-white">
                                    Status
                                </th>
                                <th className="py-4 px-4 font-bold text-black whitespace-nowrap text-[14px] text-center bg-white">
                                    Detail
                                </th>
                                <th className="py-4 pl-4 pr-6 font-bold text-black whitespace-nowrap text-right bg-white">
                                    <button
                                        onClick={() =>
                                            setIsEditMode(!isEditMode)
                                        }
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
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                                        <td className="py-4 pl-6 pr-4 text-black font-semibold text-[14px]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (
                                                                e.currentTarget as HTMLImageElement
                                                            ).src =
                                                                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
                                                        }}
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
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    user.status === "Online"
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "bg-rose-50 text-rose-600"
                                                }`}>
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        user.status === "Online"
                                                            ? "bg-emerald-500"
                                                            : "bg-rose-500"
                                                    }`}></span>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <button
                                                onClick={() =>
                                                    setDetailUser(user)
                                                }
                                                className="text-black hover:text-gray-600 hover:scale-110 transition-transform cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 border-0 bg-transparent"
                                                title="Lihat Detail User">
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                        <td className="py-4 pl-4 pr-6 text-right">
                                            {/* Action Buttons (Hapus & Edit) Muncul saat EditMode aktif */}
                                            {isEditMode && (
                                                <div className="flex items-center justify-end gap-2 animate-in fade-in duration-200">
                                                    <button
                                                        onClick={() =>
                                                            setDeleteUser(user)
                                                        }
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
                                                        title="Hapus User">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setEditUser({
                                                                ...user,
                                                            })
                                                        }
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

            {/* ================= MODALS ================= */}

            {/* 1. Pop-up Detail User */}
            {detailUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setDetailUser(null)}
                    />
                    <div className="bg-white w-full max-w-md rounded-[24px] p-6 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setDetailUser(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-100 border-0 bg-transparent">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center mb-6 mt-4">
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-100 shadow-sm">
                                <img
                                    src={detailUser.avatar}
                                    alt={detailUser.name}
                                    className="w-full h-full object-cover bg-gray-200"
                                    onError={(e) => {
                                        (
                                            e.currentTarget as HTMLImageElement
                                        ).src =
                                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
                                    }}
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-black text-center">
                                {detailUser.name}
                            </h2>
                            <span
                                className={`px-3 py-1 mt-2 rounded-full text-xs font-bold ${
                                    detailUser.status === "Online"
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-rose-50 text-rose-600"
                                }`}>
                                {detailUser.status}
                            </span>
                        </div>

                        <div className="space-y-3.5 text-sm border-t border-gray-100 pt-4">
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-3">
                                <span className="font-semibold text-gray-500">
                                    Nomer Tlp
                                </span>
                                <span className="col-span-2 text-black font-medium">
                                    {detailUser.phone}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-3">
                                <span className="font-semibold text-gray-500">
                                    Email
                                </span>
                                <span className="col-span-2 text-black font-medium">
                                    {detailUser.email}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-3">
                                <span className="font-semibold text-gray-500">
                                    Alamat
                                </span>
                                <span className="col-span-2 text-black font-medium">
                                    {detailUser.address}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-3">
                                <span className="font-semibold text-gray-500">
                                    Dibuat Tgl
                                </span>
                                <span className="col-span-2 text-black font-medium">
                                    {detailUser.createdAt}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setDetailUser(null)}
                            className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-xl transition-colors cursor-pointer text-sm border-0">
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* 2. Pop-up Konfirmasi Hapus */}
            {deleteUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setDeleteUser(null)}
                    />
                    <div className="bg-white w-full max-w-sm rounded-[24px] p-6 shadow-2xl text-center relative z-10 animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">
                            Hapus Akun?
                        </h3>
                        <p className="text-gray-600 text-sm mb-6">
                            Apakah Anda benar-benar ingin menghapus akun{" "}
                            <b>{deleteUser.name}</b>? Tindakan ini tidak dapat
                            dibatalkan.
                        </p>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setDeleteUser(null)}
                                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer text-sm">
                                Tidak
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-md cursor-pointer text-sm border-0">
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Pop-up Form Edit Data */}
            {editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setEditUser(null)}
                    />
                    <div className="bg-white w-full max-w-md rounded-[24px] p-6 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setEditUser(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-100 border-0 bg-transparent">
                            <X className="w-5 h-5" />
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
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black font-semibold text-sm"
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
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black font-semibold text-sm"
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
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black font-semibold text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={editUser.status}
                                    onChange={(e) =>
                                        setEditUser({
                                            ...editUser,
                                            status: e.target.value as
                                                | "Online"
                                                | "Offline",
                                        })
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black font-semibold text-sm bg-white cursor-pointer">
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                </select>
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
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black font-semibold text-sm resize-none"
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
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black font-semibold text-sm"
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setEditUser(null)}
                                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer text-sm">
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-md cursor-pointer text-sm border-0">
                                    Konfirmasi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 4. Pop-up Tambahkan User Baru */}
            {isAddUserOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setIsAddUserOpen(false)}
                    />
                    <div className="bg-white w-full max-w-md rounded-[24px] p-6 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsAddUserOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-100 border-0 bg-transparent">
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-2xl font-bold text-black mb-6">
                            Tambahkan User Baru
                        </h2>

                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newUserName}
                                    onChange={(e) =>
                                        setNewUserName(e.target.value)
                                    }
                                    placeholder="Contoh: Alexandro Vosca"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black font-semibold text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Nomer Telepon
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newUserPhone}
                                    onChange={(e) =>
                                        setNewUserPhone(e.target.value)
                                    }
                                    placeholder="08123456789"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black font-semibold text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={newUserEmail}
                                    onChange={(e) =>
                                        setNewUserEmail(e.target.value)
                                    }
                                    placeholder="user@museum.id"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black font-semibold text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={newUserStatus}
                                    onChange={(e) =>
                                        setNewUserStatus(
                                            e.target.value as
                                                | "Online"
                                                | "Offline",
                                        )
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black font-semibold text-sm bg-white cursor-pointer">
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Alamat
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    value={newUserAddress}
                                    onChange={(e) =>
                                        setNewUserAddress(e.target.value)
                                    }
                                    placeholder="Jl. Pahlawan No. 45, Malang"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black font-semibold text-sm resize-none"
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddUserOpen(false)}
                                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer text-sm">
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-colors shadow-md cursor-pointer text-sm border-0">
                                    Simpan User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
