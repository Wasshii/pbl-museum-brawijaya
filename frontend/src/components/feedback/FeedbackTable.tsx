"use client";
import { ArrowRight, Star } from "lucide-react";
import type { FeedbackData } from "@/types/feedback";
import { formatTanggalSingkat } from "@/lib/format";

interface Props {
    feedbacks: FeedbackData[];
    onReply: (item: FeedbackData) => void;
}

const TH_BASE =
    "sticky top-0 z-20 bg-white py-4 font-bold text-black whitespace-nowrap text-[14px] border-b border-gray-200 bg-clip-padding";

export default function FeedbackTable({ feedbacks, onReply }: Props) {
    return (
        <div className="bg-white rounded-[24px] shadow-sm overflow-hidden border border-gray-100 flex flex-col">
            {/* max-h membatasi tinggi agar tabel bisa di-scroll, header tetap menempel di atas */}
            <div className="max-h-[460px] overflow-y-auto overflow-x-auto glass-scroll">
                <table className="w-full text-left border-separate border-spacing-0 font-sans min-w-[750px]">
                    <thead className="sticky top-0 z-20 bg-white">
                        <tr className="bg-white">
                            <th className={`${TH_BASE} pl-6 pr-4`}>
                                Nama User
                            </th>
                            <th className={`${TH_BASE} px-4 w-1/3`}>Ulasan</th>
                            <th className={`${TH_BASE} px-4 text-center`}>
                                Rating
                            </th>
                            <th className={`${TH_BASE} px-4 text-center`}>
                                Detail
                            </th>
                            <th className={`${TH_BASE} pl-4 pr-6 text-center`}>
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.length > 0 ? (
                            feedbacks.map((item) => {
                                const sudahDibalas = Boolean(item.balasan);
                                return (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50/80 transition-colors">
                                        <td className="py-4 pl-6 pr-4 text-black font-semibold text-[14px] border-b border-gray-100">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                                                    <span className="font-bold text-xs text-gray-700">
                                                        {(item.nama_user || "?")
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="leading-tight m-0">
                                                        {item.nama_user}
                                                    </p>
                                                    <span className="text-[11px] text-gray-400 font-normal">
                                                        {formatTanggalSingkat(
                                                            item.tanggal,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td
                                            className="py-4 px-4 text-gray-600 max-w-[280px] text-[14px] border-b border-gray-100"
                                            title={item.komentar}>
                                            <p className="truncate m-0">
                                                &quot;{item.komentar}&quot;
                                            </p>
                                            {item.balasan && (
                                                <p className="text-[11px] text-emerald-600 truncate mt-0.5 mb-0 font-medium flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                    <span className="truncate">
                                                        Dibalas: {item.balasan}
                                                    </span>
                                                </p>
                                            )}
                                        </td>

                                        <td className="py-4 px-4 text-center border-b border-gray-100">
                                            <div className="inline-flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                <span className="font-bold text-xs text-amber-800">
                                                    {Number(item.rating).toFixed(
                                                        1,
                                                    )}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 text-center border-b border-gray-100">
                                            <button
                                                onClick={() => onReply(item)}
                                                className="text-black hover:text-gray-600 hover:scale-110 transition-transform cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 border-0 bg-transparent inline-flex items-center justify-center"
                                                title="Lihat Detail & Balas">
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </td>

                                        <td className="py-4 pl-4 pr-6 text-center font-bold text-[13px] border-b border-gray-100">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                    sudahDibalas
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "bg-rose-50 text-rose-600"
                                                }`}>
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        sudahDibalas
                                                            ? "bg-emerald-500"
                                                            : "bg-rose-500"
                                                    }`}
                                                />
                                                {sudahDibalas
                                                    ? "Telah Di Balas"
                                                    : "Belum Di Balas"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-12 text-center text-gray-500 font-semibold text-[14px]">
                                    Tidak ada ulasan ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}