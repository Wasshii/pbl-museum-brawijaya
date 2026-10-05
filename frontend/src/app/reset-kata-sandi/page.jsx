"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import Toast from "@/components/Toast";

export default function ResetKataSandiPage() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [toast, setToast] = useState(null);

    // STATE BARU: Menyimpan email yang sudah diverifikasi oleh backend
    const [verifiedEmail, setVerifiedEmail] = useState("");

    const router = useRouter();

    // Logika Timer 60 Detik
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleKirimKode = async () => {
        if (!email) {
            setToast({
                message: "Harap isi email terlebih dahulu!",
                type: "error",
            });
            return;
        }

        setCountdown(60);

        // Reset status kunci halaman jika user minta kode baru lagi
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
        } catch (error) {
            setToast({
                message:
                    error.response?.data?.message || "Email tidak terdaftar!",
                type: "error",
            });
            setVerifiedEmail("");
        }
    };

    const handleKonfirmasi = (e) => {
        e.preventDefault();

        if (!email || !code) {
            setToast({
                message: "Lengkapi email dan kode konfirmasi!",
                type: "error",
            });
            return;
        }

        if (email !== verifiedEmail) {
            setToast({
                message: "Email tidak terdaftar atau kode belum dikirim!",
                type: "error",
            });
            return;
        }

        // VALIDASI DIPERBARUI: Minimal 6 digit
        if (code.length < 6) {
            setToast({
                message: "Kode konfirmasi tidak valid! (Minimal 6 digit)",
                type: "error",
            });
            return;
        }

        router.push(
            `/sandi-baru?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
        );
    };

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
                            src="/images/museum-brawijaya.jpg"
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

                {/* Sisi Kanan: Form Reset Kata Sandi */}
                <div className="w-full md:w-1/2 p-8 md:pl-12">
                    <h1 className="text-white text-4xl font-semibold mb-12">
                        Reset Kata Sandi
                    </h1>

                    <form
                        onSubmit={handleKonfirmasi}
                        className="space-y-8 max-w-sm">
                        <div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white px-1 py-2 outline-none transition-colors"
                                placeholder="Email"
                            />
                        </div>

                        <div className="flex items-end gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    required
                                    value={code}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*$/.test(val)) {
                                            setCode(val);
                                        }
                                    }}
                                    className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white px-1 py-2 outline-none transition-colors"
                                    placeholder="Konfirmasi Kode"
                                />
                            </div>
                            <button
                                type="button"
                                disabled={countdown > 0}
                                onClick={handleKirimKode}
                                className="bg-white text-black text-xs font-medium py-2 px-4 rounded-full disabled:bg-gray-400">
                                {countdown > 0
                                    ? `${countdown} Detik`
                                    : "Kirim Kode"}
                            </button>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="bg-white text-black font-medium py-2 px-8 rounded-full hover:bg-gray-200 transition-colors">
                                Konfirmasi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
