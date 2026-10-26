"use client";
import Modal from "@/components/ui/Modal";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export default function UserDetailModal({ isOpen, onClose, user }: Props) {
    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detail Lengkap User">
            <div className="space-y-5">
                <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Nama Lengkap
                    </span>
                    <span className="font-medium text-gray-900 text-lg">
                        {user.username}
                    </span>
                </div>
                <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Alamat Email
                    </span>
                    <span className="font-medium text-gray-900">
                        {user.email}
                    </span>
                </div>
                <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Nomor HP
                    </span>
                    <span className="font-medium text-gray-900">
                        {user.no_telp}
                    </span>
                </div>
                <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Hak Akses (Role)
                    </span>
                    <span className="font-medium text-gray-900 capitalize inline-flex bg-gray-100 px-3 py-1 rounded-full w-max">
                        {user.role}
                    </span>
                </div>
                <div className="flex justify-end mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-white bg-[#6C9E78] rounded-xl hover:bg-[#5a8664] transition-colors font-medium">
                        Tutup Detail
                    </button>
                </div>
            </div>
        </Modal>
    );
}
