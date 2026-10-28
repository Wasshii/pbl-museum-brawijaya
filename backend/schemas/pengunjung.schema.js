const { z } = require("zod");
exports.pengunjungSchema = z.object({
    name: z.string().trim().min(1, "Nama wajib diisi"),
    phone: z.string().trim().min(1, "No telepon wajib diisi"),
    email: z.string().trim().email("Format email salah"),
    address: z.string().trim().min(1, "Alamat wajib diisi"),
    status: z.enum(["Online", "Offline"]).optional(),
});
