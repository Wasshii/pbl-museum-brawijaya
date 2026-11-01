"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import FieldError from "@/components/ui/FieldError";
import { formatRupiah } from "@/lib/format";
import { hitungNominal } from "@/lib/keuangan";
import { toFieldErrors, type FieldErrors } from "@/lib/validations";
import { isiSaldoSchema, JENIS_TIKET } from "@/lib/validations/keuangan";
import type { IsiSaldoInput, JenisTiket, Tarif } from "@/types/keuangan";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: IsiSaldoInput) => Promise<boolean>;
    submitting: boolean;
    tarif: Tarif;
}

interface FormState {
    nama: string;
    noTlp: string;
    tiket: string;
    jenis: string;
}

const FORM_AWAL: FormState = {
    nama: "",
    noTlp: "",
    tiket: "",
    jenis: JENIS_TIKET[0],
};

const LABEL = "block text-sm font-bold text-gray-700 mb-1.5";
const INPUT =
    "w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black focus:border-black focus:ring-1 focus:ring-black";

function IsiSaldoForm({
    onSubmit,
    submitting,
    tarif,
}: Omit<Props, "isOpen" | "onClose">) {
    const [form, setForm] = useState<FormState>(FORM_AWAL);
    const [errors, setErrors] = useState<FieldErrors<FormState>>({});

    const ubah = (field: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const jumlahTiket = parseInt(form.tiket, 10) || 0;
    const jenisTiket = form.jenis as JenisTiket;
    const total = hitungNominal(jumlahTiket, jenisTiket, tarif);
    const rumus =
        jumlahTiket >= 1
            ? `${jumlahTiket} × ${formatRupiah(tarif.hargaTiket)}${jenisTiket === "Guide" ? ` + pemandu ${formatRupiah(tarif.biayaPemandu)}` : ""}`
            : "Isi jumlah tiket";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const hasil = isiSaldoSchema.safeParse(form);
        if (!hasil.success) {
            setErrors(toFieldErrors<FormState>(hasil.error));
            return;
        }
        setErrors({});

        await onSubmit({
            tipe: "pemasukan",
            nama: form.nama.trim(),
            noTelepon: form.noTlp,
            jumlahTiket,
            jenisTiket,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate>
            <div>
                <label className={LABEL}>Nama User</label>
                <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => ubah("nama", e.target.value)}
                    placeholder="Nama Pengunjung"
                    className={INPUT}
                />
                <FieldError message={errors.nama} />
            </div>

            <div>
                <label className={LABEL}>Nomor Telepon</label>
                <input
                    type="tel"
                    inputMode="numeric"
                    value={form.noTlp}
                    onChange={(e) =>
                        ubah("noTlp", e.target.value.replace(/\D/g, ""))
                    }
                    maxLength={13}
                    placeholder="Contoh: 081234567890 (Hanya Angka)"
                    className={`${INPUT} font-mono`}
                />
                <FieldError message={errors.noTlp} />
            </div>

            <div className="flex gap-4">
                <div className="w-1/2">
                    <label className={LABEL}>Jumlah Tiket</label>
                    <input
                        type="number"
                        min="1"
                        value={form.tiket}
                        onChange={(e) => ubah("tiket", e.target.value)}
                        placeholder="1"
                        className={INPUT}
                    />
                    <FieldError message={errors.tiket} />
                </div>
                <div className="w-1/2">
                    <label className={LABEL}>Jenis Tiket</label>
                    <select
                        value={form.jenis}
                        onChange={(e) => ubah("jenis", e.target.value)}
                        className={`${INPUT} bg-white`}>
                        {JENIS_TIKET.map((j) => (
                            <option key={j} value={j}>
                                {j}
                            </option>
                        ))}
                    </select>
                    <FieldError message={errors.jenis} />
                </div>
            </div>

            {/* Di target ini kolom Nominal yang diketik; sekarang otomatis dari harga tiket */}
            <div className="rounded-xl bg-[#e6f3eb] px-4 py-3">
                <p className="text-xs font-semibold text-gray-500">
                    Total (bayar tunai)
                </p>
                <p className="text-xl font-bold text-black mt-0.5">
                    {formatRupiah(total)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{rumus}</p>
            </div>

            <button
                type="submit"
                disabled={submitting || tarif.hargaTiket === 0}
                className="mt-4 w-full bg-[#222] hover:bg-black text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50 border-0">
                {submitting ? (
                    "Memproses..."
                ) : (
                    <>
                        Konfirmasi Isi Saldo <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
        </form>
    );
}

// BaseModal tidak merender isinya saat tertutup, jadi form selalu kosong lagi
// setiap kali dibuka.
export default function KeuanganIsiSaldoModal({
    isOpen,
    onClose,
    onSubmit,
    submitting,
    tarif,
}: Props) {
    return (
        <BaseModal
            open={isOpen}
            onClose={onClose}
            className="max-w-[450px]"
            showCloseButton>
            <div className="p-2">
                <h2 className="text-[22px] font-bold text-black mb-2">
                    Form Isi Saldo (Uang Masuk)
                </h2>
                <p className="text-xs text-gray-500 mb-5">
                    Catat transaksi penjualan tiket museum masuk
                </p>
                <IsiSaldoForm
                    onSubmit={onSubmit}
                    submitting={submitting}
                    tarif={tarif}
                />
            </div>
        </BaseModal>
    );
}
