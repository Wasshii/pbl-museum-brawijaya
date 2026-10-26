import { DEFAULT_KOLEKSI_IMAGE } from "@/lib/constants";
import { todayISO } from "@/lib/format";
import { readStorage, writeStorage } from "@/lib/storage";
import type { Koleksi, KoleksiFormValues } from "@/types/koleksi";

const KEY = "museum_koleksi";

// Data dummy dibiarkan kosong, nanti akan terisi otomatis saat kita tambah data di web
const DUMMY_KOLEKSI: Koleksi[] = [];

export const getKoleksi = async (): Promise<Koleksi[]> =>
    readStorage<Koleksi[]>(KEY, DUMMY_KOLEKSI);

export const createKoleksi = async (
    values: KoleksiFormValues,
): Promise<Koleksi> => {
    const koleksiList = await getKoleksi();

    const baru: Koleksi = {
        ...values,
        id: Date.now(),
        tanggal: todayISO(), // Diisi otomatis sesuai instruksi PDF
        gambar: values.gambar || DEFAULT_KOLEKSI_IMAGE, // Gambar default jika kosong
    };

    writeStorage(KEY, [baru, ...koleksiList]);
    return baru;
};

export const updateKoleksi = async (koleksi: Koleksi): Promise<Koleksi> => {
    const koleksiList = await getKoleksi();

    const diperbarui: Koleksi = {
        ...koleksi,
        tanggal: todayISO(), // Diperbarui otomatis sesuai instruksi PDF
        gambar: koleksi.gambar || DEFAULT_KOLEKSI_IMAGE,
    };

    writeStorage(
        KEY,
        koleksiList.map((k) => (k.id === koleksi.id ? diperbarui : k)),
    );
    return diperbarui;
};

export const deleteKoleksi = async (id: number): Promise<void> => {
    const koleksiList = await getKoleksi();
    writeStorage(
        KEY,
        koleksiList.filter((k) => k.id !== id),
    );
};
