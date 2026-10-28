"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api"; // Import API axios yang sudah ada tokennya

export function useDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUser: 0,
        totalKoleksi: 0,
        saldoKeuangan: 0,
        totalUlasan: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/api/dashboard");
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Gagal mengambil data dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    };

    return { stats, loading, formatRupiah };
}
