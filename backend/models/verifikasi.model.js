const db = require("../config/db");

const MAKS_PERCOBAAN = 5; // salah 5 kali -> kode hangus, minta kode baru

const Verifikasi = {
    // Simpan kode baru (menimpa kode lama untuk kontak yang sama), berlaku 10 menit
    simpanKode: async (kontak, kode) => {
        await db.query(
            `INSERT INTO verifikasi_kontak (kontak, kode, percobaan, kedaluwarsa)
             VALUES (?, ?, 0, DATE_ADD(NOW(), INTERVAL 10 MINUTE))
             ON DUPLICATE KEY UPDATE kode = ?, percobaan = 0,
                 kedaluwarsa = DATE_ADD(NOW(), INTERVAL 10 MINUTE)`,
            [kontak, kode, kode],
        );
    },

    // true jika kode benar, belum kedaluwarsa, dan belum kebanyakan salah
    cekKode: async (kontak, kode) => {
        const [rows] = await db.query(
            "SELECT kode, percobaan FROM verifikasi_kontak WHERE kontak = ? AND kedaluwarsa > NOW()",
            [kontak],
        );
        const row = rows[0];
        if (!row || row.percobaan >= MAKS_PERCOBAAN) return false;
        if (row.kode !== kode) {
            await db.query(
                "UPDATE verifikasi_kontak SET percobaan = percobaan + 1 WHERE kontak = ?",
                [kontak],
            );
            return false;
        }
        return true;
    },

    hapus: async (kontak) => {
        await db.query("DELETE FROM verifikasi_kontak WHERE kontak = ?", [kontak]);
    },
};

module.exports = Verifikasi;
