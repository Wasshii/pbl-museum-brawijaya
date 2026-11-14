"use client";
import { ArrowRight, Building2, Smartphone, User } from "lucide-react";
import type { TabKeuangan, TransaksiData } from "@/hooks/useKeuangan";
import { formatRupiah } from "@/lib/format";
import { labelStatus } from "@/lib/keuangan";
import KeuanganPagination from "./KeuanganPagination";

interface Props {
    tab: TabKeuangan;
    transaksi: TransaksiData[]; // hanya baris di halaman aktif
    onDetail: (item: TransaksiData) => void;
    halaman: number;
    totalHalaman: number;
    totalData: number; // jumlah seluruh baris setelah difilter
    perHalaman: number;
    onHalaman: (halaman: number) => void;
}

type Rata = "kiri" | "kanan" | "tengah";
interface Kolom {
    label: string;
    rata: Rata;
}

const KOLOM_MASUK: Kolom[] = [
    { label: "Nama User", rata: "kiri" },
    { label: "Tiket", rata: "kanan" },
    { label: "Nominal", rata: "kanan" },
    { label: "Jenis Tiket", rata: "tengah" },
    { label: "Status", rata: "tengah" },
    { label: "ID Transaksi", rata: "tengah" },
    { label: "Detail", rata: "tengah" },
];
const KOLOM_KELUAR: Kolom[] = [
    { label: "Nama Admin", rata: "kiri" },
    { label: "Nominal", rata: "kanan" },
    { label: "Tujuan Pencairan", rata: "tengah" },
    { label: "Status", rata: "tengah" },
    { label: "ID Transaksi", rata: "tengah" },
    { label: "Detail", rata: "tengah" },
];

const TH_DASAR =
    "py-4 font-bold text-black text-[14px] border-b border-gray-200 bg-white";
const thKelas = (k: Kolom, i: number, total: number) => {
    if (i === 0) return `${TH_DASAR} pl-6 pr-4 text-left`;
    if (i === total - 1) return `${TH_DASAR} pl-4 pr-6 text-center`;
    if (k.rata === "kanan") return `${TH_DASAR} pl-4 pr-8 text-right`;
    return `${TH_DASAR} px-4 text-center`;
};

const TD = "py-4 px-4 text-center border-b border-gray-100";
// Angka (tiket & nominal): rata kanan, lebar angka seragam
const TD_ANGKA =
    "py-4 pr-8 pl-4 text-right border-b border-gray-100 font-mono tabular-nums";

const STATUS_STYLE: Record<string, { pil: string; titik: string }> = {
    berhasil: { pil: "text-[#00a814] bg-emerald-50", titik: "bg-[#00c918]" },
    pending: { pil: "text-amber-600 bg-amber-50", titik: "bg-amber-500" },
    gagal: { pil: "text-red-600 bg-red-50", titik: "bg-red-500" },
};

function Pil({ teks }: { teks: string | null }) {
    if (!teks) return <span className="text-gray-400">-</span>;
    return (
        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
            {teks}
        </span>
    );
}

// Nama bank / e-wallet tujuan. Baris lama (belum ada nama) tampil "Transfer Bank" / "E-Wallet".
function PilPencairan({
    jenis,
    penyedia,
}: {
    jenis: string | null;
    penyedia: string | null;
}) {
    if (!jenis) return <span className="text-gray-400">-</span>;
    const bank = jenis === "Bank";
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-900 border border-gray-200 font-bold">
            {bank ? (
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
            ) : (
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>{penyedia ?? (bank ? "Transfer Bank" : jenis)}</span>
        </span>
    );
}

function StatusPil({ status }: { status: string }) {
    const gaya = STATUS_STYLE[status] ?? {
        pil: "text-gray-600 bg-gray-100",
        titik: "bg-gray-400",
    };
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold ${gaya.pil}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${gaya.titik}`}></span>
            {labelStatus(status)}
        </span>
    );
}

export default function KeuanganTable({
    tab,
    transaksi,
    onDetail,
    halaman,
    totalHalaman,
    totalData,
    perHalaman,
    onHalaman,
}: Props) {
    const masuk = tab === "masuk";
    const kolom = masuk ? KOLOM_MASUK : KOLOM_KELUAR;

    return (
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto glass-scroll">
                <table className="w-full text-left min-w-[760px] border-separate border-spacing-0 font-sans">
                    <thead>
                        <tr className="bg-white">
                            {kolom.map((k, i) => (
                                <th
                                    key={k.label}
                                    className={thKelas(k, i, kolom.length)}>
                                    {k.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {transaksi.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-4 pl-6 pr-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                            <User className="w-4 h-4 text-gray-700" />
                                        </div>
                                        <span className="font-semibold text-[14px] text-black">
                                            {item.nama ?? "-"}
                                        </span>
                                    </div>
                                </td>

                                {masuk ? (
                                    <>
                                        <td
                                            className={`${TD_ANGKA} font-semibold text-[14px] text-gray-800`}>
                                            {item.jumlahTiket ?? "-"}
                                        </td>
                                        <td
                                            className={`${TD_ANGKA} font-bold text-[14px] text-[#1F1F1F] whitespace-nowrap`}>
                                            {formatRupiah(item.jumlah)}
                                        </td>
                                        <td
                                            className={`${TD} font-medium text-[13px]`}>
                                            <Pil teks={item.jenisTiket} />
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td
                                            className={`${TD_ANGKA} font-bold text-[14px] text-[#1F1F1F] whitespace-nowrap`}>
                                            - {formatRupiah(item.jumlah)}
                                        </td>
                                        <td
                                            className={`${TD} font-medium text-[13px]`}>
                                            <PilPencairan
                                                jenis={item.jenisPencairan}
                                                penyedia={item.penyedia}
                                            />
                                        </td>
                                    </>
                                )}

                                <td
                                    className={`${TD} font-semibold text-[13px]`}>
                                    <StatusPil status={item.status} />
                                </td>
                                <td
                                    className={`${TD} font-mono text-[13px] text-gray-600`}>
                                    {item.idTrx ?? "-"}
                                </td>
                                <td className="py-4 pl-4 pr-6 border-b border-gray-100">
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => onDetail(item)}
                                            title="Lihat Detail Transaksi"
                                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer">
                                            <ArrowRight className="w-5 h-5 text-black hover:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {transaksi.length === 0 && (
                            <tr>
                                <td
                                    colSpan={kolom.length}
                                    className="py-16 text-center text-gray-500 font-semibold text-[14px]">
                                    Tidak ada data transaksi yang cocok dengan
                                    periode atau filter yang dipilih.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <KeuanganPagination
                halaman={halaman}
                totalHalaman={totalHalaman}
                totalData={totalData}
                perHalaman={perHalaman}
                onChange={onHalaman}
            />
        </div>
    );
}
