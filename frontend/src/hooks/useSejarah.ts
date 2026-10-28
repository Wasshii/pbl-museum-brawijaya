"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import * as koleksiService from "@/services/koleksi.service";
import type { Koleksi } from "@/types/koleksi";

export function useSejarah() {
    const { notify } = useToast();

    const [koleksi, setKoleksi] = useState<Koleksi[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [modalFormOpen, setModalFormOpen] = useState(false);
    const [modalDetailOpen, setModalDetailOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

    const [isEdit, setIsEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Koleksi | null>(null);

    // Sesuaikan dengan struktur database MySQL
    const [formData, setFormData] = useState<any>({
        nama: "",
        jenis: "Benda Bersejarah", // Default jenis
        token: "",
        deskripsi: "",
        gambar: "",
        fileGambar: null,
        previewGambar: "",
    });

    const fetchKoleksi = async () => {
        setLoading(true);
        try {
            const data = await koleksiService.getKoleksi();
            setKoleksi(data);
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: "Gagal memuat data koleksi dari server",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKoleksi();
    }, []);

    const filteredKoleksi = koleksi.filter((item) =>
        item.nama?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleAdd = () => {
        setIsEdit(false);
        setFormData({
            nama: "",
            jenis: "Benda Bersejarah",
            token: `TKN-${Math.floor(Math.random() * 10000)}`, // Generate token acak sederhana
            deskripsi: "",
            gambar: "",
            fileGambar: null,
            previewGambar: "",
        });
        setModalFormOpen(true);
    };

    const handleEdit = (item: Koleksi) => {
        setIsEdit(true);
        setSelectedItem(item);
        setFormData({
            nama: item.nama,
            jenis: item.jenis,
            token: item.token,
            deskripsi: item.deskripsi,
            gambar: item.gambar,
            fileGambar: null,
            previewGambar: "",
        });
        setModalFormOpen(true);
    };

    const handleView = (item: Koleksi) => {
        setSelectedItem(item);
        setModalDetailOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        const item = koleksi.find((k) => k.id === id) || null;
        setSelectedItem(item);
        setModalDeleteOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit && selectedItem) {
                await koleksiService.updateKoleksi({
                    ...formData,
                    id: selectedItem.id,
                });
            } else {
                await koleksiService.createKoleksi(formData);
            }

            notify({
                type: "success",
                title: "Berhasil",
                message: `Data koleksi berhasil ${isEdit ? "diperbarui" : "ditambahkan"}!`,
            });
            setModalFormOpen(false);
            fetchKoleksi(); // Refresh data langsung dari MySQL
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message:
                    "Terjadi kesalahan saat menyimpan data (Pastikan token unik).",
            });
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!selectedItem) return;
        setLoading(true);
        try {
            await koleksiService.deleteKoleksi(selectedItem.id);
            notify({
                type: "success",
                title: "Berhasil",
                message: "Data koleksi berhasil dihapus.",
            });
            setModalDeleteOpen(false);
            fetchKoleksi(); // Refresh data langsung dari MySQL
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: "Terjadi kesalahan saat menghapus data.",
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        koleksi: filteredKoleksi,
        loading,
        searchQuery,
        setSearchQuery,
        formData,
        setFormData,
        isEdit,
        modalFormOpen,
        setModalFormOpen,
        modalDetailOpen,
        setModalDetailOpen,
        modalDeleteOpen,
        setModalDeleteOpen,
        selectedItem,
        handleAdd,
        handleEdit,
        handleDeleteClick,
        handleView,
        handleSubmit,
        confirmDelete,
    };
}
