const bcrypt = require("bcrypt");
const crypto = require("crypto"); // TAMBAHAN: Import modul crypto bawaan Node.js
const User = require("../models/user.model");
const { createToken } = require("../lib/jwt");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);

        // REVISI: Pesan error disamakan agar tidak membocorkan apakah email terdaftar atau tidak
        if (!user)
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Email atau kata sandi salah",
                });

        const isValid = await bcrypt.compare(password, user.password);

        // REVISI: Pesan error disamakan
        if (!isValid)
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Email atau kata sandi salah",
                });

        const token = createToken(user);
        res.json({
            success: true,
            message: "Login berhasil",
            token,
            user: { email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server",
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findByEmail(email);
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "Email tidak terdaftar" });

        // REVISI: Menggunakan crypto.randomInt untuk angka acak yang lebih aman
        const code = crypto.randomInt(100000, 999999).toString();

        await User.saveResetCode(email, code);

        // Simulasi pengiriman email (di proyek nyata gunakan Nodemailer)
        console.log(
            `[SIMULASI EMAIL] Kode reset untuk ${email} adalah: ${code}`,
        );

        res.json({
            success: true,
            message: "Kode reset telah dikirim (Cek terminal backend)",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server",
        });
    }
};

exports.verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findByEmailAndResetCode(email, code);

        if (!user)
            return res.status(400).json({
                success: false,
                message: "Kode tidak valid atau kedaluwarsa",
            });
        res.json({ success: true, message: "Kode valid" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server",
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findByEmailAndResetCode(email, code);

        if (!user)
            return res.status(400).json({
                success: false,
                message: "Kode tidak valid atau kedaluwarsa",
            });

        const hashed = await bcrypt.hash(newPassword, 10);
        await User.updatePassword(email, hashed);

        res.json({ success: true, message: "Kata sandi berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server",
        });
    }
};
