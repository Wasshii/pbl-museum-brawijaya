// Daftar bank & e-wallet tujuan pencairan (simulasi), satu sumber untuk backend dan web.
// Dikirim ke frontend lewat GET /api/keuangan, jadi frontend tidak perlu menyalin daftar ini.
// Ubah di sini kalau ada bank/e-wallet yang ditambah atau panjang rekeningnya berubah.

const bank = (id, nama, digit, contoh) => ({
    id,
    nama,
    digitMin: digit, // rekening bank: panjang harus tepat
    digitMax: digit,
    contoh,
});

const ewallet = (id, nama) => ({
    id,
    nama,
    digitMin: 10, // nomor HP: 10-13 digit
    digitMax: 13,
    contoh: "081234567890",
});

const DAFTAR_PENYEDIA = {
    bank: [
        bank("BCA", "Bank Central Asia (BCA)", 10, "1234567890"),
        bank("BRI", "Bank Rakyat Indonesia (BRI)", 15, "123401000123501"),
        bank("BNI", "Bank Negara Indonesia (BNI)", 10, "0123456789"),
        bank("Mandiri", "Bank Mandiri", 13, "1230004567890"),
        bank("BSI", "Bank Syariah Indonesia (BSI)", 10, "7123456789"),
        bank("CIMB", "CIMB Niaga", 13, "7012345678000"),
        bank("Danamon", "Bank Danamon", 10, "0036123456"),
        bank("Permata", "Bank Permata", 10, "4001234567"),
    ],
    eWallet: [
        ewallet("GoPay", "GoPay"),
        ewallet("OVO", "OVO"),
        ewallet("DANA", "DANA"),
        ewallet("ShopeePay", "ShopeePay"),
        ewallet("LinkAja", "LinkAja"),
    ],
};

// jenis = "Bank" | "E-Wallet"; mengembalikan null kalau id tidak ada di daftar
const cariPenyedia = (jenis, id) => {
    const daftar =
        jenis === "Bank" ? DAFTAR_PENYEDIA.bank : DAFTAR_PENYEDIA.eWallet;
    return daftar.find((p) => p.id === id) ?? null;
};

// Mengembalikan pesan error, atau null kalau nomor sudah sesuai aturan penyedia
const pesanRekening = (jenis, penyedia, angka) => {
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

module.exports = { DAFTAR_PENYEDIA, cariPenyedia, pesanRekening };
