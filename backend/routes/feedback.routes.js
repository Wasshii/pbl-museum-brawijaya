const express = require("express");
const feedbackController = require("../controllers/feedback.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

// --- TAMBAHKAN 2 BARIS INI ---
const validate = require("../middleware/validate.middleware");
const { feedbackSchema } = require("../schemas/feedback.schema");

const router = express.Router();

// GET tidak perlu validasi
router.get(
    "/",
    authenticate,
    requireAdmin,
    feedbackController.getSemuaFeedback,
);

// --- PASANG VALIDATE DI ROUTE PUT (Karena balas feedback butuh input body) ---
router.put(
    "/:id/reply",
    authenticate,
    requireAdmin,
    validate(feedbackSchema),
    feedbackController.balasFeedback,
);

module.exports = router;
