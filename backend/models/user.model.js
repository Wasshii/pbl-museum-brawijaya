const db = require("../config/db");
const bcrypt = require("bcrypt"); // Tambahkan bcrypt untuk hashing

// Fungsi Inisialisasi Admin (Wajib Ada)
exports.initAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@tiket.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
            adminEmail,
        ]);

        if (rows.length === 0) {
            const hashed = await bcrypt.hash(adminPassword, 10);
            await db.query(
                "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
                [adminEmail, hashed, "admin"],
            );
            console.log(
                `[SYSTEM] Akun admin default (${adminEmail}) berhasil dibuat!`,
            );
        }
    } catch (error) {
        console.error("[SYSTEM] Gagal menginisialisasi admin:", error.message);
    }
};

exports.findByEmail = async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
    ]);
    return rows[0] || null;
};

exports.findByEmailAndResetCode = async (email, code) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ? AND reset_token = ? AND reset_expires > NOW()",
        [email, code],
    );
    return rows[0] || null;
};

exports.saveResetCode = (email, code) =>
    db.query(
        "UPDATE users SET reset_token = ?, reset_expires = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE email = ?",
        [code, email],
    );

exports.updatePassword = (email, hashed) =>
    db.query(
        "UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE email = ?",
        [hashed, email],
    );

exports.create = (email, hashed, role) =>
    db.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [
        email,
        hashed,
        role,
    ]);
