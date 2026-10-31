import { api } from "@/lib/api";
import { DEFAULT_KOLEKSI_IMAGE } from "@/lib/constants";

// Mengubah nilai `gambar` dari database menjadi URL yang bisa dibuka browser.
// - "/uploads/koleksi/xxx.jpg"  -> "http://localhost:5000/uploads/koleksi/xxx.jpg"
// - URL penuh (http/https), blob:, dan data: dipakai apa adanya
// - kosong -> gambar bawaan
export function resolveImageUrl(src?: string | null): string {
    if (!src) return DEFAULT_KOLEKSI_IMAGE;
    if (/^(https?:|blob:|data:)/i.test(src)) return src;

    const base = (api.defaults.baseURL ?? "").replace(/\/$/, "");
    return `${base}${src.startsWith("/") ? "" : "/"}${src}`;
}
