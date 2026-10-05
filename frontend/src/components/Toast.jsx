"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timerShow = setTimeout(() => setIsVisible(true), 50);
        const timerHide = setTimeout(() => setIsVisible(false), 4500); // Tampil selama 5 detik
        const timerClose = setTimeout(() => {
            if (onClose) onClose();
        }, 5000);

        return () => {
            clearTimeout(timerShow);
            clearTimeout(timerHide);
            clearTimeout(timerClose);
        };
    }, [onClose]);

    return (
        <div
            className={`fixed top-6 right-8 z-50 flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl transition-transform duration-500 ease-in-out transform ${
                isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-[150%] opacity-0"
            } ${type === "success" ? "bg-white text-black" : "bg-red-500 text-white"}`}>
            <span className="text-sm font-medium">{message}</span>
            {type === "success" ? (
                <CheckCircle2
                    className="text-green-500 w-5 h-5 flex-shrink-0"
                    fill="#22c55e"
                    stroke="white"
                />
            ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
        </div>
    );
}
