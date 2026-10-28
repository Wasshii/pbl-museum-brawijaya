"use client";
import { Eye, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import type { Koleksi } from "@/types/koleksi";

interface Props {
    koleksi: Koleksi[];
    onView: (item: Koleksi) => void;
    onEdit: (item: Koleksi) => void;
    onDelete: (id: number) => void;
}

export default function SejarahTable({
    koleksi,
    onView,
    onEdit,
    onDelete,
}: Props) {
    return (
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden mt-6 overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
                <thead>
                    <tr className="bg-[#6C9E78] text-white text-left">
                        <th className="py-4 px-6 font-semibold whitespace-nowrap w-16">
                            No
                        </th>
                        <th className="py-4 px-6 font-semibold whitespace-nowrap w-24">
                            Gambar
                        </th>
                        <th className="py-4 px-6 font-semibold whitespace-nowrap w-1/4">
                            Nama Koleksi
                        </th>
                        <th className="py-4 px-6 font-semibold whitespace-nowrap w-auto">
                            Deskripsi
                        </th>
                        <th className="py-4 px-6 font-semibold text-center whitespace-nowrap w-32">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {koleksi.map((item, index) => (
                        <tr
                            key={item.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-6">{index + 1}</td>
                            <td className="py-4 px-6">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative border border-gray-200">
                                    <Image
                                        src={
                                            item.gambar ||
                                            "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80"
                                        }
                                        alt={item.nama || "koleksi"}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            </td>
                            <td className="py-4 px-6 font-medium text-gray-900">
                                {item.nama}
                            </td>
                            <td className="py-4 px-6 text-gray-600 truncate max-w-xs">
                                {item.deskripsi}
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => onView(item)}
                                        className="bg-[#4a8a5b] text-white p-2 rounded-lg hover:bg-opacity-80 transition shadow-sm">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(item)}
                                        className="bg-[#f0ad4e] text-white p-2 rounded-lg hover:bg-opacity-80 transition shadow-sm">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="bg-[#d9534f] text-white p-2 rounded-lg hover:bg-opacity-80 transition shadow-sm">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {koleksi.length === 0 && (
                        <tr>
                            <td
                                colSpan={5}
                                className="py-12 text-center text-gray-500 font-medium">
                                Tidak ada data koleksi yang ditemukan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
