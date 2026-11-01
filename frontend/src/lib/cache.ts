// Cache data di localStorage dengan masa berlaku (TTL).
// Dipakai hook useCache supaya pindah menu tidak selalu memuat ulang dari API.

const PREFIX = "cache:v1:"; // naikkan versi bila bentuk data yang disimpan berubah
export const CACHE_TTL_MS = 5 * 60 * 1000; // 5 menit

// Satu kunci untuk setiap halaman
export const CACHE_KEYS = {
    dashboard: "dashboard",
    feedback: "feedback",
    keuangan: "keuangan",
    koleksi: "koleksi",
    users: "users",
} as const;
export type CacheKey = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS];

interface CacheEntry<T> {
    data: T;
    savedAt: number; // waktu disimpan (ms sejak epoch)
}

// Mengembalikan data cache, atau null bila belum ada / sudah kedaluwarsa / rusak.
export function getCache<T>(key: CacheKey): T | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(PREFIX + key);
        if (!raw) return null;

        const entry = JSON.parse(raw) as Partial<CacheEntry<T>> | null;
        if (!entry || typeof entry.savedAt !== "number" || entry.data == null) {
            localStorage.removeItem(PREFIX + key);
            return null;
        }

        const umur = Date.now() - entry.savedAt;
        if (umur < 0 || umur > CACHE_TTL_MS) {
            localStorage.removeItem(PREFIX + key);
            return null;
        }
        return entry.data;
    } catch {
        return null;
    }
}

export function setCache<T>(key: CacheKey, data: T): void {
    if (typeof window === "undefined") return;
    try {
        const entry: CacheEntry<T> = { data, savedAt: Date.now() };
        localStorage.setItem(PREFIX + key, JSON.stringify(entry));
    } catch {
        // Penyimpanan penuh / diblokir browser: abaikan, data tetap tampil dari state
    }
}

// Hapus cache tertentu (dipakai setelah tambah/ubah/hapus data)
export function removeCache(...keys: CacheKey[]): void {
    if (typeof window === "undefined") return;
    try {
        keys.forEach((key) => localStorage.removeItem(PREFIX + key));
    } catch {
        // abaikan
    }
}

// Hapus semua cache (dipakai saat login dan logout)
export function clearAllCache(): void {
    if (typeof window === "undefined") return;
    try {
        const daftar: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(PREFIX)) daftar.push(k);
        }
        daftar.forEach((k) => localStorage.removeItem(k));
    } catch {
        // abaikan
    }
}
