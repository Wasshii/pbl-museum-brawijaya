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

    // ---------- Menautkan email / nomor ke akun yang sudah ada ----------
    // Kunci = "link:<idAkun>:<kontak>". Kode LAMA (yang baru saja digantikan "Kirim ulang") disimpan
    // di baris "lama:<kunci>" supaya bisa dikenali dan dijawab "kedaluwarsa", bukan "tidak valid".
    simpanKodeTautan: async (kunci, kode) => {
        const [rows] = await db.query(
            "SELECT kode FROM verifikasi_kontak WHERE kontak = ?",
            [kunci],
        );
        if (rows[0]) {
            await db.query(
                `INSERT INTO verifikasi_kontak (kontak, kode, percobaan, kedaluwarsa)
                 VALUES (?, ?, 0, DATE_ADD(NOW(), INTERVAL 1 DAY))
                 ON DUPLICATE KEY UPDATE kode = ?, percobaan = 0,
                     kedaluwarsa = DATE_ADD(NOW(), INTERVAL 1 DAY)`,
                ["lama:" + kunci, rows[0].kode, rows[0].kode],
            );
        }
        await Verifikasi.simpanKode(kunci, kode);
    },

    // "ok" | "tidak_valid" | "kedaluwarsa"
    cekKodeTautan: async (kunci, kode) => {
        const [rows] = await db.query(
            `SELECT kode, percobaan, kedaluwarsa > NOW() AS berlaku
             FROM verifikasi_kontak WHERE kontak = ?`,
            [kunci],
        );
        const row = rows[0];
        if (!row) return "tidak_valid"; // belum pernah minta kode

        const hangus = !row.berlaku || row.percobaan >= MAKS_PERCOBAAN;
        if (row.kode === kode) return hangus ? "kedaluwarsa" : "ok";

        // Salah: apakah ini kode lama yang sudah digantikan kode baru?
        const [lama] = await db.query(
            "SELECT kode FROM verifikasi_kontak WHERE kontak = ?",
            ["lama:" + kunci],
        );
        if (lama[0] && lama[0].kode === kode) return "kedaluwarsa";
        if (hangus) return "kedaluwarsa";

        await db.query(
            "UPDATE verifikasi_kontak SET percobaan = percobaan + 1 WHERE kontak = ?",
            [kunci],
        );
        return row.percobaan + 1 >= MAKS_PERCOBAAN
            ? "kedaluwarsa" // salah terlalu sering -> kode hangus
            : "tidak_valid";
    },

    hapusTautan: async (kunci) => {
        await db.query("DELETE FROM verifikasi_kontak WHERE kontak IN (?, ?)", [
            kunci,
            "lama:" + kunci,
        ]);
    },

    hapus: async (kontak) => {
        await db.query("DELETE FROM verifikasi_kontak WHERE kontak = ?", [kontak]);
    },
};

module.exports = Verifikasi;
