"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Toast from "@/components/Toast";

// 1. Tipe data untuk objek Toast Notification
interface ToastState {
    message: string;
    type: "success" | "error" | "info" | "warning";
}

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Search Params
    const searchParams = useSearchParams();

    // 2. Berikan penjelas tipe data ToastState | null pada useState
    const [toast, setToast] = useState<ToastState | null>(null);

    useEffect(() => {
        if (searchParams.get("resetSuccess") === "true") {
            setToast({
                message: "Sandi berhasil diperbarui!",
                type: "success",
            });

            window.history.replaceState(
                {},
                document.title,
                window.location.pathname,
            );
        }
    }, [searchParams]);

    // 3. Penentuan tipe data pada parameter event form submission
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");
        setIsLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password,
                },
            );

            if (response.data.success) {
                const role = (
                    response.data.role ||
                    response.data.data?.role ||
                    ""
                ).toLowerCase();

                if (role && role !== "admin") {
                    setErrorMsg(
                        "Akses ditolak: Akun ini bukan merupakan Admin.",
                    );
                    setIsLoading(false);
                    return;
                }

                localStorage.setItem("adminToken", response.data.token);
                if (role) {
                    localStorage.setItem("adminRole", role);
                }

                setToast({
                    message: response.data.message || "Login berhasil",
                    type: "success",
                });

                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1500);
            }
        } catch (error: unknown) {
            // 4. Pengecekan Axios Error secara aman di TypeScript
            if (axios.isAxiosError(error) && error.response) {
                setErrorMsg(
                    error.response.data.message || "Gagal melakukan login",
                );
            } else {
                setErrorMsg("Terjadi kesalahan pada server");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="w-full max-w-5xl flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 flex justify-center p-4">
                    <div className="relative w-[350px] h-[500px] rounded-[30px] overflow-hidden">
                        <Image
                            src="/images/Museum_Brawijaya_1.jpg"
                            alt="Museum Brawijaya"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-center">
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

                <div className="w-full md:w-1/2 p-8 md:pl-12">
                    <h1 className="text-white text-4xl font-semibold mb-12">
                        Login Admin
                    </h1>

                    {errorMsg && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-md text-sm text-center">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-8 max-w-md">
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white px-2 py-3 outline-none transition-colors"
                                placeholder="Email"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setPassword(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white px-2 py-3 outline-none transition-colors"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-3 text-gray-400 hover:text-white">
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        <div className="pt-2">
                            <a
                                href="/reset-kata-sandi"
                                className="text-white hover:text-gray-300 text-sm">
                                Lupa Kata Sandi ?
                            </a>
                        </div>

                        <div className="pt-6 flex justify-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-white text-black font-medium py-2 px-12 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50">
                                {isLoading ? "Memproses..." : "Login"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
