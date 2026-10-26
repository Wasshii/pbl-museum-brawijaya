import { readStorage, writeStorage } from "@/lib/storage";
import type { Feedback } from "@/types/feedback";

const KEY = "museum_feedback";

// Data dummy dibiarkan kosong
const DUMMY_FEEDBACKS: Feedback[] = [];

export const getFeedbacks = async (): Promise<Feedback[]> =>
    readStorage<Feedback[]>(KEY, DUMMY_FEEDBACKS);

export const replyFeedback = async (
    id: number,
    replyText: string,
): Promise<Feedback> => {
    const feedbacks = await getFeedbacks();
    let umpanBalikDiperbarui: Feedback | undefined;

    const feedbacksBaru = feedbacks.map((f) => {
        if (f.id === id) {
            // Mengubah status menjadi "Telah Di Balas" dan memasukkan teks balasan
            umpanBalikDiperbarui = {
                ...f,
                replyText,
                status: "Telah Di Balas",
            };
            return umpanBalikDiperbarui;
        }
        return f;
    });

    if (!umpanBalikDiperbarui) {
        throw new Error("Feedback tidak ditemukan");
    }

    writeStorage(KEY, feedbacksBaru);
    return umpanBalikDiperbarui;
};
