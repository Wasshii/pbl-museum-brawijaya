const express = require("express");
const keuanganController = require("../controllers/keuangan.controller");
// 1. Tambahkan import middleware di sini
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

// 2. Sisipkan authenticate & requireAdmin di setiap router
router.get(
    "/",
    authenticate,
    requireAdmin,
    keuanganController.getSemuaKeuangan,
);
router.post("/", authenticate, requireAdmin, keuanganController.tambahKeuangan);

module.exports = router;
