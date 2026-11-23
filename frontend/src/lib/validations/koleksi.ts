import { z } from "zod";
import { KATEGORI_KOLEKSI } from "@/lib/constants";

export const MAX_IMAGE_MB = 1;

export const koleksiSchema = z.object({
    nama: z.string().trim().min(3, "Nama minimal 3 karakter"),
    jenis: z.enum(KATEGORI_KOLEKSI, { message: "Pilih kategori benda" }),
    tahun: z
        .string()
        .trim()
        .regex(/^(\d{1,4})?$/, "Tahun berupa angka (mis. 1948)"),
    deskripsi: z.string().trim().min(10, "Sejarah minimal 10 karakter"),
    identitas: z.string().trim().min(3, "Identitas wajib diisi"),
});

// Mengembalikan pesan error, atau null jika file valid
export function validateImage(file: File): string | null {
    if (!["image/jpeg", "image/png"].includes(file.type))
        return "Hanya menerima file JPG atau PNG.";
    if (file.size > MAX_IMAGE_MB * 1024 * 1024)
        return `Ukuran gambar maksimal ${MAX_IMAGE_MB} MB.`;
    return null;
}
