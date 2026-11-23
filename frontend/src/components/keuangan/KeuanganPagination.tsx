"use client";
import Pagination, { type PaginationProps } from "@/components/ui/Pagination";

// Pembungkus tipis: navigasi halaman kini dipakai bersama (components/ui/Pagination.tsx).
export default function KeuanganPagination(props: PaginationProps) {
    return <Pagination {...props} satuan="transaksi" />;
}
