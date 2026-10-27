"use client";

import Modal from "@/components/ui/BaseModal";
import StatusBadge from "@/components/user/StatusBadge";
import UserAvatar from "@/components/user/UserAvatar";
import type { User } from "@/types/user";

interface Props {
    user: User | null; // null = modal tertutup
    onClose: () => void;
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-3">
            <span className="font-semibold text-gray-500">{label}</span>
            <span className="col-span-2 text-black font-medium">{value}</span>
        </div>
    );
}

export default function UserDetailModal({ user, onClose }: Props) {
    return (
        <Modal
            open={!!user}
            onClose={onClose}
            className="max-w-md"
            showCloseButton>
            {user && (
                <>
                    <div className="flex flex-col items-center mb-6 mt-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-100 shadow-sm">
                            <UserAvatar
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full object-cover bg-gray-200"
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-black text-center">
                            {user.name}
                        </h2>
                        <StatusBadge status={user.status} />
                    </div>

                    <div className="space-y-3.5 text-sm border-t border-gray-100 pt-4">
                        <Row label="Nomer Tlp" value={user.phone} />
                        <Row label="Email" value={user.email} />
                        <Row label="Alamat" value={user.address} />
                        <Row label="Dibuat Tgl" value={user.createdAt} />
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-xl transition-colors cursor-pointer text-sm border-0">
                        Tutup
                    </button>
                </>
            )}
        </Modal>
    );
}
