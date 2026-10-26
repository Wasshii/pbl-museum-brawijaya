"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { getErrorMessage } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import { type FieldErrors, toFieldErrors } from "@/lib/validations";
import * as authService from "@/services/auth.service";
import type { LoginPayload } from "@/types/auth";

export function useLogin() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { notify } = useToast();
    const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
    const [errors, setErrors] = useState<FieldErrors<LoginPayload>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchParams.get("resetSuccess") === "true") {
            notify({
                type: "success",
                title: "Berhasil",
                message: "Sandi berhasil diperbarui!",
            });
        }
        router.replace("/login");
    }, [searchParams, notify, router]);

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const hasil = loginSchema.safeParse(form);
        if (!hasil.success) {
            setErrors(toFieldErrors<LoginPayload>(hasil.error));
            return;
        }
        setErrors({});
        setLoading(true);
        try {
            const res = await authService.login(hasil.data);
            const role = (res.role ?? "").toLowerCase();
            if (role !== "admin") {
                notify({
                    type: "error",
                    title: "Akses ditolak",
                    message: "Akun ini bukan merupakan Admin.",
                });
                return;
            }
            saveSession(res.token, role);
            notify({
                type: "success",
                title: "Berhasil",
                message: res.message || "Login berhasil",
            });
            setTimeout(() => router.replace("/dashboard"), 1500);
        } catch (error) {
            notify({
                type: "error",
                title: "Login gagal",
                message: getErrorMessage(error, "Gagal melakukan login"),
            });
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return { form, setForm, errors, loading, submit };
}
