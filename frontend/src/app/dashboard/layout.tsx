"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import NotificationModal from "@/components/layout/NotificationModal";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const { checking, logout } = useAuthGuard();

    // Layar kosong saat mengecek status token login
    if (checking) return <div className="min-h-screen bg-[#f5f5f5]" />;

    return (
        <div className="min-h-screen flex bg-[#f5f5f5] text-[#080808] font-sans">
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onLogout={logout}
            />

            <div className="min-w-0 flex-1 flex flex-col h-screen overflow-y-auto">
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    onNotificationClick={() => setNotifOpen(true)}
                />
                <main className="p-5 md:p-[40px] flex-1">{children}</main>
            </div>

            {notifOpen && (
                <NotificationModal onClose={() => setNotifOpen(false)} />
            )}
        </div>
    );
}
