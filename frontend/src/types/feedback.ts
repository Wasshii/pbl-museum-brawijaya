export interface FeedbackData {
    id: number;
    nama_user: string;
    rating: number;
    komentar: string; // bisa kosong: pengunjung boleh hanya memberi bintang
    fotos: string[]; // 0-3 foto, mis. "/uploads/feedback/xxx.jpg"; kosong = tanpa foto
    tanggal: string;
    balasan: string | null;
}
