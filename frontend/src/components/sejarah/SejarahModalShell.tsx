"use client";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    /** Warna overlay, default hitam transparan 40% */
    overlayClassName?: string;
    /** Lebar, warna, radius, dan padding kartu */
    panelClassName?: string;
}

// Cangkang modal KHUSUS menu Koleksi Sejarah.
// Dibuat terpisah supaya komponen bersama (ui/Modal, ui/ConfirmDeleteModal)
// yang dipakai menu Keuangan, User, dan Feedback tidak ikut berubah.
export default function SejarahModalShell({
    isOpen,
    onClose,
    children,
    overlayClassName = "bg-black/40",
    panelClassName = "",
}: Props) {
    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 ${overlayClassName}`}>
            <div
                className="absolute inset-0 cursor-pointer"
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                className={`relative z-10 w-full animate-in zoom-in-95 duration-200 ${panelClassName}`}>
                {children}
            </div>
        </div>
    );
}
