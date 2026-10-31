import { api } from "@/lib/api";
import type { Koleksi, KoleksiFormValues } from "@/types/koleksi";

export const getKoleksi = async (): Promise<Koleksi[]> => {
    const response = await api.get("/api/koleksi");
    return response.data.data;
};

// Data dikirim sebagai multipart/form-data karena membawa file gambar asli.
// Jangan set header Content-Type manual: axios/browser mengisinya beserta boundary.
const toFormData = (values: KoleksiFormValues): FormData => {
    const body = new FormData();
    body.append("nama", values.nama);
    body.append("jenis", values.jenis);
    body.append("token", values.token);
    body.append("deskripsi", values.deskripsi);
    // Tanpa file baru, backend mempertahankan gambar lama (saat edit)
    // atau memakai gambar bawaan (saat tambah).
    if (values.fileGambar) body.append("gambar", values.fileGambar);
    return body;
};

export const createKoleksi = async (
    values: KoleksiFormValues,
): Promise<void> => {
    await api.post("/api/koleksi", toFormData(values));
};

export const updateKoleksi = async (
    koleksi: KoleksiFormValues & { id: number },
): Promise<void> => {
    await api.put(`/api/koleksi/${koleksi.id}`, toFormData(koleksi));
};

export const deleteKoleksi = async (id: number): Promise<void> => {
    await api.delete(`/api/koleksi/${id}`);
};
