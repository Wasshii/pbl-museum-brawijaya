"use client";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
    saldo: string;
    pemasukan: string;
    pengeluaran: string;
}

export default function KeuanganCards({
    saldo,
    pemasukan,
    pengeluaran,
}: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#e6f3eb] flex items-center justify-center text-[#4a8a5b]">
                    <Wallet className="w-7 h-7" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                        Total Saldo
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{saldo}</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                        Total Pemasukan
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {pemasukan}
                    </p>
                </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                    <TrendingDown className="w-7 h-7" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                        Total Pengeluaran
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {pengeluaran}
                    </p>
                </div>
            </div>
        </div>
    );
}
