// Rp 1.500.000
export const formatRupiah = (angka: number) =>
    `Rp ${angka.toLocaleString("id-ID")}`;

// "1.500.000" -> 1500000
export const parseNominal = (teks: string) =>
    parseInt(teks.replace(/\./g, ""), 10) || 0;

// "1500000" -> "1.500.000" (dipakai saat mengetik di input nominal)
export const formatInputNominal = (teks: string) => {
    const digit = teks.replace(/\D/g, "");
    return digit ? parseInt(digit, 10).toLocaleString("id-ID") : "";
};

// "2026-07-10" -> "10 / 7 / 2026"
export const formatTanggal = (iso: string) => {
    if (!iso) return "";
    const [tahun, bulan, hari] = iso.split("-");
    return `${parseInt(hari, 10)} / ${parseInt(bulan, 10)} / ${tahun}`;
};

// "12 Agustus 2025" (menggantikan array 12 nama bulan di halaman user)
export const tanggalPanjang = (date: Date = new Date()) =>
    date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

// Tanggal hari ini (zona waktu perangkat) format ISO "yyyy-mm-dd"
export const todayISO = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
