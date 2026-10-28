const db = require("../config/db");

const Koleksi = {
    getAll: async () => {
        const [rows] = await db.query(
            "SELECT * FROM koleksi ORDER BY tanggal_update DESC",
        );
        return rows;
    },
    create: async (data) => {
        const [result] = await db.query(
            "INSERT INTO koleksi (nama, jenis, token, deskripsi, gambar) VALUES (?, ?, ?, ?, ?)",
            [data.nama, data.jenis, data.token, data.deskripsi, data.gambar],
        );
        return result.insertId;
    },
    update: async (id, data) => {
        await db.query(
            "UPDATE koleksi SET nama = ?, jenis = ?, token = ?, deskripsi = ?, gambar = ? WHERE id = ?",
            [
                data.nama,
                data.jenis,
                data.token,
                data.deskripsi,
                data.gambar,
                id,
            ],
        );
    },
    delete: async (id) => {
        await db.query("DELETE FROM koleksi WHERE id = ?", [id]);
    },
};

module.exports = Koleksi;
