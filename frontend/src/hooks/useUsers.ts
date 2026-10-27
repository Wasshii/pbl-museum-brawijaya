"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/context/ToastContext";
import * as userService from "@/services/user.service";
import type { User, UserFormValues } from "@/types/user";

export function useUsers() {
    const { notify } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Data dibaca setelah komponen tampil (bukan di dalam useState) supaya
    // hasil render di server dan di browser sama, tidak memicu hydration mismatch.
    useEffect(() => {
        let active = true;
        userService.getUsers().then((data) => {
            if (!active) return;
            setUsers(data);
            setLoading(false);
        });
        return () => {
            active = false;
        };
    }, []);

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
        setUsers((prev) => [created, ...prev]);
        notify({
            type: "create",
            title: "User ditambahkan",
            message: `${created.name} berhasil ditambahkan.`,
        });
    };

    const editUser = async (user: User) => {
        await userService.updateUser(user);
        setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
        notify({
            type: "edit",
            title: "Data diperbarui",
            message: `Data ${user.name} berhasil diubah.`,
        });
    };

    const removeUser = async (user: User) => {
        await userService.deleteUser(user.id);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
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
