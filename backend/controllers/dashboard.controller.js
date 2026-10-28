const Dashboard = require("../models/dashboard.model");

exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await Dashboard.getStats();
        res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("[DASHBOARD ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil statistik dashboard",
        });
    }
};
