const TOKEN_KEY = "adminToken";
const ROLE_KEY = "adminRole";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function saveSession(token: string, role?: string) {
    localStorage.setItem(TOKEN_KEY, token);
    if (role) localStorage.setItem(ROLE_KEY, role);
}

export function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
}
