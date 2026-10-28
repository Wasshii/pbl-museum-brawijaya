const express = require("express");
const koleksiController = require("../controllers/koleksi.controller");
const router = express.Router();

router.get("/", koleksiController.getSemuaKoleksi);
router.post("/", koleksiController.tambahKoleksi);
router.put("/:id", koleksiController.ubahKoleksi);
router.delete("/:id", koleksiController.hapusKoleksi);

module.exports = router;
