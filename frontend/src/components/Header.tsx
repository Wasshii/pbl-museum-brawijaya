"use client";

import { useState } from "react";
import { Bell, MessageSquare, User, ArrowRight } from "lucide-react";

export default function Header() {
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    return (
        <>
            {/* HEADER TOP BAR */}
            <div className="flex justify-between items-center w-full bg-[#f4f4f4] pb-4 border-b border-gray-200">
                <h1 className="text-[20px] font-bold text-black">
                    Welcome, Alexandro Vosca
                </h1>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsNotifOpen(true)}
                        className="w-[45px] h-[45px] bg-[#222222] rounded-full flex items-center justify-center text-white hover:bg-black transition-colors cursor-pointer border-0">
                        <Bell className="w-5 h-5" />
                    </button>
                    {/* Foto Profil / Inisial */}
                    <div className="w-[45px] h-[45px] bg-gradient-to-br from-amber-600 to-amber-900 rounded-full flex items-center justify-center text-white font-bold cursor-pointer border-2 border-white shadow-sm">
                        AV
                    </div>
                </div>
            </div>

            {/* OVERLAY POP-UP NOTIFIKASI DENGAN EFEK BLUR */}
            {isNotifOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md animate-in fade-in duration-200">
                    {/* Area klik di luar pop-up untuk menutup */}
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setIsNotifOpen(false)}
                    />

                    {/* Box Pop-up */}
                    <div className="relative bg-[#76A882] w-full max-w-[400px] rounded-[24px] p-6 shadow-2xl">
                        <h2 className="text-white text-center font-bold text-lg mb-6">
                            Notifikasi
                        </h2>

                        <div className="flex flex-col">
                            {/* Notif 1 */}
                            <div className="flex items-center justify-between py-4 border-b border-white/30 cursor-pointer hover:bg-white/10 transition-colors rounded-lg px-2 -mx-2">
                                <div className="flex items-center gap-4">
                                    <MessageSquare className="text-white w-6 h-6 stroke-[1.5]" />
                                    <div>
                                        <p className="text-white font-medium text-[15px]">
                                            15 Ulasan Terbaru
                                        </p>
                                        <p className="text-white/70 text-[12px] mt-0.5">
                                            15 / 9 / 2026
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="text-white w-5 h-5" />
                            </div>

                            {/* Notif 2 */}
                            <div className="flex items-center justify-between py-4 border-b border-white/30 cursor-pointer hover:bg-white/10 transition-colors rounded-lg px-2 -mx-2">
                                <div className="flex items-center gap-4">
                                    <User className="text-white w-6 h-6 stroke-[1.5]" />
                                    <div>
                                        <p className="text-white font-medium text-[15px]">
                                            Penambahan 25 Akun User
                                        </p>
                                        <p className="text-white/70 text-[12px] mt-0.5">
                                            15 / 9 / 2026
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="text-white w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
