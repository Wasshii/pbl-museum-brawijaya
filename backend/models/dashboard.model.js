const db = require("../config/db");

const Dashboard = {
    getStats: async () => {
        const [[userResult]] = await db.query(
            "SELECT COUNT(*) as total FROM pengunjung",
        );
        const [[koleksiResult]] = await db.query(
            "SELECT COUNT(*) as total FROM koleksi",
        );
        const [[pemasukanResult]] = await db.query(
            "SELECT SUM(nominal) as total FROM keuangan WHERE jenis = 'Pemasukan'",
        );
        const [[pengeluaranResult]] = await db.query(
            "SELECT SUM(nominal) as total FROM keuangan WHERE jenis = 'Pengeluaran'",
        );
        const [[feedbackResult]] = await db.query(
            "SELECT COUNT(*) as total FROM feedback",
        );

        const totalPemasukan = Number(pemasukanResult.total) || 0;
        const totalPengeluaran = Number(pengeluaranResult.total) || 0;

        return {
            totalUser: userResult.total,
            totalKoleksi: koleksiResult.total,
            saldoKeuangan: totalPemasukan - totalPengeluaran,
            totalUlasan: feedbackResult.total,
        };
    },
};

module.exports = Dashboard;
