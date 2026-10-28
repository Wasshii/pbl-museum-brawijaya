import { api } from "@/lib/api";
import type { Koleksi, KoleksiFormValues } from "@/types/koleksi";

// Ambil semua data koleksi dari backend
export const getKoleksi = async (): Promise<Koleksi[]> => {
    const response = await api.get("/api/koleksi");
    return response.data.data;
};

// Tambah koleksi baru
export const createKoleksi = async (
    values: KoleksiFormValues,
): Promise<void> => {
    const dataToSend = {
        ...values,
        gambar:
            values.gambar ||
            "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80",
    };
    await api.post("/api/koleksi", dataToSend);
};

// Edit koleksi
export const updateKoleksi = async (koleksi: Koleksi): Promise<void> => {
    const dataToSend = {
        nama: koleksi.nama,
        jenis: koleksi.jenis,
        token: koleksi.token,
        deskripsi: koleksi.deskripsi,
        gambar: koleksi.gambar,
    };
    await api.put(`/api/koleksi/${koleksi.id}`, dataToSend);
};

// Hapus koleksi
export const deleteKoleksi = async (id: number): Promise<void> => {
    await api.delete(`/api/koleksi/${id}`);
};
