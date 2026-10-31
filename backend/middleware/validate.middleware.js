const fs = require("fs"); // <-- Tambahan sesuai instruksi

module.exports = (schema) => (req, res, next) => {
    const hasil = schema.safeParse(req.body);
    if (!hasil.success) {
        // --- Tambahan sesuai instruksi ---
        if (req.file) fs.unlink(req.file.path, () => {});

        const errors = hasil.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        // Mengirimkan pesan error pertama agar langsung terbaca oleh frontend
        return res
            .status(400)
            .json({ success: false, message: errors[0].message, errors });
    }
    req.body = hasil.data; // Mengganti req.body dengan data yang sudah bersih (ter-trim)
    next();
};
