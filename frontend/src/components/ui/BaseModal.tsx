"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string; // lebar / perataan kartu, contoh: "max-w-md" atau "max-w-sm text-center"
    showCloseButton?: boolean; // tombol X di pojok kanan atas
}

// Kerangka semua modal: lapisan gelap, klik di luar untuk menutup, kartu putih.
// Class-nya disalin dari modal lama di user/page.tsx.
export default function BaseModal({
    open,
    onClose,
    children,
    className = "max-w-md",
    showCloseButton = false,
}: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="absolute inset-0 cursor-pointer"
                onClick={onClose}
            />
            <div
                className={`bg-white w-full rounded-[24px] p-6 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 ${className}`}>
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-100 border-0 bg-transparent">
                        <X className="w-5 h-5" />
                    </button>
                )}
                {children}
            </div>
        </div>
    );
}
