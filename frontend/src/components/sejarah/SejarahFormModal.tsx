"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import SejarahModalShell from "@/components/sejarah/SejarahModalShell";
import FieldError from "@/components/ui/FieldError";
import { resolveImageUrl } from "@/lib/image";
import { MAX_IMAGE_MB, validateImage } from "@/lib/validations/koleksi";
import type { KoleksiFormValues } from "@/types/koleksi";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: KoleksiFormValues;
    setFormData: (data: KoleksiFormValues) => void;
    isEdit: boolean;
    loading: boolean;
}

const LABEL = "block text-sm font-bold text-gray-700 mb-1";
const INPUT =
    "w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black focus:border-[#222222]";

export default function SejarahFormModal({
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    isEdit,
    loading,
}: Props) {
    const [imageError, setImageError] = useState("");

    // Bersihkan pesan error gambar setiap modal ditutup
    useEffect(() => {
        if (!isOpen) setImageError("");
    }, [isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Cek jenis (JPG/PNG) dan ukuran (maks MAX_IMAGE_MB) sebelum dipakai
        const error = validateImage(file);
        if (error) {
            setImageError(error);
            e.target.value = "";
            return;
        }

        setImageError("");
        if (formData.previewGambar) URL.revokeObjectURL(formData.previewGambar);
        setFormData({
            ...formData,
            fileGambar: file,
            previewGambar: URL.createObjectURL(file),
        });
    };

    // Pratinjau: file yang baru dipilih, jika tidak ada pakai gambar tersimpan
    const preview =
        formData.previewGambar ||
        (formData.gambar ? resolveImageUrl(formData.gambar) : "");

    return (
        <SejarahModalShell
            isOpen={isOpen}
            onClose={onClose}
            panelClassName="max-w-[500px] bg-white rounded-[24px] p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="absolute top-6 right-6 z-10 border-0 bg-transparent cursor-pointer">
                <X className="w-6 h-6 text-gray-500 hover:text-black" />
            </button>

            <h2 className="text-[22px] font-bold text-black mb-6">
                {isEdit ? "Edit Koleksi Sejarah" : "Tambahkan Koleksi Baru"}
            </h2>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                {/* MODE EDIT: pratinjau besar, hover untuk ganti foto */}
                {isEdit && (
                    <div className="mb-2">
                        <div className="relative w-full h-[200px] rounded-xl overflow-hidden bg-gray-100 group">
                            {preview && (
                                <Image
                                    src={preview}
                                    alt="Pratinjau koleksi"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 flex items-center justify-center transition-opacity">
                                <label className="cursor-pointer bg-white text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-[13px] hover:bg-gray-100">
                                    <ImageIcon className="w-4 h-4" /> Ganti Foto
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        className="sr-only"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-400 font-medium">
                            JPG atau PNG, maksimal {MAX_IMAGE_MB} MB
                        </p>
                        <FieldError message={imageError} />
                    </div>
                )}

                <div>
                    <label className={LABEL}>Nama Benda</label>
                    <input
                        type="text"
                        required
                        value={formData.nama || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, nama: e.target.value })
                        }
                        placeholder="Contoh: Meriam Kuno"
                        className={INPUT}
                    />
                </div>

                {/* BARU: Jenis Benda dan Token */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={LABEL}>Jenis Benda</label>
                        <input
                            type="text"
                            required
                            value={formData.jenis || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    jenis: e.target.value,
                                })
                            }
                            placeholder="Contoh: Senjata"
                            className={INPUT}
                        />
                    </div>
                    <div>
                        <label className={LABEL}>Token</label>
                        <input
                            type="text"
                            required
                            value={formData.token || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    token: e.target.value,
                                })
                            }
                            placeholder="Contoh: TKN-1234"
                            className={`${INPUT} font-mono`}
                        />
                    </div>
                </div>

                {/* MODE TAMBAH: tombol pilih file + thumbnail kecil */}
                {!isEdit && (
                    <div>
                        <label className={LABEL}>
                            Upload Gambar (.jpg / .png)
                        </label>
                        <div className="flex items-center gap-3">
                            <label className="cursor-pointer flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-black font-semibold py-3 px-4 rounded-xl border border-gray-300 w-full transition-colors">
                                <Upload className="w-4 h-4" /> Pilih File Gambar
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    className="sr-only"
                                    onChange={handleImageChange}
                                    required={!formData.fileGambar}
                                />
                            </label>
                            {preview && (
                                <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-gray-300">
                                    <Image
                                        src={preview}
                                        alt="Pratinjau"
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-gray-400 font-medium">
                            JPG atau PNG, maksimal {MAX_IMAGE_MB} MB
                        </p>
                        <FieldError message={imageError} />
                    </div>
                )}

                <div>
                    <label className={LABEL}>Keterangan Penjelasan</label>
                    <textarea
                        required
                        rows={3}
                        value={formData.deskripsi || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                deskripsi: e.target.value,
                            })
                        }
                        placeholder="Deskripsi sejarah benda ini..."
                        className={`${INPUT} resize-none`}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`mt-4 w-full text-white font-bold py-4 rounded-xl cursor-pointer transition-colors border-0 disabled:opacity-50 ${
                        isEdit
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-[#222222] hover:bg-black"
                    }`}>
                    {loading
                        ? "Menyimpan..."
                        : isEdit
                          ? "Konfirmasi Perubahan"
                          : "Konfirmasi Tambah"}
                </button>
            </form>
        </SejarahModalShell>
    );
}
