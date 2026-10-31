const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

// File disimpan di backend/uploads/koleksi dan diakses lewat /uploads/koleksi/<nama-file>
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "koleksi");
const PUBLIC_PREFIX = "/uploads/koleksi/";

// Samakan dengan MAX_IMAGE_MB di frontend (src/lib/validations/koleksi.ts)
const MAX_IMAGE_MB = 1;

const EXT_BY_MIME = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
};

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        // Nama dibuat sendiri (bukan dari nama file asli) agar aman dan tidak bentrok
        const unik = crypto.randomBytes(6).toString("hex");
        cb(null, `koleksi-${Date.now()}-${unik}${EXT_BY_MIME[file.mimetype]}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: MAX_IMAGE_MB * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => {
        if (!EXT_BY_MIME[file.mimetype]) {
            const err = new Error("Hanya menerima file JPG atau PNG.");
            err.code = "INVALID_FILE_TYPE";
            return cb(err);
        }
        cb(null, true);
    },
}).single("gambar"); // nama field di FormData frontend

// Dipasang SETELAH authenticate/requireAdmin dan SEBELUM validate(),
// karena body berbentuk multipart sehingga baru terbaca setelah multer jalan.
const uploadGambar = (req, res, next) => {
    upload(req, res, (err) => {
        if (!err) return next();

        if (err instanceof multer.MulterError) {
            const message =
                err.code === "LIMIT_FILE_SIZE"
                    ? `Ukuran gambar maksimal ${MAX_IMAGE_MB} MB.`
                    : err.message;
            return res.status(400).json({ success: false, message });
        }
        if (err.code === "INVALID_FILE_TYPE") {
            return res
                .status(400)
                .json({ success: false, message: err.message });
        }
        return res
            .status(500)
            .json({ success: false, message: "Gagal mengunggah gambar." });
    });
};

// Hapus file lokal dari disk. URL luar (mis. Unsplash) atau path lain diabaikan.
const hapusFileGambar = (gambar) => {
    if (typeof gambar !== "string" || !gambar.startsWith(PUBLIC_PREFIX)) return;
    const namaFile = path.basename(gambar); // basename mencegah path traversal
    fs.unlink(path.join(UPLOAD_DIR, namaFile), () => {});
};

module.exports = { uploadGambar, hapusFileGambar, PUBLIC_PREFIX };
