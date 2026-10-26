import { z } from "zod";
import { emailSchema } from "@/lib/validations/auth";

export const userSchema = z.object({
    name: z.string().trim().min(3, "Nama minimal 3 karakter"),
    phone: z
        .string()
        .regex(/^08\d{8,11}$/, "Nomor telepon diawali 08 (10-13 digit)"),
    email: emailSchema,
    address: z.string().trim().min(5, "Alamat minimal 5 karakter"),
    status: z.enum(["Online", "Offline"]),
});
