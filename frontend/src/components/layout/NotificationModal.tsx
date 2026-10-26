"use client";
import { MessageSquare, CircleUserRound, ArrowRight } from "lucide-react";

export default function NotificationModal({
    onClose,
}: {
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div
                className="absolute inset-0 cursor-pointer"
                onClick={onClose}
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
    );
}
