require("dotenv").config();
const path = require("path"); // <-- Tambahan sesuai instruksi
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const koleksiRoutes = require("./routes/koleksi.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const keuanganRoutes = require("./routes/keuangan.routes");
const pengunjungRoutes = require("./routes/pengunjung.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const mobileRoutes = require("./routes/mobile.routes");

// (Baris 11 dihapus jika User sudah tidak dipakai di bawah)
// const User = require("./models/user.model");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS_ORIGIN boleh berisi lebih dari satu alamat, dipisah koma. Contoh:
//   CORS_ORIGIN=http://localhost:3000,http://localhost:3001
const asalDiizinkan = (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
app.use(cors({ origin: asalDiizinkan.length > 1 ? asalDiizinkan : asalDiizinkan[0] }));
app.use(express.json());

// --- Tambahan sesuai instruksi ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- BARIS INI SUDAH DIHAPUS ---
// User.initAdmin();

app.use("/api/auth", authRoutes);
app.use("/api/koleksi", koleksiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/keuangan", keuanganRoutes);
app.use("/api/pengunjung", pengunjungRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/mobile", mobileRoutes); // aplikasi Flutter: daftar akun + status online

app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});
