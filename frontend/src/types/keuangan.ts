export interface TransaksiData {
    id: number;
    tanggal: string;
    deskripsi: string;
    tipe: "pemasukan" | "pengeluaran";
    jumlah: number;
    status: string;
}

export interface TransaksiInput {
    tipe: "pemasukan" | "pengeluaran";
    jumlah: number;
    deskripsi: string;
}
