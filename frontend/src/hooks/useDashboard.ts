"use client";
import { useEffect, useState } from "react";
import { getFeedbacks } from "@/services/feedback.service";
import { getRingkasan, getTransaksiMasuk } from "@/services/keuangan.service";
import { getUsers } from "@/services/user.service";
import type { RingkasanKeuangan } from "@/types/keuangan";

const AWAL = {
    ringkasan: { totalPemasukan: 0, totalPengeluaran: 0 } as RingkasanKeuangan,
    totalPengunjung: 0,
    totalUser: 0,
    userAktif: 0,
    totalFeedback: 0,
};

export function useDashboard() {
    const [data, setData] = useState(AWAL);

    useEffect(() => {
        let active = true;
        Promise.all([
            getRingkasan(),
            getTransaksiMasuk(),
            getUsers(),
            getFeedbacks(),
        ]).then(([ringkasan, masuk, users, feedbacks]) => {
            if (!active) return;
            setData({
                ringkasan,
                totalPengunjung: masuk.reduce((total, t) => total + t.tiket, 0),
                totalUser: users.length,
                userAktif: users.filter((u) => u.status === "Online").length,
                totalFeedback: feedbacks.length,
            });
        });
        return () => {
            active = false;
        };
    }, []);

    return data;
}
