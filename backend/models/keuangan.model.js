const db = require("../config/db");

const Keuangan = {
    getAll: async () => {
        // Mengambil semua transaksi diurutkan dari yang terbaru
        const [rows] = await db.query(
            "SELECT * FROM keuangan ORDER BY tanggal DESC",
        );
        return rows;
    },
    create: async (data) => {
        const [result] = await db.query(
            "INSERT INTO keuangan (jenis, nominal, keterangan) VALUES (?, ?, ?)",
            [data.jenis, data.nominal, data.keterangan],
        );
        return result.insertId;
    },
};

module.exports = Keuangan;
