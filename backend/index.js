require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const User = require("./models/user.model"); // Import model User

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Inisialisasi Admin Otomatis
User.initAdmin();

// Routes
app.use("/api/auth", authRoutes);

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});
