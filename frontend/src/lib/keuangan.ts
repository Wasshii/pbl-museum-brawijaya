import type { JenisTiket, Tarif } from "@/types/keuangan";

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
};
export const labelStatus = (status: string) => LABEL_STATUS[status] ?? status;
