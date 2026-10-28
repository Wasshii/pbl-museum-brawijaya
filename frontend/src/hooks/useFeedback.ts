"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import * as feedbackService from "@/services/feedback.service";
import type { FeedbackData } from "@/types/feedback";

export function useFeedback() {
    const { notify } = useToast();

    const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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
                message: "Gagal memuat data feedback",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const filteredFeedbacks = feedbacks.filter(
        (item) =>
            item.nama_user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.komentar.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleReplyClick = (item: FeedbackData) => {
        setSelectedFeedback(item);
        setReplyText(item.balasan || "");
        setModalReplyOpen(true);
    };

    const submitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFeedback) return;

        setLoading(true);
        try {
            await feedbackService.balasFeedback(selectedFeedback.id, replyText);

            notify({
                type: "success",
                title: "Berhasil",
                message: "Balasan berhasil dikirim.",
            });
            setModalReplyOpen(false);
            fetchFeedbacks();
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: "Terjadi kesalahan saat membalas.",
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        feedbacks: filteredFeedbacks,
        loading,
        searchQuery,
        setSearchQuery,
        modalReplyOpen,
        setModalReplyOpen,
        selectedFeedback,
        replyText,
        setReplyText,
        handleReplyClick,
        submitReply,
    };
}
