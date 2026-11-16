import { api } from "@/lib/api";
import type { User, UserFormValues } from "@/types/user";

// Bentuk data dari backend: selisih detik sejak terakhir aktif
type UserApi = Omit<User, "lastActiveAt"> & { inactiveSeconds: number | null };

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get("/api/pengunjung");
    const sekarang = Date.now();
    // Detik dari server diubah jadi waktu absolut memakai jam browser saat data diambil,
    // jadi teks "Offline 5 menit lalu" tetap benar walau jam server dan browser berbeda.
    return (response.data.data as UserApi[]).map(
        ({ inactiveSeconds, ...user }) => ({
            ...user,
            lastActiveAt:
                inactiveSeconds === null
                    ? null
                    : new Date(sekarang - inactiveSeconds * 1000).toISOString(),
        }),
    );
};

export const createUser = async (values: UserFormValues): Promise<User> => {
    const response = await api.post("/api/pengunjung", values);

    // Kembalikan objek utuh agar otomatis muncul di tabel tanpa perlu refresh halaman
    return {
        id: response.data.id,
        name: values.name,
        phone: values.phone || null,
        email: values.email || null,
        address: values.address || null,
        createdAt: new Date().toISOString().split("T")[0],
        status: "Offline", // ditambah manual oleh admin, belum pernah memakai aplikasi
        lastActiveAt: null,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    };
};

export const updateUser = async (user: User): Promise<User> => {
    await api.put(`/api/pengunjung/${user.id}`, {
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address,
    });
    return user;
};

export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/api/pengunjung/${id}`);
};
