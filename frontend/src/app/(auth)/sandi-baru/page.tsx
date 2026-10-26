import AuthShell from "@/components/auth/AuthShell";
import NewPasswordForm from "@/components/auth/NewPasswordForm";

export default function SandiBaruPage() {
    return (
        <AuthShell title="Sandi Baru">
            <NewPasswordForm />
        </AuthShell>
    );
}
