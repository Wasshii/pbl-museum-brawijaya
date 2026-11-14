const Keuangan = require("../models/keuangan.model");
const {
    HARGA_TIKET,
    BIAYA_PEMANDU,
    hitungNominal,
} = require("../config/tarif");
const { DAFTAR_PENYEDIA } = require("../config/penyedia");

// Isi Saldo lewat web admin = bayar tunai di loket (dibantu staff).
// Pembayaran non tunai nanti datang dari aplikasi mobile.
const PEMBAYARAN_WEB_ADMIN = "Tunai";

// Bentuk JSON yang dikirim ke web (Next.js) dan nanti ke mobile (Flutter)
const formatTransaksi = (item) => ({
    id: item.id,
    idTrx: item.id_trx,
    tanggal: item.tanggal.toLocaleDateString("sv-SE"), // YYYY-MM-DD (waktu lokal)
    deskripsi: item.keterangan,
    tipe: item.jenis.toLowerCase(), // 'Pemasukan' -> 'pemasukan'
    jumlah: Number(item.nominal),
    status: String(item.status || "Berhasil").toLowerCase(),
    nama: item.nama,
    noTelepon: item.no_telepon,
    jumlahTiket: item.jumlah_tiket,
    jenisTiket: item.jenis_tiket,
    jenisPembayaran: item.jenis_pembayaran,
    jenisPencairan: item.jenis_pencairan,
    penyedia: item.penyedia_pencairan, // nama bank / e-wallet tujuan
    noRekening: item.no_rekening,
});

exports.getSemuaKeuangan = async (req, res) => {
    try {
        const [rows, summary, batasPencairan] = await Promise.all([
            Keuangan.getAll(),
            Keuangan.getSummary(),
            Keuangan.getBatasPencairan(),
        ]);

        res.json({
            success: true,
            data: rows.map(formatTransaksi),
            summary, // { totalPemasukan, totalPengeluaran, saldo }
            tarif: { hargaTiket: HARGA_TIKET, biayaPemandu: BIAYA_PEMANDU },
            batasPencairan, // { maksimumPerBulan, terpakaiBulanIni, sisa }
            penyedia: DAFTAR_PENYEDIA, // { bank: [...], eWallet: [...] }
        });
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
        const b = req.body; // sudah divalidasi & dibersihkan oleh keuangan.schema
        let hasil;
        let nominal;
        let message;

        if (b.tipe === "pemasukan") {
            nominal = hitungNominal(b.jumlahTiket, b.jenisTiket);
            hasil = await Keuangan.create({
                jenis: "Pemasukan",
                nominal,
                keterangan: b.deskripsi || `Isi saldo - ${b.nama}`,
                nama: b.nama,
                noTelepon: b.noTelepon,
                jumlahTiket: b.jumlahTiket,
                jenisTiket: b.jenisTiket,
                jenisPembayaran: PEMBAYARAN_WEB_ADMIN,
            });
            message = "Saldo berhasil ditambahkan";
        } else {
            nominal = b.jumlah;
            hasil = await Keuangan.createPencairan({
                jenis: "Pengeluaran",
                nominal,
                keterangan:
                    b.deskripsi ||
                    `Pencairan dana ke ${b.jenisPencairan} - ${b.penyedia}`,
                nama: b.nama,
                jenisPencairan: b.jenisPencairan,
                penyediaPencairan: b.penyedia,
                noRekening: b.noRekening,
            });
            message = "Pencairan berhasil diproses";
        }

        res.status(201).json({
            success: true,
            message,
            id: hasil.id,
            idTrx: hasil.idTrx,
            jumlah: nominal,
        });
    } catch (error) {
        // Galat yang sengaja dilempar model (saldo kurang, server sibuk)
        if (error.status) {
            return res
                .status(error.status)
                .json({ success: false, message: error.message });
        }
        console.error("[KEUANGAN ERROR]", error);
        res.status(500).json({
            success: false,
            message: "Gagal menyimpan transaksi keuangan",
        });
    }
};
