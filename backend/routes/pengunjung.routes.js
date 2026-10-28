const express = require("express");
const pengunjungController = require("../controllers/pengunjung.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const router = express.Router();

// --- TAMBAHKAN authenticate & requireAdmin DI SETIAP ROUTER ---
// Gunakan pengunjungController, bukan koleksiController
router.get(
    "/",
    authenticate,
    requireAdmin,
    pengunjungController.getSemuaPengunjung,
);
router.post(
    "/",
    authenticate,
    requireAdmin,
    pengunjungController.tambahPengunjung,
);
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    pengunjungController.ubahPengunjung,
);
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    pengunjungController.hapusPengunjung,
);

module.exports = router;
