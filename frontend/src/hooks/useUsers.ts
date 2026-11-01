"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { useCache } from "@/hooks/useCache";
import { CACHE_KEYS, removeCache } from "@/lib/cache";
import * as userService from "@/services/user.service";
import type { User, UserFormValues } from "@/types/user";

const DAFTAR_KOSONG: User[] = [];

export function useUsers() {
    const { notify } = useToast();

    // Data user: dari cache (5 menit) bila ada, kalau tidak dari API.
    // `update` mengubah tampilan sekaligus cache tanpa memuat ulang dari API.
    const { data, loading, update } = useCache<User[]>(
        CACHE_KEYS.users,
        userService.getUsers,
    );
    const users = data ?? DAFTAR_KOSONG;

    const [search, setSearch] = useState("");

    // Filter pencarian: nama, email, atau nomor telepon
    const filteredUsers = useMemo(() => {
        const q = search.toLowerCase();
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                u.phone.includes(search),
        );
    }, [users, search]);

    const addUser = async (values: UserFormValues) => {
        const created = await userService.createUser(values);
        update((prev) => [created, ...prev]);
        removeCache(CACHE_KEYS.dashboard); // jumlah user di dashboard bertambah
        notify({
            type: "create",
            title: "User ditambahkan",
            message: `${created.name} berhasil ditambahkan.`,
        });
    };

    const editUser = async (user: User) => {
        await userService.updateUser(user);
        update((prev) => prev.map((u) => (u.id === user.id ? user : u)));
        notify({
            type: "edit",
            title: "Data diperbarui",
            message: `Data ${user.name} berhasil diubah.`,
        });
    };

    const removeUser = async (user: User) => {
        await userService.deleteUser(user.id);
        update((prev) => prev.filter((u) => u.id !== user.id));
        removeCache(CACHE_KEYS.dashboard); // jumlah user di dashboard berkurang
        notify({
            type: "delete",
            title: "User dihapus",
            message: `${user.name} berhasil dihapus.`,
        });
    };

    return {
        users: filteredUsers,
        loading,
        search,
        setSearch,
        addUser,
        editUser,
        removeUser,
    };
}
