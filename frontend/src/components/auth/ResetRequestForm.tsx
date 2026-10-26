"use client";
import { useRouter } from "next/navigation";
import FieldError from "@/components/ui/FieldError";
import { useResetRequest } from "@/hooks/useResetRequest";

export default function ResetRequestForm() {
    const router = useRouter();
    const {
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
    } = useResetRequest();

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
        <form onSubmit={confirmCode} noValidate className="space-y-8 max-w-sm">
            <div>
                <div className="relative">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white px-1 py-2 outline-none transition-colors pr-24"
                        placeholder="Email"
                    />
                    <button
                        type="button"
                        onClick={sendCode}
                        disabled={seconds > 0}
                        className="absolute right-0 top-2 text-xs text-gray-300 hover:text-white disabled:opacity-50 cursor-pointer bg-transparent border-none">
                        {seconds > 0 ? `${seconds}s` : "Kirim Kode"}
                    </button>
                </div>
                <FieldError message={errors.email} />
            </div>
            <div>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-600 focus:border-white text-white px-1 py-2 outline-none transition-colors"
                    placeholder="Kode Konfirmasi"
                />
                <FieldError message={errors.code} />
            </div>
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
