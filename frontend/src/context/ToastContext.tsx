// src/context/ToastContext.tsx
"use client"; // Wajib ditambahkan untuk Next.js App Router

import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useCallback,
} from "react";
import type { ToastOptions, ToastType } from "@/types/toast";
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Edit3,
    Info,
    Plus,
    Trash2,
    X,
    type LucideIcon,
} from "lucide-react";

interface ToastItem extends ToastOptions {
    id: number;
    isExiting: boolean;
}

interface ToastContextValue {
    notify: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue>({
    notify: () => {},
});

export const useToast = () => useContext(ToastContext);

const TOAST_STYLE: Record<
    ToastType,
    { icon: LucideIcon; iconColor: string; badge: string; bar: string }
> = {
    create: {
        icon: Plus,
        iconColor: "text-emerald-400",
        badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
        bar: "bg-emerald-500",
    },
    edit: {
        icon: Edit3,
        iconColor: "text-blue-400",
        badge: "bg-blue-500/15 border-blue-500/30 text-blue-400",
        bar: "bg-blue-500",
    },
    delete: {
        icon: Trash2,
        iconColor: "text-rose-400",
        badge: "bg-rose-500/15 border-rose-500/30 text-rose-400",
        bar: "bg-rose-500",
    },
    success: {
        icon: CheckCircle2,
        iconColor: "text-emerald-400",
        badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
        bar: "bg-emerald-500",
    },
    error: {
        icon: AlertCircle,
        iconColor: "text-red-400",
        badge: "bg-red-500/15 border-red-500/30 text-red-400",
        bar: "bg-red-500",
    },
    warning: {
        icon: AlertTriangle,
        iconColor: "text-yellow-400",
        badge: "bg-yellow-500/15 border-yellow-500/30 text-yellow-400",
        bar: "bg-yellow-500",
    },
    info: {
        icon: Info,
        iconColor: "text-blue-400",
        badge: "bg-blue-500/15 border-blue-500/30 text-blue-400",
        bar: "bg-blue-500",
    },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = useState<ToastItem | null>(null);
    const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
    const removeTimerRef = useRef<NodeJS.Timeout | null>(null);

    const closeToast = useCallback(() => {
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
        if (removeTimerRef.current) clearTimeout(removeTimerRef.current);

        setToast((prev) => (prev ? { ...prev, isExiting: true } : null));

        removeTimerRef.current = setTimeout(() => {
            setToast(null);
        }, 360);
    }, []);

    const notify = useCallback(
        ({ type = "success", title, message }: ToastOptions) => {
            if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
            if (removeTimerRef.current) clearTimeout(removeTimerRef.current);

            const newToast: ToastItem = {
                id: Date.now(),
                type,
                title,
                message,
                isExiting: false,
            };

            setToast(newToast);

            // Bertahan selama 3 detik di layar, kemudian mulai slide keluar ke kanan
            exitTimerRef.current = setTimeout(() => {
                setToast((prev) =>
                    prev ? { ...prev, isExiting: true } : null,
                );
                removeTimerRef.current = setTimeout(() => {
                    setToast(null);
                }, 360);
            }, 3000);
        },
        [],
    );

    const currentStyle = toast ? TOAST_STYLE[toast.type || "success"] : null;
    const IconComponent = currentStyle ? currentStyle.icon : CheckCircle2;

    return (
        <ToastContext.Provider value={{ notify }}>
            {children}
            {toast && currentStyle && (
                <div
                    key={toast.id}
                    className={`fixed top-6 right-6 z-[9999] w-full max-w-[380px] bg-[#1a1a1a] text-white rounded-[20px] shadow-2xl border border-white/10 overflow-hidden select-none pointer-events-auto ${
                        toast.isExiting ? "toast-slide-out" : "toast-slide-in"
                    }`}
                    style={{ willChange: "transform, opacity" }}>
                    <div className="p-4 flex items-start gap-3.5">
                        <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${currentStyle.badge}`}>
                            <IconComponent
                                className={`w-5 h-5 stroke-[2.5] ${currentStyle.iconColor}`}
                            />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                            <h4 className="text-[14px] font-bold text-white tracking-tight leading-snug">
                                {toast.title}
                            </h4>
                            <p className="text-[12.5px] text-gray-300 mt-1 leading-relaxed">
                                {toast.message}
                            </p>
                        </div>
                        <button
                            onClick={closeToast}
                            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border-0 bg-transparent shrink-0"
                            title="Tutup Notifikasi">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    {!toast.isExiting && (
                        <div className="w-full bg-white/10 h-1 overflow-hidden">
                            <div
                                className={`h-full toast-progress-bar ${currentStyle.bar}`}
                            />
                        </div>
                    )}
                </div>
            )}
        </ToastContext.Provider>
    );
}
