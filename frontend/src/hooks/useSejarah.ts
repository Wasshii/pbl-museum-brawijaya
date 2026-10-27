"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";

// Struktur data menyesuaikan yang ada di tabel
export interface KoleksiData {
    id_koleksi: number;
    nama_koleksi: string;
    deskripsi: string;
    gambar: string;
}

export function useSejarah() {
    const { notify } = useToast();

    // State untuk Data
    const [koleksi, setKoleksi] = useState<KoleksiData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // State untuk Modal (Pop-up)
    const [modalFormOpen, setModalFormOpen] = useState(false);
    const [modalDetailOpen, setModalDetailOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

    // State untuk Form & Aksi
    const [isEdit, setIsEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState<KoleksiData | null>(null);
    const [formData, setFormData] = useState<any>({
        nama_koleksi: "",
        deskripsi: "",
        gambar: "",
        fileGambar: null,
        previewGambar: "",
    });

    // Fungsi mengambil data (Nanti tinggal kamu hubungkan dengan API/backend-mu)
    const fetchKoleksi = async () => {
        setLoading(true);
        try {
            // TODO: Ganti bagian ini dengan fungsi fetch ke backend (contoh: axios.get('/api/sejarah'))
            // Simulasi data sementara agar UI bisa tampil
            setTimeout(() => {
                setKoleksi([
                    {
                        id_koleksi: 1,
                        nama_koleksi: "Keris Pusaka Brawijaya",
                        deskripsi:
                            "Keris peninggalan zaman kerajaan Majapahit yang digunakan oleh para prajurit elit.",
                        gambar: "", // Kosongkan agar pakai placeholder
                    },
                    {
                        id_koleksi: 2,
                        nama_koleksi: "Seragam Pejuang 1945",
                        deskripsi:
                            "Seragam asli yang dikenakan oleh pejuang kemerdekaan saat pertempuran 10 November.",
                        gambar: "",
                    },
                ]);
                setLoading(false);
            }, 500);
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: "Gagal memuat data koleksi",
            });
            setLoading(false);
        }
    };

    // Ambil data pertama kali saat halaman dimuat
    useEffect(() => {
        fetchKoleksi();
    }, []);

    // Logika Pencarian
    const filteredKoleksi = koleksi.filter((item) =>
        item.nama_koleksi.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // --- KUMPULAN FUNGSI HANDLER ---

    const handleAdd = () => {
        setIsEdit(false);
        setFormData({
            nama_koleksi: "",
            deskripsi: "",
            gambar: "",
            fileGambar: null,
            previewGambar: "",
        });
        setModalFormOpen(true);
    };

    const handleEdit = (item: KoleksiData) => {
        setIsEdit(true);
        setSelectedItem(item);
        setFormData({
            nama_koleksi: item.nama_koleksi,
            deskripsi: item.deskripsi,
            gambar: item.gambar,
            fileGambar: null,
            previewGambar: "",
        });
        setModalFormOpen(true);
    };

    const handleView = (item: KoleksiData) => {
        setSelectedItem(item);
        setModalDetailOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        const item = koleksi.find((k) => k.id_koleksi === id) || null;
        setSelectedItem(item);
        setModalDeleteOpen(true);
    };

    // Fungsi Submit Form (Tambah / Edit)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // TODO: Hubungkan dengan API POST/PUT ke backend-mu di sini
            await new Promise((resolve) => setTimeout(resolve, 800)); // Simulasi loading

            notify({
                type: "success",
                title: "Berhasil",
                message: `Data koleksi berhasil ${isEdit ? "diperbarui" : "ditambahkan"}!`,
            });
            setModalFormOpen(false);
            fetchKoleksi(); // Refresh data
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: "Terjadi kesalahan saat menyimpan data.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Fungsi Konfirmasi Hapus
    const confirmDelete = async () => {
        if (!selectedItem) return;
        setLoading(true);
        try {
            // TODO: Hubungkan dengan API DELETE ke backend-mu di sini
            await new Promise((resolve) => setTimeout(resolve, 800)); // Simulasi loading

            notify({
                type: "success",
                title: "Berhasil",
                message: "Data koleksi berhasil dihapus.",
            });
            setModalDeleteOpen(false);
            fetchKoleksi(); // Refresh data
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
        koleksi: filteredKoleksi, // Kembalikan data yang sudah difilter agar pencarian langsung jalan
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
