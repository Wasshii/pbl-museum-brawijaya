const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 5000;
const SECRET_KEY = "rahasia industri super aman";

app.use(cors());
app.use(express.json());

// Konfigurasi Koneksi Database MySQL
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", // Sesuaikan jika XAMPP/MySQL Anda menggunakan password
    database: "db_museum_brawijaya",
});

// Fungsi otomatis membuat akun Admin default jika tabel masih kosong
const initAdmin = async () => {
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
            "admin@tiket.com",
        ]);
        if (rows.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("admin123", salt);
            await db.query(
                "INSERT INTO users (email, password, role, reset_token) VALUES (?, ?, ?, NULL)",
                ["admin@tiket.com", hashedPassword, "admin"],
            );
            console.log(
                "[SYSTEM] Akun admin default berhasil dibuat di database!",
            );
        }
    } catch (error) {
        console.error("[SYSTEM] Gagal menginisialisasi admin:", error.message);
    }
};

initAdmin();

// Endpoint Login
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        if (rows.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "Email tidak terdaftar!" });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, message: "Kata sandi salah!" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
            expiresIn: "1d",
        });

        res.status(200).json({
            success: true,
            message: "Login berhasil!",
            token: token,
            role: user.role, // Dikirim agar validasi role di frontend berjalan lancar
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
        });
    }
});

// Endpoint Lupa Kata Sandi
app.post("/api/auth/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
            email,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Email tidak terdaftar di sistem!",
            });
        }

        const resetCode = Math.floor(
            100000 + Math.random() * 900000,
        ).toString();
        await db.query("UPDATE users SET reset_token = ? WHERE email = ?", [
            resetCode,
            email,
        ]);

        console.log(
            `\n[SYSTEM EMAIL] Link/Kode Reset untuk ${email}: ${resetCode}\n`,
        );

        res.status(200).json({
            success: true,
            message:
                "Instruksi reset kata sandi telah dikirim ke sistem (cek terminal backend).",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
        });
    }
});

// Endpoint Baru: Verifikasi Kode Reset Password
app.post("/api/auth/verify-reset-code", async (req, res) => {
    const { email, code } = req.body;
    try {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ? AND reset_token = ?",
            [email, code],
        );

        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Kode konfirmasi salah atau tidak valid!",
            });
        }

        res.status(200).json({
            success: true,
            message: "Kode konfirmasi valid!",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
        });
    }
});

// Endpoint Reset Kata Sandi
app.post("/api/auth/reset-password", async (req, res) => {
    const { email, code, newPassword, confirmPassword } = req.body;
    try {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ? AND reset_token = ?",
            [email, code],
        );
        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Kode konfirmasi tidak valid atau kadaluarsa!",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Kata sandi dan konfirmasi kata sandi tidak cocok!",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query(
            "UPDATE users SET password = ?, reset_token = NULL WHERE email = ?",
            [hashedPassword, email],
        );

        res.status(200).json({
            success: true,
            message: "Kata sandi telah diperbarui",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
        });
    }
});

app.get("/", (req, res) => {
    res.send("Server Backend API Proyek UTS Berjalan dengan Aman!");
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
