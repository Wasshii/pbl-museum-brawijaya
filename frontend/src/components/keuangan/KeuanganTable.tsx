"use client";
import { ArrowRight, User } from "lucide-react";
import type { TabKeuangan, TransaksiData } from "@/hooks/useKeuangan";
import { formatRupiah } from "@/lib/format";
import { labelStatus } from "@/lib/keuangan";

interface Props {
    tab: TabKeuangan;
    transaksi: TransaksiData[];
    onDetail: (item: TransaksiData) => void;
}

const KOLOM_MASUK = [
    "Nama User",
    "Jumlah Tiket",
    "Nominal",
    "Jenis Tiket",
    "Status",
    "Id Trx",
    "Detail",
];
const KOLOM_KELUAR = [
    "Nama Admin",
    "Nominal",
    "Jenis Pencairan",
    "Status",
    "Id Trx",
    "Detail",
];

// Sel pertama dan terakhir punya padding lebih lebar (sama seperti target)
const TH_DASAR =
    "sticky top-0 z-20 bg-white py-4 font-bold text-black text-[14px] border-b border-gray-200 bg-clip-padding";
const thKelas = (i: number, total: number) =>
    i === 0
        ? `${TH_DASAR} pl-6 pr-4 text-left`
        : i === total - 1
          ? `${TH_DASAR} pl-4 pr-6 text-center`
          : `${TH_DASAR} px-4 text-center`;

const TD = "py-4 px-4 text-center border-b border-gray-100";

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

function StatusPil({ status }: { status: string }) {
    const gaya = STATUS_STYLE[status] ?? {
        pil: "text-gray-600 bg-gray-100",
        titik: "bg-gray-400",
    };
    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${gaya.pil}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${gaya.titik}`}></span>
            {labelStatus(status)}
        </span>
    );
}

export default function KeuanganTable({ tab, transaksi, onDetail }: Props) {
    const masuk = tab === "masuk";
    const kolom = masuk ? KOLOM_MASUK : KOLOM_KELUAR;

    return (
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex-grow flex flex-col">
            <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Menampilkan {transaksi.length} transaksi</span>
                <span className="hidden sm:inline text-gray-400">
                    Scroll ke bawah untuk melihat riwayat lengkap
                </span>
            </div>

            {/* Tinggi dibatasi supaya bisa di-scroll; header menempel (sticky) tanpa celah
                karena memakai border-separate. glass-scroll ada di globals.css */}
            <div className="max-h-[460px] overflow-y-auto overflow-x-auto glass-scroll">
                <table className="w-full text-left min-w-[760px] border-separate border-spacing-0 font-sans">
                    <thead className="sticky top-0 z-20 bg-white">
                        <tr className="bg-white">
                            {kolom.map((label, i) => (
                                <th
                                    key={label}
                                    className={thKelas(i, kolom.length)}>
                                    {label}
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
                                            className={`${TD} font-semibold text-[14px] text-gray-800`}>
                                            {item.jumlahTiket ?? "-"}
                                        </td>
                                        <td
                                            className={`${TD} font-bold text-[14px] text-emerald-600 whitespace-nowrap`}>
                                            + {formatRupiah(item.jumlah)}
                                        </td>
                                        <td
                                            className={`${TD} font-medium text-[13px]`}>
                                            <Pil teks={item.jenisTiket} />
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td
                                            className={`${TD} font-bold text-[14px] text-rose-600 whitespace-nowrap`}>
                                            - {formatRupiah(item.jumlah)}
                                        </td>
                                        <td
                                            className={`${TD} font-medium text-[13px]`}>
                                            <Pil teks={item.jenisPencairan} />
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
                                    filter atau pencarian.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
