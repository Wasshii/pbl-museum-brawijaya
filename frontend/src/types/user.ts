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

export type UserFormValues = Omit<User, "id" | "createdAt" | "avatar">;
