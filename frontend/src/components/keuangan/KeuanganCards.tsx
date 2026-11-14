"use client";
import { CheckSquare, ExternalLink } from "lucide-react";
import type { PeriodeKeuangan } from "@/types/keuangan";

interface Props {
    pemasukan: number;
    pengeluaran: number;
    periode: PeriodeKeuangan;
}

// Contoh: Rp. 580.000
const rp = (angka: number) => `Rp. ${angka.toLocaleString("id-ID")}`;

// Judul kartu mengikuti menu periode
const judul = (dasar: "Pemasukan" | "Pengeluaran", periode: PeriodeKeuangan) =>
    periode === "hari"
        ? `${dasar} Hari Ini`
        : periode === "bulan"
          ? `${dasar} Bulan Ini`
          : `Total ${dasar}`;

function Kartu({
    judul,
    badge,
    warnaBadge,
    nilai,
    ikon,
}: {
    judul: string;
    badge: string;
    warnaBadge: string;
    nilai: number;
    ikon: React.ReactNode;
}) {
    return (
        <div className="bg-[#222222] rounded-[24px] p-6 flex flex-col justify-between min-h-[145px] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-white font-bold text-[18px]">
                        {judul}
                    </h3>
                    <span
                        className={`inline-block bg-white/10 ${warnaBadge} text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-1.5`}>
                        {badge}
                    </span>
                </div>
                <div className="p-2.5 bg-white/10 rounded-xl">{ikon}</div>
            </div>
            <p className="text-white font-bold text-[28px] mt-4 tracking-tight">
                {rp(nilai)}
            </p>
        </div>
    );
}

// Dua kartu ini menjadi anak langsung dari grid di page.tsx.
// Angkanya mengikuti menu periode (hanya transaksi sukses), tidak ikut pencarian
// Id Trx maupun rentang tanggal kustom.
export default function KeuanganCards({
    pemasukan,
    pengeluaran,
    periode,
}: Props) {
    return (
        <>
            <Kartu
                judul={judul("Pemasukan", periode)}
                badge="Arus Kas Masuk"
                warnaBadge="text-emerald-400"
                nilai={pemasukan}
                ikon={<CheckSquare className="text-[#00ff1a] w-5 h-5 stroke-[2.5]" />}
            />
            <Kartu
                judul={judul("Pengeluaran", periode)}
                badge="Arus Kas Keluar"
                warnaBadge="text-rose-400"
                nilai={pengeluaran}
                ikon={<ExternalLink className="text-[#ff4046] w-5 h-5 stroke-[2.5]" />}
            />
        </>
    );
}
