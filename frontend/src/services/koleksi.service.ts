import { api } from "@/lib/api";
import type { Koleksi, KoleksiFormValues } from "@/types/koleksi";

export const getKoleksi = async (): Promise<Koleksi[]> => {
    const response = await api.get("/api/koleksi");
    return response.data.data;
};

export const createKoleksi = async (
    values: KoleksiFormValues,
): Promise<void> => {
    const dataToSend = {
        nama: values.nama,
        jenis: values.jenis,
        token: values.token,
        deskripsi: values.deskripsi,
        gambar:
            values.previewGambar ||
            values.gambar ||
            "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80",
    };
    await api.post("/api/koleksi", dataToSend);
};

export const updateKoleksi = async (
    koleksi: KoleksiFormValues & { id: number },
): Promise<void> => {
    const dataToSend = {
        nama: koleksi.nama,
        jenis: koleksi.jenis,
        token: koleksi.token,
        deskripsi: koleksi.deskripsi,
        gambar: koleksi.previewGambar || koleksi.gambar,
    };
    await api.put(`/api/koleksi/${koleksi.id}`, dataToSend);
};

export const deleteKoleksi = async (id: number): Promise<void> => {
    await api.delete(`/api/koleksi/${id}`);
};
