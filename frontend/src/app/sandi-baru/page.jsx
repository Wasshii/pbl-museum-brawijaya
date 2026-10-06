"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Toast from "@/components/Toast";

export default function SandiBaruPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        // 1. Cek apakah di memori browser status reset sudah selesai
        if (sessionStorage.getItem("reset_completed") === "true") {
            setIsExpired(true);
            return;
        }

        const em = searchParams.get("email");
        const cd = searchParams.get("code");

        if (!em || !cd) {
            setIsExpired(true);
            return;
        }

        setEmail(em);
        setCode(cd);
    }, [searchParams]);

    const handleKonfirmasiSandi = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setToast({ message: "Sandi baru tidak cocok!", type: "error" });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/reset-password",
                {
                    email,
                    code,
                    newPassword,
                    confirmPassword,
                },
            );

            if (response.data.success) {
                // 1. Munculkan pop-up sukses terlebih dahulu
                setToast({
                    message: "Sandi berhasil diperbarui!",
                    type: "success",
                });

                // 2. Kunci halaman agar jika di-back terdeteksi kadaluarsa
                sessionStorage.setItem("reset_completed", "true");

                // 3. Beri jeda 1.5 detik agar user sempat membaca pop-up, baru pindah ke login
                setTimeout(() => {
                    router.replace("/login?resetSuccess=true");
                }, 1500);
            }
        } catch (error) {
            setToast({
                message:
                    error.response?.data?.message ||
                    "Kode tidak valid atau kadaluarsa",
                type: "error",
            });
            setIsLoading(false); // Matikan loading hanya jika gagal
        }
    };

    // Tampilan jika user memaksa kembali dari halaman Login
    if (isExpired) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <h1 className="text-white text-3xl font-bold mb-4">
                    Halaman Kadaluarsa
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    Sandi telah berhasil diperbarui atau sesi ini tidak lagi
                    berlaku.
                </p>
                <button
                    onClick={() => router.replace("/login")}
                    className="bg-white text-black font-medium py-2 px-8 rounded-full hover:bg-gray-200 transition-colors">
                    Kembali ke Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="w-full max-w-5xl flex flex-col md:flex-row items-center">
                {/* Sisi Kiri: Gambar Museum */}
                <div className="w-full md:w-1/2 flex justify-center p-4">
                    <div className="relative w-[350px] h-[500px] rounded-[30px] overflow-hidden">
                        <Image
                            src="/images/Museum_Brawijaya_1.jpg"
                            alt="Museum Brawijaya"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-center">
                            <h2 className="text-white text-xl font-bold mb-2">
                                Museum Brawijaya
                            </h2>
                            <p className="text-gray-300 text-sm">
                                Temukan Sejarah Tersembunyi
                                <br />
                                Yang Tidak Anda Ketahui
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sisi Kanan: Form Sandi Baru */}
                <div className="w-full md:w-1/2 p-8 md:pl-12">
                    <h1 className="text-white text-4xl font-semibold mb-12">
                        Sandi Baru
                    </h1>

                    <form
                        onSubmit={handleKonfirmasiSandi}
                        className="space-y-8 max-w-sm">
                        <div className="relative">
                            <input
                                type={showNewPass ? "text" : "password"}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white px-1 py-2 outline-none transition-colors pr-10"
                                placeholder="Sandi Baru"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPass(!showNewPass)}
                                className="absolute right-2 top-2 text-gray-400 hover:text-white transition-colors">
                                {showNewPass ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirmPass ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white px-1 py-2 outline-none transition-colors pr-10"
                                placeholder="Konfirmasi Sandi Baru"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPass(!showConfirmPass)
                                }
                                className="absolute right-2 top-2 text-gray-400 hover:text-white transition-colors">
                                {showConfirmPass ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-white text-black font-medium py-2 px-8 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50">
                                {isLoading ? "Memproses..." : "Konfirmasi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
