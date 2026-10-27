import {
    BookOpen,
    CircleUserRound,
    LayoutGrid,
    MessageSquare,
    WalletCards,
} from "lucide-react";

export const NAVIGATION = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { label: "Keuangan", href: "/dashboard/keuangan", icon: WalletCards },
    { label: "Koleksi Sejarah", href: "/dashboard/sejarah", icon: BookOpen },
    { label: "Data User", href: "/dashboard/user", icon: CircleUserRound },
    { label: "Feed Back", href: "/dashboard/feedback", icon: MessageSquare },
];

export const DEFAULT_KOLEKSI_IMAGE =
    "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80";

export const DEFAULT_AVATAR =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

// Sementara, nanti diganti data dari login/profil
export const ADMIN_NAME = "Alexandro Vosca";
