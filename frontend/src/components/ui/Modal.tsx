"use client";
import type { ReactNode } from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
}

export default function Modal({
    open,
    onClose,
    children,
    className = "max-w-md",
}: ModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose} />
            <div
                className={`relative w-full rounded-[24px] shadow-2xl ${className}`}>
                {children}
            </div>
        </div>
    );
}
