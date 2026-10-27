"use client";
import SearchInput from "@/components/ui/SearchInput";
import FeedbackTable from "@/components/feedback/FeedbackTable";
import FeedbackReplyModal from "@/components/feedback/FeedbackReplyModal";
import { useFeedback } from "@/hooks/useFeedback";

export default function FeedbackPage() {
    const {
        feedbacks,
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
    } = useFeedback();

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-[24px] md:text-[28px] font-bold text-gray-900 tracking-tight m-0">
                    Feedback & Ulasan
                </h1>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Format onChange menggunakan callback (val) */}
                    <SearchInput
                        value={searchQuery}
                        onChange={(val) => setSearchQuery(val)}
                        placeholder="Cari nama atau komentar..."
                    />
                </div>
            </div>

            {loading && feedbacks.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#6C9E78] border-t-transparent" />
                </div>
            ) : (
                <FeedbackTable
                    feedbacks={feedbacks}
                    onReply={handleReplyClick}
                />
            )}

            <FeedbackReplyModal
                isOpen={modalReplyOpen}
                onClose={() => setModalReplyOpen(false)}
                onSubmit={submitReply}
                feedback={selectedFeedback}
                replyText={replyText}
                setReplyText={setReplyText}
                loading={loading}
            />
        </div>
    );
}
