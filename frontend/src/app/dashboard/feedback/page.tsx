"use client";
import SearchInput from "@/components/ui/SearchInput";
import FeedbackTable from "@/components/feedback/FeedbackTable";
import FeedbackReplyModal from "@/components/feedback/FeedbackReplyModal";
import { useFeedback, STATUS_FILTERS } from "@/hooks/useFeedback";

export default function FeedbackPage() {
    const {
        feedbacks,
        totalFeedbacks,
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
    } = useFeedback();

    return (
        <div className="w-full animate-in fade-in duration-500 pb-10 font-sans">
            <h1 className="text-[26px] font-bold text-black mb-8 mt-0">
                Feed Back
            </h1>

            {/* Search & filter status */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Cari Berdasarkan Nama / Ulasan"
                />

                <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-full border border-gray-200">
                    {STATUS_FILTERS.map((filter) => (
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

            {loading && totalFeedbacks === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#222222] border-t-transparent" />
                </div>
            ) : (
                <FeedbackTable
                    feedbacks={feedbacks}
                    onReply={handleReplyClick}
                />
            )}

            <FeedbackReplyModal
                isOpen={modalReplyOpen}
                onClose={handleCloseModal}
                onSubmit={submitReply}
                feedback={selectedFeedback}
                replyText={replyText}
                setReplyText={setReplyText}
                loading={submitting}
            />
        </div>
    );
}
