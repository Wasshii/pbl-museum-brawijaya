const { z } = require("zod");

// "" atau tidak diisi -> null (kolom di database boleh kosong)
const opsional = (inner) =>
    z.preprocess(
        (v) => (v == null || (typeof v === "string" && v.trim() === "") ? null : v),
        inner.nullable(),
    );

exports.pengunjungSchema = z
    .object({
        name: z.string().trim().min(3, "Nama minimal 3 karakter"),
        // 08xxxxxxxxxx (10-13 digit) atau format internasional +kodeNegara...
        phone: opsional(
            z
                .string()
                .trim()
                .regex(
                    /^(\+\d{8,15}|08\d{8,11})$/,
                    "Nomor telepon: 08xxxxxxxxxx (10-13 digit) atau +kodeNegara",
                ),
        ),
        email: opsional(
            z.string().trim().email("Format email salah").toLowerCase(),
        ),
        address: opsional(z.string().trim()),
    })
    .superRefine((d, ctx) => {
        if (!d.phone && !d.email) {
            ctx.addIssue({
                code: "custom",
                path: ["phone"],
                message: "Isi nomor telepon atau email (minimal salah satu)",
            });
        }
    });
