import { z } from "zod";

export const MAX_IMAGE_MB = 1;

export const koleksiSchema = z.object({
    nama: z.string().trim().min(3, "Nama minimal 3 karakter"),
    jenis: z.string().trim().min(1, "Jenis wajib diisi"),
    token: z
        .string()
        .trim()
        .regex(/^[A-Za-z0-9]{4,12}$/, "Token 4-12 karakter huruf atau angka"),
    deskripsi: z.string().trim().min(10, "Deskripsi minimal 10 karakter"),
});

// Mengembalikan pesan error, atau null jika file valid
export function validateImage(file: File): string | null {
    if (!["image/jpeg", "image/png"].includes(file.type))
        return "Hanya menerima file JPG atau PNG.";
    if (file.size > MAX_IMAGE_MB * 1024 * 1024)
        return `Ukuran gambar maksimal ${MAX_IMAGE_MB} MB.`;
    return null;
}
