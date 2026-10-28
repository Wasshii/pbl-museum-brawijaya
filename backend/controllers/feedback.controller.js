const Feedback = require("../models/feedback.model");

exports.getSemuaFeedback = async (req, res) => {
    try {
        const data = await Feedback.getAll();

        // Memformat data agar sesuai dengan struktur tabel di Frontend
        const formattedData = data.map((item) => ({
            id: item.id,
            nama_user: item.nama,
            rating: item.rating,
            komentar: item.ulasan,
            // REVISI: Menggunakan format tanggal lokal (YYYY-MM-DD)
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
    } catch (error) {
        console.error("[FEEDBACK ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengirim balasan",
        });
    }
};
