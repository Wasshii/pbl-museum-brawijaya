const { z } = require("zod");

const email = z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid");
const code = z.string().regex(/^\d{6}$/, "Kode harus 6 digit angka");

exports.loginSchema = z.object({
    email,
    password: z.string().min(1, "Password wajib diisi"),
});

exports.forgotSchema = z.object({ email });

exports.verifyCodeSchema = z.object({ email, code });

exports.resetSchema = z
    .object({
        email,
        code,
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
