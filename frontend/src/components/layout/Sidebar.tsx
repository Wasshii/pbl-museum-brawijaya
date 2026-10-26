"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { NAVIGATION } from "@/lib/constants";

interface Props {
    open: boolean;
    onClose: () => void;
    onLogout: () => void;
}

export default function Sidebar({ open, onClose, onLogout }: Props) {
    const pathname = usePathname();

    return (
        <>
            <aside
                className={`fixed md:relative z-40 w-[285px] shrink-0 min-h-screen bg-[#050505] text-[#f7f7f7] p-[31px_24px_28px] flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
                <div className="flex items-center justify-between px-[2px]">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3"
                        onClick={onClose}>
                        <div className="bg-white rounded-lg p-1 flex items-center justify-center">
                            <Image
                                src="/images/logo_museum.jpg"
                                alt="Logo Museum Brawijaya"
                                width={38}
                                height={38}
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px] font-bold leading-tight text-white">
                                Museum
                            </span>
                            <span className="text-[16px] font-bold leading-tight text-[#B5852A]">
                                Brawijaya
                            </span>
                        </div>
                    </Link>
                    <button
                        className="md:hidden w-[29px] h-[29px] border-2 border-white rounded-[6px] bg-transparent p-0 flex items-center justify-center cursor-pointer ml-auto"
                        onClick={onClose}>
                        <span className="h-[15px] w-[2px] bg-white block mr-[4px] rotate-45 translate-x-[3px]" />
                        <span className="h-[15px] w-[2px] bg-white block -rotate-45 -translate-x-[3px]" />
                    </button>
                </div>
                <div className="h-[1px] bg-[#a1a1a1] my-[34px] opacity-90" />

                <nav className="flex flex-col gap-[16px]">
                    {NAVIGATION.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                href={href}
                                key={label}
                                onClick={onClose}
                                className={`flex items-center gap-[20px] w-full min-h-[56px] px-[20px] py-[12px] border-0 rounded-[40px] text-left text-[18px] md:text-[20px] font-bold cursor-pointer transition-colors ${isActive ? "text-white bg-[#343434]" : "text-[#adadad] hover:text-white hover:bg-[#222]"}`}>
                                <Icon className="w-[28px] h-[28px] shrink-0 stroke-[1.8]" />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={onLogout}
                    className="mt-auto text-[#ff4c4c] hover:text-red-400 hover:bg-[#222] rounded-full flex items-center gap-[20px] bg-transparent border-0 p-[15px_20px] cursor-pointer self-start transition-colors w-full">
                    <LogOut className="w-[28px] h-[28px] stroke-[1.8]" />
                    <span className="text-[18px] font-bold">Keluar</span>
                </button>
            </aside>

            {open && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 z-30"
                    onClick={onClose}
                />
            )}
        </>
    );
}
