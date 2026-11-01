// Harga tiket (simulasi). Ubah angka di sini kalau harga berubah.
// Nominal tiap transaksi disimpan di tabel keuangan, jadi transaksi lama
// tidak ikut berubah ketika harga diganti.
const HARGA_TIKET = 10000; // per tiket (Mandiri maupun Guide)
const BIAYA_PEMANDU = 50000; // sekali per transaksi, hanya untuk jenis Guide

// 2 tiket Mandiri = 20.000 | 1 tiket Guide = 60.000 | 2 tiket Guide = 70.000
const hitungNominal = (jumlahTiket, jenisTiket) =>
    jumlahTiket * HARGA_TIKET + (jenisTiket === "Guide" ? BIAYA_PEMANDU : 0);

module.exports = { HARGA_TIKET, BIAYA_PEMANDU, hitungNominal };
