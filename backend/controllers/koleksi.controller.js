const Koleksi = require("../models/koleksi.model");

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
    try {
        const insertId = await Koleksi.create(req.body);
        res.status(201).json({
            success: true,
            message: "Data koleksi berhasil ditambahkan",
            id: insertId,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal menambah data, pastikan token unik!",
        });
    }
};

exports.ubahKoleksi = async (req, res) => {
    try {
        await Koleksi.update(req.params.id, req.body);
        res.json({ success: true, message: "Data berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui data",
        });
    }
};

exports.hapusKoleksi = async (req, res) => {
    try {
        await Koleksi.delete(req.params.id);
        res.json({ success: true, message: "Data berhasil dihapus" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal menghapus data",
        });
    }
};
