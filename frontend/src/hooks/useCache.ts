"use client";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { type CacheKey, getCache, setCache } from "@/lib/cache";

interface UseCacheOptions {
    // Dipanggil bila pengambilan data gagal (mis. untuk menampilkan toast)
    onError?: (error: unknown) => void;
}

// Mengambil data dengan cache di localStorage (berlaku 5 menit).
// - Ada cache yang masih berlaku  -> langsung tampil, tanpa spinner dan tanpa request.
// - Belum ada / sudah kedaluwarsa -> ambil dari API, lalu simpan ke cache.
export function useCache<T>(
    key: CacheKey,
    fetcher: () => Promise<T>,
    { onError }: UseCacheOptions = {},
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);

    const dataRef = useRef<T | null>(null);
    const mountedRef = useRef(false);
    const fetcherRef = useRef(fetcher);
    const onErrorRef = useRef(onError);

    // Simpan fetcher & onError terbaru supaya refetch tidak ikut berubah tiap render
    useEffect(() => {
        fetcherRef.current = fetcher;
        onErrorRef.current = onError;
    });

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // Ambil ulang dari API, lalu perbarui state dan cache
    const refetch = useCallback(async () => {
        setLoading(true);
        try {
            const result = await fetcherRef.current();
            setCache(key, result); // tetap diisi walau halaman sudah ditinggalkan
            if (mountedRef.current) {
                dataRef.current = result;
                setData(result);
            }
        } catch (error) {
            if (!mountedRef.current) return;
            if (onErrorRef.current) onErrorRef.current(error);
            else console.error(`Gagal memuat data "${key}":`, error);
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [key]);

    // Ubah data lokal (dan cache) tanpa memanggil API.
    // Bila belum ada data untuk diubah, ambil ulang dari API.
    const update = useCallback(
        (updater: (prev: T) => T) => {
            if (dataRef.current === null) {
                void refetch();
                return;
            }
            const next = updater(dataRef.current);
            dataRef.current = next;
            setData(next);
            setCache(key, next);
        },
        [key, refetch],
    );

    // Dibaca setelah komponen terpasang (bukan di useState) supaya hasil render
    // server dan browser sama. useLayoutEffect dipakai agar data dari cache sudah
    // tampil sebelum browser menggambar layar, jadi spinner tidak sempat berkedip.
    useLayoutEffect(() => {
        const cached = getCache<T>(key);
        if (cached !== null) {
            dataRef.current = cached;
            setData(cached);
            setLoading(false);
        } else {
            void refetch();
        }
    }, [key, refetch]);

    return { data, loading, refetch, update };
}
