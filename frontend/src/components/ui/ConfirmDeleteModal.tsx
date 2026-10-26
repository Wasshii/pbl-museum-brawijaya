"use client";
import Modal from "@/components/ui/Modal";

interface Props {
    open: boolean;
    itemName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDeleteModal({
    open,
    itemName,
    onConfirm,
    onCancel,
}: Props) {
    return (
        <Modal
            open={open}
            onClose={onCancel}
            className="max-w-sm bg-[#1f1f1f] text-white p-6">
            <h3 className="text-lg font-bold">Hapus data?</h3>
            <p className="mt-2 text-sm text-gray-300">
                {itemName} akan dihapus permanen.
            </p>
            <div className="mt-6 flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 rounded-xl border border-white/20 py-2">
                    Batal
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 rounded-xl bg-red-500 py-2 font-semibold">
                    Hapus
                </button>
            </div>
        </Modal>
    );
}
