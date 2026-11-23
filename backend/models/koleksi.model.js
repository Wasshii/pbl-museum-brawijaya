const db = require("../config/db");

// Kolom: nama, jenis (kategori), tahun, deskripsi (= sejarah / "Cerita" di aplikasi),
// identitas ("Identitas" di aplikasi), gambar.
const Koleksi = {
    getAll: async () => {
        const [rows] = await db.query(
            "SELECT * FROM koleksi ORDER BY tanggal_update DESC",
        );
        return rows;
    },
    // Dipakai untuk mengetahui gambar lama saat ubah/hapus
    getById: async (id) => {
        const [rows] = await db.query("SELECT * FROM koleksi WHERE id = ?", [
            id,
        ]);
        return rows[0] || null;
    },
    create: async (data) => {
        const [result] = await db.query(
            "INSERT INTO koleksi (nama, jenis, tahun, deskripsi, identitas, gambar) VALUES (?, ?, ?, ?, ?, ?)",
            [
                data.nama,
                data.jenis,
                data.tahun ?? null,
                data.deskripsi,
                data.identitas,
                data.gambar,
            ],
        );
        return result.insertId;
    },
    update: async (id, data) => {
        await db.query(
            "UPDATE koleksi SET nama = ?, jenis = ?, tahun = ?, deskripsi = ?, identitas = ?, gambar = ? WHERE id = ?",
            [
                data.nama,
                data.jenis,
                data.tahun ?? null,
                data.deskripsi,
                data.identitas,
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
