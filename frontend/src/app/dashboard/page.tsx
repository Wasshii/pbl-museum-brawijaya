"use client";

import { useState } from "react";
import {
    ArrowRight,
    Bell,
    BookOpen,
    ChevronRight,
    CircleUserRound,
    DoorOpen,
    LayoutGrid,
    LogOut,
    Menu,
    MessageSquare,
    WalletCards,
    LucideIcon,
} from "lucide-react";

const navigation = [
    { label: "Dashboard", icon: LayoutGrid },
    { label: "Keuangan", icon: WalletCards },
    { label: "Koleksi Sejarah", icon: BookOpen },
    { label: "Data User", icon: CircleUserRound },
    { label: "Feed Back", icon: MessageSquare },
];

function SummaryCard({
    title,
    date,
    value,
    icon: Icon,
    iconClass,
    detail = true,
}: {
    title: string;
    date: string;
    value: string;
    icon: LucideIcon;
    iconClass: string;
    detail?: boolean;
}) {
    return (
        <article className="bg-[#202020] text-[#f8f8f8] rounded-[35px] min-h-[200px] p-[23px_26px_22px] flex flex-col">
            <div className="flex items-start justify-between gap-2.5">
                <div>
                    <h3 className="m-0 text-[21px] leading-[1.15] font-bold">
                        {title}
                    </h3>
                    <p className="text-[#a5a5a5] text-base mt-2 mb-0 font-bold">
                        {date}
                    </p>
                </div>
                <Icon
                    className={`w-[31px] h-[31px] stroke-[2.4] ${iconClass}`}
                />
            </div>
            <p className="text-[21px] font-bold mt-[16px] mb-0">{value}</p>
            {detail && (
                <button
                    className="inline-flex items-center gap-[9px] p-0 mt-auto border-0 bg-transparent text-[#a5a5a5] font-bold text-base cursor-pointer text-left"
                    type="button">
                    Lihat Lebih Detail <ChevronRight className="w-5 h-5" />
                </button>
            )}
        </article>
    );
}

export default function Page() {
    const [active, setActive] = useState("Dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-[#f1f1f1] text-[#080808] font-sans">
            {/* Sidebar */}
            <aside
                className={`fixed md:relative z-20 w-[285px] shrink-0 min-h-screen bg-[#050505] text-[#f7f7f7] p-[31px_24px_28px] flex flex-col transition-transform duration-250 ease-in-out ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                }`}>
                <div className="flex items-center gap-[20px] px-[2px]">
                    <div
                        className="w-[44px] h-[46px] border-2 border-[#c9b56d] text-[#c9b56d] grid place-items-center font-serif font-bold text-[21px]"
                        style={{
                            clipPath:
                                "polygon(12% 0, 88% 0, 100% 82%, 50% 100%, 0 82%)",
                        }}>
                        B
                    </div>
                    <div className="text-[21px] font-bold leading-[1.12] tracking-tight">
                        Museum
                        <br />
                        Brawijaya
                    </div>
                    <button
                        className="md:hidden ml-auto w-[29px] h-[29px] border-2 border-white rounded-[6px] bg-transparent p-0 flex items-center justify-center cursor-pointer"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Tutup menu">
                        <span className="h-full w-[2px] bg-white block mr-[2px]" />
                        <span className="h-full w-[2px] bg-white block" />
                    </button>
                </div>

                <div className="h-[1px] bg-[#a1a1a1] my-[34px] opacity-90" />

                <nav className="flex flex-col gap-[24px]">
                    {navigation.map(({ label, icon: Icon }) => (
                        <button
                            type="button"
                            key={label}
                            className={`flex items-center gap-[25px] w-full min-h-[62px] px-[20px] py-[12px] border-0 rounded-[40px] text-left text-[21px] font-bold cursor-pointer transition-colors ${
                                active === label
                                    ? "text-white bg-[#343434]"
                                    : "text-[#adadad] bg-transparent hover:text-white"
                            }`}
                            onClick={() => {
                                setActive(label);
                                setSidebarOpen(false);
                            }}>
                            <Icon className="w-[34px] h-[34px] shrink-0 stroke-[1.8]" />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>

                <button
                    className="mt-auto text-white bg-transparent border-0 p-[15px_20px] cursor-pointer self-start"
                    type="button"
                    aria-label="Keluar">
                    <LogOut className="w-[34px] h-[34px] stroke-[1.8]" />
                </button>
            </aside>

            {/* Overlay Mobile */}
            {sidebarOpen && (
                <button
                    className="md:hidden fixed inset-0 bg-black/50 border-0 z-10"
                    aria-label="Tutup navigasi"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="min-w-0 flex-1">
                <header className="h-[84px] md:h-[112px] border-b border-[#b8b8b8] flex items-center justify-between px-5 md:px-[60px] md:pl-[33px] gap-4">
                    <button
                        className="md:hidden border-0 bg-transparent p-0 text-[#111]"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Buka menu">
                        <Menu className="w-[25px] h-[25px]" />
                    </button>

                    <h1 className="m-0 text-[17px] md:text-[21px] font-bold tracking-tight flex-1 md:flex-none">
                        Welcome Alexandro Vosca
                    </h1>

                    <div className="flex items-center gap-3 md:gap-[37px]">
                        <div className="relative">
                            <button
                                className="w-[45px] h-[45px] md:w-[62px] md:h-[62px] rounded-full border-0 bg-[#222] text-white grid place-items-center cursor-pointer"
                                onClick={() =>
                                    setNotificationsOpen(!notificationsOpen)
                                }
                                aria-label="Notifikasi">
                                <Bell className="w-[21px] h-[21px] md:w-[26px] md:h-[26px] stroke-[1.8]" />
                            </button>
                            {notificationsOpen && (
                                <div className="absolute top-[73px] right-[-50px] md:right-0 min-w-[210px] p-[14px_16px] text-[#222] bg-white border border-[#ddd] rounded-[10px] shadow-lg text-xs md:text-sm z-30">
                                    Tidak ada notifikasi baru
                                </div>
                            )}
                        </div>

                        <div className="w-[45px] h-[45px] md:w-[64px] md:h-[64px] rounded-full bg-gradient-to-br from-[#d0b85f] via-[#6b5949] to-[#d3d3d3] grid place-items-center text-white font-bold text-xs md:text-base border border-[#d0d0d0]">
                            AV
                        </div>
                    </div>
                </header>

                <main className="p-[32px_20px_48px] md:p-[46px_33px_70px] max-w-[1040px]">
                    <section>
                        <h2 className="text-[27px] md:text-[32px] leading-tight m-0 mb-[20px] md:mb-[28px] tracking-tight font-bold">
                            Keuangan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-[36px]">
                            <SummaryCard
                                title="Uang Masuk"
                                date="10 / 7 / 2026"
                                value="Rp. 400.000"
                                icon={DoorOpen}
                                iconClass="text-[#00ff1a]"
                            />
                            <SummaryCard
                                title="Uang Keluar"
                                date="10 / 7 / 2026"
                                value="Rp. 100.000"
                                icon={ArrowRight}
                                iconClass="text-[#ff0810]"
                            />
                            <SummaryCard
                                title="Total Pengunjung"
                                date="10 / 7 / 2026"
                                value="40 Orang"
                                icon={CircleUserRound}
                                iconClass="text-white"
                            />
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-[292px_292px] gap-[34px] md:gap-[36px] mt-[36px] md:mt-[51px]">
                        <section>
                            <h2 className="text-[27px] md:text-[32px] leading-tight m-0 mb-[20px] md:mb-[28px] tracking-tight font-bold">
                                Data User
                            </h2>
                            <article className="bg-[#202020] text-[#f8f8f8] rounded-[35px] min-h-[280px] md:min-h-[307px] p-[23px_26px_24px] flex flex-col">
                                <h3 className="m-0 text-[21px] font-bold">
                                    User
                                </h3>
                                <p className="text-base font-bold my-[23px]">
                                    Total User 60
                                </p>
                                <div className="h-[1px] bg-[#bdbdbd] mb-[17px]" />
                                <p className="flex items-center gap-[17px] text-[19px] m-0 mb-6">
                                    <CircleUserRound className="w-[25px] h-[25px] stroke-2 text-[#00ff1a]" />
                                    <strong>10 User Aktif</strong>
                                </p>
                                <p className="flex items-center gap-[17px] text-[19px] m-0 mb-6">
                                    <CircleUserRound className="w-[25px] h-[25px] stroke-2 text-[#ff0810]" />
                                    <strong>50 User Tidak Aktif</strong>
                                </p>
                                <button
                                    className="inline-flex items-center gap-[9px] p-0 mt-auto border-0 bg-transparent text-[#a5a5a5] font-bold text-base cursor-pointer text-left"
                                    type="button">
                                    Lihat Lebih Detail{" "}
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </article>
                        </section>

                        <section>
                            <h2 className="text-[27px] md:text-[32px] leading-tight m-0 mb-[20px] md:mb-[28px] tracking-tight font-bold">
                                Feed Back
                            </h2>
                            <article className="bg-[#202020] text-[#f8f8f8] rounded-[35px] min-h-[280px] md:min-h-[307px] p-[23px_26px_24px] flex flex-col">
                                <h3 className="m-0 text-[21px] font-bold">
                                    Ulasan
                                </h3>
                                <p className="text-[60px] leading-none font-bold mt-[38px] mb-0">
                                    50
                                </p>
                                <button
                                    className="inline-flex items-center gap-[9px] p-0 mt-auto border-0 bg-transparent text-[#a5a5a5] font-bold text-base cursor-pointer text-left"
                                    type="button">
                                    Lihat Lebih Detail{" "}
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </article>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
