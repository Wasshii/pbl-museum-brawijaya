const { z } = require("zod");

exports.replySchema = z.object({
    replyText: z.string().trim().min(1, "Balasan tidak boleh kosong"),
});

// Alias lama agar kode yang masih memakai nama `feedbackSchema` tidak error
exports.feedbackSchema = exports.replySchema;
