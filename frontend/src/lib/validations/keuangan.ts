import { z } from "zod";
import { parseNominal } from "@/lib/format";

// Dibuat sebagai fungsi karena batas nominal bergantung pada saldo saat ini
export const pencairanSchema = (saldo: number) =>
    z.object({
        nominal: z
            .string()
            .min(1, "Nominal wajib diisi")
            .refine((v) => parseNominal(v) > 0, "Nominal harus lebih dari 0")
            .refine(
                (v) => parseNominal(v) <= saldo,
                "Saldo pemasukan tidak mencukupi",
            ),
        jenisPencairan: z.enum(["Bank", "E-Wallet"]),
        noRekening: z
            .string()
            .refine(
                (v) => /^\d{8,16}$/.test(v.replace(/\D/g, "")),
                "Nomor rekening harus 8-16 digit angka",
            ),
    });

export const isiSaldoSchema = z.object({
    nama: z.string().trim().min(3, "Nama minimal 3 karakter"),
    tiket: z
        .string()
        .refine(
            (v) => /^\d+$/.test(v) && parseInt(v, 10) >= 1,
            "Jumlah tiket minimal 1",
        ),
    jenis: z.enum(["Mandiri", "Guide"]),
    nominal: z
        .string()
        .refine((v) => parseNominal(v) > 0, "Nominal harus lebih dari 0"),
    noTlp: z
        .string()
        .refine(
            (v) => v === "" || /^08\d{8,11}$/.test(v.replace(/\D/g, "")),
            "Nomor telepon diawali 08 (10-13 digit)",
        ),
});
