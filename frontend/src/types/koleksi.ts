export interface Koleksi {
    id: number;
    nama: string;
    jenis: string;
    token: string;
    deskripsi: string;
    gambar: string | null;
    tanggal_update: string;
}

// Tipe data khusus untuk saat admin mengisi form (id dan tanggal dibuat otomatis oleh database)
export interface KoleksiFormValues {
    nama: string;
    jenis: string;
    token: string;
    deskripsi: string;
    gambar: string;
    fileGambar?: File | null;
    previewGambar?: string;
}
