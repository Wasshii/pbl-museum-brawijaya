"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";

export interface TransaksiData {
    id: number;
    tanggal: string;
    deskripsi: string;
    tipe: "pemasukan" | "pengeluaran";
    jumlah: number;
    status: "berhasil" | "pending" | "gagal";
}

export function useKeuangan() {
    const { notify } = useToast();

    const [transaksi, setTransaksi] = useState<TransaksiData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [modalFormOpen, setModalFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        tipe: "pemasukan",
        jumlah: "",
        deskripsi: "",
    });

    const fetchKeuangan = async () => {
        setLoading(true);
        try {
            // TODO: Ganti dengan fetch API dari backend
            setTimeout(() => {
                setTransaksi([
                    {
                        id: 1,
                        tanggal: "2026-10-25",
                        deskripsi: "Top up saldo admin",
                        tipe: "pemasukan",
                        jumlah: 500000,
                        status: "berhasil",
                    },
                    {
                        id: 2,
                        tanggal: "2026-10-26",
                        deskripsi: "Pencairan dana ke bank",
                        tipe: "pengeluaran",
                        jumlah: 150000,
                        status: "berhasil",
                    },
                ]);
                setLoading(false);
            }, 500);
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: "Gagal memuat data keuangan",
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeuangan();
    }, []);

    const filteredTransaksi = transaksi.filter((item) =>
        item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Perhitungan Ringkasan
    const totalPemasukan = transaksi
        .filter((t) => t.tipe === "pemasukan")
        .reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalPengeluaran = transaksi
        .filter((t) => t.tipe === "pengeluaran")
        .reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalSaldo = totalPemasukan - totalPengeluaran;

    const handleAdd = () => {
        setFormData({ tipe: "pemasukan", jumlah: "", deskripsi: "" });
        setModalFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // TODO: Ganti dengan POST API ke backend
            await new Promise((resolve) => setTimeout(resolve, 800));
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
                message: "Terjadi kesalahan saat memproses.",
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
