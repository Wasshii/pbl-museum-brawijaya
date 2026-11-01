export type TipeTransaksi = "pemasukan" | "pengeluaran";
export type JenisTiket = "Mandiri" | "Guide";
export type JenisPencairan = "Bank" | "E-Wallet";

// Satu baris transaksi dari GET /api/keuangan.
// Kolom yang tidak berlaku (atau baris lama) bernilai null -> tampil "-".
export interface TransaksiData {
    id: number;
    idTrx: string | null; // 10 digit angka
    tanggal: string; // yyyy-mm-dd
    deskripsi: string;
    tipe: TipeTransaksi;
    jumlah: number;
    status: string; // "berhasil" | "pending" | "gagal"
    nama: string | null;
    noTelepon: string | null;
    jumlahTiket: number | null;
    jenisTiket: JenisTiket | null;
    jenisPembayaran: string | null;
    jenisPencairan: JenisPencairan | null;
    noRekening: string | null;
}

// Angka kartu dihitung backend (hanya transaksi berstatus berhasil)
export interface KeuanganSummary {
    totalPemasukan: number;
    totalPengeluaran: number;
    saldo: number;
}

// Harga tiket dari backend (satu sumber, dipakai web dan nanti Flutter)
export interface Tarif {
    hargaTiket: number; // per tiket
    biayaPemandu: number; // sekali per transaksi, khusus jenis Guide
}

// Batas pencairan per bulan kalender, dihitung backend
export interface BatasPencairan {
    maksimumPerBulan: number;
    terpakaiBulanIni: number;
    sisa: number;
}

export interface KeuanganResponse {
    data: TransaksiData[];
    summary: KeuanganSummary;
    tarif: Tarif;
    batasPencairan: BatasPencairan;
}

// Isi Saldo -> pemasukan (nominal dihitung backend dari tiket)
export interface IsiSaldoInput {
    tipe: "pemasukan";
    nama: string;
    noTelepon?: string;
    jumlahTiket: number;
    jenisTiket: JenisTiket;
}

// Pencairan -> pengeluaran
export interface PencairanInput {
    tipe: "pengeluaran";
    nama: string;
    jumlah: number;
    jenisPencairan: JenisPencairan;
    noRekening: string;
}

export type TransaksiInput = IsiSaldoInput | PencairanInput;

export interface TambahKeuanganResult {
    id: number;
    idTrx: string;
    jumlah: number; // nominal final yang disimpan backend
}
