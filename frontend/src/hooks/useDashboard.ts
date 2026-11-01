"use client";
import { api } from "@/lib/api"; // Import API axios yang sudah ada tokennya
import { CACHE_KEYS } from "@/lib/cache";
import { useCache } from "@/hooks/useCache";

interface DashboardStats {
    totalUser: number;
    totalKoleksi: number;
    saldoKeuangan: number;
    totalUlasan: number;
}

const STATS_KOSONG: DashboardStats = {
    totalUser: 0,
    totalKoleksi: 0,
    saldoKeuangan: 0,
    totalUlasan: 0,
};

const fetchStats = async (): Promise<DashboardStats> => {
    const response = await api.get("/api/dashboard");
    // Dilempar sebagai error supaya respons gagal tidak ikut tersimpan di cache
    if (!response.data.success) {
        throw new Error("Respons dashboard tidak berhasil");
    }
    return response.data.data;
};

const handleError = (error: unknown) => {
    console.error("Gagal mengambil data dashboard:", error);
};

export function useDashboard() {
    const { data, loading } = useCache<DashboardStats>(
        CACHE_KEYS.dashboard,
        fetchStats,
        { onError: handleError },
    );

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    };

    return { stats: data ?? STATS_KOSONG, loading, formatRupiah };
}
