const Koleksi = require("../models/koleksi.model");
const {
    hapusFileGambar,
    PUBLIC_PREFIX,
} = require("../middleware/upload.middleware");

// Dipakai jika koleksi dibuat tanpa gambar (sama dengan DEFAULT_KOLEKSI_IMAGE di frontend)
const DEFAULT_GAMBAR =
    "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80";

// Path yang disimpan di database, contoh: /uploads/koleksi/koleksi-1730000000000-ab12cd34ef56.jpg
const pathGambar = (file) => (file ? `${PUBLIC_PREFIX}${file.filename}` : null);

const isTokenKembar = (error) => error && error.code === "ER_DUP_ENTRY";

exports.getSemuaKoleksi = async (req, res) => {
    try {
        const data = await Koleksi.getAll();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data",
        });
    }
};

exports.tambahKoleksi = async (req, res) => {
    // Field "gambar" dari body sengaja diabaikan; yang dipakai hanya file hasil upload
    const gambar = pathGambar(req.file) || DEFAULT_GAMBAR;
    try {
        const insertId = await Koleksi.create({ ...req.body, gambar });
        res.status(201).json({
            success: true,
            message: "Data koleksi berhasil ditambahkan",
            id: insertId,
        });
    } catch (error) {
        hapusFileGambar(gambar); // jangan tinggalkan file yatim jika insert gagal
        if (isTokenKembar(error)) {
            return res.status(409).json({
                success: false,
                message: "Token sudah digunakan, gunakan token lain.",
            });
        }
        res.status(500).json({
            success: false,
            message: "Gagal menambah data, pastikan token unik!",
        });
    }
};

exports.ubahKoleksi = async (req, res) => {
    const gambarBaru = pathGambar(req.file);
    try {
        const lama = await Koleksi.getById(req.params.id);
        if (!lama) {
            hapusFileGambar(gambarBaru);
            return res.status(404).json({
                success: false,
                message: "Data koleksi tidak ditemukan",
            });
        }

        // Tidak upload gambar baru -> pertahankan gambar lama
        await Koleksi.update(req.params.id, {
            ...req.body,
            gambar: gambarBaru || lama.gambar,
        });

        if (gambarBaru) hapusFileGambar(lama.gambar); // buang file lama yang sudah tergantikan
        res.json({ success: true, message: "Data berhasil diperbarui" });
    } catch (error) {
        hapusFileGambar(gambarBaru);
        if (isTokenKembar(error)) {
            return res.status(409).json({
                success: false,
                message: "Token sudah digunakan, gunakan token lain.",
            });
        }
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui data",
        });
    }
};

exports.hapusKoleksi = async (req, res) => {
    try {
        const lama = await Koleksi.getById(req.params.id);
        await Koleksi.delete(req.params.id);
        if (lama) hapusFileGambar(lama.gambar);
        res.json({ success: true, message: "Data berhasil dihapus" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal menghapus data",
        });
    }
};
