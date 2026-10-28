const { z } = require("zod");
exports.replySchema = z.object({
    replyText: z.string().trim().min(1, "Balasan tidak boleh kosong"),
});
