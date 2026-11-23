const { verifyToken } = require("../lib/jwt");
const Pengunjung = require("../models/pengunjung.model");

// Fungsi satpam untuk mengecek token
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Akses ditolak. Token tidak ditemukan.",
                });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        req.user = decoded; // Simpan data user (dari token) ke request
        next(); // Lanjut ke proses berikutnya
    } catch (error) {
        return res
            .status(401)
            .json({
                success: false,
                message: "Token tidak valid atau sudah kedaluwarsa.",
            });
    }
};

// Fungsi satpam khusus untuk memastikan yang login adalah admin
const requireAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res
            .status(403)
            .json({
                success: false,
                message: "Akses ditolak. Hanya admin yang diizinkan.",
            });
    }
    next();
};

// Fungsi satpam khusus untuk pengunjung aplikasi mobile.
// TAMBAHAN: akunnya harus MASIH ADA di database. Token pengunjung berlaku 30 hari, jadi tanpa
// pengecekan ini akun yang sudah dihapus masih bisa memakai token lamanya (mis. melihat pesanan).
const requireVisitor = async (req, res, next) => {
    if (req.user.role !== "visitor") {
        return res.status(403).json({
            success: false,
            message: "Akses ditolak. Hanya untuk pengunjung aplikasi.",
        });
    }
    try {
        if (!(await Pengunjung.findById(req.user.id))) {
            return res.status(404).json({
                success: false,
                code: "account_missing",
                message: "Akun tidak ditemukan",
            });
        }
        next();
    } catch (error) {
        console.error("[requireVisitor]", error);
        res.status(500).json({
            success: false,
            code: "server_error",
            message: "Terjadi kesalahan server",
        });
    }
};

module.exports = { authenticate, requireAdmin, requireVisitor };
