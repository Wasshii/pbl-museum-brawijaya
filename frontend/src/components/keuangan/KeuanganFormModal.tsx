"use client";
import Modal from "@/components/ui/Modal";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: any;
    setFormData: (data: any) => void;
    loading: boolean;
}

export default function KeuanganFormModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    loading,
}: Props) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tambah Transaksi Baru">
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipe Transaksi
                    </label>
                    <select
                        value={formData.tipe}
                        onChange={(e) =>
                            setFormData({ ...formData, tipe: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6C9E78] focus:ring-1 focus:ring-[#6C9E78] bg-white">
                        <option value="pemasukan">
                            Pemasukan (Top Up / Tambah Saldo)
                        </option>
                        <option value="pengeluaran">
                            Pengeluaran (Pencairan / Tarik Dana)
                        </option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jumlah (Rp)
                    </label>
                    <input
                        type="number"
                        value={formData.jumlah}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                jumlah: Number(e.target.value),
                            })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6C9E78] focus:ring-1 focus:ring-[#6C9E78]"
                        required
                        placeholder="Contoh: 150000"
                        min="1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi
                    </label>
                    <input
                        type="text"
                        value={formData.deskripsi}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                deskripsi: e.target.value,
                            })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6C9E78] focus:ring-1 focus:ring-[#6C9E78]"
                        required
                        placeholder="Masukkan keterangan..."
                    />
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
                        {loading ? "Memproses..." : "Simpan Transaksi"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
