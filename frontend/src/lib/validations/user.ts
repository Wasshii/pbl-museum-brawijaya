import { z } from "zod";
import { emailSchema } from "@/lib/validations/auth";

export const userSchema = z.object({
    name: z.string().trim().min(3, "Nama minimal 3 karakter"),
    phone: z
        .string()
        .trim()
        .regex(
            /^08\d{8,11}$/,
            "Nomor telepon harus diawali 08 dan 10-13 digit angka",
        ),
    email: emailSchema,
    address: z.string().trim().min(5, "Alamat minimal 5 karakter"),
    status: z.enum(["Online", "Offline"]),
});

// Form edit punya satu field tambahan: tanggal akun dibuat
export const userEditSchema = userSchema.extend({
    createdAt: z.string().trim().min(1, "Tanggal akun dibuat wajib diisi"),
});
