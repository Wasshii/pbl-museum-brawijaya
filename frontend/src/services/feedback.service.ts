import { api } from "@/lib/api";
import type { FeedbackData } from "@/types/feedback";

export const getFeedbacks = async (): Promise<FeedbackData[]> => {
    const response = await api.get("/api/feedback");
    return response.data.data;
};

export const balasFeedback = async (
    id: number,
    replyText: string,
): Promise<void> => {
    await api.put(`/api/feedback/${id}/reply`, { replyText });
};
