"use client";

import { Search, X } from "lucide-react";

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

export default function SearchInput({ value, onChange, placeholder }: Props) {
    return (
        <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-[#222222] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder-gray-400 text-[14px] font-semibold"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white cursor-pointer bg-transparent border-none">
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
