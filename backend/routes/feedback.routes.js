const express = require("express");
const feedbackController = require("../controllers/feedback.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

// --- TAMBAHKAN authenticate & requireAdmin DI SETIAP ROUTER ---
// Gunakan feedbackController, bukan koleksiController
router.get(
    "/",
    authenticate,
    requireAdmin,
    feedbackController.getSemuaFeedback,
);
router.put(
    "/:id/reply",
    authenticate,
    requireAdmin,
    feedbackController.balasFeedback,
);

module.exports = router;
