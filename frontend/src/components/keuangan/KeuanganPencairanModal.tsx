"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import FieldError from "@/components/ui/FieldError";
import { ADMIN_NAME } from "@/lib/constants";
import {
    formatInputNominal,
    formatRupiah,
    parseNominal,
    tanggalPanjang,
} from "@/lib/format";
import { toFieldErrors, type FieldErrors } from "@/lib/validations";
import { JENIS_PENCAIRAN, pencairanSchema } from "@/lib/validations/keuangan";
import type {
    BatasPencairan,
    JenisPencairan,
    PencairanInput,
} from "@/types/keuangan";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PencairanInput) => Promise<boolean>;
    submitting: boolean;
    saldo: number;
    batas: BatasPencairan;
}

interface FormState {
    nominal: string;
    noRekening: string;
    jenisPencairan: string;
}

const FORM_AWAL: FormState = {
    nominal: "",
    noRekening: "",
    jenisPencairan: JENIS_PENCAIRAN[0],
};

// Teks di dropdown (nilai yang dikirim tetap "Bank" / "E-Wallet")
const LABEL_JENIS: Record<string, string> = {
    Bank: "Transfer Bank",
    "E-Wallet": "E-Wallet (Dana / OVO / GoPay)",
};

const LABEL = "block text-sm font-bold text-gray-700 mb-1.5";
const INPUT =
    "w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black focus:border-black focus:ring-1 focus:ring-black";

function PencairanForm({
    onSubmit,
    submitting,
    saldo,
    batas,
}: Omit<Props, "isOpen" | "onClose">) {
    const [form, setForm] = useState<FormState>(FORM_AWAL);
    const [errors, setErrors] = useState<FieldErrors<FormState>>({});

    // maksimumPerBulan = 0 berarti data batas belum dimuat dari backend
    const belumDimuat = batas.maksimumPerBulan === 0;
    const tercapai = !belumDimuat && batas.sisa <= 0;
    const sekarang = new Date();
    const awalBulanDepan = new Date(
        sekarang.getFullYear(),
        sekarang.getMonth() + 1,
        1,
    );

    const ubah = (field: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Batas nominal = saldo saat ini dan sisa batas bulan ini (backend mengecek ulang)
        const hasil = pencairanSchema(saldo, batas.sisa).safeParse(form);
        if (!hasil.success) {
            setErrors(toFieldErrors<FormState>(hasil.error));
            return;
        }
        setErrors({});

        await onSubmit({
            tipe: "pengeluaran",
            nama: ADMIN_NAME,
            jumlah: parseNominal(form.nominal),
            jenisPencairan: form.jenisPencairan as JenisPencairan,
            noRekening: form.noRekening,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate>
            {tercapai && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-[13px] text-amber-800 font-medium">
                    Batas pencairan bulan ini (
                    {formatRupiah(batas.maksimumPerBulan)}) sudah tercapai.
                    Pencairan bisa dilakukan lagi mulai{" "}
                    {tanggalPanjang(awalBulanDepan)}.
                </div>
            )}

            <div>
                <label className={LABEL}>Nominal (Rp)</label>
                <input
                    type="text"
                    inputMode="numeric"
                    value={form.nominal}
                    onChange={(e) =>
                        ubah("nominal", formatInputNominal(e.target.value))
                    }
                    placeholder="Contoh: 150.000"
                    className={INPUT}
                />
                <FieldError message={errors.nominal} />
            </div>

            <div>
                <label className={LABEL}>Nomor Rekening Tujuan</label>
                <input
                    type="text"
                    inputMode="numeric"
                    value={form.noRekening}
                    onChange={(e) =>
                        ubah("noRekening", e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={16}
                    placeholder="Contoh: 1234567890 (Hanya Angka)"
                    className={`${INPUT} font-mono`}
                />
                <FieldError message={errors.noRekening} />
            </div>

            <div>
                <label className={LABEL}>Jenis Pencairan</label>
                <select
                    value={form.jenisPencairan}
                    onChange={(e) => ubah("jenisPencairan", e.target.value)}
                    className={`${INPUT} bg-white cursor-pointer`}>
                    {JENIS_PENCAIRAN.map((j) => (
                        <option key={j} value={j}>
                            {LABEL_JENIS[j]}
                        </option>
                    ))}
                </select>
                <FieldError message={errors.jenisPencairan} />
            </div>

            <button
                type="submit"
                disabled={submitting || belumDimuat || tercapai}
                className="mt-4 w-full bg-[#222] hover:bg-black text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50 border-0">
                {submitting ? (
                    "Memproses..."
                ) : (
                    <>
                        Konfirmasi Pencairan <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
        </form>
    );
}

// BaseModal tidak merender isinya saat tertutup, jadi form selalu kosong lagi
// setiap kali dibuka.
export default function KeuanganPencairanModal({
    isOpen,
    onClose,
    onSubmit,
    submitting,
    saldo,
    batas,
}: Props) {
    return (
        <BaseModal
            open={isOpen}
            onClose={onClose}
            className="max-w-[450px]"
            showCloseButton>
            <div className="p-2">
                <h2 className="text-[22px] font-bold text-black mb-2">
                    Form Pencairan Saldo
                </h2>
                <div className="mb-6 space-y-1">
                    <p className="text-xs text-gray-500">
                        Saldo tersedia: {formatRupiah(saldo)}
                    </p>
                    {batas.maksimumPerBulan > 0 && batas.sisa > 0 && (
                        <p className="text-xs text-gray-500">
                            Sisa batas pencairan bulan ini:{" "}
                            {formatRupiah(batas.sisa)} dari{" "}
                            {formatRupiah(batas.maksimumPerBulan)}
                        </p>
                    )}
                </div>
                <PencairanForm
                    onSubmit={onSubmit}
                    submitting={submitting}
                    saldo={saldo}
                    batas={batas}
                />
            </div>
        </BaseModal>
    );
}
