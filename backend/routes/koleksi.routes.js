const express = require("express");
const koleksiController = require("../controllers/koleksi.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

const validate = require("../middleware/validate.middleware");
const { koleksiSchema } = require("../schemas/koleksi.schema");

// --- BARU: middleware upload gambar (multer) ---
const { uploadGambar } = require("../middleware/upload.middleware");

const router = express.Router();

// GET tidak perlu validasi karena hanya mengambil data
router.get("/", authenticate, requireAdmin, koleksiController.getSemuaKoleksi);

// POST dan PUT sekarang menerima multipart/form-data (ada file gambar).
// Urutan penting: cek login dulu -> baca file (multer) -> validasi field teks.
router.post(
    "/",
    authenticate,
    requireAdmin,
    uploadGambar,
    validate(koleksiSchema),
    koleksiController.tambahKoleksi,
);
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    uploadGambar,
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
