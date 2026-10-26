export interface ApiResponse {
    success: boolean;
    message: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse extends ApiResponse {
    token: string;
    role: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface VerifyCodePayload {
    email: string;
    code: string;
}

export interface ResetPasswordPayload {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
}
