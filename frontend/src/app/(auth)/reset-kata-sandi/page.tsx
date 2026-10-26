import AuthShell from "@/components/auth/AuthShell";
import ResetRequestForm from "@/components/auth/ResetRequestForm";

export default function ResetKataSandiPage() {
    return (
        <AuthShell title="Lupa Kata Sandi">
            <ResetRequestForm />
        </AuthShell>
    );
}
