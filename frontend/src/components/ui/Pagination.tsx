"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Navigasi halaman untuk semua tabel (Keuangan, User, Feedback).
export interface PaginationProps {
    halaman: number; // halaman aktif (mulai dari 1)
    totalHalaman: number;
    totalData: number; // jumlah seluruh baris setelah difilter
    perHalaman: number;
    onChange: (halaman: number) => void;
}

interface Props extends PaginationProps {
    satuan: string; // kata di teks kiri bawah: "transaksi", "user", "feedback"
}

type ItemHalaman = number | "gap-awal" | "gap-akhir";

// Contoh total 12, aktif 6 -> 1 ... 5 6 7 ... 12
// Total <= 7 -> tampil semua: 1 2 3 4 5 6 7
const buatDaftarHalaman = (aktif: number, total: number): ItemHalaman[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const hasil: ItemHalaman[] = [1];
    const awal = Math.max(2, aktif - 1);
    const akhir = Math.min(total - 1, aktif + 1);

    if (awal > 2) hasil.push("gap-awal");
    for (let i = awal; i <= akhir; i++) hasil.push(i);
    if (akhir < total - 1) hasil.push("gap-akhir");
    hasil.push(total);

    return hasil;
};

const TOMBOL_NAV =
    "flex items-center gap-1 h-9 px-3 rounded-full text-[13px] font-bold border-0 transition-colors cursor-pointer bg-gray-100 text-black hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-100";

export default function Pagination({
    halaman,
    totalHalaman,
    totalData,
    perHalaman,
    onChange,
    satuan,
}: Props) {
    if (totalData === 0) return null;

    const dari = (halaman - 1) * perHalaman + 1;
    const sampai = Math.min(halaman * perHalaman, totalData);

    return (
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500 font-medium">
                Menampilkan {dari}-{sampai} dari {totalData} {satuan}
            </span>

            {totalHalaman > 1 && (
                <nav
                    aria-label="Navigasi halaman"
                    className="flex items-center gap-1.5 flex-wrap justify-center">
                    <button
                        type="button"
                        onClick={() => onChange(halaman - 1)}
                        disabled={halaman <= 1}
                        className={TOMBOL_NAV}>
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Sebelumnya</span>
                    </button>

                    {buatDaftarHalaman(halaman, totalHalaman).map((item) =>
                        typeof item === "number" ? (
                            <button
                                key={item}
                                type="button"
                                onClick={() => onChange(item)}
                                aria-current={
                                    item === halaman ? "page" : undefined
                                }
                                className={`w-9 h-9 rounded-full text-[13px] font-bold border-0 transition-colors cursor-pointer ${
                                    item === halaman
                                        ? "bg-[#222222] text-white"
                                        : "bg-gray-100 text-black hover:bg-gray-200"
                                }`}>
                                {item}
                            </button>
                        ) : (
                            <span
                                key={item}
                                className="w-6 text-center text-gray-400 font-bold select-none">
                                …
                            </span>
                        ),
                    )}

                    <button
                        type="button"
                        onClick={() => onChange(halaman + 1)}
                        disabled={halaman >= totalHalaman}
                        className={TOMBOL_NAV}>
                        <span className="hidden sm:inline">Berikutnya</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </nav>
            )}
        </div>
    );
}
