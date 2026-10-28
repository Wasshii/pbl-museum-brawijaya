const express = require("express");
const feedbackController = require("../controllers/feedback.controller");
const router = express.Router();

router.get("/", feedbackController.getSemuaFeedback);
router.put("/:id/reply", feedbackController.balasFeedback);

module.exports = router;
