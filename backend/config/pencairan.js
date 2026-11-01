// Batas total pencairan per bulan kalender (simulasi).
// Dihitung dari semua pencairan berstatus Berhasil pada bulan berjalan,
// dan kembali ke nol setiap tanggal 1. Ubah angka di sini kalau batasnya berubah.
// Patokan besaran: batas transaksi bulanan uang elektronik Bank Indonesia (Rp 20 juta).
const BATAS_PENCAIRAN_PER_BULAN = 20000000;

module.exports = { BATAS_PENCAIRAN_PER_BULAN };
