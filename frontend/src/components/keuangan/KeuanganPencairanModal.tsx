"use client";
import { useState } from "react";
import {
    AlertCircle,
    ArrowRight,
    Building2,
    CheckCircle2,
    Smartphone,
} from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import FieldError from "@/components/ui/FieldError";
import { ADMIN_NAME } from "@/lib/constants";
import {
    formatInputNominal,
    formatRupiah,
    parseNominal,
    tanggalPanjang,
} from "@/lib/format";
import { pesanRekening } from "@/lib/keuangan";
import { toFieldErrors, type FieldErrors } from "@/lib/validations";
import { JENIS_PENCAIRAN, pencairanSchema } from "@/lib/validations/keuangan";
import type {
    BatasPencairan,
    DaftarPenyedia,
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
    penyedia: DaftarPenyedia; // daftar bank & e-wallet dari backend
}

interface FormState {
    nominal: string;
    noRekening: string;
    jenisPencairan: string; // "Bank" | "E-Wallet"
    penyedia: string; // id bank / e-wallet; kosong = pilihan pertama
}

const FORM_AWAL: FormState = {
    nominal: "",
    noRekening: "",
    jenisPencairan: JENIS_PENCAIRAN[0],
    penyedia: "",
};

const LABEL = "block text-sm font-bold text-gray-700 mb-1.5";
const INPUT =
    "w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black focus:border-black focus:ring-1 focus:ring-black";

function PencairanForm({
    onSubmit,
    submitting,
    saldo,
    batas,
    penyedia,
}: Omit<Props, "isOpen" | "onClose">) {
    const [form, setForm] = useState<FormState>(FORM_AWAL);
    const [errors, setErrors] = useState<FieldErrors<FormState>>({});

    // maksimumPerBulan = 0 berarti data batas belum dimuat dari backend
    const batasBelumDimuat = batas.maksimumPerBulan === 0;
    const tercapai = !batasBelumDimuat && batas.sisa <= 0;
    const sekarang = new Date();
    const awalBulanDepan = new Date(
        sekarang.getFullYear(),
        sekarang.getMonth() + 1,
        1,
    );

    const jenis = form.jenisPencairan as JenisPencairan;
    const bank = jenis === "Bank";
    const daftarPenyedia = bank ? penyedia.bank : penyedia.eWallet;
    const aktif =
        daftarPenyedia.find((p) => p.id === form.penyedia) ?? daftarPenyedia[0];
    const belumDimuat = batasBelumDimuat || !aktif;

    const angka = form.noRekening;
    const pesan = aktif ? pesanRekening(jenis, aktif, angka) : null;
    const sesuai = Boolean(aktif) && !pesan;
    const targetDigit = aktif
        ? aktif.digitMin === aktif.digitMax
            ? `${aktif.digitMin}`
            : `${aktif.digitMin}-${aktif.digitMax}`
        : "";

    const ubah = (field: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    // Ganti Bank <-> E-Wallet: pilihan penyedia dan nomor dikosongkan
    const ubahJenis = (nilai: JenisPencairan) => {
        setForm((prev) => ({
            ...prev,
            jenisPencairan: nilai,
            penyedia: "",
            noRekening: "",
        }));
        setErrors({});
    };

    const ubahPenyedia = (id: string) => {
        setForm((prev) => ({ ...prev, penyedia: id, noRekening: "" }));
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aktif) return;

        // Batas nominal = saldo saat ini dan sisa batas bulan ini (backend mengecek ulang)
        const hasil = pencairanSchema(saldo, batas.sisa, penyedia).safeParse({
            ...form,
            penyedia: aktif.id,
        });
        if (!hasil.success) {
            setErrors(toFieldErrors<FormState>(hasil.error));
            return;
        }
        setErrors({});

        await onSubmit({
            tipe: "pengeluaran",
            nama: ADMIN_NAME,
            jumlah: parseNominal(form.nominal),
            jenisPencairan: jenis,
            penyedia: aktif.id,
            noRekening: form.noRekening,
        });
    };

    const tombolJenis = (nilai: JenisPencairan, label: string) => (
        <button
            type="button"
            onClick={() => ubahJenis(nilai)}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border-0 ${
                jenis === nilai
                    ? "bg-white text-black shadow-sm"
                    : "bg-transparent text-gray-600 hover:text-black"
            }`}>
            {nilai === "Bank" ? (
                <Building2 className="w-4 h-4 text-blue-600" />
            ) : (
                <Smartphone className="w-4 h-4 text-emerald-600" />
            )}
            <span>{label}</span>
        </button>
    );

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

            {/* Pilihan metode: Transfer Bank atau E-Wallet */}
            <div>
                <label className={LABEL}>Jenis Metode Pencairan</label>
                <div className="grid grid-cols-2 gap-2 bg-[#f4f4f4] p-1.5 rounded-2xl border border-gray-200">
                    {tombolJenis("Bank", "Transfer Bank")}
                    {tombolJenis("E-Wallet", "E-Wallet")}
                </div>
                <FieldError message={errors.jenisPencairan} />
            </div>

            <div>
                <label className={LABEL}>
                    {bank ? "Pilih Bank Tujuan" : "Pilih Provider E-Wallet"}
                </label>
                <select
                    value={aktif?.id ?? ""}
                    onChange={(e) => ubahPenyedia(e.target.value)}
                    disabled={!aktif}
                    className={`${INPUT} bg-white cursor-pointer`}>
                    {daftarPenyedia.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nama} (
                            {p.digitMin === p.digitMax
                                ? p.digitMin
                                : `${p.digitMin}-${p.digitMax}`}{" "}
                            digit)
                        </option>
                    ))}
                </select>
                <FieldError message={errors.penyedia} />
            </div>

            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-bold text-gray-700">
                        {aktif
                            ? bank
                                ? `Nomor Rekening ${aktif.id}`
                                : `Nomor HP Akun ${aktif.nama}`
                            : "Nomor Tujuan"}
                    </label>
                    {aktif && (
                        <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                                sesuai
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}>
                            {bank
                                ? `${angka.length} / ${aktif.digitMax} digit`
                                : `${angka.length} digit`}
                        </span>
                    )}
                </div>
                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={aktif?.digitMax ?? 16}
                    value={form.noRekening}
                    onChange={(e) =>
                        ubah("noRekening", e.target.value.replace(/\D/g, ""))
                    }
                    placeholder={
                        aktif
                            ? `Contoh: ${aktif.contoh} (${targetDigit} digit)`
                            : "Memuat daftar..."
                    }
                    disabled={!aktif}
                    className={`${INPUT} font-mono tracking-wider`}
                />
                {aktif && (
                    <p className="text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                        {sesuai ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {bank
                                    ? `Format rekening ${aktif.id} sesuai (${targetDigit} digit)`
                                    : `Nomor ${aktif.nama} valid (${angka.length} digit)`}
                            </span>
                        ) : (
                            <span className="text-gray-500 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {bank
                                    ? `Hanya angka, tepat ${targetDigit} digit`
                                    : `Nomor telepon terdaftar, diawali 08, ${targetDigit} digit`}
                            </span>
                        )}
                    </p>
                )}
                <FieldError message={errors.noRekening} />
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
    penyedia,
}: Props) {
    return (
        <BaseModal
            open={isOpen}
            onClose={onClose}
            className="max-w-[450px] max-h-[92vh] overflow-y-auto glass-scroll"
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
                    penyedia={penyedia}
                />
            </div>
        </BaseModal>
    );
}
