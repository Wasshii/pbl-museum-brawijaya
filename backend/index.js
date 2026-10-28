require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const koleksiRoutes = require("./routes/koleksi.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const keuanganRoutes = require("./routes/keuangan.routes"); // [BARU] Import rute keuangan
const User = require("./models/user.model");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

User.initAdmin();

app.use("/api/auth", authRoutes);
app.use("/api/koleksi", koleksiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/keuangan", keuanganRoutes); // [BARU] Daftarkan rute keuangan

app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});
