const Pengunjung = require("../models/pengunjung.model");

// Avatar default sementara jika user belum punya foto
const DUMMY_AVATAR =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

exports.getSemuaPengunjung = async (req, res) => {
    try {
        const data = await Pengunjung.getAll();

        // Sesuaikan format data MySQL dengan tipe TypeScript di Frontend
        const formattedData = data.map((item) => ({
            id: item.id,
            name: item.nama,
            phone: item.no_telp,
            email: item.email,
            address: item.alamat,
            status: item.status,
            createdAt: item.tanggal_dibuat.toISOString().split("T")[0],
            avatar: item.avatar || DUMMY_AVATAR,
        }));

        res.json({ success: true, data: formattedData });
    } catch (error) {
        console.error("[USER ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data pengunjung",
        });
    }
};

exports.tambahPengunjung = async (req, res) => {
    try {
        const { name, phone, email, address, status } = req.body;
        const insertId = await Pengunjung.create({
            nama: name,
            no_telp: phone,
            email: email,
            alamat: address,
            status: status,
            avatar: DUMMY_AVATAR,
        });
        res.status(201).json({
            success: true,
            message: "Berhasil",
            id: insertId,
        });
    } catch (error) {
        console.error("[USER ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Gagal menambah data (Email mungkin sudah terdaftar)",
        });
    }
};

exports.ubahPengunjung = async (req, res) => {
    try {
        const { name, phone, email, address, status } = req.body;
        await Pengunjung.update(req.params.id, {
            nama: name,
            no_telp: phone,
            email: email,
            alamat: address,
            status: status,
        });
        res.json({ success: true, message: "Berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui data",
        });
    }
};

exports.hapusPengunjung = async (req, res) => {
    try {
        await Pengunjung.delete(req.params.id);
        res.json({ success: true, message: "Berhasil dihapus" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal menghapus data",
        });
    }
};
