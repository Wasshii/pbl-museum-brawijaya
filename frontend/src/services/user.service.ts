import { DEFAULT_AVATAR } from "@/lib/constants";
import { tanggalPanjang } from "@/lib/format";
import { readStorage, writeStorage } from "@/lib/storage";
import type { User, UserFormValues } from "@/types/user";

const KEY = "museum_users";

// 10 data dummy (dipindah dari user/page.tsx). Nanti diganti data dari backend.
const DUMMY_USERS: User[] = [
    {
        id: 1,
        name: "Hendra Kedura",
        phone: "0812991817265",
        email: "hendra718@gmail.com",
        address: "Jl. Veteran No. 10, Malang",
        createdAt: "12 Agustus 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 2,
        name: "Evisa Hermina",
        phone: "081928776218",
        email: "jajakke4415@gmail.com",
        address: "Jl. Soekarno Hatta No. 4, Malang",
        createdAt: "15 Agustus 2025",
        status: "Offline",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 3,
        name: "Budi Santoso",
        phone: "082133445566",
        email: "budisantoso@gmail.com",
        address: "Jl. Ijen Boulevard No. 12, Malang",
        createdAt: "20 Agustus 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 4,
        name: "Siti Aminah",
        phone: "085677889900",
        email: "sitiaminah@yahoo.com",
        address: "Jl. MT Haryono No. 55, Malang",
        createdAt: "01 September 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 5,
        name: "Agus Pratama",
        phone: "081122334455",
        email: "aguspratama99@gmail.com",
        address: "Jl. Kawi No. 8, Malang",
        createdAt: "10 September 2025",
        status: "Offline",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 6,
        name: "Rina Kartika",
        phone: "081999888777",
        email: "rinakartika.id@gmail.com",
        address: "Jl. Galunggung No. 22, Malang",
        createdAt: "12 September 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 7,
        name: "Joko Anwar",
        phone: "082211223344",
        email: "jokoanwar_filmmaker@gmail.com",
        address: "Jl. Semeru No. 9, Malang",
        createdAt: "25 September 2025",
        status: "Offline",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 8,
        name: "Dewi Lestari",
        phone: "081344556677",
        email: "dewilestari@book.com",
        address: "Jl. Tlogomas No. 11, Malang",
        createdAt: "02 Oktober 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 9,
        name: "Andi Wijaya",
        phone: "085712341234",
        email: "andiwijaya_cool@gmail.com",
        address: "Jl. S. Supriadi No. 7, Malang",
        createdAt: "05 Oktober 2025",
        status: "Offline",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 10,
        name: "Maya Sari",
        phone: "081233221144",
        email: "mayasari.beauty@gmail.com",
        address: "Jl. Dieng No. 15, Malang",
        createdAt: "10 Oktober 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 11,
        name: "Fajar Prasetyo",
        phone: "081277665544",
        email: "fajar.prasetyo@gmail.com",
        address: "Jl. Borobudur No. 20, Malang",
        createdAt: "15 Oktober 2025",
        status: "Online",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    },
    {
        id: 12,
        name: "Nurul Hidayati",
        phone: "085811223344",
        email: "nurul.hidayati@gmail.com",
        address: "Jl. Candi Mendut No. 5, Malang",
        createdAt: "18 Oktober 2025",
        status: "Offline",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    },
];

// Semua fungsi async supaya bentuknya sama dengan pemanggilan API nanti.
// Saat backend siap, cukup ganti isi fungsi di bawah dengan api.get / api.post / dst.
export const getUsers = async (): Promise<User[]> =>
    readStorage<User[]>(KEY, DUMMY_USERS);

export const createUser = async (values: UserFormValues): Promise<User> => {
    const users = await getUsers();
    const user: User = {
        id: Date.now(),
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: values.address,
        status: values.status,
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
