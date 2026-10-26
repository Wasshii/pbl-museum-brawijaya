export type StatusFeedback = "Telah Di Balas" | "Belum Di Balas";

export interface Feedback {
    id: number;
    name: string;
    review: string;
    rating: number;
    status: StatusFeedback;
    replyText?: string;
    date: string;
}
