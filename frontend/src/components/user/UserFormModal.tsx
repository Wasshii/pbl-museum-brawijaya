"use client";

import { type ReactNode, useState } from "react";
import FieldError from "@/components/ui/FieldError";
import Modal from "@/components/ui/BaseModal";
import { type FieldErrors, toFieldErrors } from "@/lib/validations";
import { userEditSchema, userSchema } from "@/lib/validations/user";
import type { UserEditValues } from "@/types/user";

const KOSONG: UserEditValues = {
    name: "",
    phone: "",
    email: "",
    address: "",
    status: "Online",
    createdAt: "",
};

// Class disalin dari form lama
const INPUT =
    "w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none text-black font-semibold text-sm";
const SELECT = `${INPUT} bg-white cursor-pointer`;
const TEXTAREA = `${INPUT} resize-none`;

interface Props {
    open: boolean;
    mode: "add" | "edit"; // satu komponen untuk Tambah dan Edit
    initialValues?: UserEditValues; // wajib diisi saat mode "edit"
    onClose: () => void;
    onSubmit: (values: UserEditValues) => Promise<void> | void;
}

// Form berada di komponen dalam. Modal tidak merender anaknya saat tertutup,
// jadi state form otomatis kembali bersih setiap modal dibuka.
export default function UserFormModal({ open, onClose, ...rest }: Props) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            className="max-w-md"
            showCloseButton={rest.mode === "edit"}>
            <UserForm onClose={onClose} {...rest} />
        </Modal>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
                {label}
            </label>
            {children}
            <FieldError message={error} />
        </div>
    );
}

function UserForm({
    mode,
    initialValues = KOSONG,
    onClose,
    onSubmit,
}: Omit<Props, "open">) {
    const isEdit = mode === "edit";
    const [values, setValues] = useState<UserEditValues>(initialValues);
    const [errors, setErrors] = useState<FieldErrors<UserEditValues>>({});

    const set = <K extends keyof UserEditValues>(
        key: K,
        value: UserEditValues[K],
    ) => setValues((prev) => ({ ...prev, [key]: value }));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const hasil = (isEdit ? userEditSchema : userSchema).safeParse(values);
        if (!hasil.success) {
            setErrors(toFieldErrors<UserEditValues>(hasil.error));
            return;
        }
        setErrors({});
        await onSubmit({ ...values, ...hasil.data }); // data hasil validasi sudah di-trim
    };

    return (
        <>
            <h2 className="text-2xl font-bold text-black mb-6">
                {isEdit ? "Edit Data User" : "Tambahkan User Baru"}
            </h2>

            <form onSubmit={submit} noValidate className="space-y-4">
                <Field label="Nama User" error={errors.name}>
                    <input
                        type="text"
                        value={values.name}
                        placeholder={
                            isEdit ? undefined : "Contoh: Alexandro Vosca"
                        }
                        onChange={(e) => set("name", e.target.value)}
                        className={INPUT}
                    />
                </Field>

                <Field label="Nomer Telepon" error={errors.phone}>
                    <input
                        type="text"
                        value={values.phone}
                        placeholder={isEdit ? undefined : "08123456789"}
                        onChange={(e) => set("phone", e.target.value)}
                        className={INPUT}
                    />
                </Field>

                <Field label="Email" error={errors.email}>
                    <input
                        type="email"
                        value={values.email}
                        placeholder={isEdit ? undefined : "user@museum.id"}
                        onChange={(e) => set("email", e.target.value)}
                        className={INPUT}
                    />
                </Field>

                <Field label="Status" error={errors.status}>
                    <select
                        value={values.status}
                        onChange={(e) =>
                            set(
                                "status",
                                e.target.value as UserEditValues["status"],
                            )
                        }
                        className={SELECT}>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                    </select>
                </Field>

                <Field label="Alamat" error={errors.address}>
                    <textarea
                        rows={2}
                        value={values.address}
                        placeholder={
                            isEdit ? undefined : "Jl. Pahlawan No. 45, Malang"
                        }
                        onChange={(e) => set("address", e.target.value)}
                        className={TEXTAREA}
                    />
                </Field>

                {/* Hanya ada di form Edit (sesuai kode asli) */}
                {isEdit && (
                    <Field label="Tanggal Akun Dibuat" error={errors.createdAt}>
                        <input
                            type="text"
                            value={values.createdAt}
                            onChange={(e) => set("createdAt", e.target.value)}
                            className={INPUT}
                        />
                    </Field>
                )}

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer text-sm">
                        Batal
                    </button>
                    <button
                        type="submit"
                        className={`px-5 py-2.5 rounded-xl text-white font-bold transition-colors shadow-md cursor-pointer text-sm border-0 ${
                            isEdit
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-black hover:bg-gray-800"
                        }`}>
                        {isEdit ? "Konfirmasi" : "Simpan User"}
                    </button>
                </div>
            </form>
        </>
    );
}
