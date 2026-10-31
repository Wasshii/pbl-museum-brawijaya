"use client";
import { X, Send, Star } from "lucide-react";
import type { FeedbackData } from "@/types/feedback";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    feedback: FeedbackData | null;
    replyText: string;
    setReplyText: (text: string) => void;
    loading: boolean;
}

export default function FeedbackReplyModal({
    isOpen,
    onClose,
    onSubmit,
    feedback,
    replyText,
    setReplyText,
    loading,
}: Props) {
    if (!isOpen || !feedback) return null;

    const sudahDibalas = Boolean(feedback.balasan);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Klik area gelap untuk menutup */}
            <div
                className="absolute inset-0 cursor-pointer"
                onClick={onClose}
            />

            <div className="bg-[#1f1f1f] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[24px] p-7 shadow-2xl relative text-white border border-gray-800 z-10 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-5 border-b border-gray-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight m-0">
                            {feedback.nama_user}
                        </h2>
                        <div className="flex items-center gap-1.5 mt-2">
                            {[...Array(5)].map((_, index) => (
                                <Star
                                    key={index}
                                    className={`w-4 h-4 ${
                                        index < feedback.rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-600"
                                    }`}
                                />
                            ))}
                            <span className="ml-2 text-xs font-semibold text-gray-400">
                                ({feedback.rating} dari 5 Bintang)
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer border-0 bg-transparent"
                        title="Batal / Tutup">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Isi ulasan */}
                <div className="mb-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 mt-0">
                        Ulasan Pengunjung:
                    </p>
                    <div className="bg-[#2a2a2a] p-4 rounded-xl text-gray-200 leading-relaxed italic border border-gray-700/60 text-sm">
                        &quot;{feedback.komentar}&quot;
                    </div>
                </div>

                {/* Status saat ini */}
                <div className="mb-4 flex items-center justify-between text-xs text-gray-400">
                    <span>Status:</span>
                    <span
                        className={`px-2.5 py-0.5 rounded-full font-bold ${
                            sudahDibalas
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : "bg-rose-950 text-rose-400 border border-rose-800"
                        }`}>
                        {sudahDibalas ? "Telah Di Balas" : "Belum Di Balas"}
                    </span>
                </div>

                {/* Form balasan admin */}
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            {sudahDibalas
                                ? "Edit Balasan:"
                                : "Tulis Balasan Admin:"}
                        </label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Tulis balasan resmi untuk ulasan ini..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full px-4 py-3 bg-[#121212] border border-gray-700 rounded-xl focus:ring-2 focus:ring-white focus:outline-none text-white resize-none placeholder-gray-500 text-sm"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-600 bg-transparent text-gray-300 font-semibold hover:bg-gray-800 transition-colors cursor-pointer text-sm">
                            <X className="w-4 h-4" /> Batal
                        </button>

                        <button
                            type="submit"
                            disabled={loading || replyText.trim() === ""}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm border-0">
                            <Send className="w-4 h-4" />
                            {loading ? "Mengirim..." : "Kirim Balasan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
