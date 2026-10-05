import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Museum Brawijaya Dashboard",
    description: "Admin Panel Museum Brawijaya",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <body className="bg-[#f1f1f1] text-[#080808] font-sans antialiased">
                {children}
            </body>
        </html>
    );
}
