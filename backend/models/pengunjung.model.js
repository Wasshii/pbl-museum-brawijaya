const db = require("../config/db");

const Pengunjung = {
    getAll: async () => {
        const [rows] = await db.query(
            "SELECT * FROM pengunjung ORDER BY tanggal_dibuat DESC",
        );
        return rows;
    },
    create: async (data) => {
        const [result] = await db.query(
            "INSERT INTO pengunjung (nama, no_telp, email, alamat, status, avatar) VALUES (?, ?, ?, ?, ?, ?)",
            [
                data.nama,
                data.no_telp,
                data.email,
                data.alamat,
                data.status || "Online",
                data.avatar || "",
            ],
        );
        return result.insertId;
    },
    update: async (id, data) => {
        await db.query(
            "UPDATE pengunjung SET nama = ?, no_telp = ?, email = ?, alamat = ?, status = ? WHERE id = ?",
            [data.nama, data.no_telp, data.email, data.alamat, data.status, id],
        );
    },
    delete: async (id) => {
        await db.query("DELETE FROM pengunjung WHERE id = ?", [id]);
    },
};

module.exports = Pengunjung;
