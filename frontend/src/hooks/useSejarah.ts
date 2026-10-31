"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { getErrorMessage } from "@/lib/api";
import * as koleksiService from "@/services/koleksi.service";
import type { Koleksi, KoleksiFormValues } from "@/types/koleksi";

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

    const [formData, setFormData] = useState<KoleksiFormValues>({
        nama: "",
        jenis: "",
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
            // Format tanggal update agar rapi
            const formattedData = data.map((item) => ({
                ...item,
                tanggal_update: new Date(
                    item.tanggal_update,
                ).toLocaleDateString("id-ID"),
            }));
            setKoleksi(formattedData);
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: "Gagal memuat data koleksi",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKoleksi();
    }, []);

    // REVISI: Pencarian sekarang mencakup Nama ATAU Token
    const filteredKoleksi = koleksi.filter(
        (item) =>
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.token.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleAdd = () => {
        setIsEdit(false);
        setFormData({
            nama: "",
            jenis: "", // BARU: diisi admin lewat input Jenis Benda
            token: `TKN-${Math.floor(1000 + Math.random() * 9000)}`, // usulan token, boleh diubah
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
            gambar: item.gambar || "",
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
                message: `Data berhasil ${isEdit ? "diperbarui" : "ditambahkan"}`,
            });
            setModalFormOpen(false);
            fetchKoleksi();
        } catch (error) {
            // REVISI: tampilkan pesan asli dari backend (token kembar, ukuran gambar, dll)
            notify({
                type: "error",
                title: "Gagal",
                message: getErrorMessage(error, "Gagal menyimpan data."),
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
                message: "Data berhasil dihapus.",
            });
            setModalDeleteOpen(false);
            fetchKoleksi();
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: "Gagal menghapus data.",
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
