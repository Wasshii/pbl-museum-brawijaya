export type StatusUser = "Online" | "Offline";

export interface User {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    createdAt: string;
    status: StatusUser;
    avatar: string;
}

// Isian form Tambah User (id, tanggal dibuat, dan avatar dibuat oleh sistem)
export type UserFormValues = Pick<
    User,
    "name" | "phone" | "email" | "address" | "status"
>;

// Isian form Edit User (tanggal dibuat ikut bisa diedit, sesuai kode asli)
export type UserEditValues = UserFormValues & Pick<User, "createdAt">;
