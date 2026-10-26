import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <AuthShell title="Login Admin">
            <Suspense>
                <LoginForm />
            </Suspense>
        </AuthShell>
    );
}
