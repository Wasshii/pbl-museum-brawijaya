"use client";
import { useState, useEffect } from "react";

export function useDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUser: 0,
        totalKoleksi: 0,
        saldoKeuangan: 0,
        totalUlasan: 0,
    });

    useEffect(() => {
        // Simulasi fetch data statistik untuk Dashboard
        setTimeout(() => {
            setStats({
                totalUser: 125,
                totalKoleksi: 48,
                saldoKeuangan: 15500000,
                totalUlasan: 320,
            });
            setLoading(false);
        }, 500);
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
