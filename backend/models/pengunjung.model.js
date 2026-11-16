const db = require("../config/db");

const Pengunjung = {
    // detik_sejak_aktif dihitung oleh database (NOW() - terakhir_aktif),
    // jadi tidak terpengaruh perbedaan zona waktu server dan browser.
    // password_hash sengaja tidak ikut dipilih.
    getAll: async () => {
        const [rows] = await db.query(
            `SELECT id, nama, no_telp, email, alamat, status, avatar,
                    tanggal_dibuat, terakhir_aktif,
                    TIMESTAMPDIFF(SECOND, terakhir_aktif, NOW()) AS detik_sejak_aktif
             FROM pengunjung
             ORDER BY tanggal_dibuat DESC`,
        );
        return rows;
    },

    // Ditambah manual oleh admin (belum pernah memakai aplikasi -> Offline)
    create: async (data) => {
        const [result] = await db.query(
            "INSERT INTO pengunjung (nama, no_telp, email, alamat, status, avatar) VALUES (?, ?, ?, ?, 'Offline', ?)",
            [data.nama, data.no_telp, data.email, data.alamat, data.avatar || ""],
        );
        return result.insertId;
    },

    // Status Online / Offline TIDAK diubah di sini; itu urusan aplikasi mobile
    update: async (id, data) => {
        await db.query(
            "UPDATE pengunjung SET nama = ?, no_telp = ?, email = ?, alamat = ? WHERE id = ?",
            [data.nama, data.no_telp, data.email, data.alamat, id],
        );
    },

    delete: async (id) => {
        await db.query("DELETE FROM pengunjung WHERE id = ?", [id]);
    },

    // ---------- khusus aplikasi mobile ----------
    findByEmail: async (email) => {
        const [rows] = await db.query(
            "SELECT id FROM pengunjung WHERE LOWER(email) = ?",
            [email.toLowerCase()],
        );
        return rows[0] || null;
    },

    findByPhone: async (phone) => {
        const [rows] = await db.query(
            "SELECT id FROM pengunjung WHERE no_telp = ?",
            [phone],
        );
        return rows[0] || null;
    },

    findById: async (id) => {
        const [rows] = await db.query(
            "SELECT id, nama, email, no_telp FROM pengunjung WHERE id = ?",
            [id],
        );
        return rows[0] || null;
    },

    // Untuk login: ikut mengambil password_hash (JANGAN dikirim ke klien)
    findLogin: async (jenis, kontak) => {
        const sql =
            jenis === "phone"
                ? "SELECT id, nama, email, no_telp, password_hash FROM pengunjung WHERE no_telp = ?"
                : "SELECT id, nama, email, no_telp, password_hash FROM pengunjung WHERE LOWER(email) = ?";
        const [rows] = await db.query(sql, [kontak]);
        return rows[0] || null;
    },

    // Akun dari aplikasi: langsung Online
    createMobile: async ({ nama, email, noTelp, passwordHash }) => {
        const [result] = await db.query(
            `INSERT INTO pengunjung
                (nama, no_telp, email, alamat, password_hash, status, terakhir_aktif, avatar)
             VALUES (?, ?, ?, NULL, ?, 'Online', NOW(), '')`,
            [nama, noTelp, email, passwordHash],
        );
        return result.insertId;
    },

    // true jika akun masih ada
    tandaiAktif: async (id) => {
        const [result] = await db.query(
            "UPDATE pengunjung SET status = 'Online', terakhir_aktif = NOW() WHERE id = ?",
            [id],
        );
        return result.affectedRows > 0;
    },

    tandaiOffline: async (id) => {
        await db.query(
            "UPDATE pengunjung SET status = 'Offline', terakhir_aktif = NOW() WHERE id = ?",
            [id],
        );
    },
};

module.exports = Pengunjung;
