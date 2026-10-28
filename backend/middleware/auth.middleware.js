const { verifyToken } = require("../lib/jwt");

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

module.exports = { authenticate, requireAdmin };
