const express = require("express");
const keuanganController = require("../controllers/keuangan.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

// --- TAMBAHKAN 2 BARIS INI ---
const validate = require("../middleware/validate.middleware");
const { keuanganSchema } = require("../schemas/keuangan.schema");

const router = express.Router();

router.get(
    "/",
    authenticate,
    requireAdmin,
    keuanganController.getSemuaKeuangan,
);

// --- PASANG VALIDATE DI ROUTE POST ---
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(keuanganSchema),
    keuanganController.tambahKeuangan,
);

module.exports = router;
