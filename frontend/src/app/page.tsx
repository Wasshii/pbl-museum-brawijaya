"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckSquare, ExternalLink, User, Users } from "lucide-react";

export default function DashboardPage() {
    const [pemasukan, setPemasukan] = useState(400000);
    const [pengeluaran, setPengeluaran] = useState(100000);

    // Ambil data terbaru dari localStorage saat halaman dashboard dibuka
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
                    <Link
                        href="/dashboard/keuangan"
                        className="bg-[#222222] rounded-[24px] p-6 flex flex-col justify-between min-h-[160px] no-underline hover:scale-[1.02] transition-transform">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-white font-bold text-[18px]">
                                    Uang Masuk
                                </h3>
                                <p className="text-[#a3a3a3] text-[13px] mt-2 font-medium">
                                    10 / 7 / 2026
                                </p>
                            </div>
                            <CheckSquare className="text-[#00ff1a] w-6 h-6 stroke-[2]" />
                        </div>
                        <p className="text-white font-bold text-[24px] mt-6">
                            Rp. {pemasukan.toLocaleString("id-ID")}
                        </p>
                    </Link>

                    {/* Kartu Uang Keluar */}
                    <Link
                        href="/dashboard/keuangan"
                        className="bg-[#222222] rounded-[24px] p-6 flex flex-col justify-between min-h-[160px] no-underline hover:scale-[1.02] transition-transform">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-white font-bold text-[18px]">
                                    Uang Keluar
                                </h3>
                                <p className="text-[#a3a3a3] text-[13px] mt-2 font-medium">
                                    10 / 7 / 2026
                                </p>
                            </div>
                            <ExternalLink className="text-[#ff0810] w-6 h-6 stroke-[2]" />
                        </div>
                        <p className="text-white font-bold text-[24px] mt-6">
                            Rp. {pengeluaran.toLocaleString("id-ID")}
                        </p>
                    </Link>

                    {/* Kartu Total Pengunjung */}
                    <div className="bg-[#222222] rounded-[24px] p-6 flex flex-col justify-between min-h-[160px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-white font-bold text-[18px]">
                                    Total Pengunjung
                                </h3>
                                <p className="text-[#a3a3a3] text-[13px] mt-2 font-medium">
                                    10 / 7 / 2026
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-white font-bold text-[24px] mt-6">
                            <Users className="w-6 h-6 text-white" />
                            <span>40 Orang</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bagian Bawah Dashboard (Data User & Feedback) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="bg-[#222222] rounded-[24px] p-6 text-white">
                    <h3 className="text-[18px] font-bold mb-4">Data User</h3>
                    <p className="text-white/70 text-[14px]">Total User 60</p>
                    <div className="mt-6 flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-green-400 font-semibold text-[14px]">
                            <User className="w-5 h-5" /> 10 User Aktif
                        </div>
                        <div className="flex items-center gap-3 text-red-400 font-semibold text-[14px]">
                            <User className="w-5 h-5" /> 50 User Tidak Aktif
                        </div>
                    </div>
                </div>

                <div className="bg-[#222222] rounded-[24px] p-6 text-white flex flex-col justify-between">
                    <h3 className="text-[18px] font-bold mb-2">Feed Back</h3>
                    <div>
                        <p className="text-white/70 text-[14px]">Ulasan</p>
                        <p className="text-[40px] font-bold mt-2">50</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
