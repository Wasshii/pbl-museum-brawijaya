"use client";
import Modal from "@/components/ui/Modal";
import Image from "next/image";
import { Upload } from "lucide-react";
import type { KoleksiFormValues } from "@/types/koleksi"; // TAMBAHKAN IMPORT INI

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: KoleksiFormValues; // REVISI: any diganti dengan KoleksiFormValues
    setFormData: (data: KoleksiFormValues) => void; // REVISI: any diganti dengan KoleksiFormValues
    isEdit: boolean;
    loading: boolean;
}

export default function SejarahFormModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    isEdit,
    loading,
}: Props) {
    // Simulasi ganti gambar untuk UI
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file)
            setFormData({
                ...formData,
                fileGambar: file,
                previewGambar: URL.createObjectURL(file),
            });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Data Koleksi" : "Tambah Koleksi Baru"}>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Koleksi
                    </label>
                    <input
                        type="text"
                        value={formData.nama || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                nama: e.target.value,
                            })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6C9E78] focus:ring-1 focus:ring-[#6C9E78]"
                        required
                        placeholder="Masukkan nama koleksi..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi
                    </label>
                    <textarea
                        value={formData.deskripsi || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                deskripsi: e.target.value,
                            })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6C9E78] focus:ring-1 focus:ring-[#6C9E78] min-h-[120px] resize-none"
                        required
                        placeholder="Tuliskan deskripsi sejarah..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Foto Koleksi
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl relative hover:bg-gray-50 transition-colors">
                        <div className="space-y-1 text-center">
                            {formData.previewGambar || formData.gambar ? (
                                <div className="relative w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden border border-gray-200">
                                    <Image
                                        src={
                                            formData.previewGambar ||
                                            formData.gambar ||
                                            ""
                                        }
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            )}
                            <div className="flex text-sm text-gray-600 justify-center">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#6C9E78] hover:text-[#5a8664] focus-within:outline-none">
                                    <span>Upload file</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        required={!isEdit}
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, JPEG (Max. 2MB)
                            </p>
                        </div>
                    </div>
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
