const express = require("express");
const feedbackController = require("../controllers/feedback.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { replySchema } = require("../schemas/feedback.schema");

const router = express.Router();

// Daftar ulasan (admin)
router.get(
    "/",
    authenticate,
    requireAdmin,
    feedbackController.getSemuaFeedback,
);

// Balas ulasan (admin). Sebelumnya mengimpor `feedbackSchema` yang tidak ada -> error saat membalas.
router.put(
    "/:id/reply",
    authenticate,
    requireAdmin,
    validate(replySchema),
    feedbackController.balasFeedback,
);

module.exports = router;
