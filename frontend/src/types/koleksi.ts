export interface Koleksi {
    id: number;
    nama: string;
    jenis: string; // kategori benda (lihat KATEGORI_KOLEKSI)
    tahun: number | null;
    deskripsi: string; // sejarah benda (tab "Cerita" di aplikasi)
    identitas: string | null; // tab "Identitas" di aplikasi
    gambar: string | null;
    tanggal_update: string;
}

// Tipe data khusus untuk saat admin mengisi form (id dan tanggal dibuat otomatis oleh database)
export interface KoleksiFormValues {
    nama: string;
    jenis: string;
    tahun: string; // diketik sebagai teks, boleh kosong
    deskripsi: string;
    identitas: string;
    gambar: string;
    fileGambar?: File | null;
    previewGambar?: string;
}
