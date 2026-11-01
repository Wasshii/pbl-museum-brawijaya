import { z } from "zod";
import { parseNominal } from "@/lib/format";

// Pilihan dropdown. Ubah di sini kalau pilihannya perlu diganti.
export const JENIS_TIKET = ["Mandiri", "Guide"] as const;
export const JENIS_PENCAIRAN = ["Bank", "E-Wallet"] as const;

// Dibuat sebagai fungsi karena batas nominal bergantung pada saldo saat ini
// dan sisa batas pencairan bulan ini
export const pencairanSchema = (saldo: number, sisaBatas: number) =>
    z.object({
        nominal: z
            .string()
            .min(1, "Nominal wajib diisi")
            .refine((v) => parseNominal(v) > 0, "Nominal harus lebih dari 0")
            .refine((v) => parseNominal(v) <= saldo, "Saldo tidak mencukupi")
            .refine(
                (v) => parseNominal(v) <= sisaBatas,
                "Melebihi sisa batas pencairan bulan ini",
            ),
        jenisPencairan: z.enum(JENIS_PENCAIRAN),
        noRekening: z
            .string()
            .refine(
                (v) => /^\d{8,16}$/.test(v.replace(/\D/g, "")),
                "Nomor rekening harus 8-16 digit angka",
            ),
    });

// Nominal tidak ada di sini: dihitung otomatis dari jumlah dan jenis tiket
export const isiSaldoSchema = z.object({
    nama: z.string().trim().min(3, "Nama minimal 3 karakter"),
    tiket: z
        .string()
        .refine(
            (v) => /^\d+$/.test(v) && parseInt(v, 10) >= 1,
            "Jumlah tiket minimal 1",
        ),
    jenis: z.enum(JENIS_TIKET),
    noTlp: z
        .string()
        .refine(
            (v) => /^08\d{8,11}$/.test(v.replace(/\D/g, "")),
            "Nomor telepon wajib diisi (diawali 08, 10-13 digit)",
        ),
});
