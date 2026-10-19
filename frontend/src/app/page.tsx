"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Wallet,
    BookOpen,
    Users,
    MessageSquare,
    LogOut,
} from "lucide-react";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    // Fungsi untuk menangani proses Logout
    const handleLogout = () => {
        // 1. Hapus token dan role admin dari localStorage
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRole");

        // 2. Arahkan kembali (redirect) ke halaman login
        router.push("/login");
    };

    // Daftar menu navigasi
    const menuItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Keuangan", href: "/dashboard/keuangan", icon: Wallet },
        { name: "Koleksi Sejarah", href: "/dashboard/koleksi", icon: BookOpen },
        { name: "Data User", href: "/dashboard/users", icon: Users },
        { name: "Feed Back", href: "/dashboard/feedback", icon: MessageSquare },
    ];

    return (
        <aside className="w-64 min-h-screen bg-black text-white flex flex-col justify-between p-6 border-r border-gray-800">
            <div>
                {/* Logo & Judul Museum */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10">
                        <Image
                            src="/images/Museum_Brawijaya_1.jpg"
                            alt="Logo Museum"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="font-bold text-base leading-tight text-white">
                            Museum
                        </h2>
                        <p className="text-amber-500 text-sm font-semibold">
                            Brawijaya
                        </p>
                    </div>
                </div>

                <hr className="border-gray-800 mb-6" />

                {/* Navigasi Menu */}
                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${
                                    isActive
                                        ? "bg-[#222222] text-white shadow-md"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}>
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Tombol Keluar (Logout) di Bagian Bawah */}
            <div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-colors font-medium text-sm">
                    <LogOut className="w-5 h-5" />
                    <span>Keluar</span>
                </button>
            </div>
        </aside>
    );
}
