"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";

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
            const response = await api.get("/api/keuangan");
            setTransaksi(response.data.data);
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: "Gagal memuat data keuangan dari server",
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

    // Perhitungan Ringkasan (Berdasarkan data MySQL)
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

        // Logika Validasi Tambahan: Cegah minus
        if (
            formData.tipe === "pengeluaran" &&
            Number(formData.jumlah) > totalSaldo
        ) {
            notify({
                type: "error",
                title: "Saldo Kurang",
                message: "Pencairan ditolak! Saldo tidak mencukupi.",
            });
            return;
        }

        setLoading(true);
        try {
            await api.post("/api/keuangan", {
                tipe: formData.tipe,
                jumlah: Number(formData.jumlah),
                deskripsi: formData.deskripsi,
            });

            notify({
                type: "success",
                title: "Berhasil",
                message: "Transaksi berhasil diproses.",
            });
            setModalFormOpen(false);
            fetchKeuangan(); // Muat ulang data langsung dari database
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: "Terjadi kesalahan saat memproses transaksi.",
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
