"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getToken } from "@/lib/auth";

export function useAuthGuard() {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (!getToken()) router.replace("/login");
        else setChecking(false);
    }, [router]);

    const logout = () => {
        clearSession();
        router.replace("/login");
    };

    return { checking, logout };
}
