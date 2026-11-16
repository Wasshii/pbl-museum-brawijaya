const crypto = require("crypto");

// Kode akses tiket: 10 karakter, pasti ada huruf besar, huruf kecil, dan angka
// (huruf/angka yang mirip seperti O/0 dan l/1 sengaja tidak dipakai).
const BESAR = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const KECIL = "abcdefghijkmnopqrstuvwxyz";
const ANGKA = "23456789";
const SEMUA = BESAR + KECIL + ANGKA;

const ambil = (set) => set[crypto.randomInt(0, set.length)];

const buatKodeAkses = () => {
    const huruf = [ambil(BESAR), ambil(KECIL), ambil(ANGKA)];
    while (huruf.length < 10) huruf.push(ambil(SEMUA));
    // Acak urutan supaya 3 karakter pertama tidak selalu besar-kecil-angka
    for (let i = huruf.length - 1; i > 0; i--) {
        const j = crypto.randomInt(0, i + 1);
        [huruf[i], huruf[j]] = [huruf[j], huruf[i]];
    }
    return huruf.join("");
};

module.exports = { buatKodeAkses };
