const express = require("express");
const keuanganController = require("../controllers/keuangan.controller");
const router = express.Router();

router.get("/", keuanganController.getSemuaKeuangan);
router.post("/", keuanganController.tambahKeuangan);

module.exports = router;
