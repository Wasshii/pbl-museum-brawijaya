"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-[#f5f5f5] text-[#080808] font-sans">
            {/* --- SIDEBAR --- */}
            <aside
                className={`fixed md:relative z-40 w-[285px] shrink-0 min-h-screen bg-[#050505] text-[#f7f7f7] p-[31px_24px_28px] flex flex-col transition-transform duration-300 ease-in-out ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                }`}>
                <div className="flex items-center gap-[20px] px-[2px]">
                    <div
                        className="w-[44px] h-[46px] border-2 border-[#c9b56d] text-[#c9b56d] grid place-items-center font-serif font-bold text-[21px]"
                        style={{
                            clipPath:
                                "polygon(12% 0, 88% 0, 100% 82%, 50% 100%, 0 82%)",
                        }}>
                        B
                    </div>
                    <div className="text-[21px] font-bold leading-[1.12] tracking-tight">
                        Museum <br /> Brawijaya
                    </div>
                    <button
                        className="md:hidden ml-auto w-[29px] h-[29px] border-2 border-white rounded-[6px] bg-transparent p-0 flex items-center justify-center cursor-pointer"
                        onClick={() => setSidebarOpen(false)}>
                        <span className="h-[15px] w-[2px] bg-white block mr-[4px] rotate-45 translate-x-[3px]" />
                        <span className="h-[15px] w-[2px] bg-white block -rotate-45 -translate-x-[3px]" />
                    </button>
                </div>

                <div className="h-[1px] bg-[#a1a1a1] my-[34px] opacity-90" />

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

                <button className="mt-auto text-[#ff4c4c] hover:text-red-400 hover:bg-[#222] rounded-full flex items-center gap-[20px] bg-transparent border-0 p-[15px_20px] cursor-pointer self-start transition-colors">
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
                {/* Header Navbar - Padding disamakan persis dengan padding Main Content */}
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
                        <div className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] rounded-full bg-gradient-to-br from-[#d0b85f] to-[#6b5949] flex items-center justify-center text-white font-bold text-sm md:text-lg border-[2.5px] border-white shadow-sm cursor-pointer">
                            AV
                        </div>
                    </div>
                </header>

                {/* Render Halaman Disini - Menggunakan padding yang simetris dengan header */}
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
