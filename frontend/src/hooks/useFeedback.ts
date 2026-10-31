"use client";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/context/ToastContext";
import { getErrorMessage } from "@/lib/api";
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

export function useFeedback() {
    const { notify } = useToast();

    const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");

    const [modalReplyOpen, setModalReplyOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] =
        useState<FeedbackData | null>(null);
    const [replyText, setReplyText] = useState("");

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const data = await feedbackService.getFeedbacks();
            setFeedbacks(data);
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: getErrorMessage(error, "Gagal memuat data feedback"),
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            fetchFeedbacks(); // ambil ulang dari database agar status ikut terbarui
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
