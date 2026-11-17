export interface FeedbackData {
    id: number;
    nama_user: string;
    rating: number;
    komentar: string; // bisa kosong: pengunjung boleh hanya memberi bintang
    foto: string | null; // mis. "/uploads/feedback/xxx.jpg"; null = tanpa foto
    tanggal: string;
    balasan: string | null;
}
