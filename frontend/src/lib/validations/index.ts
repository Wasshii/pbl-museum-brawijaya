import type { ZodError } from "zod";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

// Mengubah error zod menjadi { namaField: "pesan" } supaya mudah ditampilkan di bawah input
export function toFieldErrors<T>(error: ZodError): FieldErrors<T> {
    const result: Record<string, string> = {};
    for (const issue of error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !result[key]) result[key] = issue.message; // ambil pesan pertama tiap field
    }
    return result as FieldErrors<T>;
}
