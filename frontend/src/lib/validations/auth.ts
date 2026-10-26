import { z } from "zod";

export const emailSchema = z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid");

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password wajib diisi"),
});

export const forgotSchema = z.object({ email: emailSchema });

export const kodeSchema = z.object({
    email: emailSchema,
    code: z.string().regex(/^\d{6}$/, "Kode harus 6 digit angka"),
});

export const sandiBaruSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Sandi minimal 8 karakter")
            .regex(/[A-Za-z]/, "Sandi harus mengandung huruf")
            .regex(/\d/, "Sandi harus mengandung angka"),
        confirmPassword: z.string().min(1, "Konfirmasi sandi wajib diisi"),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: "Sandi dan konfirmasi sandi tidak cocok",
        path: ["confirmPassword"],
    });
