"use client";
import Modal from "@/components/ui/Modal"; // Menggunakan Modal universal dari Tahap 7.1

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: any;
    setFormData: (data: any) => void;
    isEdit: boolean;
    loading: boolean;
}

export default function UserFormModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    isEdit,
    loading,
}: Props) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Data User" : "Tambah User Baru"}>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama
                    </label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                username: e.target.value,
                            })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6C9E78] focus:ring-1 focus:ring-[#6C9E78]"
                        required
                        placeholder="Masukkan nama..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6C9E78] focus:ring-1 focus:ring-[#6C9E78]"
                        required
                        placeholder="contoh@email.com"
                    />
                </div>
                {!isEdit && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kata Sandi
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6C9E78] focus:ring-1 focus:ring-[#6C9E78]"
                            required={!isEdit}
                            placeholder="Minimal 6 karakter"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        No. HP
                    </label>
                    <input
                        type="text"
                        value={formData.no_telp}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                no_telp: e.target.value,
                            })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6C9E78] focus:ring-1 focus:ring-[#6C9E78]"
                        required
                        placeholder="08xxxxxxxxxx"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6C9E78] focus:ring-1 focus:ring-[#6C9E78] bg-white">
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 text-white bg-[#6C9E78] rounded-xl hover:bg-[#5a8664] transition-colors font-medium disabled:opacity-50">
                        {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
