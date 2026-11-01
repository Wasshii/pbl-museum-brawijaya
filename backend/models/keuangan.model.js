const crypto = require("crypto");
const db = require("../config/db");
const { BATAS_PENCAIRAN_PER_BULAN } = require("../config/pencairan");

const NAMA_LOCK = "keuangan_pencairan";

const galat = (message, status) =>
    Object.assign(new Error(message), { status });

// Id Trx: 10 digit angka acak (boleh diawali 0), contoh: 0556277831.
// Dibuat di backend, bukan dari urutan id, jadi tidak bisa ditebak.
const buatIdTrx = () =>
    String(crypto.randomInt(0, 10_000_000_000)).padStart(10, "0");

const SQL_INSERT = `
    INSERT INTO keuangan
        (id_trx, jenis, nominal, keterangan, nama, no_telepon, jumlah_tiket,
         jenis_tiket, jenis_pembayaran, jenis_pencairan, no_rekening)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

// Simpan 1 baris. Kalau Id Trx kebetulan kembar (UNIQUE), buat ulang.
const insert = async (conn, d) => {
    for (let percobaan = 0; percobaan < 5; percobaan++) {
        const idTrx = buatIdTrx();
        try {
            const [result] = await conn.query(SQL_INSERT, [
                idTrx,
                d.jenis,
                d.nominal,
                d.keterangan,
                d.nama ?? null,
                d.noTelepon ?? null,
                d.jumlahTiket ?? null,
                d.jenisTiket ?? null,
                d.jenisPembayaran ?? null,
                d.jenisPencairan ?? null,
                d.noRekening ?? null,
            ]);
            return { id: result.insertId, idTrx };
        } catch (err) {
            if (err.code !== "ER_DUP_ENTRY") throw err;
        }
    }
    throw new Error("Gagal membuat Id Trx yang unik");
};

// Saldo = SUM(pemasukan) - SUM(pengeluaran), hanya transaksi berstatus Berhasil.
// Transaksi Pending / Gagal belum / tidak dihitung.
const SQL_RINGKASAN = `
    SELECT
        COALESCE(SUM(CASE WHEN jenis = 'Pemasukan'   THEN nominal END), 0) AS pemasukan,
        COALESCE(SUM(CASE WHEN jenis = 'Pengeluaran' THEN nominal END), 0) AS pengeluaran
    FROM keuangan
    WHERE status = 'Berhasil'`;

// Total pencairan berhasil pada bulan kalender berjalan (memakai jam server database)
const SQL_PENCAIRAN_BULAN_INI = `
    SELECT COALESCE(SUM(nominal), 0) AS total
    FROM keuangan
    WHERE jenis = 'Pengeluaran'
      AND status = 'Berhasil'
      AND YEAR(tanggal) = YEAR(CURDATE())
      AND MONTH(tanggal) = MONTH(CURDATE())`;

const Keuangan = {
    getAll: async () => {
        const [rows] = await db.query(
            "SELECT * FROM keuangan ORDER BY tanggal DESC, id DESC",
        );
        return rows;
    },

    getSummary: async (conn = db) => {
        const [[row]] = await conn.query(SQL_RINGKASAN);
        const totalPemasukan = Number(row.pemasukan);
        const totalPengeluaran = Number(row.pengeluaran);
        return {
            totalPemasukan,
            totalPengeluaran,
            saldo: totalPemasukan - totalPengeluaran,
        };
    },

    getBatasPencairan: async (conn = db) => {
        const [[row]] = await conn.query(SQL_PENCAIRAN_BULAN_INI);
        const terpakaiBulanIni = Number(row.total);
        return {
            maksimumPerBulan: BATAS_PENCAIRAN_PER_BULAN,
            terpakaiBulanIni,
            sisa: Math.max(0, BATAS_PENCAIRAN_PER_BULAN - terpakaiBulanIni),
        };
    },

    // Isi Saldo (pemasukan): saldo hanya bertambah, tidak perlu dikunci
    create: (data) => insert(db, data),

    // Pencairan (pengeluaran): saldo dicek dulu. Dikunci supaya dua pencairan
    // yang masuk bersamaan tidak sama-sama lolos dari saldo yang sama.
    createPencairan: async (data) => {
        const conn = await db.getConnection();
        try {
            const [[kunci]] = await conn.query("SELECT GET_LOCK(?, 5) AS ok", [
                NAMA_LOCK,
            ]);
            if (kunci.ok !== 1) {
                throw galat(
                    "Server sedang sibuk, coba lagi sebentar lagi",
                    503,
                );
            }

            const { saldo } = await Keuangan.getSummary(conn);
            if (data.nominal > saldo) {
                throw galat("Saldo tidak mencukupi untuk pencairan ini", 400);
            }

            const batas = await Keuangan.getBatasPencairan(conn);
            if (data.nominal > batas.sisa) {
                throw galat(
                    `Batas pencairan bulan ini terlampaui. Sisa batas: Rp ${batas.sisa.toLocaleString("id-ID")}`,
                    400,
                );
            }

            return await insert(conn, data);
        } finally {
            await conn
                .query("SELECT RELEASE_LOCK(?)", [NAMA_LOCK])
                .catch(() => {});
            conn.release();
        }
    },
};

module.exports = Keuangan;
