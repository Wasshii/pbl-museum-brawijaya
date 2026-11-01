"use client";
import { useState, useMemo } from "react";
import { useToast } from "@/context/ToastContext";
import { useCache } from "@/hooks/useCache";
import { getErrorMessage } from "@/lib/api";
import { CACHE_KEYS, removeCache } from "@/lib/cache";
import * as koleksiService from "@/services/koleksi.service";
import type { Koleksi, KoleksiFormValues } from "@/types/koleksi";

const DAFTAR_KOSONG: Koleksi[] = [];

export function useSejarah() {
    const { notify } = useToast();

    // Data koleksi apa adanya dari API: dari cache (5 menit) bila ada, kalau tidak dari API
    const {
        data,
        loading: fetching,
        refetch: fetchKoleksi,
    } = useCache<Koleksi[]>(CACHE_KEYS.koleksi, koleksiService.getKoleksi, {
        onError: () =>
            notify({
                type: "error",
                title: "Gagal",
                message: "Gagal memuat data koleksi",
            }),
    });

    // Format tanggal update agar rapi (dilakukan saat tampil, bukan sebelum
    // disimpan ke cache, supaya cache tetap berisi data asli dari API)
    const koleksi = useMemo(
        () =>
            (data ?? DAFTAR_KOSONG).map((item) => ({
                ...item,
                tanggal_update: new Date(
                    item.tanggal_update,
                ).toLocaleDateString("id-ID"),
            })),
        [data],
    );

    // `loading` tetap berlaku untuk pengambilan data maupun proses simpan/hapus
    const [submitting, setSubmitting] = useState(false);
    const loading = fetching || submitting;

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
        setSubmitting(true);
        try {
            if (isEdit && selectedItem) {
                await koleksiService.updateKoleksi({
                    ...formData,
                    id: selectedItem.id,
                });
            } else {
                await koleksiService.createKoleksi(formData);
                removeCache(CACHE_KEYS.dashboard); // jumlah koleksi di dashboard bertambah
            }
            notify({
                type: "success",
                title: "Berhasil",
                message: `Data berhasil ${isEdit ? "diperbarui" : "ditambahkan"}`,
            });
            setModalFormOpen(false);
            fetchKoleksi(); // ambil ulang, cache koleksi ikut diperbarui
        } catch (error) {
            // REVISI: tampilkan pesan asli dari backend (token kembar, ukuran gambar, dll)
            notify({
                type: "error",
                title: "Gagal",
                message: getErrorMessage(error, "Gagal menyimpan data."),
            });
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!selectedItem) return;
        setSubmitting(true);
        try {
            await koleksiService.deleteKoleksi(selectedItem.id);
            notify({
                type: "success",
                title: "Berhasil",
                message: "Data berhasil dihapus.",
            });
            setModalDeleteOpen(false);
            removeCache(CACHE_KEYS.dashboard); // jumlah koleksi di dashboard berkurang
            fetchKoleksi(); // ambil ulang, cache koleksi ikut diperbarui
        } catch {
            notify({
                type: "error",
                title: "Gagal",
                message: "Gagal menghapus data.",
            });
        } finally {
            setSubmitting(false);
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
