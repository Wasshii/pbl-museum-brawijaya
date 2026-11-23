"use client";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import { formatRupiah, formatTanggalSingkat } from "@/lib/format";
import { labelStatus } from "@/lib/keuangan";
import type { TransaksiData } from "@/types/keuangan";

interface Props {
    data: TransaksiData | null;
    onClose: () => void;
    // Konfirmasi pembayaran tunai dari aplikasi mobile (hanya muncul untuk status pending)
    onKonfirmasi?: (data: TransaksiData) => Promise<void> | void;
}

const WARNA_STATUS: Record<string, string> = {
    berhasil: "text-[#00c918]",
    pending: "text-amber-600",
    gagal: "text-red-600",
    dibatalkan: "text-gray-500",
};

function Baris({
    label,
    value,
    kelas = "text-black",
}: {
    label: string;
    value: string;
    kelas?: string;
}) {
    return (
        <div className="flex justify-between gap-4 py-3.5 border-b border-gray-100">
            <span className="text-gray-500 font-semibold text-[14px]">
                {label}
            </span>
            <span
                className={`font-bold text-[14px] text-right break-words min-w-0 ${kelas}`}>
                {value}
            </span>
        </div>
    );
}

// Kode akses: dicoret + tulisan "Kedaluwarsa" bila sudah lewat jam 23:59
function BarisKodeAkses({ data }: { data: TransaksiData }) {
    const kode = data.kodeAkses;
    return (
        <div className="flex justify-between items-center gap-4 py-3.5 border-b border-gray-100">
            <span className="text-gray-500 font-semibold text-[14px]">
                Kode Akses
            </span>
            {kode ? (
                <span className="flex items-center gap-2 min-w-0">
                    {data.aksesKedaluwarsa && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 shrink-0">
                            Kedaluwarsa
                        </span>
                    )}
                    <span
                        className={`font-mono font-bold text-[14px] break-all ${
                            data.aksesKedaluwarsa
                                ? "line-through text-gray-400"
                                : "text-black"
                        }`}>
                        {kode}
                    </span>
                </span>
            ) : (
                <span className="font-bold text-[14px] text-black">-</span>
            )}
        </div>
    );
}

export default function KeuanganDetailModal({
    data,
    onClose,
    onKonfirmasi,
}: Props) {
    if (!data) return null;

    const masuk = data.tipe === "pemasukan";
    const perluKonfirmasi = masuk && data.status === "pending";

    return (
        <BaseModal
            open
            onClose={onClose}
            className="max-w-[450px]"
            showCloseButton>
            <div className="p-2">
                <h2 className="text-[22px] font-bold text-black mb-6">
                    {masuk ? "Detail Uang Masuk" : "Detail Uang Keluar"}
                </h2>

                <div className="flex flex-col gap-0 border-t border-gray-200">
                    {masuk ? (
                        <>
                            <Baris label="Nama User" value={data.nama ?? "-"} />
                            <BarisKodeAkses data={data} />
                            <Baris
                                label="Jumlah Tiket"
                                value={
                                    data.jumlahTiket
                                        ? `${data.jumlahTiket} Tiket`
                                        : "-"
                                }
                            />
                            <Baris
                                label="Jenis Tiket"
                                value={data.jenisTiket ?? "-"}
                            />
                            <Baris
                                label="Jenis Pembayaran"
                                value={data.jenisPembayaran ?? "-"}
                            />
                            <Baris
                                label="Nominal"
                                value={formatRupiah(data.jumlah)}
                                kelas="text-emerald-600"
                            />
                        </>
                    ) : (
                        <>
                            <Baris
                                label="Nama Admin"
                                value={data.nama ?? "-"}
                            />
                            <Baris
                                label="Jenis Pencairan"
                                value={data.jenisPencairan ?? "-"}
                            />
                            <Baris
                                label="Bank / E-Wallet"
                                value={data.penyedia ?? "-"}
                            />
                            {data.noRekening && (
                                <Baris
                                    label="No. Rekening / HP Tujuan"
                                    value={data.noRekening}
                                    kelas="text-black font-mono"
                                />
                            )}
                            <Baris
                                label="Nominal"
                                value={formatRupiah(data.jumlah)}
                                kelas="text-rose-600"
                            />
                        </>
                    )}

                    <Baris
                        label="Tanggal"
                        value={formatTanggalSingkat(data.tanggal) || "-"}
                    />
                    <Baris
                        label="Status"
                        value={labelStatus(data.status)}
                        kelas={WARNA_STATUS[data.status] ?? "text-black"}
                    />
                    <Baris
                        label="ID Trx"
                        value={data.idTrx ?? "-"}
                        kelas="text-black font-mono"
                    />
                </div>

                {perluKonfirmasi && onKonfirmasi && (
                    <button
                        onClick={() => onKonfirmasi(data)}
                        className="mt-6 w-full bg-[#222] hover:bg-black text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors border-0">
                        <CheckCircle2 className="w-5 h-5" /> Konfirmasi
                        Pembayaran Tunai
                    </button>
                )}

                <button
                    onClick={onClose}
                    className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors border-0">
                    <ArrowLeft className="w-5 h-5" /> Kembali
                </button>
            </div>
        </BaseModal>
    );
}
