const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

// Foto ulasan disimpan di backend/uploads/feedback dan diakses lewat /uploads/feedback/<nama-file>
// (folder /uploads sudah disajikan oleh index.js)
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "feedback");
const PUBLIC_PREFIX = "/uploads/feedback/";
const MAX_FOTO_MB = 5;
const MAX_FOTO = 3; // jumlah foto per ulasan

const EXT_BY_MIME = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        // Nama dibuat sendiri (bukan dari nama file asli) agar aman dan tidak bentrok
        const unik = crypto.randomBytes(6).toString("hex");
        cb(null, `feedback-${Date.now()}-${unik}${EXT_BY_MIME[file.mimetype]}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: MAX_FOTO_MB * 1024 * 1024, files: MAX_FOTO },
    fileFilter: (req, file, cb) => {
        if (!EXT_BY_MIME[file.mimetype]) {
            const err = new Error("Hanya menerima foto JPG, PNG, atau WEBP.");
            err.code = "INVALID_FILE_TYPE";
            return cb(err);
        }
        cb(null, true);
    },
}).array("foto", MAX_FOTO); // nama field di form aplikasi mobile (boleh diulang sampai 3 kali)

// Dipasang SETELAH authenticate dan SEBELUM handler (body multipart baru terbaca setelah ini).
const uploadFoto = (req, res, next) => {
    upload(req, res, (err) => {
        if (!err) return next();

        if (err instanceof multer.MulterError) {
            const message =
                err.code === "LIMIT_FILE_SIZE"
                    ? `Ukuran foto maksimal ${MAX_FOTO_MB} MB.`
                    : err.code === "LIMIT_UNEXPECTED_FILE" || err.code === "LIMIT_FILE_COUNT"
                      ? `Maksimal ${MAX_FOTO} foto.`
                      : err.message;
            return res
                .status(400)
                .json({ success: false, code: "invalid_photo", message });
        }
        if (err.code === "INVALID_FILE_TYPE") {
            return res
                .status(400)
                .json({ success: false, code: "invalid_photo", message: err.message });
        }
        return res.status(500).json({
            success: false,
            code: "server_error",
            message: "Gagal mengunggah foto.",
        });
    });
};

// Kolom `foto` di database berisi array JSON, mis. ["/uploads/feedback/a.jpg","/uploads/feedback/b.jpg"].
// Nilai lama berupa satu path biasa juga tetap terbaca.
const parseFoto = (raw) => {
    if (!raw || typeof raw !== "string") return [];
    if (raw.startsWith("[")) {
        try {
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
        } catch {
            return [];
        }
    }
    return [raw];
};

// Hapus file lokal dari disk (path lain diabaikan). Menerima satu path atau daftar path.
const hapusFileFoto = (foto) => {
    const daftar = Array.isArray(foto) ? foto : [foto];
    for (const f of daftar) {
        if (typeof f !== "string" || !f.startsWith(PUBLIC_PREFIX)) continue;
        const namaFile = path.basename(f); // basename mencegah path traversal
        fs.unlink(path.join(UPLOAD_DIR, namaFile), () => {});
    }
};

module.exports = { uploadFoto, hapusFileFoto, parseFoto, PUBLIC_PREFIX, MAX_FOTO };
