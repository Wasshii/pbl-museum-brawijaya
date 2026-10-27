"use client";
import Modal from "@/components/ui/Modal";
import { FeedbackData } from "@/hooks/useFeedback";

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
    if (!feedback) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detail & Balas Ulasan">
            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="font-semibold text-gray-900 m-0">
                                {feedback.nama_user}
                            </p>
                            <p className="text-xs text-gray-500 m-0">
                                {feedback.tanggal}
                            </p>
                        </div>
                        <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                            ★ {feedback.rating}
                        </div>
                    </div>
                    <p className="text-gray-700 text-sm mt-3 m-0 italic">
                        "{feedback.komentar}"
                    </p>
                </div>

                <form onSubmit={onSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Balasan Anda
                        </label>
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6C9E78] focus:ring-1 focus:ring-[#6C9E78] min-h-[100px] resize-none"
                            required
                            placeholder="Tuliskan balasan untuk ulasan ini..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 text-white bg-[#6C9E78] rounded-xl hover:bg-[#5a8664] transition-colors font-medium disabled:opacity-50">
                            {loading ? "Mengirim..." : "Kirim Balasan"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
