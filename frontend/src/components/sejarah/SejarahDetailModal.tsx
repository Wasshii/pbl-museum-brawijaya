"use client";
import Modal from "@/components/ui/Modal";
import Image from "next/image";
import type { Koleksi } from "@/types/koleksi"; // TAMBAHKAN IMPORT INI

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: Koleksi | null; // REVISI: any diganti dengan Koleksi | null
}

export default function SejarahDetailModal({ isOpen, onClose, item }: Props) {
    if (!item) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detail Koleksi Sejarah">
            <div className="space-y-6">
                <div className="w-full h-48 relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                    <Image
                        src={item.gambar || "/images/placeholder.jpg"}
                        // REVISI: item.nama_koleksi diubah menjadi item.nama (menyesuaikan tabel)
                        alt={item.nama || "Gambar Koleksi"}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Nama Koleksi
                    </span>
                    <span className="font-medium text-gray-900 text-lg">
                        {/* REVISI: item.nama_koleksi diubah menjadi item.nama */}
                        {item.nama}
                    </span>
                </div>

                <div className="flex flex-col gap-1.5 pb-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Deskripsi Lengkap
                    </span>
                    <span className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                        {item.deskripsi}
                    </span>
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-white bg-[#6C9E78] rounded-xl hover:bg-[#5a8664] transition-colors font-medium">
                        Tutup Detail
                    </button>
                </div>
            </div>
        </Modal>
    );
}
