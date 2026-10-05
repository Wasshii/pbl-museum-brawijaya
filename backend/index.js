const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const SECRET_KEY = "rahasia_industri_super_aman";

app.use(cors());
app.use(express.json());

let users = [];

const initAdmin = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    users.push({
        id: 1,
        email: "admin@tiket.com",
        password: hashedPassword,
        resetToken: null,
    });
};
initAdmin();

app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
        return res
            .status(404)
            .json({ success: false, message: "Email tidak terdaftar!" });
    }

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
    });
});

app.post("/api/auth/forgot-password", (req, res) => {
    const { email } = req.body;
    const user = users.find((u) => u.email === email);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Email tidak terdaftar di sistem!",
        });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetToken = resetCode;

    console.log(
        `\n[SYSTEM EMAIL] Link/Kode Reset untuk ${email}: ${resetCode}\n`,
    );

    res.status(200).json({
        success: true,
        message:
            "Instruksi reset kata sandi telah dikirim ke sistem (cek terminal backend).",
    });
});

app.post("/api/auth/reset-password", async (req, res) => {
    const { email, code, newPassword, confirmPassword } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user || user.resetToken !== code) {
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
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = null;

    res.status(200).json({
        success: true,
        message: "Kata sandi telah diperbarui",
    });
});

app.get("/", (req, res) => {
    res.send("Server Backend API Proyek UTS Berjalan dengan Aman!");
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
