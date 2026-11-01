"use client";
import { useState, useMemo } from "react";
import { useToast } from "@/context/ToastContext";
import { useCache } from "@/hooks/useCache";
import { getErrorMessage } from "@/lib/api";
import { CACHE_KEYS } from "@/lib/cache";
import * as feedbackService from "@/services/feedback.service";
import type { FeedbackData } from "@/types/feedback";

// Tetap diekspor dari sini supaya import lama
// (import { FeedbackData } from "@/hooks/useFeedback") tidak error.
export type { FeedbackData };

export const STATUS_FILTERS = [
    "Semua",
    "Belum Di Balas",
    "Telah Di Balas",
] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

const DAFTAR_KOSONG: FeedbackData[] = [];

export function useFeedback() {
    const { notify } = useToast();

    // Data feedback: dari cache (5 menit) bila ada, kalau tidak dari API
    const {
        data,
        loading,
        refetch: fetchFeedbacks,
    } = useCache<FeedbackData[]>(
        CACHE_KEYS.feedback,
        feedbackService.getFeedbacks,
        {
            onError: (error) =>
                notify({
                    type: "error",
                    title: "Gagal",
                    message: getErrorMessage(
                        error,
                        "Gagal memuat data feedback",
                    ),
                }),
        },
    );
    const feedbacks = data ?? DAFTAR_KOSONG;

    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");

    const [modalReplyOpen, setModalReplyOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] =
        useState<FeedbackData | null>(null);
    const [replyText, setReplyText] = useState("");

    // Status diturunkan dari kolom balasan_admin (backend mengirimnya sebagai `balasan`)
    const filteredFeedbacks = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return feedbacks.filter((item) => {
            const matchesSearch =
                item.nama_user.toLowerCase().includes(q) ||
                item.komentar.toLowerCase().includes(q);

            const sudahDibalas = Boolean(item.balasan);
            const matchesStatus =
                statusFilter === "Semua" ||
                (statusFilter === "Telah Di Balas"
                    ? sudahDibalas
                    : !sudahDibalas);

            return matchesSearch && matchesStatus;
        });
    }, [feedbacks, searchQuery, statusFilter]);

    const handleReplyClick = (item: FeedbackData) => {
        setSelectedFeedback(item);
        setReplyText(item.balasan || ""); // jika sudah ada balasan, tampilkan di input
        setModalReplyOpen(true);
    };

    const handleCloseModal = () => {
        setModalReplyOpen(false);
        setReplyText("");
    };

    const submitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        const teks = replyText.trim();
        if (!selectedFeedback || teks === "") return;

        const namaUser = selectedFeedback.nama_user;

        setSubmitting(true);
        try {
            await feedbackService.balasFeedback(selectedFeedback.id, teks);

            notify({
                type: "edit",
                title: "Balasan Berhasil Dikirim!",
                message: `Balasan untuk ulasan dari ${namaUser} telah berhasil dikirim.`,
            });
            handleCloseModal();
            fetchFeedbacks(); // ambil ulang dari database, cache ikut diperbarui
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: getErrorMessage(
                    error,
                    "Terjadi kesalahan saat membalas.",
                ),
            });
        } finally {
            setSubmitting(false);
        }
    };

    return {
        feedbacks: filteredFeedbacks,
        totalFeedbacks: feedbacks.length,
        loading,
        submitting,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        modalReplyOpen,
        handleCloseModal,
        selectedFeedback,
        replyText,
        setReplyText,
        handleReplyClick,
        submitReply,
    };
}
