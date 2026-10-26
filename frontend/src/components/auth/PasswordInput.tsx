"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import FieldError from "@/components/ui/FieldError";

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    error?: string;
}

export default function PasswordInput({
    value,
    onChange,
    placeholder,
    error,
}: Props) {
    const [show, setShow] = useState(false);
    return (
        <div>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white px-2 py-3 outline-none transition-colors"
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-2 top-3 text-gray-400 hover:text-white">
                    {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            <FieldError message={error} />
        </div>
    );
}
