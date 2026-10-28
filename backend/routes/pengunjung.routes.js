const express = require("express");
const pengunjungController = require("../controllers/pengunjung.controller");
const router = express.Router();

router.get("/", pengunjungController.getSemuaPengunjung);
router.post("/", pengunjungController.tambahPengunjung);
router.put("/:id", pengunjungController.ubahPengunjung);
router.delete("/:id", pengunjungController.hapusPengunjung);

module.exports = router;
