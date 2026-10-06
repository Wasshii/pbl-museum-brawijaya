"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/context/ToastContext";
import {
    ExternalLink,
    CheckSquare,
    Upload,
    Download,
    Calendar,
    Search,
    User,
    ArrowRight,
    X,
    ChevronDown,
    ArrowLeft,
} from "lucide-react";

export default function KeuanganPage() {
    const { notify } = useToast();

    // URL Search Params fallback
    const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
        if (typeof window !== "undefined") {
            return new URLSearchParams(window.location.search);
        }
        return new URLSearchParams();
    });

    useEffect(() => {
        const handlePopState = () => {
            setSearchParams(new URLSearchParams(window.location.search));
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const tabQuery = searchParams.get("tab");

    const [activeTab, setActiveTab] = useState<"masuk" | "keluar">("masuk");
    const [searchIdTrx, setSearchIdTrx] = useState("");

    // State untuk filter rentang tanggal
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [appliedStartDate, setAppliedStartDate] = useState("");
    const [appliedEndDate, setAppliedEndDate] = useState("");
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const datePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target as Node)
            ) {
                setIsDatePickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (tabQuery === "keluar") {
            setActiveTab("keluar");
        } else if (tabQuery === "masuk") {
            setActiveTab("masuk");
        }
    }, [tabQuery]);

    const [totalPemasukan, setTotalPemasukan] = useState<number>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("museum_pemasukan");
            return saved ? parseInt(saved) : 680000;
        }
        return 680000;
    });

    const [totalPengeluaran, setTotalPengeluaran] = useState<number>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("museum_pengeluaran");
            return saved ? parseInt(saved) : 180000;
        }
        return 180000;
    });

    // --- DATA UANG MASUK (DENGAN NO TLP & QRIS) ---
    const [dataMasuk, setDataMasuk] = useState<any[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("museum_data_masuk");
            if (saved) return JSON.parse(saved);
        }
        return [
            {
                id: 1,
                nama: "Keyla Hezizah",
                tiket: 2,
                nominal: "20.000",
                jenis: "Mandiri",
                status: "Sukses",
                idTrx: "0556277831",
                tanggal: "2026-07-10",
                noTlp: "081234567890",
                jenisPembayaran: "QRIS",
            },
            {
                id: 2,
                nama: "Bella Kujia Lewa",
                tiket: 1,
                nominal: "60.000",
                jenis: "Guide",
                status: "Sukses",
                idTrx: "7728177812",
                tanggal: "2026-07-08",
                noTlp: "085678901234",
                jenisPembayaran: "QRIS",
            },
            {
                id: 3,
                nama: "Agus Harmanto",
                tiket: 1,
                nominal: "10.000",
                jenis: "Mandiri",
                status: "Sukses",
                idTrx: "0091827663",
                tanggal: "2026-07-05",
                noTlp: "082345678901",
                jenisPembayaran: "QRIS",
            },
            {
                id: 4,
                nama: "Venka Kuliara",
                tiket: 3,
                nominal: "30.000",
                jenis: "Mandiri",
                status: "Sukses",
                idTrx: "9100927774",
                tanggal: "2026-07-02",
                noTlp: "089876543210",
                jenisPembayaran: "QRIS",
            },
            {
                id: 5,
                nama: "Jojo Kermianto",
                tiket: 1,
                nominal: "10.000",
                jenis: "Mandiri",
                status: "Sukses",
                idTrx: "3332877195",
                tanggal: "2026-06-28",
                noTlp: "081112223334",
                jenisPembayaran: "QRIS",
            },
            {
                id: 6,
                nama: "Siti Aminah",
                tiket: 2,
                nominal: "20.000",
                jenis: "Mandiri",
                status: "Sukses",
                idTrx: "3332112233",
                tanggal: "2026-06-25",
                noTlp: "087788990011",
                jenisPembayaran: "QRIS",
            },
            {
                id: 7,
                nama: "Dimas Anggara",
                tiket: 4,
                nominal: "40.000",
                jenis: "Mandiri",
                status: "Sukses",
                idTrx: "1198273645",
                tanggal: "2026-06-20",
                noTlp: "081399887766",
                jenisPembayaran: "QRIS",
            },
            {
                id: 8,
                nama: "Rizki Nurhadi",
                tiket: 2,
                nominal: "120.000",
                jenis: "Guide",
                status: "Sukses",
                idTrx: "8829102934",
                tanggal: "2026-06-18",
                noTlp: "085211223344",
                jenisPembayaran: "QRIS",
            },
            {
                id: 9,
                nama: "Farah Diba",
                tiket: 1,
                nominal: "10.000",
                jenis: "Mandiri",
                status: "Sukses",
                idTrx: "7765123984",
                tanggal: "2026-06-15",
                noTlp: "081299881122",
                jenisPembayaran: "QRIS",
            },
            {
                id: 10,
                nama: "Hendro Saputro",
                tiket: 5,
                nominal: "50.000",
                jenis: "Mandiri",
                status: "Sukses",
                idTrx: "4429182371",
                tanggal: "2026-06-10",
                noTlp: "087811992233",
                jenisPembayaran: "QRIS",
            },
            {
                id: 11,
                nama: "Nadia Utami",
                tiket: 2,
                nominal: "120.000",
                jenis: "Guide",
                status: "Sukses",
                idTrx: "9910283746",
                tanggal: "2026-06-05",
                noTlp: "089612349876",
                jenisPembayaran: "QRIS",
            },
            {
                id: 12,
                nama: "Bambang Pamungkas",
                tiket: 3,
                nominal: "30.000",
                jenis: "Mandiri",
                status: "Sukses",
                idTrx: "6655443322",
                tanggal: "2026-06-01",
                noTlp: "082199887711",
                jenisPembayaran: "QRIS",
            },
            {
                id: 13,
                nama: "Alya Putri",
                tiket: 1,
                nominal: "60.000",
                jenis: "Guide",
                status: "Sukses",
                idTrx: "5544332211",
                tanggal: "2026-05-28",
                noTlp: "085711223399",
                jenisPembayaran: "QRIS",
            },
            {
                id: 14,
                nama: "Eko Prasetyo",
                tiket: 2,
                nominal: "20.000",
                jenis: "Mandiri",
                status: "Sukses",
                idTrx: "2233445566",
                tanggal: "2026-05-25",
                noTlp: "081912345678",
                jenisPembayaran: "QRIS",
            },
        ];
    });

    // --- DATA UANG KELUAR ---
    const [dataKeluar, setDataKeluar] = useState<any[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("museum_data_keluar");
            if (saved) return JSON.parse(saved);
        }
        return [
            {
                id: 1,
                namaAdmin: "Vidi Kurniawan",
                nominal: "- 50.000",
                jenisPencairan: "Bank",
                noRekening: "109823471928",
                status: "Sukses",
                idTrx: "9988811891",
                tanggal: "2026-07-10",
            },
            {
                id: 2,
                namaAdmin: "Bella Aji Zehira",
                nominal: "- 30.000",
                jenisPencairan: "Bank",
                noRekening: "882736192039",
                status: "Sukses",
                idTrx: "0019987162",
                tanggal: "2026-07-09",
            },
            {
                id: 3,
                namaAdmin: "Gegen Huriawan",
                nominal: "- 20.000",
                jenisPencairan: "Bank",
                noRekening: "552417283910",
                status: "Sukses",
                idTrx: "4463728173",
                tanggal: "2026-07-01",
            },
            {
                id: 4,
                namaAdmin: "Alexandro Vosca",
                nominal: "- 25.000",
                jenisPencairan: "E-Wallet",
                noRekening: "081299887766",
                status: "Sukses",
                idTrx: "7766554433",
                tanggal: "2026-06-25",
            },
            {
                id: 5,
                namaAdmin: "Vidi Kurniawan",
                nominal: "- 15.000",
                jenisPencairan: "Bank",
                noRekening: "112233445566",
                status: "Sukses",
                idTrx: "6655449988",
                tanggal: "2026-06-20",
            },
            {
                id: 6,
                namaAdmin: "Bella Aji Zehira",
                nominal: "- 20.000",
                jenisPencairan: "Bank",
                noRekening: "882736192039",
                status: "Sukses",
                idTrx: "3322119900",
                tanggal: "2026-06-15",
            },
            {
                id: 7,
                namaAdmin: "Gegen Huriawan",
                nominal: "- 10.000",
                jenisPencairan: "E-Wallet",
                noRekening: "085811223344",
                status: "Sukses",
                idTrx: "8899001122",
                tanggal: "2026-06-10",
            },
            {
                id: 8,
                namaAdmin: "Alexandro Vosca",
                nominal: "- 10.000",
                jenisPencairan: "Bank",
                noRekening: "081299887766",
                status: "Sukses",
                idTrx: "9911223344",
                tanggal: "2026-06-02",
            },
        ];
    });

    // State untuk Modal Form
    const [isPencairanOpen, setIsPencairanOpen] = useState(false);
    const [isIsiSaldoOpen, setIsIsiSaldoOpen] = useState(false);

    // State untuk Modal Detail
    const [selectedDetailMasuk, setSelectedDetailMasuk] = useState<any | null>(
        null,
    );
    const [selectedDetailKeluar, setSelectedDetailKeluar] = useState<
        any | null
    >(null);

    // State Form Pencairan
    const [formNominal, setFormNominal] = useState("");
    const [formRekening, setFormRekening] = useState("");
    const [formJenis, setFormJenis] = useState("Bank");

    // State Form Isi Saldo
    const [formIsiNama, setFormIsiNama] = useState("");
    const [formIsiTiket, setFormIsiTiket] = useState("");
    const [formIsiJenisTiket, setFormIsiJenisTiket] = useState("Mandiri");
    const [formIsiNominal, setFormIsiNominal] = useState("");
    const [formIsiNoTlp, setFormIsiNoTlp] = useState("");

    useEffect(() => {
        localStorage.setItem("museum_pemasukan", totalPemasukan.toString());
        localStorage.setItem("museum_pengeluaran", totalPengeluaran.toString());
        localStorage.setItem("museum_data_keluar", JSON.stringify(dataKeluar));
        localStorage.setItem("museum_data_masuk", JSON.stringify(dataMasuk));
    }, [totalPemasukan, totalPengeluaran, dataKeluar, dataMasuk]);

    // --- LOGIKA FILTER ---
    const filterData = (data: any[]) => {
        return data.filter((item) => {
            const matchId = item.idTrx
                .toLowerCase()
                .includes(searchIdTrx.toLowerCase());
            let matchDate = true;
            if (appliedStartDate && appliedEndDate) {
                matchDate =
                    item.tanggal >= appliedStartDate &&
                    item.tanggal <= appliedEndDate;
            } else if (appliedStartDate) {
                matchDate = item.tanggal >= appliedStartDate;
            } else if (appliedEndDate) {
                matchDate = item.tanggal <= appliedEndDate;
            }
            return matchId && matchDate;
        });
    };

    const filteredDataMasuk = filterData(dataMasuk);
    const filteredDataKeluar = filterData(dataKeluar);

    const handleConfirmDate = () => {
        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
        setIsDatePickerOpen(false);
    };

    const handleResetDate = () => {
        setStartDate("");
        setEndDate("");
        setAppliedStartDate("");
        setAppliedEndDate("");
        setIsDatePickerOpen(false);
    };

    // --- SUBMIT PENCAIRAN ---
    const handlePencairanSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numNominal = parseInt(formNominal.replace(/\./g, ""));
        if (!numNominal || numNominal <= 0)
            return alert("Masukkan nominal yang valid!");
        if (numNominal > totalPemasukan)
            return alert("Saldo Pemasukan tidak mencukupi!");

        setTotalPemasukan(totalPemasukan - numNominal);
        setTotalPengeluaran(totalPengeluaran + numNominal);

        const randomTrx = Math.floor(
            1000000000 + Math.random() * 9000000000,
        ).toString();
        const cleanRekening = formRekening.replace(/\D/g, "");
        const newData = {
            id: Date.now(),
            namaAdmin: "Alexandro Vosca",
            nominal: `- ${numNominal.toLocaleString("id-ID")}`,
            jenisPencairan: formJenis,
            noRekening: cleanRekening,
            status: "Sukses",
            idTrx: randomTrx,
            tanggal: new Date().toISOString().split("T")[0],
        };

        const nominalPencairan = formNominal;
        setDataKeluar([newData, ...dataKeluar]);
        setIsPencairanOpen(false);
        setFormNominal("");
        setFormRekening("");
        setActiveTab("keluar");
        notify({
            type: "success",
            title: "Pencairan Berhasil!",
            message: `Pencairan dana sebesar Rp ${nominalPencairan} berhasil diproses via ${formJenis}.`,
        });
    };

    // --- SUBMIT ISI SALDO ---
    const handleIsiSaldoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numNominal = parseInt(formIsiNominal.replace(/\./g, ""));
        const numTiket = parseInt(formIsiTiket);

        if (!numNominal || numNominal <= 0)
            return alert("Masukkan nominal yang valid!");
        if (!numTiket || numTiket <= 0)
            return alert("Masukkan jumlah tiket yang valid!");

        setTotalPemasukan(totalPemasukan + numNominal);

        const randomTrx = Math.floor(
            1000000000 + Math.random() * 9000000000,
        ).toString();
        const pembeliNama = formIsiNama;
        const cleanNoTlp = formIsiNoTlp.replace(/\D/g, "");
        const nominalIsi = numNominal.toLocaleString("id-ID");
        const newData = {
            id: Date.now(),
            nama: formIsiNama,
            tiket: numTiket,
            jenis: formIsiJenisTiket,
            nominal: numNominal.toLocaleString("id-ID"),
            status: "Sukses",
            idTrx: randomTrx,
            tanggal: new Date().toISOString().split("T")[0],
            noTlp: cleanNoTlp || "-",
            jenisPembayaran: "QRIS",
        };

        setDataMasuk([newData, ...dataMasuk]);
        setIsIsiSaldoOpen(false);

        // Reset Form
        setFormIsiNama("");
        setFormIsiTiket("");
        setFormIsiNominal("");
        setFormIsiNoTlp("");
        setActiveTab("masuk");
        notify({
            type: "create",
            title: "Transaksi Berhasil Ditambahkan!",
            message: `Data transaksi untuk ${pembeliNama} (${numTiket} tiket) senilai Rp ${nominalIsi} berhasil dicatat.`,
        });
    };

    const handleNominalChange =
        (setter: (val: string) => void) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            setter(value ? parseInt(value).toLocaleString("id-ID") : "");
        };

    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        return `${parseInt(day)} / ${parseInt(month)} / ${year}`;
    };

    const dateDisplayText =
        appliedStartDate && appliedEndDate
            ? `${formatDateDisplay(appliedStartDate)} - ${formatDateDisplay(appliedEndDate)}`
            : appliedStartDate
              ? `Dari: ${formatDateDisplay(appliedStartDate)}`
              : appliedEndDate
                ? `Sampai: ${formatDateDisplay(appliedEndDate)}`
                : "Pilih Rentang Tanggal";

    return (
        <div className="w-full flex flex-col font-sans animate-in fade-in duration-500 pb-10">
            {/* INJEKSI CSS UNTUK GLASS SCROLLBAR */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .glass-scroll::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .glass-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 10px;
                }
                .glass-scroll::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.15); /* Transparan hitam (glass) */
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                .glass-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
            `,
                }}
            />

            <h2 className="text-[26px] font-bold text-black mb-8">Keuangan</h2>

            {/* --- KARTU ATAS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Pemasukan */}
                <div className="bg-[#222222] rounded-[24px] p-6 flex flex-col justify-between min-h-[160px] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-white font-bold text-[18px]">
                                Pemasukan
                            </h3>
                            <p className="text-[#a3a3a3] text-[13px] mt-1 font-medium">
                                Total Keseluruhan
                            </p>
                        </div>
                        <div className="p-2 bg-white/10 rounded-xl">
                            <CheckSquare className="text-[#00ff1a] w-5 h-5 stroke-[2]" />
                        </div>
                    </div>
                    <p className="text-white font-bold text-[24px] mt-6 tracking-tight">
                        Rp. {totalPemasukan.toLocaleString("id-ID")}
                    </p>
                </div>

                {/* Pengeluaran */}
                <div className="bg-[#222222] rounded-[24px] p-6 flex flex-col justify-between min-h-[160px] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-white font-bold text-[18px]">
                                Pengeluaran
                            </h3>
                            <p className="text-[#a3a3a3] text-[13px] mt-1 font-medium">
                                Total Keseluruhan
                            </p>
                        </div>
                        <div className="p-2 bg-white/10 rounded-xl">
                            <ExternalLink className="text-[#ff4046] w-5 h-5 stroke-[2]" />
                        </div>
                    </div>
                    <p className="text-white font-bold text-[24px] mt-6 tracking-tight">
                        Rp. {totalPengeluaran.toLocaleString("id-ID")}
                    </p>
                </div>

                {/* Aksi Pencairan & Isi Saldo */}
                <div className="bg-white rounded-[24px] p-6 flex items-center justify-center gap-5 shadow-sm border border-gray-100">
                    <button
                        onClick={() => setIsPencairanOpen(true)}
                        className="flex flex-col items-center justify-center bg-[#222222] hover:bg-black transition-all hover:scale-[1.02] w-full max-w-[120px] h-[110px] rounded-[20px] text-white cursor-pointer border-0 shadow-sm">
                        <Upload className="w-6 h-6 mb-2" />
                        <span className="font-semibold text-[13px]">
                            Pencairan
                        </span>
                    </button>

                    <button
                        onClick={() => setIsIsiSaldoOpen(true)}
                        className="flex flex-col items-center justify-center bg-[#222222] hover:bg-black transition-all hover:scale-[1.02] w-full max-w-[120px] h-[110px] rounded-[20px] text-white cursor-pointer border-0 shadow-sm">
                        <Download className="w-6 h-6 mb-2" />
                        <span className="font-semibold text-[13px]">
                            Isi Saldo
                        </span>
                    </button>
                </div>
            </div>

            {/* --- TAB & FILTER --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => setActiveTab("masuk")}
                        className={`pb-2 cursor-pointer border-b-[3px] transition-colors border-0 bg-transparent p-0 ${
                            activeTab === "masuk"
                                ? "border-black text-black"
                                : "border-transparent text-[#888888] hover:text-black"
                        }`}>
                        <span className="text-[20px] font-bold">
                            Uang Masuk
                        </span>
                        <span className="ml-2 text-xs py-0.5 px-2 bg-gray-100 text-gray-700 rounded-full font-bold">
                            {filteredDataMasuk.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("keluar")}
                        className={`pb-2 cursor-pointer border-b-[3px] transition-colors border-0 bg-transparent p-0 ${
                            activeTab === "keluar"
                                ? "border-black text-black"
                                : "border-transparent text-[#888888] hover:text-black"
                        }`}>
                        <span className="text-[20px] font-bold">
                            Uang Keluar
                        </span>
                        <span className="ml-2 text-xs py-0.5 px-2 bg-gray-100 text-gray-700 rounded-full font-bold">
                            {filteredDataKeluar.length}
                        </span>
                    </button>
                </div>

                <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto">
                    {/* FILTER RENTANG TANGGAL */}
                    <div
                        className="relative flex-1 sm:flex-initial"
                        ref={datePickerRef}>
                        <button
                            onClick={() =>
                                setIsDatePickerOpen(!isDatePickerOpen)
                            }
                            className="w-full flex items-center justify-between gap-3 bg-[#222222] text-white px-5 py-3 rounded-full hover:bg-black transition-colors cursor-pointer border-0 shadow-sm">
                            <Calendar className="w-4 h-4 text-white/80 shrink-0" />
                            <span className="text-[13px] font-bold min-w-[140px] text-left truncate">
                                {dateDisplayText}
                            </span>
                            <ChevronDown
                                className={`w-4 h-4 text-white/80 transition-transform shrink-0 ${
                                    isDatePickerOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {isDatePickerOpen && (
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
                                            value={startDate}
                                            onChange={(e) =>
                                                setStartDate(e.target.value)
                                            }
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-black font-semibold text-[13px] cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-gray-500 mb-1">
                                            Sampai Dengan
                                        </label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) =>
                                                setEndDate(e.target.value)
                                            }
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none text-black font-semibold text-[13px] cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleResetDate}
                                        className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-xl text-[13px] transition-colors cursor-pointer">
                                        Reset
                                    </button>
                                    <button
                                        onClick={handleConfirmDate}
                                        className="flex-1 py-2.5 bg-[#222] hover:bg-black text-white font-bold rounded-xl text-[13px] transition-colors cursor-pointer">
                                        Konfirmasi
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PENCARIAN ID TRX */}
                    <div className="flex items-center gap-3 bg-[#222222] text-white px-5 py-3 rounded-full flex-1 sm:w-[260px] shadow-sm">
                        <Search className="w-4 h-4 text-white/80 shrink-0" />
                        <input
                            type="text"
                            value={searchIdTrx}
                            onChange={(e) => setSearchIdTrx(e.target.value)}
                            placeholder="Cari Id Trx..."
                            className="bg-transparent border-none outline-none text-[13px] font-semibold text-white w-full placeholder:text-white/60"
                        />
                        {searchIdTrx && (
                            <button
                                onClick={() => setSearchIdTrx("")}
                                className="text-white/60 hover:text-white cursor-pointer bg-transparent border-none p-0 shrink-0">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* KOTAK TABEL DENGAN SCROLL GLASS */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex-grow flex flex-col">
                <div className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>
                        Menampilkan{" "}
                        {activeTab === "masuk"
                            ? filteredDataMasuk.length
                            : filteredDataKeluar.length}{" "}
                        transaksi
                    </span>
                    <span className="hidden sm:inline text-gray-400">
                        Scroll ke bawah untuk melihat riwayat lengkap
                    </span>
                </div>

                {/* 
                    max-h-[460px]: Membatasi tinggi tabel agar bisa di-scroll 
                    overflow-y-auto: Menampilkan scrollbar vertikal
                    glass-scroll: Memanggil CSS custom efek glass
                    Tanpa celah (border-separate border-spacing-0 + sticky th)
                */}
                <div className="max-h-[460px] overflow-y-auto overflow-x-auto glass-scroll">
                    <table className="w-full text-left min-w-[760px] border-separate border-spacing-0 font-sans">
                        <thead className="sticky top-0 z-20 bg-white">
                            {activeTab === "masuk" ? (
                                <tr className="bg-white">
                                    <th className="sticky top-0 z-20 bg-white py-4 pl-6 pr-4 font-bold text-black text-[14px] border-b border-gray-200 bg-clip-padding">
                                        Nama User
                                    </th>
                                    <th className="sticky top-0 z-20 bg-white py-4 px-4 font-bold text-black text-[14px] text-center border-b border-gray-200 bg-clip-padding">
                                        Jumlah Tiket
                                    </th>
                                    <th className="sticky top-0 z-20 bg-white py-4 px-4 font-bold text-black text-[14px] text-center border-b border-gray-200 bg-clip-padding">
                                        Nominal
                                    </th>
                                    <th className="sticky top-0 z-20 bg-white py-4 px-4 font-bold text-black text-[14px] text-center border-b border-gray-200 bg-clip-padding">
                                        Jenis Tiket
                                    </th>
                                    <th className="sticky top-0 z-20 bg-white py-4 px-4 font-bold text-black text-[14px] text-center border-b border-gray-200 bg-clip-padding">
                                        Status
                                    </th>
                                    <th className="sticky top-0 z-20 bg-white py-4 px-4 font-bold text-black text-[14px] text-center border-b border-gray-200 bg-clip-padding">
                                        Id Trx
                                    </th>
                                    <th className="sticky top-0 z-20 bg-white py-4 pl-4 pr-6 font-bold text-black text-[14px] text-center border-b border-gray-200 bg-clip-padding">
                                        Detail
                                    </th>
                                </tr>
                            ) : (
                                <tr className="bg-white">
                                    <th className="sticky top-0 z-20 bg-white py-4 pl-6 pr-4 font-bold text-black text-[14px] border-b border-gray-200 bg-clip-padding">
                                        Nama Admin
                                    </th>
                                    <th className="sticky top-0 z-20 bg-white py-4 px-4 font-bold text-black text-[14px] text-center border-b border-gray-200 bg-clip-padding">
                                        Nominal
                                    </th>
                                    <th className="sticky top-0 z-20 bg-white py-4 px-4 font-bold text-black text-[14px] text-center border-b border-gray-200 bg-clip-padding">
                                        Jenis Pencairan
                                    </th>
                                    <th className="sticky top-0 z-20 bg-white py-4 px-4 font-bold text-black text-[14px] text-center border-b border-gray-200 bg-clip-padding">
                                        Status
                                    </th>
                                    <th className="sticky top-0 z-20 bg-white py-4 px-4 font-bold text-black text-[14px] text-center border-b border-gray-200 bg-clip-padding">
                                        Id Trx
                                    </th>
                                    <th className="sticky top-0 z-20 bg-white py-4 pl-4 pr-6 font-bold text-black text-[14px] text-center border-b border-gray-200 bg-clip-padding">
                                        Detail
                                    </th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {activeTab === "masuk" &&
                                filteredDataMasuk.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-gray-50/80 transition-colors">
                                        <td className="py-4 pl-6 pr-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                                    <User className="w-4 h-4 text-gray-700" />
                                                </div>
                                                <span className="font-semibold text-[14px] text-black">
                                                    {row.nama}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center font-semibold text-[14px] text-gray-800 border-b border-gray-100">
                                            {row.tiket}
                                        </td>
                                        <td className="py-4 px-4 text-center font-bold text-[14px] text-emerald-600 border-b border-gray-100">
                                            + Rp {row.nominal}
                                        </td>
                                        <td className="py-4 px-4 text-center font-medium text-[13px] border-b border-gray-100">
                                            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                                                {row.jenis}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center font-semibold text-[13px] border-b border-gray-100">
                                            <span className="inline-flex items-center gap-1 text-[#00a814] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#00c918]"></span>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center font-mono text-[13px] text-gray-600 border-b border-gray-100">
                                            {row.idTrx}
                                        </td>
                                        <td className="py-4 pl-4 pr-6 border-b border-gray-100">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() =>
                                                        setSelectedDetailMasuk(
                                                            row,
                                                        )
                                                    }
                                                    title="Lihat Detail Transaksi"
                                                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer">
                                                    <ArrowRight className="w-5 h-5 text-black hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {activeTab === "keluar" &&
                                filteredDataKeluar.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="hover:bg-gray-50/80 transition-colors">
                                        <td className="py-4 pl-6 pr-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                                    <User className="w-4 h-4 text-gray-700" />
                                                </div>
                                                <span className="font-semibold text-[14px] text-black">
                                                    {row.namaAdmin}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center font-bold text-[14px] text-rose-600 border-b border-gray-100">
                                            {row.nominal}
                                        </td>
                                        <td className="py-4 px-4 text-center font-medium text-[13px] border-b border-gray-100">
                                            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                                                {row.jenisPencairan}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center font-semibold text-[13px] border-b border-gray-100">
                                            <span className="inline-flex items-center gap-1 text-[#00a814] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#00c918]"></span>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center font-mono text-[13px] text-gray-600 border-b border-gray-100">
                                            {row.idTrx}
                                        </td>
                                        <td className="py-4 pl-4 pr-6 border-b border-gray-100">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() =>
                                                        setSelectedDetailKeluar(
                                                            row,
                                                        )
                                                    }
                                                    title="Lihat Detail Pengeluaran"
                                                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer">
                                                    <ArrowRight className="w-5 h-5 text-black hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            {((activeTab === "masuk" &&
                                filteredDataMasuk.length === 0) ||
                                (activeTab === "keluar" &&
                                    filteredDataKeluar.length === 0)) && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-16 text-center text-gray-500 font-semibold text-[14px]">
                                        Tidak ada data transaksi yang cocok
                                        dengan filter atau pencarian.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL PENCAIRAN --- */}
            {isPencairanOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setIsPencairanOpen(false)}
                    />
                    <div className="relative bg-white w-full max-w-[450px] rounded-[24px] p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsPencairanOpen(false)}
                            className="absolute top-6 right-6 border-0 bg-transparent cursor-pointer p-1 rounded-full hover:bg-gray-100">
                            <X className="w-5 h-5 text-gray-500 hover:text-black" />
                        </button>
                        <h2 className="text-[22px] font-bold text-black mb-2">
                            Form Pencairan Saldo
                        </h2>
                        <p className="text-xs text-gray-500 mb-6">
                            Saldo tersedia: Rp{" "}
                            {totalPemasukan.toLocaleString("id-ID")}
                        </p>
                        <form
                            onSubmit={handlePencairanSubmit}
                            className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Nominal (Rp)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formNominal}
                                    onChange={handleNominalChange(
                                        setFormNominal,
                                    )}
                                    placeholder="Contoh: 150.000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Nomor Rekening Tujuan
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    value={formRekening}
                                    onChange={(e) =>
                                        setFormRekening(
                                            e.target.value.replace(/\D/g, ""),
                                        )
                                    }
                                    placeholder="Contoh: 1234567890 (Hanya Angka)"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black focus:border-black focus:ring-1 focus:ring-black font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Jenis Pencairan
                                </label>
                                <select
                                    value={formJenis}
                                    onChange={(e) =>
                                        setFormJenis(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold bg-white cursor-pointer text-black focus:border-black">
                                    <option value="Bank">Transfer Bank</option>
                                    <option value="E-Wallet">
                                        E-Wallet (Dana / OVO / GoPay)
                                    </option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 w-full bg-[#222] hover:bg-black text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm">
                                Konfirmasi Pencairan{" "}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL ISI SALDO --- */}
            {isIsiSaldoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setIsIsiSaldoOpen(false)}
                    />
                    <div className="relative bg-white w-full max-w-[450px] rounded-[24px] p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsIsiSaldoOpen(false)}
                            className="absolute top-6 right-6 border-0 bg-transparent cursor-pointer p-1 rounded-full hover:bg-gray-100">
                            <X className="w-5 h-5 text-gray-500 hover:text-black" />
                        </button>
                        <h2 className="text-[22px] font-bold text-black mb-2">
                            Form Isi Saldo (Uang Masuk)
                        </h2>
                        <p className="text-xs text-gray-500 mb-5">
                            Catat transaksi penjualan tiket museum masuk
                        </p>
                        <form
                            onSubmit={handleIsiSaldoSubmit}
                            className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Nama User
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formIsiNama}
                                    onChange={(e) =>
                                        setFormIsiNama(e.target.value)
                                    }
                                    placeholder="Nama Pengunjung"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Nomor Telepon
                                </label>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    value={formIsiNoTlp}
                                    onChange={(e) =>
                                        setFormIsiNoTlp(
                                            e.target.value.replace(/\D/g, ""),
                                        )
                                    }
                                    placeholder="Contoh: 081234567890 (Hanya Angka)"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black focus:border-black font-mono"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                        Jumlah Tiket
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formIsiTiket}
                                        onChange={(e) =>
                                            setFormIsiTiket(e.target.value)
                                        }
                                        placeholder="1"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black focus:border-black"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                        Jenis Tiket
                                    </label>
                                    <select
                                        value={formIsiJenisTiket}
                                        onChange={(e) =>
                                            setFormIsiJenisTiket(e.target.value)
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold bg-white text-black focus:border-black">
                                        <option value="Mandiri">Mandiri</option>
                                        <option value="Guide">Guide</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Nominal (Rp)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formIsiNominal}
                                    onChange={handleNominalChange(
                                        setFormIsiNominal,
                                    )}
                                    placeholder="Contoh: 50.000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black focus:border-black"
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-4 w-full bg-[#222] hover:bg-black text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm">
                                Konfirmasi Isi Saldo{" "}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL DETAIL UANG MASUK --- */}
            {selectedDetailMasuk && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setSelectedDetailMasuk(null)}
                    />
                    <div className="relative bg-white w-full max-w-[450px] rounded-[24px] p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setSelectedDetailMasuk(null)}
                            className="absolute top-6 right-6 border-0 bg-transparent cursor-pointer p-1 rounded-full hover:bg-gray-100">
                            <X className="w-5 h-5 text-gray-500 hover:text-black" />
                        </button>
                        <h2 className="text-[22px] font-bold text-black mb-6">
                            Detail Uang Masuk
                        </h2>
                        <div className="flex flex-col gap-0 border-t border-gray-200">
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Nama User
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailMasuk.nama}
                                </span>
                            </div>
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Nomor Telepon
                                </span>
                                <span className="text-black font-bold text-[14px] font-mono">
                                    {selectedDetailMasuk.noTlp}
                                </span>
                            </div>
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Jumlah Tiket
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailMasuk.tiket} Tiket
                                </span>
                            </div>
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Jenis Tiket
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailMasuk.jenis}
                                </span>
                            </div>
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Jenis Pembayaran
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailMasuk.jenisPembayaran}
                                </span>
                            </div>
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Nominal
                                </span>
                                <span className="text-emerald-600 font-bold text-[14px]">
                                    Rp {selectedDetailMasuk.nominal}
                                </span>
                            </div>
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Tanggal
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailMasuk.tanggal}
                                </span>
                            </div>
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Status
                                </span>
                                <span className="text-[#00c918] font-bold text-[14px]">
                                    {selectedDetailMasuk.status}
                                </span>
                            </div>
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    ID Trx
                                </span>
                                <span className="text-black font-mono font-bold text-[14px]">
                                    {selectedDetailMasuk.idTrx}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedDetailMasuk(null)}
                            className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                            <ArrowLeft className="w-5 h-5" /> Kembali
                        </button>
                    </div>
                </div>
            )}

            {/* --- MODAL DETAIL UANG KELUAR --- */}
            {selectedDetailKeluar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setSelectedDetailKeluar(null)}
                    />
                    <div className="relative bg-white w-full max-w-[450px] rounded-[24px] p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setSelectedDetailKeluar(null)}
                            className="absolute top-6 right-6 border-0 bg-transparent cursor-pointer p-1 rounded-full hover:bg-gray-100">
                            <X className="w-5 h-5 text-gray-500 hover:text-black" />
                        </button>
                        <h2 className="text-[22px] font-bold text-black mb-6">
                            Detail Uang Keluar
                        </h2>
                        <div className="flex flex-col gap-0 border-t border-gray-200">
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Nama Admin
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailKeluar.namaAdmin}
                                </span>
                            </div>
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Jenis Pencairan
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailKeluar.jenisPencairan}
                                </span>
                            </div>
                            {selectedDetailKeluar.noRekening && (
                                <div className="flex justify-between py-3.5 border-b border-gray-100">
                                    <span className="text-gray-500 font-semibold text-[14px]">
                                        No. Rekening Tujuan
                                    </span>
                                    <span className="text-black font-mono font-bold text-[14px]">
                                        {selectedDetailKeluar.noRekening}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Nominal
                                </span>
                                <span className="text-rose-600 font-bold text-[14px]">
                                    Rp{" "}
                                    {selectedDetailKeluar.nominal.replace(
                                        "- ",
                                        "",
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Tanggal
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailKeluar.tanggal}
                                </span>
                            </div>
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Status
                                </span>
                                <span className="text-[#00c918] font-bold text-[14px]">
                                    {selectedDetailKeluar.status}
                                </span>
                            </div>
                            <div className="flex justify-between py-3.5 border-b border-gray-100">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    ID Trx
                                </span>
                                <span className="text-black font-mono font-bold text-[14px]">
                                    {selectedDetailKeluar.idTrx}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedDetailKeluar(null)}
                            className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                            <ArrowLeft className="w-5 h-5" /> Kembali
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
