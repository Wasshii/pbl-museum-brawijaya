import axios from "axios";
import { getToken } from "@/lib/auth";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
});

// Menyisipkan token ke setiap request secara otomatis
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Mengambil pesan error dari response backend
export function getErrorMessage(
    error: unknown,
    fallback = "Terjadi kesalahan pada server",
) {
    if (axios.isAxiosError(error)) {
        return (
            (error.response?.data as { message?: string } | undefined)
                ?.message ?? fallback
        );
    }
    return fallback;
}
