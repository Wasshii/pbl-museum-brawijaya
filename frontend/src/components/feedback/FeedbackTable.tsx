"use client";
import { MessageSquareReply, Eye } from "lucide-react";
import { FeedbackData } from "@/hooks/useFeedback";

interface Props {
    feedbacks: FeedbackData[];
    onReply: (item: FeedbackData) => void;
}

export default function FeedbackTable({ feedbacks, onReply }: Props) {
    // Fungsi pembuat bintang rating
    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden mt-6 overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
                <thead>
                    <tr className="bg-[#6C9E78] text-white text-left">
                        <th className="py-4 px-6 font-semibold w-16">No</th>
                        <th className="py-4 px-6 font-semibold w-1/4">
                            Nama User
                        </th>
                        <th className="py-4 px-6 font-semibold w-32">Rating</th>
                        <th className="py-4 px-6 font-semibold w-auto">
                            Komentar
                        </th>
                        <th className="py-4 px-6 font-semibold text-center w-32">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.map((item, index) => (
                        <tr
                            key={item.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-6">{index + 1}</td>
                            <td className="py-4 px-6">
                                <p className="font-medium text-gray-900 m-0">
                                    {item.nama_user}
                                </p>
                                <p className="text-xs text-gray-500 m-0 mt-1">
                                    {item.tanggal}
                                </p>
                            </td>
                            <td className="py-4 px-6">
                                {renderStars(item.rating)}
                            </td>
                            <td className="py-4 px-6 text-gray-600">
                                <p className="truncate max-w-xs m-0">
                                    {item.komentar}
                                </p>
                                {item.balasan && (
                                    <p className="text-xs text-[#4a8a5b] font-medium mt-1 truncate max-w-xs">
                                        Dibales: {item.balasan}
                                    </p>
                                )}
                            </td>
                            <td className="py-4 px-6 text-center">
                                <button
                                    onClick={() => onReply(item)}
                                    className={`p-2 rounded-lg transition shadow-sm inline-flex items-center justify-center ${item.balasan ? "bg-[#6C9E78] text-white hover:bg-opacity-80" : "bg-[#f0ad4e] text-white hover:bg-opacity-80"}`}
                                    title={
                                        item.balasan
                                            ? "Lihat Detail"
                                            : "Balas Ulasan"
                                    }>
                                    {item.balasan ? (
                                        <Eye className="w-4 h-4" />
                                    ) : (
                                        <MessageSquareReply className="w-4 h-4" />
                                    )}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {feedbacks.length === 0 && (
                        <tr>
                            <td
                                colSpan={5}
                                className="py-12 text-center text-gray-500 font-medium">
                                Tidak ada ulasan ditemukan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
