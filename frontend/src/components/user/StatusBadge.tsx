import type { StatusUser } from "@/types/user";

interface Props {
    status: StatusUser;
    withDot?: boolean; // true = versi tabel (ada titik), false = versi modal detail
}

export default function StatusBadge({ status, withDot = false }: Props) {
    const online = status === "Online";
    const warna = online
        ? "bg-emerald-50 text-emerald-600"
        : "bg-rose-50 text-rose-600";

    if (withDot) {
        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${warna}`}>
                <span
                    className={`w-1.5 h-1.5 rounded-full ${online ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                {status}
            </span>
        );
    }

    return (
        <span
            className={`px-3 py-1 mt-2 rounded-full text-xs font-bold ${warna}`}>
            {status}
        </span>
    );
}
