import { z } from "zod";
import { emailSchema } from "@/lib/validations/auth";

// 08xxxxxxxxxx (10-13 digit) atau format internasional dari aplikasi mobile (+6281...)
const PHONE_REGEX = /^(\+\d{8,15}|08\d{8,11})$/;

const userDasar = z.object({
    name: z.string().trim().min(3, "Nama minimal 3 karakter"),
    // Nomor telepon dan email boleh kosong, tetapi salah satunya wajib diisi
    phone: z
        .string()
        .trim()
        .refine(
            (v) => v === "" || PHONE_REGEX.test(v),
            "Nomor telepon: 08xxxxxxxxxx (10-13 digit) atau +kodeNegara",
        ),
    email: z
        .string()
        .trim()
        .refine(
            (v) => v === "" || emailSchema.safeParse(v).success,
            "Format email tidak valid",
        ),
    address: z.string().trim(),
});

const salahSatuKontak = (d: { phone: string; email: string }) =>
    d.phone !== "" || d.email !== "";
const PESAN_KONTAK = {
    message: "Isi nomor telepon atau email (minimal salah satu)",
    path: ["phone"],
};

export const userSchema = userDasar.refine(salahSatuKontak, PESAN_KONTAK);

// Form edit punya satu field tambahan: tanggal akun dibuat
export const userEditSchema = userDasar
    .extend({
        createdAt: z.string().trim().min(1, "Tanggal akun dibuat wajib diisi"),
    })
    .refine(salahSatuKontak, PESAN_KONTAK);
