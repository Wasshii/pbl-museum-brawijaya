export type JenisTiket = "Mandiri" | "Guide";
export type JenisPencairan = "Bank" | "E-Wallet";
export type StatusTransaksi = "Sukses";

export interface TransaksiMasuk {
    id: number;
    nama: string;
    tiket: number;
    nominal: number; // angka murni, contoh 20000
    jenis: JenisTiket;
    status: StatusTransaksi;
    idTrx: string;
    tanggal: string; // format ISO: '2026-07-10'
    noTlp: string;
    jenisPembayaran: "QRIS";
}

export interface TransaksiKeluar {
    id: number;
    namaAdmin: string;
    nominal: number; // angka positif; tanda minus ditambahkan saat ditampilkan
    jenisPencairan: JenisPencairan;
    noRekening: string;
    status: StatusTransaksi;
    idTrx: string;
    tanggal: string;
}

export interface RingkasanKeuangan {
    totalPemasukan: number;
    totalPengeluaran: number;
}
