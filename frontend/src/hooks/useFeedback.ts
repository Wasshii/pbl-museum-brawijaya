"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";

export interface FeedbackData {
    id: number;
    nama_user: string;
    rating: number;
    komentar: string;
    tanggal: string;
    balasan: string | null;
}

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
            // TODO: Ganti dengan fetch API dari backend
            setTimeout(() => {
                setFeedbacks([
                    {
                        id: 1,
                        nama_user: "Budi Santoso",
                        rating: 5,
                        komentar: "Aplikasi sangat bagus dan informatif!",
                        tanggal: "2026-10-26",
                        balasan: null,
                    },
                    {
                        id: 2,
                        nama_user: "Siti Aminah",
                        rating: 4,
                        komentar:
                            "Koleksinya lengkap, tapi loading kadang lambat.",
                        tanggal: "2026-10-25",
                        balasan:
                            "Terima kasih masukannya, kami akan tingkatkan performa server.",
                    },
                ]);
                setLoading(false);
            }, 500);
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: "Gagal memuat data feedback",
            });
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
            // TODO: Ganti dengan POST/PUT API balasan ke backend
            await new Promise((resolve) => setTimeout(resolve, 800));
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
                message: "Terjadi kesalahan saat mengirim balasan.",
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
