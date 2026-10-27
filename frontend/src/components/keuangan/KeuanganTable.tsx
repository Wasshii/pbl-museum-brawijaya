"use client";
import { TransaksiData } from "@/hooks/useKeuangan";

interface Props {
    transaksi: TransaksiData[];
    formatRupiah: (angka: number) => string;
}

export default function KeuanganTable({ transaksi, formatRupiah }: Props) {
    return (
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
                <thead>
                    <tr className="bg-[#6C9E78] text-white text-left">
                        <th className="py-4 px-6 font-semibold w-16">No</th>
                        <th className="py-4 px-6 font-semibold">Tanggal</th>
                        <th className="py-4 px-6 font-semibold">Deskripsi</th>
                        <th className="py-4 px-6 font-semibold">Tipe</th>
                        <th className="py-4 px-6 font-semibold">Jumlah</th>
                        <th className="py-4 px-6 font-semibold">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {transaksi.map((item, index) => (
                        <tr
                            key={item.id}
                            className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-6">{index + 1}</td>
                            <td className="py-4 px-6 text-gray-600">
                                {item.tanggal}
                            </td>
                            <td className="py-4 px-6 font-medium text-gray-900">
                                {item.deskripsi}
                            </td>
                            <td className="py-4 px-6 capitalize">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${item.tipe === "pemasukan" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {item.tipe}
                                </span>
                            </td>
                            <td
                                className={`py-4 px-6 font-semibold ${item.tipe === "pemasukan" ? "text-green-600" : "text-red-600"}`}>
                                {item.tipe === "pemasukan" ? "+" : "-"}
                                {formatRupiah(item.jumlah)}
                            </td>
                            <td className="py-4 px-6 capitalize">
                                <span className="text-gray-600 font-medium">
                                    {item.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {transaksi.length === 0 && (
                        <tr>
                            <td
                                colSpan={6}
                                className="py-12 text-center text-gray-500 font-medium">
                                Belum ada data transaksi.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
