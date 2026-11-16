export type StatusUser = "Online" | "Offline";

export interface User {
    id: number;
    name: string;
    phone: string | null; // null = mendaftar lewat email -> tampil "-"
    email: string | null; // null = mendaftar lewat nomor telepon -> tampil "-"
    address: string | null;
    createdAt: string;
    status: StatusUser;
    // Kapan terakhir terlihat aktif (ISO). null = belum pernah memakai aplikasi.
    lastActiveAt: string | null;
    avatar: string;
}

// Isian form Tambah/Edit User. Kolom kosong = "" di form, disimpan sebagai null.
// Status tidak ada di form: Online/Offline diatur otomatis oleh aplikasi mobile.
export interface UserFormValues {
    name: string;
    phone: string;
    email: string;
    address: string;
}

// Isian form Edit User (tanggal dibuat ikut bisa diedit, sesuai kode asli)
export type UserEditValues = UserFormValues & Pick<User, "createdAt">;
