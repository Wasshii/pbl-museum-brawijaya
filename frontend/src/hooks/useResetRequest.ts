"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { getErrorMessage } from "@/lib/api";
import { forgotSchema, kodeSchema } from "@/lib/validations/auth";
import { type FieldErrors, toFieldErrors } from "@/lib/validations";
import * as authService from "@/services/auth.service";
import { useCountdown } from "./useCountdown";

export function useResetRequest() {
    const router = useRouter();
    const { notify } = useToast();
    const { seconds, start } = useCountdown();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [verifiedEmail, setVerifiedEmail] = useState("");
    const [errors, setErrors] = useState<
        FieldErrors<{ email: string; code: string }>
    >({});
    const [loading, setLoading] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("reset_completed") === "true") {
            setIsExpired(true);
        }
    }, []);

    const sendCode = async () => {
        const hasil = forgotSchema.safeParse({ email });
        if (!hasil.success) {
            setErrors(toFieldErrors(hasil.error));
            return;
        }
        setErrors({});
        start(60);
        sessionStorage.removeItem("reset_completed");
        try {
            await authService.forgotPassword({ email: hasil.data.email });
            notify({
                type: "success",
                title: "Berhasil",
                message: "Kode berhasil dikirim ke sistem",
            });
            setVerifiedEmail(hasil.data.email);
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: getErrorMessage(error, "Email tidak terdaftar!"),
            });
            setVerifiedEmail("");
            start(0);
        }
    };

    const confirmCode = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasil = kodeSchema.safeParse({
            email: verifiedEmail || email,
            code,
        });
        if (!hasil.success) {
            setErrors(toFieldErrors(hasil.error));
            return;
        }
        setErrors({});
        setLoading(true);
        try {
            await authService.verifyResetCode(hasil.data);
            sessionStorage.setItem("reset_email", hasil.data.email);
            sessionStorage.setItem("reset_code", hasil.data.code);
            notify({
                type: "success",
                title: "Berhasil",
                message: "Kode valid! Silakan buat sandi baru.",
            });
            setTimeout(() => router.push("/sandi-baru"), 1000);
        } catch (error) {
            notify({
                type: "error",
                title: "Kode salah",
                message: getErrorMessage(
                    error,
                    "Kode konfirmasi salah atau kedaluwarsa",
                ),
            });
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        code,
        setCode,
        errors,
        loading,
        isExpired,
        seconds,
        sendCode,
        confirmCode,
    };
}
