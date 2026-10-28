require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const koleksiRoutes = require("./routes/koleksi.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const keuanganRoutes = require("./routes/keuangan.routes");
const pengunjungRoutes = require("./routes/pengunjung.routes");
const feedbackRoutes = require("./routes/feedback.routes");

// (Baris 11 dihapus jika User sudah tidak dipakai di bawah)
// const User = require("./models/user.model");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// --- BARIS INI SUDAH DIHAPUS ---
// User.initAdmin();

app.use("/api/auth", authRoutes);
app.use("/api/koleksi", koleksiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/keuangan", keuanganRoutes);
app.use("/api/pengunjung", pengunjungRoutes);
app.use("/api/feedback", feedbackRoutes);

app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});
