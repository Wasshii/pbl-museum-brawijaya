export type ToastType =
    | "create"
    | "edit"
    | "delete"
    | "success"
    | "error"
    | "info"
    | "warning";

export interface ToastOptions {
    type?: ToastType;
    title: string;
    message: string;
}
