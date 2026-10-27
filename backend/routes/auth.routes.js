const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");
const authSchema = require("../schemas/auth.schema");

const router = express.Router();

router.post("/login", validate(authSchema.loginSchema), authController.login);
router.post(
    "/forgot-password",
    validate(authSchema.forgotSchema),
    authController.forgotPassword,
);
router.post(
    "/verify-reset-code",
    validate(authSchema.verifyCodeSchema),
    authController.verifyResetCode,
);
router.post(
    "/reset-password",
    validate(authSchema.resetSchema),
    authController.resetPassword,
);

module.exports = router;
