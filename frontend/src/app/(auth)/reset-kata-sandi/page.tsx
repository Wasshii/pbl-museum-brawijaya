"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import Toast from "@/components/Toast";

// Tipe data untuk Notifikasi Toast
interface ToastState {
    message: string;
    type: "success" | "error" | "info" | "warning";
}

export default function ResetKataSandiPage() {
    const [email, setEmail] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [countdown, setCountdown] = useState<number>(0);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [verifiedEmail, setVerifiedEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isExpired, setIsExpired] = useState<boolean>(false);

    const router = useRouter();

    // Logika Timer 60 Detik
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    // Cek apakah proses reset sudah selesai
    useEffect(() => {
        if (sessionStorage.getItem("reset_completed") === "true") {
            setIsExpired(true);
        }
    }, []);

    const handleKirimKode = async () => {
        if (!email) {
            setToast({
                message: "Harap isi email terlebih dahulu!",
                type: "error",
            });
            return;
        }

        setCountdown(60);
        sessionStorage.removeItem("reset_completed");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/forgot-password",
                { email },
            );

            if (response.data.success) {
                setToast({
                    message: "Kode berhasil dikirim ke sistem",
                    type: "success",
                });
                setVerifiedEmail(email);
            }
        } catch (error: unknown) {
            let errorMsg = "Email tidak terdaftar!";
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }
            setToast({
                message: errorMsg,
                type: "error",
            });
            setVerifiedEmail("");
        }
    };

    const handleKonfirmasi = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!code) {
            setToast({
                message: "Harap masukkan kode konfirmasi!",
                type: "error",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Simpan verifikasi sementara di sessionStorage untuk dipakai di halaman sandi-baru
            sessionStorage.setItem("reset_email", verifiedEmail || email);
            sessionStorage.setItem("reset_code", code);

            setToast({
                message: "Kode valid! Silakan buat sandi baru.",
                type: "success",
            });

            setTimeout(() => {
                router.push("/sandi-baru");
            }, 1000);
        } catch (error: unknown) {
            let errorMsg = "Kode tidak valid atau kadaluarsa";
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }
            setToast({
                message: errorMsg,
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

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

                {/* Sisi Kanan: Form Reset Sandi */}
                <div className="w-full md:w-1/2 p-8 md:pl-12">
                    <h1 className="text-white text-4xl font-semibold mb-12">
                        Lupa Kata Sandi
                    </h1>

                    <form
                        onSubmit={handleKonfirmasi}
                        className="space-y-8 max-w-sm">
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white px-1 py-2 outline-none transition-colors pr-24"
                                placeholder="Email"
                            />
                            <button
                                type="button"
                                onClick={handleKirimKode}
                                disabled={countdown > 0}
                                className="absolute right-0 top-2 text-xs text-gray-300 hover:text-white disabled:opacity-50">
                                {countdown > 0 ? `${countdown}s` : "Kirim Kode"}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={code}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setCode(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white px-1 py-2 outline-none transition-colors"
                                placeholder="Kode Konfirmasi"
                            />
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
