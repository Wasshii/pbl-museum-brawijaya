"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Search,
    ArrowRight,
    X,
    Send,
    Star,
    MessageSquare,
    CheckCircle2,
} from "lucide-react";

// Tipe Data Feedback
export interface Feedback {
    id: number;
    name: string;
    review: string;
    rating: number;
    status: "Telah Di Balas" | "Belum Di Balas";
    replyText?: string;
    date: string;
}

// Data Dummy Awal Lengkap (10 data agar efek scroll terlihat langsung)
const initialFeedbacks: Feedback[] = [
    {
        id: 1,
        name: "Hendra Kedura",
        review: "Suasananya sejuk dan sangat bersih. Koleksi sejarahnya juga tertata dengan sangat rapi. Sangat direkomendasikan!",
        rating: 5,
        status: "Telah Di Balas",
        replyText:
            "Terima kasih atas ulasan positifnya! Kami selalu berusaha menjaga kebersihan dan kenyamanan pengunjung.",
        date: "04 Okt 2026",
    },
    {
        id: 2,
        name: "Evisa Hermina",
        review: "Mungkin perlu ditambah lagi petunjuk arah di dalam museum karena agak membingungkan untuk pengunjung baru.",
        rating: 3,
        status: "Belum Di Balas",
        date: "03 Okt 2026",
    },
    {
        id: 3,
        name: "Budi Santoso",
        review: "Koleksinya sangat lengkap, anak saya sangat senang belajar sejarah di sini. Petugas pemandu sangat ramah.",
        rating: 4,
        status: "Belum Di Balas",
        date: "02 Okt 2026",
    },
    {
        id: 4,
        name: "Siti Aminah",
        review: "Fasilitas toiletnya kurang terawat saat saya berkunjung di hari libur, mohon ditingkatkan lagi kebersihannya.",
        rating: 2,
        status: "Belum Di Balas",
        date: "01 Okt 2026",
    },
    {
        id: 5,
        name: "Agus Pratama",
        review: "Bagus sekali, tiketnya juga terjangkau. Cocok untuk wisata edukasi keluarga di akhir pekan.",
        rating: 5,
        status: "Telah Di Balas",
        replyText:
            "Terima kasih banyak Bapak Agus. Ditunggu kunjungan selanjutnya bersama keluarga!",
        date: "29 Sep 2026",
    },
    {
        id: 6,
        name: "Rina Kartika",
        review: "Ruang diorama perjuangan sangat mengesankan, efek suara dan pencahayaan sangat dramatis!",
        rating: 5,
        status: "Telah Di Balas",
        replyText:
            "Terima kasih ulasannya Ibu Rina! Kami terus memelihara instalasi tata cahaya dan audio diorama agar selalu prima.",
        date: "26 Sep 2026",
    },
    {
        id: 7,
        name: "Joko Anwar",
        review: "Parkiran motor cukup luas dan tertib. Sangat bagus untuk penelitian sejarah militer Jawa Timur.",
        rating: 4,
        status: "Belum Di Balas",
        date: "22 Sep 2026",
    },
    {
        id: 8,
        name: "Dewi Lestari",
        review: "Pencahayaan di beberapa etalase dokumen kuno agak redup, sehingga teks agak sulit dibaca.",
        rating: 3,
        status: "Belum Di Balas",
        date: "18 Sep 2026",
    },
    {
        id: 9,
        name: "Andi Wijaya",
        review: "Meriam kuno dan tank di halaman luar sangat megah! Tempat foto terbaik di Kota Malang.",
        rating: 5,
        status: "Telah Di Balas",
        replyText:
            "Senang mendengarnya Mas Andi! Spot halaman depan memang favorit pengunjung untuk berfoto bersama kendaraan tempur bersejarah.",
        date: "14 Sep 2026",
    },
    {
        id: 10,
        name: "Maya Sari",
        review: "Pelayanan loket QRIS sangat mempermudah pembayaran tanpa perlu bawa uang tunai banyak.",
        rating: 5,
        status: "Belum Di Balas",
        date: "10 Sep 2026",
    },
    {
        id: 11,
        name: "Farhan Maulana",
        review: "Koleksi seragam dan atribut pejuang sangat mendalam. Cocok buat referensi tugas sekolah anak saya.",
        rating: 4,
        status: "Belum Di Balas",
        date: "05 Sep 2026",
    },
];

export default function FeedBackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("museum_feedback");
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return initialFeedbacks;
                }
            }
        }
        return initialFeedbacks;
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "Semua" | "Belum Di Balas" | "Telah Di Balas"
    >("Semua");

    // State untuk Modal Balasan
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
        null,
    );
    const [replyInput, setReplyInput] = useState("");
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Simpan ke localStorage saat data berubah
    const updateFeedbacksAndStore = (newFeedbacks: Feedback[]) => {
        setFeedbacks(newFeedbacks);
        if (typeof window !== "undefined") {
            localStorage.setItem(
                "museum_feedback",
                JSON.stringify(newFeedbacks),
            );
        }
    };

    // Filter Pencarian & Status
    const filteredFeedbacks = useMemo(() => {
        return feedbacks.filter((fb) => {
            const matchesSearch =
                fb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fb.review.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "Semua" || fb.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [feedbacks, searchQuery, statusFilter]);

    // Buka Modal Detail
    const handleOpenDetail = (feedback: Feedback) => {
        setSelectedFeedback(feedback);
        setReplyInput(feedback.replyText || ""); // Jika sudah ada balasan, tampilkan di input
    };

    // Tutup Modal
    const handleCloseDetail = () => {
        setSelectedFeedback(null);
        setReplyInput("");
    };

    // Fungsi Kirim Balasan
    const handleSendReply = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedFeedback && replyInput.trim() !== "") {
            // Update status dan teks balasan di tabel utama
            const updated = feedbacks.map((fb) =>
                fb.id === selectedFeedback.id
                    ? {
                          ...fb,
                          status: "Telah Di Balas" as const,
                          replyText: replyInput.trim(),
                      }
                    : fb,
            );
            updateFeedbacksAndStore(updated);
            showToast(
                `Balasan untuk ${selectedFeedback.name} berhasil disimpan!`,
            );
            handleCloseDetail();
        }
    };

    return (
        <div className="w-full animate-in fade-in duration-500 pb-10 font-sans">
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

            {/* TOAST NOTIFIKASI */}
            {toastMessage && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-black text-white px-5 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium">{toastMessage}</span>
                </div>
            )}

            <h1 className="text-[26px] font-bold text-black mb-8">Feed Back</h1>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Cari Berdasarkan Nama / Ulasan"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-10 py-3 bg-[#222222] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder-gray-400 text-[14px] font-semibold"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white cursor-pointer bg-transparent border-none">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filter Status Pills */}
                <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-full border border-gray-200">
                    {(
                        ["Semua", "Belum Di Balas", "Telah Di Balas"] as const
                    ).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setStatusFilter(filter)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-0 ${
                                statusFilter === filter
                                    ? "bg-black text-white shadow-sm"
                                    : "bg-transparent text-gray-600 hover:text-black"
                            }`}>
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Container Tabel dengan Glass Scrollbar */}
            <div className="bg-white rounded-[24px] shadow-sm overflow-hidden border border-gray-100 flex flex-col">
                {/* 
                    max-h-[460px]: Membatasi tinggi tabel agar bisa di-scroll 
                    overflow-y-auto overflow-x-auto: Menampilkan scrollbar vertikal & horizontal
                    glass-scroll: Efek custom scrollbar glass
                    Tanpa padding top/horizontal pada scroll container agar header sticky tepat di bibir atas tanpa celah
                */}
                <div className="max-h-[460px] overflow-y-auto overflow-x-auto glass-scroll">
                    <table className="w-full text-left border-collapse font-sans min-w-[750px]">
                        <thead className="sticky top-0 z-20 bg-white shadow-[0_1px_0_0_#f0f0f0]">
                            <tr className="border-b-2 border-gray-100 bg-white">
                                <th className="py-4 pl-6 pr-4 font-bold text-black whitespace-nowrap text-[14px] bg-white">
                                    Nama User
                                </th>
                                <th className="py-4 px-4 font-bold text-black whitespace-nowrap text-[14px] w-1/3 bg-white">
                                    Ulasan
                                </th>
                                <th className="py-4 px-4 font-bold text-black whitespace-nowrap text-center text-[14px] bg-white">
                                    Rating
                                </th>
                                <th className="py-4 px-4 font-bold text-black whitespace-nowrap text-center text-[14px] bg-white">
                                    Detail
                                </th>
                                <th className="py-4 pl-4 pr-6 font-bold text-black whitespace-nowrap text-center text-[14px] bg-white">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFeedbacks.length > 0 ? (
                                filteredFeedbacks.map((feedback) => (
                                    <tr
                                        key={feedback.id}
                                        className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                                        <td className="py-4 pl-6 pr-4 text-black font-semibold text-[14px]">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                                                    <span className="font-bold text-xs text-gray-700">
                                                        {feedback.name.charAt(
                                                            0,
                                                        )}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="leading-tight">
                                                        {feedback.name}
                                                    </p>
                                                    <span className="text-[11px] text-gray-400 font-normal">
                                                        {feedback.date}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td
                                            className="py-4 px-4 text-gray-600 truncate max-w-[280px] text-[14px]"
                                            title={feedback.review}>
                                            <p className="truncate">
                                                "{feedback.review}"
                                            </p>
                                            {feedback.replyText && (
                                                <p className="text-[11px] text-emerald-600 truncate mt-0.5 font-medium flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Dibalas:{" "}
                                                    {feedback.replyText}
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="inline-flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                <span className="font-bold text-xs text-amber-800">
                                                    {feedback.rating}.0
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <button
                                                onClick={() =>
                                                    handleOpenDetail(feedback)
                                                }
                                                className="text-black hover:text-gray-600 hover:scale-110 transition-transform cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 border-0 bg-transparent inline-flex items-center justify-center"
                                                title="Lihat Detail & Balas">
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                        <td className="py-4 pl-4 pr-6 text-center font-bold text-[13px]">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                    feedback.status ===
                                                    "Telah Di Balas"
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "bg-rose-50 text-rose-600"
                                                }`}>
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        feedback.status ===
                                                        "Telah Di Balas"
                                                            ? "bg-emerald-500"
                                                            : "bg-rose-500"
                                                    }`}></span>
                                                {feedback.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-12 text-center text-gray-500 font-semibold text-[14px]">
                                        Tidak ada ulasan ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= MODAL DETAIL & BALAS ULASAN (CARD HITAM #1f1f1f) ================= */}
            {selectedFeedback && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={handleCloseDetail}
                    />
                    {/* Card Warna #1f1f1f sesuai permintaan */}
                    <div className="bg-[#1f1f1f] w-full max-w-lg rounded-[24px] p-7 shadow-2xl relative text-white border border-gray-800 z-10 animate-in zoom-in-95 duration-200">
                        {/* Header Modal */}
                        <div className="flex items-start justify-between mb-5 border-b border-gray-800 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    {selectedFeedback.name}
                                </h2>
                                <div className="flex items-center gap-1.5 mt-2">
                                    {/* Render Bintang Rating */}
                                    {[...Array(5)].map((_, index) => (
                                        <Star
                                            key={index}
                                            className={`w-4 h-4 ${
                                                index < selectedFeedback.rating
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-600"
                                            }`}
                                        />
                                    ))}
                                    <span className="ml-2 text-xs font-semibold text-gray-400">
                                        ({selectedFeedback.rating} dari 5
                                        Bintang)
                                    </span>
                                </div>
                            </div>

                            {/* Tombol Cancel / Silang (X) */}
                            <button
                                onClick={handleCloseDetail}
                                className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer border-0 bg-transparent"
                                title="Batal / Tutup">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Isi Ulasan */}
                        <div className="mb-5">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Ulasan Pengunjung:
                            </p>
                            <div className="bg-[#2a2a2a] p-4 rounded-xl text-gray-200 leading-relaxed italic border border-gray-700/60 text-sm">
                                "{selectedFeedback.review}"
                            </div>
                        </div>

                        {/* Status Saat Ini */}
                        <div className="mb-4 flex items-center justify-between text-xs text-gray-400">
                            <span>Status:</span>
                            <span
                                className={`px-2.5 py-0.5 rounded-full font-bold ${
                                    selectedFeedback.status === "Telah Di Balas"
                                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                        : "bg-rose-950 text-rose-400 border border-rose-800"
                                }`}>
                                {selectedFeedback.status}
                            </span>
                        </div>

                        {/* Form Balasan Admin */}
                        <form onSubmit={handleSendReply} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    {selectedFeedback.status ===
                                    "Telah Di Balas"
                                        ? "Edit Balasan:"
                                        : "Tulis Balasan Admin:"}
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Tulis balasan resmi untuk ulasan ini..."
                                    value={replyInput}
                                    onChange={(e) =>
                                        setReplyInput(e.target.value)
                                    }
                                    className="w-full px-4 py-3 bg-[#121212] border border-gray-700 rounded-xl focus:ring-2 focus:ring-white focus:outline-none text-white resize-none placeholder-gray-500 text-sm"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                                {/* Tombol Batal/Cancel */}
                                <button
                                    type="button"
                                    onClick={handleCloseDetail}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-600 text-gray-300 font-semibold hover:bg-gray-800 transition-colors cursor-pointer text-sm">
                                    <X className="w-4 h-4" /> Batal
                                </button>

                                {/* Tombol Kirim */}
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm border-0"
                                    disabled={replyInput.trim() === ""}>
                                    <Send className="w-4 h-4" /> Kirim Balasan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
