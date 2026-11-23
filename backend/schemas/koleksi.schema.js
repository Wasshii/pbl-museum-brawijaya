const { z } = require("zod");

// Kategori benda (sama dengan tombol kategori di aplikasi mobile)
const KATEGORI = [
    "Mata Uang",
    "Senjata",
    "Kendaraan",
    "Seragam",
    "Peta",
    "Alat Musik",
    "Patung",
    "Peristiwa",
];

// Form dikirim multipart, jadi semua nilai berupa teks: "" dianggap tidak diisi
const kosongKeUndefined = (v) => (v === "" || v === null ? undefined : v);

exports.KATEGORI = KATEGORI;
exports.koleksiSchema = z.object({
    nama: z.string().trim().min(1, "Nama wajib diisi"),
    jenis: z.enum(KATEGORI, { message: "Pilih kategori benda" }),
    tahun: z.preprocess(
        kosongKeUndefined,
        z.coerce
            .number()
            .int("Tahun harus berupa angka")
            .min(1, "Tahun tidak valid")
            .max(2100, "Tahun tidak valid")
            .optional(),
    ),
    deskripsi: z.string().trim().min(1, "Sejarah wajib diisi"),
    identitas: z.string().trim().min(1, "Identitas wajib diisi"),
    gambar: z.string().optional(),
});
