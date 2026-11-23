"use client";
import { useMemo, useState } from "react";
import type { PaginationProps } from "@/components/ui/Pagination";

// Jumlah baris per halaman tabel (sama dengan tabel Keuangan)
export const BARIS_PER_HALAMAN = 10;

// Membagi daftar (yang sudah dicari / difilter) menjadi halaman berisi maksimal 10 baris.
// Pagination dilakukan di sisi klien karena backend mengirim semua data sekaligus.
// Pemanggil memanggil `kePertama()` setiap kali pencarian / filter berubah.
export function usePagination<T>(
    items: T[],
    perHalaman: number = BARIS_PER_HALAMAN,
) {
    const [halaman, setHalaman] = useState(1);

    const totalData = items.length;
    const totalHalaman = Math.max(1, Math.ceil(totalData / perHalaman));
    // Data berkurang (mis. baris terakhir dihapus) -> halaman aktif ikut mundur
    const halamanAktif = Math.min(halaman, totalHalaman);

    const dataHalaman = useMemo(
        () =>
            items.slice(
                (halamanAktif - 1) * perHalaman,
                halamanAktif * perHalaman,
            ),
        [items, halamanAktif, perHalaman],
    );

    const pagination: PaginationProps = {
        halaman: halamanAktif,
        totalHalaman,
        totalData,
        perHalaman,
        onChange: setHalaman,
    };

    return { dataHalaman, pagination, kePertama: () => setHalaman(1) };
}
