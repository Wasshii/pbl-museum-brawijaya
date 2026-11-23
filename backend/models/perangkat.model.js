const db = require("../config/db");

const Perangkat = {
    // Satu token = satu HP. Bila HP dipakai akun lain, token berpindah ke akun itu.
    simpan: async (pengunjungId, token, platform) => {
        await db.query(
            `INSERT INTO perangkat_token (pengunjung_id, token, platform) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE pengunjung_id = ?, platform = ?`,
            [pengunjungId, token, platform, pengunjungId, platform],
        );
    },

    // Dipanggil saat Log Out: HP ini berhenti menerima notifikasi akun tersebut
    hapusToken: async (token, pengunjungId) => {
        await db.query("DELETE FROM perangkat_token WHERE token = ? AND pengunjung_id = ?", [token, pengunjungId]);
    },

    daftarToken: async (pengunjungId) => {
        const [rows] = await db.query("SELECT token FROM perangkat_token WHERE pengunjung_id = ?", [pengunjungId]);
        return rows.map((r) => r.token);
    },

    hapusBanyak: async (tokens) => {
        if (tokens.length === 0) return;
        await db.query("DELETE FROM perangkat_token WHERE token IN (?)", [tokens]);
    },

    hapusSemua: async (pengunjungId) => {
        await db.query("DELETE FROM perangkat_token WHERE pengunjung_id = ?", [pengunjungId]);
    },
};

module.exports = Perangkat;
