"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
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

function KeuanganContent() {
    const searchParams = useSearchParams();
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
            return saved ? parseInt(saved) : 400000;
        }
        return 400000;
    });

    const [totalPengeluaran, setTotalPengeluaran] = useState<number>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("museum_pengeluaran");
            return saved ? parseInt(saved) : 100000;
        }
        return 100000;
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
                status: "Sukses",
                idTrx: "9988811891",
                tanggal: "2026-07-10",
            },
            {
                id: 2,
                namaAdmin: "Bella Aji Zehira",
                nominal: "- 30.000",
                jenisPencairan: "Bank",
                status: "Sukses",
                idTrx: "0019987162",
                tanggal: "2026-07-09",
            },
            {
                id: 3,
                namaAdmin: "Gegen Huriawan",
                nominal: "- 20.000",
                jenisPencairan: "Bank",
                status: "Sukses",
                idTrx: "4463728173",
                tanggal: "2026-07-01",
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
        const newData = {
            id: Date.now(),
            namaAdmin: "Admin Aktif",
            nominal: `- ${numNominal.toLocaleString("id-ID")}`,
            jenisPencairan: formJenis,
            status: "Sukses",
            idTrx: randomTrx,
            tanggal: new Date().toISOString().split("T")[0],
        };

        setDataKeluar([newData, ...dataKeluar]);
        setIsPencairanOpen(false);
        setFormNominal("");
        setFormRekening("");
        setActiveTab("keluar");
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
        const newData = {
            id: Date.now(),
            nama: formIsiNama,
            tiket: numTiket,
            jenis: formIsiJenisTiket,
            nominal: numNominal.toLocaleString("id-ID"),
            status: "Sukses",
            idTrx: randomTrx,
            tanggal: new Date().toISOString().split("T")[0],
            noTlp: formIsiNoTlp || "-",
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
    };

    const handleNominalChange =
        (setter: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className="w-full max-w-[1100px] animate-in fade-in duration-500">
            <h2 className="text-[28px] font-bold text-black mb-6 mt-2">
                Keuangan
            </h2>

            {/* --- KARTU ATAS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#222222] rounded-[24px] p-6 flex flex-col justify-between min-h-[160px]">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-white font-bold text-[18px]">
                                Pemasukan
                            </h3>
                            <p className="text-[#a3a3a3] text-[13px] mt-2 font-medium">
                                Total Keseluruhan
                            </p>
                        </div>
                        <CheckSquare className="text-[#00ff1a] w-6 h-6 stroke-[2]" />
                    </div>
                    <p className="text-white font-bold text-[24px] mt-6">
                        Rp. {totalPemasukan.toLocaleString("id-ID")}
                    </p>
                </div>

                <div className="bg-[#222222] rounded-[24px] p-6 flex flex-col justify-between min-h-[160px]">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-white font-bold text-[18px]">
                                Pengeluaran
                            </h3>
                            <p className="text-[#a3a3a3] text-[13px] mt-2 font-medium">
                                Total Keseluruhan
                            </p>
                        </div>
                        <ExternalLink className="text-[#ff0810] w-6 h-6 stroke-[2]" />
                    </div>
                    <p className="text-white font-bold text-[24px] mt-6">
                        Rp. {totalPengeluaran.toLocaleString("id-ID")}
                    </p>
                </div>

                <div className="bg-white rounded-[32px] p-6 flex items-center justify-center gap-6 shadow-sm">
                    <button
                        onClick={() => setIsPencairanOpen(true)}
                        className="flex flex-col items-center justify-center bg-[#222222] hover:bg-black transition-colors w-[110px] h-[110px] rounded-[20px] text-white cursor-pointer border-0">
                        <Upload className="w-6 h-6 mb-3" />
                        <span className="font-semibold text-[13px]">
                            Pencairan
                        </span>
                    </button>

                    <button
                        onClick={() => setIsIsiSaldoOpen(true)}
                        className="flex flex-col items-center justify-center bg-[#222222] hover:bg-black transition-colors w-[110px] h-[110px] rounded-[20px] text-white cursor-pointer border-0">
                        <Download className="w-6 h-6 mb-3" />
                        <span className="font-semibold text-[13px]">
                            Isi Saldo
                        </span>
                    </button>
                </div>
            </div>

            {/* --- TAB & FILTER --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <div className="flex items-center gap-8">
                    <div
                        onClick={() => setActiveTab("masuk")}
                        className={`pb-2 cursor-pointer border-b-[3px] transition-colors ${activeTab === "masuk" ? "border-black" : "border-transparent"}`}>
                        <span
                            className={`text-[20px] font-bold ${activeTab === "masuk" ? "text-black" : "text-[#888888]"}`}>
                            Uang Masuk
                        </span>
                    </div>
                    <div
                        onClick={() => setActiveTab("keluar")}
                        className={`pb-2 cursor-pointer border-b-[3px] transition-colors ${activeTab === "keluar" ? "border-black" : "border-transparent"}`}>
                        <span
                            className={`text-[20px] font-bold ${activeTab === "keluar" ? "text-black" : "text-[#888888]"}`}>
                            Uang Keluar
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* FILTER RENTANG TANGGAL */}
                    <div className="relative" ref={datePickerRef}>
                        <button
                            onClick={() =>
                                setIsDatePickerOpen(!isDatePickerOpen)
                            }
                            className="flex items-center gap-3 bg-[#222222] text-white px-5 py-3 rounded-full hover:bg-black transition-colors cursor-pointer border-0">
                            <Calendar className="w-5 h-5 text-white/80" />
                            <span className="text-[14px] font-bold min-w-[150px] text-left">
                                {dateDisplayText}
                            </span>
                            <ChevronDown
                                className={`w-5 h-5 text-white/80 transition-transform ${isDatePickerOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {isDatePickerOpen && (
                            <div className="absolute top-full right-0 mt-2 w-[320px] bg-white rounded-[24px] shadow-xl border border-gray-100 p-6 z-20">
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
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-black font-semibold text-[14px] cursor-pointer"
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
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-black font-semibold text-[14px] cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleResetDate}
                                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-xl text-[14px] transition-colors cursor-pointer">
                                        Reset
                                    </button>
                                    <button
                                        onClick={handleConfirmDate}
                                        className="flex-1 py-3 bg-[#222] hover:bg-black text-white font-bold rounded-xl text-[14px] transition-colors cursor-pointer">
                                        Konfirmasi
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PENCARIAN ID TRX */}
                    <div className="flex items-center gap-3 bg-[#222222] text-white px-5 py-3 rounded-full w-[280px]">
                        <Search className="w-5 h-5 text-white/80" />
                        <input
                            type="text"
                            value={searchIdTrx}
                            onChange={(e) => setSearchIdTrx(e.target.value)}
                            placeholder="Cari Id Trx..."
                            className="bg-transparent border-none outline-none text-[14px] font-semibold text-white w-full placeholder:text-white/60"
                        />
                        {searchIdTrx && (
                            <button
                                onClick={() => setSearchIdTrx("")}
                                className="text-white/60 hover:text-white cursor-pointer bg-transparent border-none p-0">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- TABEL DATA --- */}
            <div className="bg-white rounded-[24px] p-8 shadow-sm overflow-x-auto w-full">
                <table className="w-full text-left min-w-[800px] border-collapse">
                    <thead>
                        {activeTab === "masuk" ? (
                            <tr>
                                <th className="pb-4 font-bold text-black text-[15px] border-b border-black w-[20%]">
                                    Nama User
                                </th>
                                <th className="pb-4 font-bold text-black text-[15px] border-b border-black text-center">
                                    Jumlah Tiket
                                </th>
                                <th className="pb-4 font-bold text-black text-[15px] border-b border-black text-center">
                                    Nominal
                                </th>
                                <th className="pb-4 font-bold text-black text-[15px] border-b border-black text-center">
                                    Jenis Tiket
                                </th>
                                <th className="pb-4 font-bold text-black text-[15px] border-b border-black text-center">
                                    Status
                                </th>
                                <th className="pb-4 font-bold text-black text-[15px] border-b border-black text-center">
                                    Id Trx
                                </th>
                                <th className="pb-4 font-bold text-black text-[15px] border-b border-black text-center">
                                    Detail
                                </th>
                            </tr>
                        ) : (
                            <tr>
                                <th className="pb-4 font-bold text-black text-[15px] border-b border-black w-[20%]">
                                    Nama Admin
                                </th>
                                <th className="pb-4 font-bold text-black text-[15px] border-b border-black text-center">
                                    Nominal
                                </th>
                                <th className="pb-4 font-bold text-black text-[15px] border-b border-black text-center">
                                    Jenis Pencairan
                                </th>
                                <th className="pb-4 font-bold text-black text-[15px] border-b border-black text-center">
                                    Status
                                </th>
                                <th className="pb-4 font-bold text-black text-[15px] border-b border-black text-center">
                                    Id Trx
                                </th>
                                <th className="pb-4 font-bold text-black text-[15px] border-b border-black text-center">
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
                                    className="border-b border-[#dddddd] last:border-b-0 hover:bg-gray-50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-4">
                                            <User className="w-6 h-6 text-black" />
                                            <span className="font-semibold text-[14px]">
                                                {row.nama}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center font-semibold text-[14px]">
                                        {row.tiket}
                                    </td>
                                    <td className="py-4 text-center font-semibold text-[14px]">
                                        {row.nominal}
                                    </td>
                                    <td className="py-4 text-center font-semibold text-[14px]">
                                        {row.jenis}
                                    </td>
                                    <td className="py-4 text-center font-semibold text-[14px]">
                                        <span className="text-[#00c918]">
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-center font-semibold text-[14px]">
                                        {row.idTrx}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex justify-center">
                                            <ArrowRight
                                                onClick={() =>
                                                    setSelectedDetailMasuk(row)
                                                }
                                                className="w-5 h-5 text-black cursor-pointer hover:scale-110 transition-transform"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        {activeTab === "keluar" &&
                            filteredDataKeluar.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-[#dddddd] last:border-b-0 hover:bg-gray-50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-4">
                                            <User className="w-6 h-6 text-black" />
                                            <span className="font-semibold text-[14px]">
                                                {row.namaAdmin}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center font-semibold text-[14px] text-black">
                                        {row.nominal}
                                    </td>
                                    <td className="py-4 text-center font-semibold text-[14px]">
                                        {row.jenisPencairan}
                                    </td>
                                    <td className="py-4 text-center font-semibold text-[14px]">
                                        <span className="text-[#00c918]">
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-center font-semibold text-[14px]">
                                        {row.idTrx}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex justify-center">
                                            <ArrowRight
                                                onClick={() =>
                                                    setSelectedDetailKeluar(row)
                                                }
                                                className="w-5 h-5 text-black cursor-pointer hover:scale-110 transition-transform"
                                            />
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
                                    className="py-12 text-center text-gray-500 font-semibold text-[15px]">
                                    Data tidak ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL PENCAIRAN --- */}
            {isPencairanOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setIsPencairanOpen(false)}
                    />
                    <div className="relative bg-white w-full max-w-[450px] rounded-[24px] p-8 shadow-xl z-10 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsPencairanOpen(false)}
                            className="absolute top-6 right-6 border-0 bg-transparent cursor-pointer">
                            <X className="w-6 h-6 text-gray-500 hover:text-black" />
                        </button>
                        <h2 className="text-[22px] font-bold text-black mb-6">
                            Form Pencairan Saldo
                        </h2>
                        <form
                            onSubmit={handlePencairanSubmit}
                            className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
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
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nomor Rekening Tujuan
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formRekening}
                                    onChange={(e) =>
                                        setFormRekening(e.target.value)
                                    }
                                    placeholder="Masukkan Nomor Rekening"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Jenis Pencairan
                                </label>
                                <select
                                    value={formJenis}
                                    onChange={(e) =>
                                        setFormJenis(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold bg-white cursor-pointer text-black">
                                    <option value="Bank">Transfer Bank</option>
                                    <option value="E-Wallet">
                                        E-Wallet (Dana/OVO)
                                    </option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 w-full bg-[#222] hover:bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                                Konfirmasi Pencairan{" "}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL ISI SALDO --- */}
            {isIsiSaldoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setIsIsiSaldoOpen(false)}
                    />
                    <div className="relative bg-white w-full max-w-[450px] rounded-[24px] p-8 shadow-xl z-10 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsIsiSaldoOpen(false)}
                            className="absolute top-6 right-6 border-0 bg-transparent cursor-pointer">
                            <X className="w-6 h-6 text-gray-500 hover:text-black" />
                        </button>
                        <h2 className="text-[22px] font-bold text-black mb-6">
                            Form Isi Saldo (Uang Masuk)
                        </h2>
                        <form
                            onSubmit={handleIsiSaldoSubmit}
                            className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nama User
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formIsiNama}
                                    onChange={(e) =>
                                        setFormIsiNama(e.target.value)
                                    }
                                    placeholder="Nama Pembeli"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nomor Telepon
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formIsiNoTlp}
                                    onChange={(e) =>
                                        setFormIsiNoTlp(e.target.value)
                                    }
                                    placeholder="0812xxxxxx"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Jumlah Tiket
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formIsiTiket}
                                        onChange={(e) =>
                                            setFormIsiTiket(e.target.value)
                                        }
                                        placeholder="1"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Jenis Tiket
                                    </label>
                                    <select
                                        value={formIsiJenisTiket}
                                        onChange={(e) =>
                                            setFormIsiJenisTiket(e.target.value)
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold bg-white text-black">
                                        <option value="Mandiri">Mandiri</option>
                                        <option value="Guide">Guide</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
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
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black"
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-4 w-full bg-[#222] hover:bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                                Konfirmasi Isi Saldo{" "}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL DETAIL UANG MASUK --- */}
            {selectedDetailMasuk && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setSelectedDetailMasuk(null)}
                    />
                    <div className="relative bg-white w-full max-w-[450px] rounded-[24px] p-8 shadow-xl z-10 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setSelectedDetailMasuk(null)}
                            className="absolute top-6 right-6 border-0 bg-transparent cursor-pointer">
                            <X className="w-6 h-6 text-gray-500 hover:text-black" />
                        </button>
                        <h2 className="text-[22px] font-bold text-black mb-6">
                            Detail Uang Masuk
                        </h2>
                        <div className="flex flex-col gap-0 border-t border-gray-200">
                            <div className="flex justify-between py-4 border-b border-gray-200">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Nama User
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailMasuk.nama}
                                </span>
                            </div>
                            <div className="flex justify-between py-4 border-b border-gray-200">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Nomor Telepon
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailMasuk.noTlp}
                                </span>
                            </div>
                            <div className="flex justify-between py-4 border-b border-gray-200">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Jumlah Tiket
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailMasuk.tiket} Tiket
                                </span>
                            </div>
                            <div className="flex justify-between py-4 border-b border-gray-200">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Jenis Tiket
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailMasuk.jenis}
                                </span>
                            </div>
                            <div className="flex justify-between py-4 border-b border-gray-200">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Jenis Pembayaran
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailMasuk.jenisPembayaran}
                                </span>
                            </div>
                            <div className="flex justify-between py-4 border-b border-gray-200">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Nominal
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    Rp {selectedDetailMasuk.nominal}
                                </span>
                            </div>
                            <div className="flex justify-between py-4 border-b border-gray-200">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Status
                                </span>
                                <span className="text-[#00c918] font-bold text-[14px]">
                                    {selectedDetailMasuk.status}
                                </span>
                            </div>
                            <div className="flex justify-between py-4 border-b border-gray-200">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    ID Trx
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailMasuk.idTrx}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedDetailMasuk(null)}
                            className="mt-8 w-full bg-gray-100 hover:bg-gray-200 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                            <ArrowLeft className="w-5 h-5" /> Kembali
                        </button>
                    </div>
                </div>
            )}

            {/* --- MODAL DETAIL UANG KELUAR --- */}
            {selectedDetailKeluar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setSelectedDetailKeluar(null)}
                    />
                    <div className="relative bg-white w-full max-w-[450px] rounded-[24px] p-8 shadow-xl z-10 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setSelectedDetailKeluar(null)}
                            className="absolute top-6 right-6 border-0 bg-transparent cursor-pointer">
                            <X className="w-6 h-6 text-gray-500 hover:text-black" />
                        </button>
                        <h2 className="text-[22px] font-bold text-black mb-6">
                            Detail Uang Keluar
                        </h2>
                        <div className="flex flex-col gap-0 border-t border-gray-200">
                            <div className="flex justify-between py-4 border-b border-gray-200">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Nama Admin
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailKeluar.namaAdmin}
                                </span>
                            </div>
                            <div className="flex justify-between py-4 border-b border-gray-200">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Jenis Pencairan
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailKeluar.jenisPencairan}
                                </span>
                            </div>
                            <div className="flex justify-between py-4 border-b border-gray-200">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Nominal
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    Rp{" "}
                                    {selectedDetailKeluar.nominal.replace(
                                        "- ",
                                        "",
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between py-4 border-b border-gray-200">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    Status
                                </span>
                                <span className="text-[#00c918] font-bold text-[14px]">
                                    {selectedDetailKeluar.status}
                                </span>
                            </div>
                            <div className="flex justify-between py-4 border-b border-gray-200">
                                <span className="text-gray-500 font-semibold text-[14px]">
                                    ID Trx
                                </span>
                                <span className="text-black font-bold text-[14px]">
                                    {selectedDetailKeluar.idTrx}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedDetailKeluar(null)}
                            className="mt-8 w-full bg-gray-100 hover:bg-gray-200 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                            <ArrowLeft className="w-5 h-5" /> Kembali
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function KeuanganPage() {
    return (
        <Suspense
            fallback={
                <div className="p-8 text-black font-bold">Loading...</div>
            }>
            <KeuanganContent />
        </Suspense>
    );
}
