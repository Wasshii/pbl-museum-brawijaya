const { z } = require("zod");

const jenisKontak = z.enum(["email", "phone"], {
    error: "Jenis kontak tidak valid",
});

// Email -> huruf kecil. Nomor telepon dipakai apa adanya (+kodeNegara + nomor).
const rapikan = (s) => (s.includes("@") ? s.toLowerCase() : s);

const cekFormatKontak = (d, ctx) => {
    if (d.contact_type === "email") {
        if (!z.string().email().safeParse(d.contact).success) {
            ctx.addIssue({
                code: "custom",
                path: ["contact"],
                message: "Format email tidak valid",
            });
        }
    } else if (!/^\+\d{8,15}$/.test(d.contact)) {
        ctx.addIssue({
            code: "custom",
            path: ["contact"],
            message: "Format nomor telepon tidak valid (contoh +6281234567890)",
        });
    }
};

const kontakString = z.string().trim().min(1, "Kontak wajib diisi");

// contact-exists dan send-code
exports.kontakSchema = z
    .object({ contact_type: jenisKontak, contact: kontakString })
    .superRefine(cekFormatKontak)
    .transform((d) => ({ ...d, contact: rapikan(d.contact) }));

exports.verifySchema = z.object({
    contact: kontakString.transform(rapikan),
    code: z.string().regex(/^\d{6}$/, "Kode harus 6 digit angka"),
});

// Aturan password sama dengan aplikasi mobile (AuthValidators.passwordError)
const password = z
    .string()
    .min(10, "Password minimal 10 karakter")
    .max(50, "Password maksimal 50 karakter")
    .regex(/\p{L}/u, "Password harus mengandung huruf")
    .regex(/\d/, "Password harus mengandung angka")
    .regex(/[^\p{L}\p{N}\s]/u, "Password harus mengandung simbol");

exports.registerSchema = z
    .object({
        name: z.string().trim().min(3, "Nama minimal 3 karakter").max(50, "Nama maksimal 50 karakter"),
        contact_type: jenisKontak,
        contact: kontakString,
        password,
        code: z.string().regex(/^\d{6}$/, "Kode harus 6 digit angka"),
    })
    .superRefine(cekFormatKontak)
    .transform((d) => ({ ...d, contact: rapikan(d.contact) }));

// Login: email / nomor + password (kode verifikasi dikirim setelah password benar)
exports.loginSchema = z
    .object({
        contact_type: jenisKontak,
        contact: kontakString,
        password: z.string().min(1, "Password wajib diisi").max(100),
    })
    .superRefine(cekFormatKontak)
    .transform((d) => ({ ...d, contact: rapikan(d.contact) }));

exports.loginVerifySchema = exports.verifySchema;

// Pesanan tiket. Harga TIDAK dikirim klien; backend menghitungnya dari tarif.
exports.orderSchema = z.object({
    type_key: z.enum(["booking_title", "guide_title"], {
        error: "Jenis tiket tidak valid",
    }),
    count: z
        .number({ error: "Jumlah tiket harus berupa angka" })
        .int("Jumlah tiket harus bilangan bulat")
        .min(1, "Jumlah tiket minimal 1")
        .max(100, "Jumlah tiket maksimal 100"),
    pay: z.enum(["cash", "qr"], { error: "Cara bayar tidak valid" }),
});

exports.accessSchema = z.object({
    code: z.string().trim().min(1, "Kode akses wajib diisi").max(20),
});
