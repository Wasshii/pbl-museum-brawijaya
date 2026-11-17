const express = require("express");
const mobileController = require("../controllers/mobile.controller");
const { authenticate, requireVisitor } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { uploadFoto } = require("../middleware/uploadFeedback.middleware");
const {
    kontakSchema,
    verifySchema,
    registerSchema,
    loginSchema,
    loginVerifySchema,
    orderSchema,
    accessSchema,
} = require("../schemas/mobile.schema");

const router = express.Router();

// --- Pendaftaran (publik) ---
router.post("/auth/contact-exists", validate(kontakSchema), mobileController.contactExists);
router.post("/auth/send-code", validate(kontakSchema), mobileController.sendCode);
router.post("/auth/verify-code", validate(verifySchema), mobileController.verifyCode);
router.post("/auth/register", validate(registerSchema), mobileController.register);

// --- Login (publik): password -> kode -> token ---
router.post("/auth/login", validate(loginSchema), mobileController.login);
router.post("/auth/login/verify", validate(loginVerifySchema), mobileController.loginVerify);

// --- Pesanan tiket & kode akses (butuh token pengunjung) ---
const pengunjungSaja = [authenticate, requireVisitor];
router.post("/orders", ...pengunjungSaja, validate(orderSchema), mobileController.createOrder);
router.get("/orders", ...pengunjungSaja, mobileController.listOrders);
router.get("/orders/:trx", ...pengunjungSaja, mobileController.getOrder);
router.post("/orders/:trx/pay", ...pengunjungSaja, mobileController.payOrder);
router.post("/access/verify", ...pengunjungSaja, validate(accessSchema), mobileController.verifyAccess);

// --- Ulasan (feedback) & hapus akun ---
// /feedback/today harus di atas /feedback/:id
router.get("/feedback/today", ...pengunjungSaja, mobileController.feedbackToday);
router.post("/feedback", ...pengunjungSaja, uploadFoto, mobileController.createFeedback);
router.get("/feedback", ...pengunjungSaja, mobileController.listFeedback);
router.get("/feedback/:id", ...pengunjungSaja, mobileController.getFeedback);
router.delete("/account", ...pengunjungSaja, mobileController.deleteAccount);

// --- Status Online / Offline (butuh token pengunjung dari register) ---
router.post("/presence/heartbeat", authenticate, requireVisitor, mobileController.heartbeat);
router.post("/presence/offline", authenticate, requireVisitor, mobileController.goOffline);

module.exports = router;
