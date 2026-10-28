import { api } from "@/lib/api";
import type { User, UserFormValues } from "@/types/user";

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get("/api/pengunjung");
    return response.data.data;
};

export const createUser = async (values: UserFormValues): Promise<User> => {
    const response = await api.post("/api/pengunjung", values);

    // Kembalikan objek utuh agar otomatis muncul di tabel tanpa perlu refresh halaman
    return {
        ...values,
        id: response.data.id,
        createdAt: new Date().toISOString().split("T")[0],
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    };
};

export const updateUser = async (user: User): Promise<User> => {
    await api.put(`/api/pengunjung/${user.id}`, user);
    return user;
};

export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/api/pengunjung/${id}`);
};
