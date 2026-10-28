const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Hitung Total User (Pengunjung)
        const [[userResult]] = await db.query(
            "SELECT COUNT(*) as total FROM pengunjung",
        );

        // 2. Hitung Total Koleksi Sejarah
        const [[koleksiResult]] = await db.query(
            "SELECT COUNT(*) as total FROM koleksi",
        );

        // 3. Hitung Saldo Keuangan (Pemasukan - Pengeluaran)
        const [[pemasukanResult]] = await db.query(
            "SELECT SUM(nominal) as total FROM keuangan WHERE jenis = 'Pemasukan'",
        );
        const [[pengeluaranResult]] = await db.query(
            "SELECT SUM(nominal) as total FROM keuangan WHERE jenis = 'Pengeluaran'",
        );

        const totalPemasukan = Number(pemasukanResult.total) || 0;
        const totalPengeluaran = Number(pengeluaranResult.total) || 0;
        const saldoKeuangan = totalPemasukan - totalPengeluaran;

        // 4. Hitung Total Ulasan/Feedback
        const [[feedbackResult]] = await db.query(
            "SELECT COUNT(*) as total FROM feedback",
        );

        res.json({
            success: true,
            data: {
                totalUser: userResult.total,
                totalKoleksi: koleksiResult.total,
                saldoKeuangan: saldoKeuangan,
                totalUlasan: feedbackResult.total,
            },
        });
    } catch (error) {
        console.error("[DASHBOARD ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil statistik dashboard",
        });
    }
};
