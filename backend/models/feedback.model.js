const db = require("../config/db");

const Feedback = {
    getAll: async () => {
        const [rows] = await db.query(
            "SELECT * FROM feedback ORDER BY tanggal DESC",
        );
        return rows;
    },
    // Fungsi khusus untuk admin membalas ulasan
    reply: async (id, balasan) => {
        await db.query(
            "UPDATE feedback SET balasan_admin = ?, status = 'Telah Di Balas' WHERE id = ?",
            [balasan, id],
        );
    },
};

module.exports = Feedback;
