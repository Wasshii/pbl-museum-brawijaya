const { z } = require("zod");
exports.koleksiSchema = z.object({
    nama: z.string().trim().min(1, "Nama wajib diisi"),
    jenis: z.string().trim().min(1, "Jenis wajib diisi"),
    token: z.string().trim().min(1, "Token wajib diisi"),
    deskripsi: z.string().trim().min(1, "Deskripsi wajib diisi"),
    gambar: z.string().optional(),
});
