import { z } from "zod";

export const replySchema = z.object({
    replyText: z
        .string()
        .trim()
        .min(5, "Balasan minimal 5 karakter")
        .max(500, "Balasan maksimal 500 karakter"),
});
