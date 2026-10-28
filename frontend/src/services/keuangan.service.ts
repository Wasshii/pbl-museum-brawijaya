import { api } from "@/lib/api";
import type { TransaksiData, TransaksiInput } from "@/types/keuangan";

export const getKeuangan = async (): Promise<TransaksiData[]> => {
    const response = await api.get("/api/keuangan");
    return response.data.data;
};

export const tambahKeuangan = async (data: TransaksiInput): Promise<void> => {
    await api.post("/api/keuangan", data);
};
