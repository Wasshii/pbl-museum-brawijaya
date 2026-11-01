import { api } from "@/lib/api";
import type {
    KeuanganResponse,
    TambahKeuanganResult,
    TransaksiInput,
} from "@/types/keuangan";

export const getKeuangan = async (): Promise<KeuanganResponse> => {
    const response = await api.get("/api/keuangan");
    return {
        data: response.data.data,
        summary: response.data.summary,
        tarif: response.data.tarif,
        batasPencairan: response.data.batasPencairan,
    };
};

export const tambahKeuangan = async (
    data: TransaksiInput,
): Promise<TambahKeuanganResult> => {
    const response = await api.post("/api/keuangan", data);
    return {
        id: response.data.id,
        idTrx: response.data.idTrx,
        jumlah: response.data.jumlah,
    };
};
