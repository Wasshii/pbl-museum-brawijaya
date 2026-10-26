import { todayISO } from "@/lib/format";
import { readStorage, writeStorage } from "@/lib/storage";
import type {
    JenisPencairan,
    JenisTiket,
    RingkasanKeuangan,
    TransaksiKeluar,
    TransaksiMasuk,
} from "@/types/keuangan";

const KEY_MASUK = "museum_data_masuk";
const KEY_KELUAR = "museum_data_keluar";
const KEY_PEMASUKAN = "museum_pemasukan";
const KEY_PENGELUARAN = "museum_pengeluaran";

const DUMMY_MASUK: TransaksiMasuk[] = [];
const DUMMY_KELUAR: TransaksiKeluar[] = [];

const buatIdTrx = () =>
    Math.floor(1000000000 + Math.random() * 9000000000).toString();

export const getTransaksiMasuk = async () =>
    readStorage<TransaksiMasuk[]>(KEY_MASUK, DUMMY_MASUK);
export const getTransaksiKeluar = async () =>
    readStorage<TransaksiKeluar[]>(KEY_KELUAR, DUMMY_KELUAR);
export const getRingkasan = async (): Promise<RingkasanKeuangan> => ({
    totalPemasukan: readStorage<number>(KEY_PEMASUKAN, 680000),
    totalPengeluaran: readStorage<number>(KEY_PENGELUARAN, 180000),
});

export interface IsiSaldoInput {
    nama: string;
    tiket: number;
    jenis: JenisTiket;
    nominal: number;
    noTlp: string;
}

export const tambahPemasukan = async (
    input: IsiSaldoInput,
): Promise<TransaksiMasuk> => {
    const [daftar, ringkasan] = await Promise.all([
        getTransaksiMasuk(),
        getRingkasan(),
    ]);
    const baru: TransaksiMasuk = {
        ...input,
        noTlp: input.noTlp || "-",
        id: Date.now(),
        idTrx: buatIdTrx(),
        tanggal: todayISO(),
        status: "Sukses",
        jenisPembayaran: "QRIS",
    };
    writeStorage(KEY_MASUK, [baru, ...daftar]);
    writeStorage(KEY_PEMASUKAN, ringkasan.totalPemasukan + input.nominal);
    return baru;
};

export interface PencairanInput {
    nominal: number;
    jenisPencairan: JenisPencairan;
    noRekening: string;
    namaAdmin: string;
}

export const buatPencairan = async (
    input: PencairanInput,
): Promise<TransaksiKeluar> => {
    const [daftar, ringkasan] = await Promise.all([
        getTransaksiKeluar(),
        getRingkasan(),
    ]);

    if (input.nominal > ringkasan.totalPemasukan) {
        throw new Error("Saldo pemasukan tidak mencukupi!");
    }

    const baru: TransaksiKeluar = {
        ...input,
        id: Date.now(),
        idTrx: buatIdTrx(),
        tanggal: todayISO(),
        status: "Sukses",
    };

    writeStorage(KEY_KELUAR, [baru, ...daftar]);
    writeStorage(KEY_PEMASUKAN, ringkasan.totalPemasukan - input.nominal);
    writeStorage(KEY_PENGELUARAN, ringkasan.totalPengeluaran + input.nominal);
    return baru;
};
