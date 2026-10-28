const express = require("express");
const pengunjungController = require("../controllers/pengunjung.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

// --- TAMBAHKAN 2 BARIS INI ---
const validate = require("../middleware/validate.middleware");
const { pengunjungSchema } = require("../schemas/pengunjung.schema");

const router = express.Router();

// GET dan DELETE tidak perlu validasi body
router.get(
    "/",
    authenticate,
    requireAdmin,
    pengunjungController.getSemuaPengunjung,
);
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    pengunjungController.hapusPengunjung,
);

// --- PASANG VALIDATE DI ROUTE POST DAN PUT ---
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(pengunjungSchema),
    pengunjungController.tambahPengunjung,
);
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(pengunjungSchema),
    pengunjungController.ubahPengunjung,
);

module.exports = router;
