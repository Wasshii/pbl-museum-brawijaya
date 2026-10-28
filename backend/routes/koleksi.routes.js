const express = require("express");
const koleksiController = require("../controllers/koleksi.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

// --- TAMBAHKAN 2 BARIS INI ---
const validate = require("../middleware/validate.middleware");
const { koleksiSchema } = require("../schemas/koleksi.schema");

const router = express.Router();

// GET tidak perlu validasi karena hanya mengambil data
router.get("/", authenticate, requireAdmin, koleksiController.getSemuaKoleksi);

// --- PASANG VALIDATE DI ROUTE POST DAN PUT ---
router.post(
    "/",
    authenticate,
    requireAdmin,
    validate(koleksiSchema),
    koleksiController.tambahKoleksi,
);
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    validate(koleksiSchema),
    koleksiController.ubahKoleksi,
);

// DELETE tidak perlu validasi karena tidak mengirim body data
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    koleksiController.hapusKoleksi,
);

module.exports = router;
