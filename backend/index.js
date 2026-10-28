require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const koleksiRoutes = require("./routes/koleksi.routes"); // [BARU] Import rute koleksi
const User = require("./models/user.model");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

User.initAdmin();

app.use("/api/auth", authRoutes);
app.use("/api/koleksi", koleksiRoutes); // [BARU] Daftarkan rute koleksi ke Express

app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});
