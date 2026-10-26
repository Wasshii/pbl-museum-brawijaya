import { DEFAULT_AVATAR } from "@/lib/constants";
import { tanggalPanjang } from "@/lib/format";
import { readStorage, writeStorage } from "@/lib/storage";
import type { User, UserFormValues } from "@/types/user";

const KEY = "museum_users";

// Pindahkan array initialUsers dari user/page.tsx ke sini
const DUMMY_USERS: User[] = [
    // { id: 1, name: 'Hendra Kedura', phone: '0812991817265', ... },
];

export const getUsers = async (): Promise<User[]> =>
    readStorage<User[]>(KEY, DUMMY_USERS);

export const createUser = async (values: UserFormValues): Promise<User> => {
    const users = await getUsers();
    const user: User = {
        ...values,
        id: Date.now(),
        createdAt: tanggalPanjang(),
        avatar: DEFAULT_AVATAR,
    };
    writeStorage(KEY, [user, ...users]);
    return user;
};

export const updateUser = async (user: User): Promise<User> => {
    const users = await getUsers();
    writeStorage(
        KEY,
        users.map((u) => (u.id === user.id ? user : u)),
    );
    return user;
};

export const deleteUser = async (id: number): Promise<void> => {
    const users = await getUsers();
    writeStorage(
        KEY,
        users.filter((u) => u.id !== id),
    );
};
