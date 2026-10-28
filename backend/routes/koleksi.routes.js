const express = require("express");
const koleksiController = require("../controllers/koleksi.controller");
const router = express.Router();
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

// --- TAMBAHKAN authenticate & requireAdmin DI SETIAP ROUTER ---
router.get("/", authenticate, requireAdmin, koleksiController.getSemuaKoleksi);
router.post("/", authenticate, requireAdmin, koleksiController.tambahKoleksi);
router.put("/:id", authenticate, requireAdmin, koleksiController.ubahKoleksi);
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    koleksiController.hapusKoleksi,
);

module.exports = router;
