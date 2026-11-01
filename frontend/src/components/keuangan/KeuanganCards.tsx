"use client";
import { CheckSquare, ExternalLink } from "lucide-react";

interface Props {
    pemasukan: number;
    pengeluaran: number;
}

// Contoh: Rp. 580.000
const rp = (angka: number) => `Rp. ${angka.toLocaleString("id-ID")}`;

function Kartu({
    judul,
    nilai,
    ikon,
}: {
    judul: string;
    nilai: number;
    ikon: React.ReactNode;
}) {
    return (
        <div className="bg-[#222222] rounded-[24px] p-6 flex flex-col justify-between min-h-[160px] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-white font-bold text-[18px]">{judul}</h3>
                    <p className="text-[#a3a3a3] text-[13px] mt-1 font-medium">
                        Total Keseluruhan
                    </p>
                </div>
                <div className="p-2 bg-white/10 rounded-xl">{ikon}</div>
            </div>
            <p className="text-white font-bold text-[24px] mt-6 tracking-tight">
                {rp(nilai)}
            </p>
        </div>
    );
}

// Dua kartu ini menjadi anak langsung dari grid di page.tsx.
// Isinya total keseluruhan dari database (hanya transaksi sukses), tidak ikut filter.
export default function KeuanganCards({ pemasukan, pengeluaran }: Props) {
    return (
        <>
            <Kartu
                judul="Pemasukan"
                nilai={pemasukan}
                ikon={<CheckSquare className="text-[#00ff1a] w-5 h-5 stroke-[2]" />}
            />
            <Kartu
                judul="Pengeluaran"
                nilai={pengeluaran}
                ikon={<ExternalLink className="text-[#ff4046] w-5 h-5 stroke-[2]" />}
            />
        </>
    );
}