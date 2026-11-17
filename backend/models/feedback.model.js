const db = require("../config/db");

const Feedback = {
    // ---------- admin (web) ----------
    getAll: async () => {
        const [rows] = await db.query(
            "SELECT * FROM feedback ORDER BY tanggal DESC, id DESC",
        );
        return rows;
    },

    // Admin membalas ulasan -> status otomatis "Telah Di Balas"
    reply: async (id, balasan) => {
        await db.query(
            "UPDATE feedback SET balasan_admin = ?, status = 'Telah Di Balas' WHERE id = ?",
            [balasan, id],
        );
    },

    // ---------- aplikasi mobile ----------
    // Sudah mengirim ulasan hari ini? (hari kalender, jam database)
    sudahKirimHariIni: async (pengunjungId) => {
        const [rows] = await db.query(
            "SELECT id FROM feedback WHERE pengunjung_id = ? AND DATE(tanggal) = CURDATE() LIMIT 1",
            [pengunjungId],
        );
        return rows.length > 0;
    },

    create: async ({ pengunjungId, nama, rating, ulasan, foto }) => {
        const [result] = await db.query(
            `INSERT INTO feedback (pengunjung_id, nama, ulasan, rating, foto, status)
             VALUES (?, ?, ?, ?, ?, 'Belum Di Balas')`,
            [pengunjungId, nama, ulasan, rating, foto],
        );
        return result.insertId;
    },

    listByPengunjung: async (pengunjungId) => {
        const [rows] = await db.query(
            "SELECT * FROM feedback WHERE pengunjung_id = ? ORDER BY tanggal DESC, id DESC",
            [pengunjungId],
        );
        return rows;
    },

    // Hanya ulasan milik akun ini
    findOwn: async (id, pengunjungId) => {
        const [rows] = await db.query(
            "SELECT * FROM feedback WHERE id = ? AND pengunjung_id = ?",
            [id, pengunjungId],
        );
        return rows[0] || null;
    },
};

module.exports = Feedback;
