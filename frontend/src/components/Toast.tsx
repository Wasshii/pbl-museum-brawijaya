"use client";

import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

// Definisi tipe data Props untuk komponen Toast
export interface ToastProps {
    message: string;
    type?: "success" | "error" | "info" | "warning";
    onClose: () => void;
    duration?: number;
}

export default function Toast({
    message,
    type = "info",
    onClose,
    duration = 3000,
}: ToastProps) {
    // Timer otomatis menutup toast sesuai durasi
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    // Penentuan style dan ikon berdasarkan tipe toast
    const getToastStyle = () => {
        switch (type) {
            case "success":
                return {
                    container:
                        "bg-green-500/10 border-green-500 text-green-400",
                    icon: (
                        <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                    ),
                };
            case "error":
                return {
                    container: "bg-red-500/10 border-red-500 text-red-400",
                    icon: (
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    ),
                };
            case "warning":
                return {
                    container:
                        "bg-yellow-500/10 border-yellow-500 text-yellow-400",
                    icon: (
                        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
                    ),
                };
            case "info":
            default:
                return {
                    container: "bg-blue-500/10 border-blue-500 text-blue-400",
                    icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
                };
        }
    };

    const style = getToastStyle();

    return (
        <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-2 max-w-md ${style.container}`}>
            {style.icon}
            <span className="text-sm font-medium leading-relaxed">
                {message}
            </span>
            <button
                onClick={onClose}
                type="button"
                className="ml-auto p-1 text-gray-400 hover:text-white transition-colors rounded-md outline-none"
                aria-label="Tutup notifikasi">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
