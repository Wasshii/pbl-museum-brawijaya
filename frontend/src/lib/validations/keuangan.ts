import { z } from "zod";
import { parseNominal } from "@/lib/format";
import { pesanRekening } from "@/lib/keuangan";
import type { DaftarPenyedia } from "@/types/keuangan";

// Pilihan dropdown. Ubah di sini kalau pilihannya perlu diganti.
export const JENIS_TIKET = ["Mandiri", "Guide"] as const;
export const JENIS_PENCAIRAN = ["Bank", "E-Wallet"] as const;

// Dibuat sebagai fungsi karena batas nominal bergantung pada saldo saat ini,
// sisa batas pencairan bulan ini, dan daftar bank / e-wallet dari backend
export const pencairanSchema = (
    saldo: number,
    sisaBatas: number,
    penyedia: DaftarPenyedia,
) =>
    z
        .object({
            nominal: z
                .string()
                .min(1, "Nominal wajib diisi")
                .refine(
                    (v) => parseNominal(v) > 0,
                    "Nominal harus lebih dari 0",
                )
                .refine(
                    (v) => parseNominal(v) <= saldo,
                    "Saldo tidak mencukupi",
                )
                .refine(
                    (v) => parseNominal(v) <= sisaBatas,
                    "Melebihi sisa batas pencairan bulan ini",
                ),
            jenisPencairan: z.enum(JENIS_PENCAIRAN),
            penyedia: z.string().min(1, "Pilih bank / e-wallet tujuan"),
            noRekening: z.string().min(1, "Nomor tujuan wajib diisi"),
        })
        .superRefine((v, ctx) => {
            const daftar =
                v.jenisPencairan === "Bank" ? penyedia.bank : penyedia.eWallet;
            const dipilih = daftar.find((p) => p.id === v.penyedia);
            if (!dipilih) {
                ctx.addIssue({
                    code: "custom",
                    path: ["penyedia"],
                    message: "Bank / e-wallet tidak valid",
                });
                return;
            }
            const pesan = pesanRekening(
                v.jenisPencairan,
                dipilih,
                v.noRekening.replace(/\D/g, ""),
            );
            if (pesan) {
                ctx.addIssue({
                    code: "custom",
                    path: ["noRekening"],
                    message: pesan,
                });
            }
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
