"use client";
import { useEffect } from "react";
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

// Angka dashboard (mis. total user) bisa berubah dari aplikasi mobile (daftar / hapus akun),
// jadi cache 5 menit saja tidak cukup: data tampil dari cache dulu, lalu diambil ulang.
const SEGARKAN_MS = 15_000;

export function useDashboard() {
    const { data, loading, refetch } = useCache<DashboardStats>(
        CACHE_KEYS.dashboard,
        fetchStats,
        { onError: handleError },
    );

    // Ambil ulang saat halaman dibuka lalu berkala selama halaman ini terbuka
    useEffect(() => {
        void refetch();
        const timer = setInterval(() => void refetch(), SEGARKAN_MS);
        return () => clearInterval(timer);
    }, [refetch]);

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    };

    // Spinner hanya saat belum ada data sama sekali; penyegaran berikutnya berjalan diam-diam
    return {
        stats: data ?? STATS_KOSONG,
        loading: loading && data === null,
        formatRupiah,
    };
}
