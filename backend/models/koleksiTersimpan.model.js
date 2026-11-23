const db = require("../config/db");

// Benda sejarah yang disimpan (ikon bookmark) oleh pengunjung di aplikasi mobile.
const KoleksiTersimpan = {
    // Daftar id koleksi yang disimpan pengunjung
    ids: async (pengunjungId) => {
        const [rows] = await db.query(
            "SELECT koleksi_id FROM koleksi_tersimpan WHERE pengunjung_id = ?",
            [pengunjungId],
        );
        return rows.map((r) => String(r.koleksi_id));
    },
    // Simpan bila belum, hapus bila sudah. Mengembalikan true jika sekarang TERSIMPAN.
    toggle: async (pengunjungId, koleksiId) => {
        const [hapus] = await db.query(
            "DELETE FROM koleksi_tersimpan WHERE pengunjung_id = ? AND koleksi_id = ?",
            [pengunjungId, koleksiId],
        );
        if (hapus.affectedRows > 0) return false;
        await db.query(
            "INSERT IGNORE INTO koleksi_tersimpan (pengunjung_id, koleksi_id) VALUES (?, ?)",
            [pengunjungId, koleksiId],
        );
        return true;
    },
    // Akun dihapus -> koleksi tersimpannya ikut dihapus
    hapusPengunjung: async (pengunjungId) => {
        await db.query("DELETE FROM koleksi_tersimpan WHERE pengunjung_id = ?", [
            pengunjungId,
        ]);
    },
    // Admin menghapus benda -> hilang dari daftar simpanan semua pengunjung
    hapusKoleksi: async (koleksiId) => {
        await db.query("DELETE FROM koleksi_tersimpan WHERE koleksi_id = ?", [
            koleksiId,
        ]);
    },
};

module.exports = KoleksiTersimpan;
