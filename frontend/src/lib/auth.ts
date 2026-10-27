import { z } from "zod";

// ==========================================
// 1. Session Management
// ==========================================
const TOKEN_KEY = "adminToken";
const ROLE_KEY = "adminRole";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function saveSession(token: string, role?: string) {
    localStorage.setItem(TOKEN_KEY, token);
    if (role) localStorage.setItem(ROLE_KEY, role);
}

export function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
}

// ==========================================
// 2. Validation Schemas (Zod)
// ==========================================
export const emailSchema = z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid")
    .toLowerCase(); // Tambahan opsional: memastikan email selalu format huruf kecil

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password wajib diisi"),
});

export const forgotSchema = z.object({
    email: emailSchema,
});

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

// Type inference (opsional untuk membantu TypeScript di komponen React/Form)
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotInput = z.infer<typeof forgotSchema>;
export type KodeInput = z.infer<typeof kodeSchema>;
export type SandiBaruInput = z.infer<typeof sandiBaruSchema>;
