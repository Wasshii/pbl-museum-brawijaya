"use client";
import Link from "next/link";
import PasswordInput from "@/components/auth/PasswordInput";
import FieldError from "@/components/ui/FieldError";
import { useLogin } from "@/hooks/useLogin";

export default function LoginForm() {
    const { form, setForm, errors, loading, submit } = useLogin();

    return (
        <form onSubmit={submit} noValidate className="space-y-8 max-w-md">
            <div>
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    placeholder="Email"
                    className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white px-2 py-3 outline-none transition-colors"
                />
                <FieldError message={errors.email} />
            </div>
            <PasswordInput
                value={form.password}
                onChange={(password) => setForm({ ...form, password })}
                placeholder="Password"
                error={errors.password}
            />
            <Link
                href="/reset-kata-sandi"
                className="block text-white hover:text-gray-300 text-sm">
                Lupa Kata Sandi ?
            </Link>
            <div className="pt-6 flex justify-center">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-white text-black px-12 py-3 rounded-full font-semibold disabled:opacity-60">
                    {loading ? "Memproses..." : "Login"}
                </button>
            </div>
        </form>
    );
}
