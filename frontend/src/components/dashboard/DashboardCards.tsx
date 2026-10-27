"use client";
import { Users, BookOpen, Wallet, MessageSquare } from "lucide-react";

interface Props {
    stats: {
        totalUser: number;
        totalKoleksi: number;
        saldoKeuangan: number;
        totalUlasan: number;
    };
    formatRupiah: (angka: number) => string;
}

export default function DashboardCards({ stats, formatRupiah }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                    <Users className="w-7 h-7" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                        Total User
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {stats.totalUser}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-[#e6f3eb] flex items-center justify-center text-[#4a8a5b] shrink-0">
                    <BookOpen className="w-7 h-7" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                        Total Koleksi
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {stats.totalKoleksi}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Wallet className="w-7 h-7" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                        Saldo Keuangan
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {formatRupiah(stats.saldoKeuangan)}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-500 shrink-0">
                    <MessageSquare className="w-7 h-7" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                        Total Ulasan
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {stats.totalUlasan}
                    </p>
                </div>
            </div>
        </div>
    );
}
