const Feedback = require("../models/feedback.model");
const Perangkat = require("../models/perangkat.model");
const { kirimPush } = require("../config/firebase");

const POTONG = 120; // isi balasan di notifikasi dipotong supaya tidak kepanjangan

// Dipanggil setelah admin membalas ulasan -> notifikasi ke HP pemilik ulasan.
// Judul: "Ulasan"   Isi: "Ulasan di balas oleh admin : <isi balasan>"
const kirimNotifikasiBalasan = async (feedbackId, teksBalasan) => {
    const ulasan = await Feedback.findById(feedbackId);
    if (!ulasan?.pengunjung_id) return; // ulasan lama / tanpa akun mobile

    const tokens = await Perangkat.daftarToken(ulasan.pengunjung_id);
    if (tokens.length === 0) return;

    const ringkas = String(teksBalasan).trim().replace(/\s+/g, " ");
    const isi = ringkas.length > POTONG ? `${ringkas.slice(0, POTONG - 1)}…` : ringkas;

    const { mati } = await kirimPush(tokens, {
        title: "Ulasan",
        body: `Ulasan di balas oleh admin : ${isi}`,
        data: { type: "review_reply", feedback_id: String(feedbackId) },
    });
    await Perangkat.hapusBanyak(mati); // buang token HP yang sudah tidak aktif
};

module.exports = { kirimNotifikasiBalasan };
