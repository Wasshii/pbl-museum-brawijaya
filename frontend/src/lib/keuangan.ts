import type {
    JenisPencairan,
    JenisTiket,
    Penyedia,
    PeriodeKeuangan,
    Tarif,
} from "@/types/keuangan";

// Hanya untuk pratinjau total di form. Angka yang disimpan tetap
// dihitung backend, dengan harga yang sama (dikirim lewat GET /api/keuangan).
export const hitungNominal = (
    jumlahTiket: number,
    jenisTiket: JenisTiket,
    tarif: Tarif,
) => {
    if (jumlahTiket < 1) return 0;
    return (
        jumlahTiket * tarif.hargaTiket +
        (jenisTiket === "Guide" ? tarif.biayaPemandu : 0)
    );
};

// Nilai dari backend -> label di layar
const LABEL_STATUS: Record<string, string> = {
    berhasil: "Sukses",
    pending: "Pending",
    gagal: "Gagal",
    dibatalkan: "Dibatalkan", // dibatalkan pengguna di aplikasi mobile
};
export const labelStatus = (status: string) => LABEL_STATUS[status] ?? status;

// Apakah tanggal (yyyy-mm-dd) masuk ke periode yang dipilih.
// hariIni juga yyyy-mm-dd; dibandingkan sebagai teks supaya tidak bergeser zona waktu.
export const cocokPeriode = (
    tanggal: string,
    periode: PeriodeKeuangan,
    hariIni: string,
) => {
    if (periode === "hari") return tanggal === hariIni;
    if (periode === "bulan") return tanggal.startsWith(hariIni.slice(0, 7));
    return true;
};

// Aturan nomor tujuan pencairan (sama dengan config/penyedia.js di backend).
// Mengembalikan pesan error, atau null kalau sudah sesuai.
export const pesanRekening = (
    jenis: JenisPencairan,
    penyedia: Penyedia,
    angka: string,
): string | null => {
    if (jenis === "Bank") {
        return angka.length === penyedia.digitMin
            ? null
            : `Nomor rekening ${penyedia.id} harus tepat ${penyedia.digitMin} digit angka`;
    }
    if (!angka.startsWith("08")) {
        return `Nomor HP ${penyedia.nama} harus diawali 08`;
    }
    return angka.length >= penyedia.digitMin &&
        angka.length <= penyedia.digitMax
        ? null
        : `Nomor HP ${penyedia.nama} harus ${penyedia.digitMin}-${penyedia.digitMax} digit`;
};
