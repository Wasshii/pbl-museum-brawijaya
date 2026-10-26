import { api } from "@/lib/api";
import type {
    ApiResponse,
    ForgotPasswordPayload,
    LoginPayload,
    LoginResponse,
    ResetPasswordPayload,
    VerifyCodePayload,
} from "@/types/auth";

export const login = async (payload: LoginPayload) =>
    (await api.post<LoginResponse>("/api/auth/login", payload)).data;

export const forgotPassword = async (payload: ForgotPasswordPayload) =>
    (await api.post<ApiResponse>("/api/auth/forgot-password", payload)).data;

export const verifyResetCode = async (payload: VerifyCodePayload) =>
    (await api.post<ApiResponse>("/api/auth/verify-reset-code", payload)).data;

export const resetPassword = async (payload: ResetPasswordPayload) =>
    (await api.post<ApiResponse>("/api/auth/reset-password", payload)).data;
