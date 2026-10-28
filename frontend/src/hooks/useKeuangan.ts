"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import * as keuanganService from "@/services/keuangan.service";
import type { TransaksiData, TransaksiInput } from "@/types/keuangan";

export function useKeuangan() {
    const { notify } = useToast();

    const [transaksi, setTransaksi] = useState<TransaksiData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [modalFormOpen, setModalFormOpen] = useState(false);
    const [formData, setFormData] = useState<TransaksiInput>({
        tipe: "pemasukan",
        jumlah: 0,
        deskripsi: "",
    });

    const fetchKeuangan = async () => {
        setLoading(true);
        try {
            const data = await keuanganService.getKeuangan();
            setTransaksi(data);
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: "Gagal memuat data keuangan",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeuangan();
    }, []);

    const filteredTransaksi = transaksi.filter((item) =>
        item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const totalPemasukan = transaksi
        .filter((t) => t.tipe === "pemasukan")
        .reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalPengeluaran = transaksi
        .filter((t) => t.tipe === "pengeluaran")
        .reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalSaldo = totalPemasukan - totalPengeluaran;

    const handleAdd = () => {
        setFormData({ tipe: "pemasukan", jumlah: 0, deskripsi: "" });
        setModalFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.tipe === "pengeluaran" && formData.jumlah > totalSaldo) {
            notify({
                type: "error",
                title: "Saldo Kurang",
                message: "Pencairan ditolak! Saldo tidak mencukupi.",
            });
            return;
        }

        setLoading(true);
        try {
            await keuanganService.tambahKeuangan(formData);
            notify({
                type: "success",
                title: "Berhasil",
                message: "Transaksi berhasil diproses.",
            });
            setModalFormOpen(false);
            fetchKeuangan();
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: "Gagal memproses transaksi.",
            });
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    };

    return {
        transaksi: filteredTransaksi,
        loading,
        searchQuery,
        setSearchQuery,
        modalFormOpen,
        setModalFormOpen,
        formData,
        setFormData,
        totalSaldo,
        totalPemasukan,
        totalPengeluaran,
        handleAdd,
        handleSubmit,
        formatRupiah,
    };
}
