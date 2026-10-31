"use client";
import { Trash2 } from "lucide-react";
import SejarahModalShell from "@/components/sejarah/SejarahModalShell";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
}

export default function SejarahDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    itemName = "koleksi ini",
}: Props) {
    return (
        <SejarahModalShell
            isOpen={isOpen}
            onClose={onClose}
            overlayClassName="bg-black/50"
            panelClassName="max-w-[400px] bg-[#1f1f1f] rounded-[24px] p-8 shadow-2xl text-center border border-white/10">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-white text-[18px] font-bold mb-2">
                Hapus Koleksi?
            </h3>
            <p className="text-gray-400 text-[14px] mb-8 font-medium">
                Apakah Anda benar-benar ingin menghapus{" "}
                <span className="text-white font-bold">{itemName}</span>?
            </p>
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors cursor-pointer text-[14px] border-0">
                    Batal
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-[14px] border-0">
                    Konfirmasi
                </button>
            </div>
        </SejarahModalShell>
    );
}
