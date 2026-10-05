"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    CheckSquare,
    ExternalLink,
    User,
    Users,
    ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
    const [pemasukan, setPemasukan] = useState(400000);
    const [pengeluaran, setPengeluaran] = useState(100000);

    useEffect(() => {
        const savedPemasukan = localStorage.getItem("museum_pemasukan");
        const savedPengeluaran = localStorage.getItem("museum_pengeluaran");

        if (savedPemasukan) setPemasukan(parseInt(savedPemasukan));
        if (savedPengeluaran) setPengeluaran(parseInt(savedPengeluaran));
    }, []);

    return (
        <div className="w-full max-w-[1100px] animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-[24px] font-bold text-black mb-6">
                    Keuangan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Kartu Uang Masuk */}
                    <div className="bg-[#222222] rounded-[24px] p-6 flex flex-col justify-between min-h-[190px]">
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-white font-bold text-[18px]">
                                        Uang Masuk
                                    </h3>
                                    <p className="text-[#a3a3a3] text-[13px] mt-1 font-medium">
                                        10 / 7 / 2026
                                    </p>
                                </div>
                                <CheckSquare className="text-[#00ff1a] w-6 h-6 stroke-[2]" />
                            </div>
                            <p className="text-white font-bold text-[24px] mt-4">
                                Rp. {pemasukan.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <Link
                            href="/dashboard/keuangan?tab=masuk"
                            className="flex items-center gap-2 text-[#a3a3a3] hover:text-white text-[13px] font-semibold no-underline mt-4 transition-colors w-fit">
                            <span>Lihat Lebih Detail</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Kartu Uang Keluar */}
                    <div className="bg-[#222222] rounded-[24px] p-6 flex flex-col justify-between min-h-[190px]">
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-white font-bold text-[18px]">
                                        Uang Keluar
                                    </h3>
                                    <p className="text-[#a3a3a3] text-[13px] mt-1 font-medium">
                                        10 / 7 / 2026
                                    </p>
                                </div>
                                <ExternalLink className="text-[#ff0810] w-6 h-6 stroke-[2]" />
                            </div>
                            <p className="text-white font-bold text-[24px] mt-4">
                                Rp. {pengeluaran.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <Link
                            href="/dashboard/keuangan?tab=keluar"
                            className="flex items-center gap-2 text-[#a3a3a3] hover:text-white text-[13px] font-semibold no-underline mt-4 transition-colors w-fit">
                            <span>Lihat Lebih Detail</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Kartu Total Pengunjung (Tanpa Lihat Lebih Detail) */}
                    <div className="bg-[#222222] rounded-[24px] p-6 flex flex-col justify-between min-h-[190px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-white font-bold text-[18px]">
                                    Total Pengunjung
                                </h3>
                                <p className="text-[#a3a3a3] text-[13px] mt-1 font-medium">
                                    10 / 7 / 2026
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-white font-bold text-[24px]">
                            <Users className="w-6 h-6 text-white" />
                            <span>40 Orang</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bagian Bottom Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {/* Kartu Data User */}
                <div className="bg-[#222222] rounded-[24px] p-6 text-white flex flex-col justify-between min-h-[200px]">
                    <div>
                        <h3 className="text-[18px] font-bold mb-1">
                            Data User
                        </h3>
                        <p className="text-white/70 text-[13px] mb-4">
                            Total User 60
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 text-green-400 font-semibold text-[14px]">
                                <User className="w-5 h-5" /> 10 User Aktif
                            </div>
                            <div className="flex items-center gap-3 text-red-400 font-semibold text-[14px]">
                                <User className="w-5 h-5" /> 50 User Tidak Aktif
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/user"
                        className="flex items-center gap-2 text-[#a3a3a3] hover:text-white text-[13px] font-semibold no-underline mt-6 transition-colors w-fit">
                        <span>Lihat Lebih Detail</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Kartu Feed Back */}
                <div className="bg-[#222222] rounded-[24px] p-6 text-white flex flex-col justify-between min-h-[200px]">
                    <div>
                        <h3 className="text-[18px] font-bold mb-1">
                            Feed Back
                        </h3>
                        <p className="text-white/70 text-[13px]">Ulasan</p>
                        <p className="text-[40px] font-bold mt-2">50</p>
                    </div>
                    <Link
                        href="/dashboard/feedback"
                        className="flex items-center gap-2 text-[#a3a3a3] hover:text-white text-[13px] font-semibold no-underline mt-6 transition-colors w-fit">
                        <span>Lihat Lebih Detail</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
