"use client";
import { Menu, Bell } from "lucide-react";
import { ADMIN_NAME } from "@/lib/constants";
import Image from "next/image";

interface Props {
    onMenuClick: () => void;
    onNotificationClick: () => void;
}

export default function Header({ onMenuClick, onNotificationClick }: Props) {
    return (
        <header className="sticky top-0 z-20 bg-[#f5f5f5] h-[90px] border-b border-[#dddddd] flex items-center justify-between px-5 md:px-[40px]">
            <div className="flex items-center gap-4">
                <button
                    className="md:hidden border-0 bg-transparent p-0 text-[#111]"
                    onClick={onMenuClick}>
                    <Menu className="w-[30px] h-[30px]" />
                </button>
                <h1 className="m-0 text-[20px] md:text-[24px] font-bold tracking-tight text-black">
                    Welcome, {ADMIN_NAME}
                </h1>
            </div>
            <div className="flex items-center gap-4 md:gap-[24px]">
                <button
                    className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] rounded-full border-0 bg-[#222] text-white flex items-center justify-center cursor-pointer shadow-sm hover:bg-black transition-colors"
                    onClick={onNotificationClick}>
                    <Bell className="w-[20px] h-[20px] md:w-[22px] md:h-[22px] stroke-[2]" />
                </button>
                <div className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] rounded-full overflow-hidden border-[2.5px] border-white shadow-sm cursor-pointer shrink-0">
                    <Image
                        src="/images/logo-profil.jfif"
                        alt="Foto Profil"
                        width={50}
                        height={50}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </header>
    );
}
