"use client";

import { Trash2 } from "lucide-react";
import Modal from "@/components/ui/BaseModal";

interface Props {
    open: boolean;
    itemName: string;
    title?: string;
    itemLabel?: string; // kata benda, contoh: "akun" atau "koleksi"
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDeleteDialog ({
    open,
    itemName,
    title = "Hapus Akun?",
    itemLabel = "akun",
    onConfirm,
    onCancel,
}: Props) {
    return (
        <Modal open={open} onClose={onCancel} className="max-w-sm text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-6">
                Apakah Anda benar-benar ingin menghapus {itemLabel}{" "}
                <b>{itemName}</b>? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex gap-3 justify-center">
                <button
                    onClick={onCancel}
                    className="flex-1 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer text-sm">
                    Tidak
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-md cursor-pointer text-sm border-0">
                    Ya, Hapus
                </button>
            </div>
        </Modal>
    );
}
