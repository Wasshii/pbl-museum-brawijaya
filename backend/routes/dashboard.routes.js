const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
// 1. Tambahkan baris ini untuk memanggil middleware
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

// 2. Sisipkan authenticate & requireAdmin sebelum controller
router.get(
    "/",
    authenticate,
    requireAdmin,
    dashboardController.getDashboardStats,
);

module.exports = router;
