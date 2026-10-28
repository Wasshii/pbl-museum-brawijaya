const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const router = express.Router();

// Tidak perlu validasi karena hanya mengambil data (GET)
router.get(
    "/",
    authenticate,
    requireAdmin,
    dashboardController.getDashboardStats,
);

module.exports = router;
