"use client";
import { ArrowRight, Edit3, Trash2 } from "lucide-react";
import type { Koleksi } from "@/types/koleksi";

interface Props {
    koleksi: Koleksi[];
    onView: (item: Koleksi) => void;
    onEdit: (item: Koleksi) => void;
    onDelete: (id: number) => void;
}

const TH =
    "sticky top-0 z-20 bg-white py-4 px-4 font-bold text-black text-[15px] border-b border-gray-200 bg-clip-padding";
const TD = "py-4 px-4 font-semibold text-[14px] border-b border-gray-100";

export default function SejarahTable({
    koleksi,
    onView,
    onEdit,
    onDelete,
}: Props) {
    return (
        <div className="bg-white rounded-[24px] shadow-sm overflow-hidden w-full border border-gray-100">
            {/* Tinggi dibatasi agar tabel bisa di-scroll; header tetap menempel di atas */}
            <div className="max-h-[460px] overflow-y-auto overflow-x-auto glass-scroll">
                <table className="w-full text-left min-w-[800px] border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20 bg-white">
                        <tr className="bg-white">
                            <th className={`${TH} pl-6 w-[25%]`}>Nama Benda</th>
                            <th className={`${TH} w-[20%]`}>Jenis Benda</th>
                            <th className={`${TH} text-center`}>
                                Tanggal Di Update
                            </th>
                            <th className={`${TH} text-center`}>Token</th>
                            <th className={`${TH} text-center`}>Detail</th>
                            <th className={`${TH} pr-6 text-center`}>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {koleksi.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-gray-50/80 transition-colors">
                                <td className={`${TD} pl-6 text-black`}>
                                    {item.nama}
                                </td>
                                <td className={`${TD} text-gray-700`}>
                                    {item.jenis}
                                </td>
                                <td
                                    className={`${TD} text-center text-gray-700`}>
                                    {item.tanggal_update}
                                </td>
                                <td
                                    className={`${TD} text-center text-gray-700 font-mono`}>
                                    {item.token}
                                </td>
                                <td className={`${TD} text-center`}>
                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => onView(item)}
                                            title="Lihat Detail Benda"
                                            className="bg-transparent border-0 cursor-pointer p-1 rounded hover:bg-gray-100 transition-colors">
                                            <ArrowRight className="w-5 h-5 text-black hover:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </td>
                                <td className={`${TD} pr-6 text-center`}>
                                    <div className="flex justify-center items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => onDelete(item.id)}
                                            title="Hapus Koleksi"
                                            className="text-red-500 hover:text-red-700 transition-colors bg-transparent border-0 cursor-pointer p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onEdit(item)}
                                            title="Edit Koleksi"
                                            className="text-blue-500 hover:text-blue-700 transition-colors bg-transparent border-0 cursor-pointer p-1">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {koleksi.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-12 text-center text-gray-500 font-semibold text-[15px]">
                                    Data tidak ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
