const Feedback = require("../models/feedback.model");
const { kirimNotifikasiBalasan } = require("../services/push");
const { parseFoto } = require("../middleware/uploadFeedback.middleware");

exports.getSemuaFeedback = async (req, res) => {
    try {
        const data = await Feedback.getAll();

        // Memformat data agar sesuai dengan struktur tabel di Frontend
        const formattedData = data.map((item) => ({
            id: item.id,
            nama_user: item.nama,
            rating: item.rating,
            komentar: item.ulasan, // bisa kosong (ulasan teks bersifat opsional)
            fotos: parseFoto(item.foto), // 0-3 foto, mis. "/uploads/feedback/xxx.jpg"
            // Format tanggal lokal (YYYY-MM-DD)
            tanggal: new Date(item.tanggal).toLocaleDateString("sv-SE"),
            balasan: item.balasan_admin || null,
        }));

        res.json({ success: true, data: formattedData });
    } catch (error) {
        console.error("[FEEDBACK ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data ulasan",
        });
    }
};

exports.balasFeedback = async (req, res) => {
    try {
        const { replyText } = req.body;
        await Feedback.reply(req.params.id, replyText);
        res.json({ success: true, message: "Balasan berhasil dikirim" });

        // Notifikasi ke HP pengguna dikirim SETELAH respons ke admin (tidak menahan admin).
        // Kegagalan notifikasi hanya dicatat di log; balasan tetap tersimpan.
        kirimNotifikasiBalasan(req.params.id, replyText).catch((e) =>
            console.error("[PUSH] Gagal mengirim notifikasi:", e.message),
        );
    } catch (error) {
        console.error("[FEEDBACK ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengirim balasan",
        });
    }
};
