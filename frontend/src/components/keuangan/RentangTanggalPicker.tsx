"use client";
import { useCallback, useRef, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { RentangTanggal } from "@/hooks/useKeuangan";
import { formatTanggal } from "@/lib/format";

interface Props {
    value: RentangTanggal;
    onChange: (rentang: RentangTanggal) => void;
}

const INPUT =
    "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-black font-semibold text-[13px] cursor-pointer";

export default function RentangTanggalPicker({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    // Pilihan sementara: baru berlaku setelah klik Konfirmasi
    const [draft, setDraft] = useState<RentangTanggal>(value);
    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(
        ref,
        useCallback(() => setOpen(false), []),
    );

    const toggle = () => {
        if (!open) setDraft(value);
        setOpen(!open);
    };

    const konfirmasi = () => {
        onChange(draft);
        setOpen(false);
    };

    const reset = () => {
        const kosong = { dari: "", sampai: "" };
        setDraft(kosong);
        onChange(kosong);
        setOpen(false);
    };

    const label =
        value.dari && value.sampai
            ? `${formatTanggal(value.dari)} - ${formatTanggal(value.sampai)}`
            : value.dari
              ? `Dari: ${formatTanggal(value.dari)}`
              : value.sampai
                ? `Sampai: ${formatTanggal(value.sampai)}`
                : "Pilih Rentang Tanggal";

    return (
        <div className="relative flex-1 sm:flex-initial" ref={ref}>
            <button
                onClick={toggle}
                className="w-full flex items-center justify-between gap-3 bg-[#222222] text-white px-5 py-3 rounded-full hover:bg-black transition-colors cursor-pointer border-0 shadow-sm">
                <Calendar className="w-4 h-4 text-white/80 shrink-0" />
                <span className="text-[13px] font-bold min-w-[140px] text-left truncate">
                    {label}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-white/80 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute top-full right-0 mt-2 w-[320px] bg-white rounded-[24px] shadow-2xl border border-gray-100 p-6 z-30">
                    <h4 className="text-black font-bold text-[16px] mb-4">
                        Pilih Rentang Tanggal
                    </h4>
                    <div className="flex flex-col gap-4 mb-6">
                        <div>
                            <label className="block text-[12px] font-semibold text-gray-500 mb-1">
                                Mulai Dari
                            </label>
                            <input
                                type="date"
                                value={draft.dari}
                                max={draft.sampai || undefined}
                                onChange={(e) =>
                                    setDraft({ ...draft, dari: e.target.value })
                                }
                                className={INPUT}
                            />
                        </div>
                        <div>
                            <label className="block text-[12px] font-semibold text-gray-500 mb-1">
                                Sampai Dengan
                            </label>
                            <input
                                type="date"
                                value={draft.sampai}
                                min={draft.dari || undefined}
                                onChange={(e) =>
                                    setDraft({
                                        ...draft,
                                        sampai: e.target.value,
                                    })
                                }
                                className={INPUT}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={reset}
                            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-xl text-[13px] transition-colors cursor-pointer border-0">
                            Reset
                        </button>
                        <button
                            onClick={konfirmasi}
                            className="flex-1 py-2.5 bg-[#222] hover:bg-black text-white font-bold rounded-xl text-[13px] transition-colors cursor-pointer border-0">
                            Konfirmasi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
