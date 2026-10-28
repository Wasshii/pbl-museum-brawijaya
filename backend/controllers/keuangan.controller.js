const Keuangan = require("../models/keuangan.model");

exports.getSemuaKeuangan = async (req, res) => {
    try {
        const data = await Keuangan.getAll();

        // Memformat data agar sesuai dengan struktur tabel di Frontend
        const formattedData = data.map((item) => ({
            id: item.id,
            tanggal: item.tanggal.toISOString().split("T")[0], // Mengambil format YYYY-MM-DD
            deskripsi: item.keterangan,
            tipe: item.jenis.toLowerCase(), // Mengubah 'Pemasukan' jadi 'pemasukan'
            jumlah: item.nominal,
            status: "berhasil", // Secara default berhasil
        }));

        res.json({ success: true, data: formattedData });
    } catch (error) {
        console.error("[KEUANGAN ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data keuangan",
        });
    }
};

exports.tambahKeuangan = async (req, res) => {
    try {
        const { tipe, jumlah, deskripsi } = req.body;

        const dataToInsert = {
            jenis: tipe === "pemasukan" ? "Pemasukan" : "Pengeluaran",
            nominal: jumlah,
            keterangan: deskripsi,
        };

        const insertId = await Keuangan.create(dataToInsert);
        res.status(201).json({
            success: true,
            message: "Transaksi berhasil ditambahkan",
            id: insertId,
        });
    } catch (error) {
        console.error("[KEUANGAN ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Gagal menambah transaksi keuangan",
        });
    }
};
