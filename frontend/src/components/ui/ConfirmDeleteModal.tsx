"use client";
import Modal from "@/components/ui/Modal";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string; // Dibuat opsional agar fleksibel
}

export default function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    itemName = "Data ini",
}: Props) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Hapus Data?">
            <div>
                <p className="mt-2 text-sm text-gray-600">
                    Apakah Anda yakin ingin menghapus{" "}
                    <strong>{itemName}</strong> secara permanen? Tindakan ini
                    tidak dapat dibatalkan.
                </p>
                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium border-0 cursor-pointer">
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors font-medium border-0 cursor-pointer">
                        Hapus
                    </button>
                </div>
            </div>
        </Modal>
    );
}
