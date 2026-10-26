"use client";
import { Search, X } from "lucide-react";

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchInput({
    value,
    onChange,
    placeholder = "Cari...",
}: Props) {
    return (
        <div className="relative w-full max-w-sm">
            {/* Ikon Kaca Pembesar di kiri */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
            </div>

            {/* Kotak Input */}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent border border-gray-600 focus:border-white text-white rounded-xl pl-10 pr-10 py-2 outline-none transition-colors"
            />

            {/* Tombol X di kanan (Hanya muncul jika kotak teks tidak kosong) */}
            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors">
                    <X size={18} />
                </button>
            )}
        </div>
    );
}
