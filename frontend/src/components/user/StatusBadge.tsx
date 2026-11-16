import { labelStatus } from "@/lib/user";
import type { User } from "@/types/user";

interface Props {
    user: Pick<User, "status" | "lastActiveAt">;
    now: number; // waktu sekarang (ms), untuk menghitung "Offline 5 menit lalu"
    withDot?: boolean; // true = versi tabel (ada titik), false = versi modal detail
}

export default function StatusBadge({ user, now, withDot = false }: Props) {
    const online = user.status === "Online";
    const teks = labelStatus(user, now);
    const warna = online
        ? "bg-emerald-50 text-emerald-600"
        : "bg-rose-50 text-rose-600";

    if (withDot) {
        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${warna}`}>
                <span
                    className={`w-1.5 h-1.5 rounded-full ${online ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                {teks}
            </span>
        );
    }

    return (
        <span
            className={`px-3 py-1 mt-2 rounded-full text-xs font-bold ${warna}`}>
            {teks}
        </span>
    );
}
