"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import {
    ArrowRight,
    Bell,
    BookOpen,
    CircleUserRound,
    LayoutGrid,
    LogOut,
    Menu,
    MessageSquare,
    WalletCards,
} from "lucide-react";

const navigation = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { label: "Keuangan", href: "/dashboard/keuangan", icon: WalletCards },
    { label: "Koleksi Sejarah", href: "/dashboard/sejarah", icon: BookOpen },
    { label: "Data User", href: "/dashboard/user", icon: CircleUserRound },
    { label: "Feed Back", href: "/dashboard/feedback", icon: MessageSquare },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    // State loading untuk menutupi layar saat proses cek autentikasi berjalan
    const [isLoading, setIsLoading] = useState(true);

    // --- PROTEKSI RUTE (Route Guard) MENGGUNAKAN TOKEN ---
    useEffect(() => {
        // Cek apakah adminToken (yang di-set di login.tsx) ada di localStorage
        const token = localStorage.getItem("adminToken");

        if (!token) {
            // Jika tidak ada token (belum login atau sudah logout), lempar ke halaman login
            router.replace("/login");
        } else {
            // Jika token ada, izinkan render halaman dashboard
            setIsLoading(false);
        }
    }, [router]);

    // --- FUNGSI LOGOUT (KELUAR) ---
    const handleLogout = () => {
        // 1. Hapus token dan data yang di-set saat login
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRole");

        // 2. Arahkan pengguna kembali ke halaman login (menghapus riwayat dashboard)
        router.replace("/login");
    };

    // Tampilkan layar kosong/loading selama pengecekan token berlangsung
    if (isLoading) return <div className="min-h-screen bg-[#f5f5f5]" />;

    return (
        <div className="min-h-screen flex bg-[#f5f5f5] text-[#080808] font-sans">
            {/* --- SIDEBAR --- */}
            <aside
                className={`fixed md:relative z-40 w-[285px] shrink-0 min-h-screen bg-[#050505] text-[#f7f7f7] p-[31px_24px_28px] flex flex-col transition-transform duration-300 ease-in-out ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                }`}>
                {/* BRAND / LOGO SIDEBAR */}
                <div className="flex items-center justify-between px-[2px]">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="bg-white rounded-lg p-1 flex items-center justify-center">
                            <img
                                src="/images/logo_museum.jpg"
                                alt="Logo Museum Brawijaya"
                                className="h-[38px] w-[38px] object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] font-bold leading-tight text-white">
                                Museum
                            </span>
                            <span className="text-[16px] font-bold leading-tight text-[#B5852A]">
                                Brawijaya
                            </span>
                        </div>
                    </Link>

                    {/* Tombol Close Mobile */}
                    <button
                        className="md:hidden w-[29px] h-[29px] border-2 border-white rounded-[6px] bg-transparent p-0 flex items-center justify-center cursor-pointer ml-auto"
                        onClick={() => setSidebarOpen(false)}>
                        <span className="h-[15px] w-[2px] bg-white block mr-[4px] rotate-45 translate-x-[3px]" />
                        <span className="h-[15px] w-[2px] bg-white block -rotate-45 -translate-x-[3px]" />
                    </button>
                </div>

                <div className="h-[1px] bg-[#a1a1a1] my-[34px] opacity-90" />

                {/* MENU NAVIGASI */}
                <nav className="flex flex-col gap-[16px]">
                    {navigation.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                href={href}
                                key={label}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-[20px] w-full min-h-[56px] px-[20px] py-[12px] border-0 rounded-[40px] text-left text-[18px] md:text-[20px] font-bold cursor-pointer transition-colors ${
                                    isActive
                                        ? "text-white bg-[#343434]"
                                        : "text-[#adadad] hover:text-white hover:bg-[#222]"
                                }`}>
                                <Icon className="w-[28px] h-[28px] shrink-0 stroke-[1.8]" />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* TOMBOL KELUAR */}
                <button
                    onClick={handleLogout}
                    className="mt-auto text-[#ff4c4c] hover:text-red-400 hover:bg-[#222] rounded-full flex items-center gap-[20px] bg-transparent border-0 p-[15px_20px] cursor-pointer self-start transition-colors w-full">
                    <LogOut className="w-[28px] h-[28px] stroke-[1.8]" />
                    <span className="text-[18px] font-bold">Keluar</span>
                </button>
            </aside>

            {/* Overlay Mobile */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* --- MAIN CONTENT AREA --- */}
            <div className="min-w-0 flex-1 flex flex-col h-screen overflow-y-auto">
                <header className="sticky top-0 z-20 bg-[#f5f5f5] h-[90px] border-b border-[#dddddd] flex items-center justify-between px-5 md:px-[40px]">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden border-0 bg-transparent p-0 text-[#111]"
                            onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-[30px] h-[30px]" />
                        </button>
                        <h1 className="m-0 text-[20px] md:text-[24px] font-bold tracking-tight text-black">
                            Welcome, Alexandro Vosca
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 md:gap-[24px]">
                        <button
                            className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] rounded-full border-0 bg-[#222] text-white flex items-center justify-center cursor-pointer shadow-sm hover:bg-black transition-colors"
                            onClick={() => setNotificationsOpen(true)}>
                            <Bell className="w-[20px] h-[20px] md:w-[22px] md:h-[22px] stroke-[2]" />
                        </button>

                        <div className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] rounded-full overflow-hidden border-[2.5px] border-white shadow-sm cursor-pointer shrink-0">
                            <img
                                src="/images/logo-profil.jfif"
                                alt="Foto Profil"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                <main className="p-5 md:p-[40px] flex-1">{children}</main>
            </div>

            {/* --- POP-UP NOTIFIKASI --- */}
            {notificationsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="relative bg-[#6C9E78] w-full max-w-[420px] rounded-[32px] p-8 shadow-2xl z-10 text-white">
                        <h2 className="text-center font-bold text-[22px] mb-8 mt-1 tracking-wide">
                            Notifikasi
                        </h2>
                        <div className="flex flex-col gap-2">
                            <div className="py-3 border-b border-white/40">
                                <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity">
                                    <div className="flex items-center gap-4">
                                        <MessageSquare className="w-6 h-6 stroke-[1.8]" />
                                        <div>
                                            <p className="font-semibold text-[15px] leading-tight m-0">
                                                15 Ulasan Terbaru
                                            </p>
                                            <p className="text-white/80 text-[12px] mt-1 m-0">
                                                15 / 9 / 2026
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 stroke-[2]" />
                                </div>
                            </div>
                            <div className="py-3">
                                <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity">
                                    <div className="flex items-center gap-4">
                                        <CircleUserRound className="w-6 h-6 stroke-[1.8]" />
                                        <div>
                                            <p className="font-semibold text-[15px] leading-tight m-0">
                                                Penambahan 25 Akun User
                                            </p>
                                            <p className="text-white/80 text-[12px] mt-1 m-0">
                                                15 / 9 / 2026
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 stroke-[2]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
