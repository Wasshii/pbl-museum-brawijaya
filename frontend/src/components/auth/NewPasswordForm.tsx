"use client";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/auth/PasswordInput";
import { useNewPassword } from "@/hooks/useNewPassword";

export default function NewPasswordForm() {
    const router = useRouter();
    const { form, setForm, errors, loading, isExpired, submit } =
        useNewPassword();

    if (isExpired) {
        return (
            <div className="flex flex-col items-center justify-center text-center">
                <h1 className="text-white text-3xl font-bold mb-4">
                    Halaman Kadaluarsa
                </h1>
                <p className="text-gray-400 mb-8">
                    Sandi telah berhasil diperbarui atau sesi ini tidak berlaku.
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
        <form onSubmit={submit} noValidate className="space-y-8 max-w-sm">
            <PasswordInput
                value={form.newPassword}
                onChange={(val) => setForm({ ...form, newPassword: val })}
                placeholder="Sandi Baru"
                error={errors.newPassword}
            />
            <PasswordInput
                value={form.confirmPassword}
                onChange={(val) => setForm({ ...form, confirmPassword: val })}
                placeholder="Konfirmasi Sandi Baru"
                error={errors.confirmPassword}
            />
            <div className="pt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-medium py-3 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50">
                    {loading ? "Memproses..." : "Konfirmasi"}
                </button>
            </div>
        </form>
    );
}
