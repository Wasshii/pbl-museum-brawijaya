import type { User, UserEditValues } from "@/types/user";

// User dari API -> isian form Edit (null jadi teks kosong)
export const toEditValues = (user: User): UserEditValues => ({
    name: user.name,
    phone: user.phone ?? "",
    email: user.email ?? "",
    address: user.address ?? "",
    createdAt: user.createdAt,
});

// Kolom kosong tampil "-"
export const tampilkan = (nilai: string | null) =>
    nilai && nilai.trim() ? nilai : "-";

// "baru saja" / "12 menit lalu" / "3 jam lalu" / "2 hari lalu"
export const durasiLalu = (sejakIso: string, sekarang: number) => {
    const detik = Math.max(
        0,
        Math.floor((sekarang - new Date(sejakIso).getTime()) / 1000),
    );
    if (detik < 60) return "baru saja";
    const menit = Math.floor(detik / 60);
    if (menit < 60) return `${menit} menit lalu`;
    const jam = Math.floor(menit / 60);
    if (jam < 24) return `${jam} jam lalu`;
    return `${Math.floor(jam / 24)} hari lalu`;
};

// Teks status di tabel: "Online" atau "Offline 25 menit lalu"
export const labelStatus = (
    user: Pick<User, "status" | "lastActiveAt">,
    sekarang: number,
) => {
    if (user.status === "Online") return "Online";
    if (!user.lastActiveAt) return "Offline";
    return `Offline ${durasiLalu(user.lastActiveAt, sekarang)}`;
};

// "14 November 2026 pukul 10.32" (untuk modal detail)
export const waktuAktifTerakhir = (iso: string) =>
    new Date(iso).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
