"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { getErrorMessage } from "@/lib/api";
import { sandiBaruSchema } from "@/lib/validations/auth";
import { type FieldErrors, toFieldErrors } from "@/lib/validations";
import * as authService from "@/services/auth.service";

export function useNewPassword() {
    const router = useRouter();
    const { notify } = useToast();
    const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
    const [errors, setErrors] = useState<FieldErrors<typeof form>>({});
    const [loading, setLoading] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("reset_completed") === "true") {
            setIsExpired(true);
        }
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasil = sandiBaruSchema.safeParse(form);
        if (!hasil.success) {
            setErrors(toFieldErrors(hasil.error));
            return;
        }
        setErrors({});
        setLoading(true);

        const email = sessionStorage.getItem("reset_email") || "";
        const code = sessionStorage.getItem("reset_code") || "";

        try {
            await authService.resetPassword({ email, code, ...hasil.data });
            sessionStorage.setItem("reset_completed", "true");
            notify({
                type: "success",
                title: "Berhasil",
                message: "Sandi berhasil diperbarui!",
            });
            setTimeout(() => router.replace("/login?resetSuccess=true"), 1500);
        } catch (error) {
            notify({
                type: "error",
                title: "Gagal",
                message: getErrorMessage(
                    error,
                    "Kode tidak valid atau kedaluwarsa",
                ),
            });
            setLoading(false);
        }
    };

    return { form, setForm, errors, loading, isExpired, submit };
}
