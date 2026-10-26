import Image from "next/image";
import type { ReactNode } from "react";

export default function AuthShell({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-5xl flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 flex justify-center p-4">
                    <div className="relative w-[350px] h-[500px] rounded-[30px] overflow-hidden">
                        <Image
                            src="/images/Museum_Brawijaya_1.jpg"
                            alt="Museum Brawijaya"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-center">
                            <h2 className="text-white text-xl font-bold mb-2">
                                Museum Brawijaya
                            </h2>
                            <p className="text-gray-300 text-sm">
                                Temukan Sejarah Tersembunyi
                                <br />
                                Yang Tidak Anda Ketahui
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-8 md:pl-12">
                    <h1 className="text-white text-4xl font-semibold mb-12">
                        {title}
                    </h1>
                    {children}
                </div>
            </div>
        </div>
    );
}
