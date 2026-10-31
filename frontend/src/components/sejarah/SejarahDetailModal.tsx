"use client";
import Image from "next/image";
import { X } from "lucide-react";
import SejarahModalShell from "@/components/sejarah/SejarahModalShell";
import { resolveImageUrl } from "@/lib/image";
import type { Koleksi } from "@/types/koleksi";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: Koleksi | null;
}

export default function SejarahDetailModal({ isOpen, onClose, item }: Props) {
    if (!item) return null;

    return (
        <SejarahModalShell
            isOpen={isOpen}
            onClose={onClose}
            panelClassName="max-w-[450px] bg-white rounded-[24px] p-6 shadow-xl">
            <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="absolute top-4 right-4 z-10 bg-white/80 rounded-full p-1 cursor-pointer border-0">
                <X className="w-6 h-6 text-black" />
            </button>

            <div className="relative w-full h-[250px] mb-6 rounded-xl overflow-hidden bg-gray-100">
                <Image
                    src={resolveImageUrl(item.gambar)}
                    alt={item.nama || "Gambar Koleksi"}
                    fill
                    unoptimized
                    className="object-cover"
                />
            </div>

            <h2 className="text-[24px] font-bold text-black mb-1">
                {item.nama}
            </h2>
            <span className="inline-block bg-gray-100 text-gray-700 text-[12px] font-bold px-3 py-1 rounded-full mb-4">
                {item.jenis}
            </span>
            <p className="text-[14px] text-gray-600 font-medium leading-relaxed mb-4 whitespace-pre-wrap">
                {item.deskripsi}
            </p>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase">
                        Token
                    </p>
                    <p className="font-bold text-black text-[14px]">
                        {item.token}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[11px] text-gray-400 font-bold uppercase">
                        Update Terakhir
                    </p>
                    <p className="font-bold text-black text-[14px]">
                        {item.tanggal_update}
                    </p>
                </div>
            </div>
        </SejarahModalShell>
    );
}
