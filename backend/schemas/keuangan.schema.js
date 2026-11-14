const { z } = require("zod");
const { cariPenyedia, pesanRekening } = require("../config/penyedia");

const hanyaAngka = (v) => v.replace(/\D/g, "");

const deskripsi = z
    .string()
    .trim()
    .max(255, "Deskripsi terlalu panjang")
    .optional();

// Isi Saldo -> dicatat sebagai Pemasukan.
// Nominal TIDAK dikirim klien: backend menghitungnya dari harga tiket.
const pemasukanSchema = z.object({
    tipe: z.literal("pemasukan"),
    nama: z
        .string()
        .trim()
        .min(3, "Nama minimal 3 karakter")
        .max(100, "Nama maksimal 100 karakter"),
    noTelepon: z
        .string()
        .trim()
        .optional()
        .refine(
            (v) => !v || /^08\d{8,11}$/.test(hanyaAngka(v)),
            "Nomor telepon diawali 08 (10-13 digit)",
        )
        .transform((v) => (v ? hanyaAngka(v) : undefined)),
    jumlahTiket: z
        .number({ error: "Jumlah tiket harus berupa angka" })
        .int("Jumlah tiket harus bilangan bulat")
        .min(1, "Jumlah tiket minimal 1"),
    jenisTiket: z.enum(["Mandiri", "Guide"], {
        error: "Jenis tiket tidak valid",
    }),
    deskripsi,
});

// Pencairan -> dicatat sebagai Pengeluaran
const pengeluaranSchema = z.object({
    tipe: z.literal("pengeluaran"),
    nama: z
        .string()
        .trim()
        .min(1, "Nama wajib diisi")
        .max(100, "Nama maksimal 100 karakter"),
    jumlah: z
        .number({ error: "Jumlah harus berupa angka" })
        .int("Jumlah harus bilangan bulat")
        .positive("Jumlah harus lebih dari 0"),
    jenisPencairan: z.enum(["Bank", "E-Wallet"], {
        error: "Jenis pencairan tidak valid",
    }),
    penyedia: z.string().trim().min(1, "Pilih bank / e-wallet tujuan"),
    noRekening: z
        .string()
        .trim()
        .refine(
            (v) => /^[\d\s-]+$/.test(v) && /^\d{8,16}$/.test(hanyaAngka(v)),
            "Nomor rekening harus 8-16 digit angka",
        )
        .transform(hanyaAngka),
    deskripsi,
});

exports.keuanganSchema = z
    .discriminatedUnion("tipe", [pemasukanSchema, pengeluaranSchema], {
        error: "Tipe transaksi harus pemasukan atau pengeluaran",
    })
    // Aturan yang bergantung pada bank / e-wallet yang dipilih
    // (panjang rekening bank, awalan 08 untuk e-wallet).
    .superRefine((b, ctx) => {
        if (b.tipe !== "pengeluaran") return;

        const penyedia = cariPenyedia(b.jenisPencairan, b.penyedia);
        if (!penyedia) {
            ctx.addIssue({
                code: "custom",
                path: ["penyedia"],
                message: "Bank / e-wallet tujuan tidak valid",
            });
            return;
        }

        const pesan = pesanRekening(b.jenisPencairan, penyedia, b.noRekening);
        if (pesan) {
            ctx.addIssue({
                code: "custom",
                path: ["noRekening"],
                message: pesan,
            });
        }
    });
