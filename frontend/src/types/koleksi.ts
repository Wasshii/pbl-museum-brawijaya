export interface Koleksi {
    id: number;
    nama: string;
    jenis: string;
    tanggal: string;
    token: string;
    deskripsi: string;
    gambar: string;
}
// Nilai yang diisi admin di form (id dan tanggal dibuat oleh sistem)
export type KoleksiFormValues = Omit<Koleksi, "id" | "tanggal">;
