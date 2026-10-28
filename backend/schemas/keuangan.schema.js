const { z } = require("zod");
exports.keuanganSchema = z.object({
    tipe: z.enum(["pemasukan", "pengeluaran"]),
    jumlah: z.number().positive("Jumlah harus lebih dari 0"),
    deskripsi: z.string().trim().min(1, "Deskripsi wajib diisi"),
});
