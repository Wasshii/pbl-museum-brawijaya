"use client";
import DashboardCards from "@/components/dashboard/DashboardCards";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardUtamaPage() {
    const { stats, loading, formatRupiah } = useDashboard();

    return (
        <div className="animate-in fade-in duration-300">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[24px] md:text-[28px] font-bold text-gray-900 tracking-tight m-0">
                        Dashboard Statistik
                    </h1>
                    <p className="text-gray-500 mt-2 m-0">
                        Ringkasan data sistem Museum Brawijaya hari ini
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#6C9E78] border-t-transparent" />
                </div>
            ) : (
                <>
                    <DashboardCards stats={stats} formatRupiah={formatRupiah} />

                    {/* Banner Selamat Datang */}
                    <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center mt-4">
                        <div className="w-20 h-20 bg-[#e6f3eb] rounded-full flex items-center justify-center mb-6">
                            <span className="text-4xl"></span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Selamat Datang di Panel Admin!
                        </h3>
                        <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
                            Anda memegang kendali penuh atas sistem ini. Gunakan
                            menu navigasi di sebelah kiri untuk mengelola data
                            Pengguna, Koleksi Sejarah, Laporan Keuangan, dan
                            meninjau Ulasan Pengunjung.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
