const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Pengunjung = require("../models/pengunjung.model");
const Verifikasi = require("../models/verifikasi.model");
const Keuangan = require("../models/keuangan.model");
const Feedback = require("../models/feedback.model");
const { hapusFileFoto, PUBLIC_PREFIX } = require("../middleware/uploadFeedback.middleware");
const { feedbackKirimSchema } = require("../schemas/mobile.schema");
const { createVisitorToken } = require("../lib/jwt");
const { hitungNominal } = require("../config/tarif");
const { buatKodeAkses } = require("../config/akses");

const cariKontak = (jenis, kontak) =>
    jenis === "phone"
        ? Pengunjung.findByPhone(kontak)
        : Pengunjung.findByEmail(kontak);

const pesanTerpakai = (jenis) =>
    jenis === "phone" ? "Nomor telepon sudah terdaftar" : "Email sudah terdaftar";

// Format error seragam; "code" dipakai aplikasi mobile untuk memilih teks yang tampil
const gagal = (res, status, code, message) =>
    res.status(status).json({ success: false, code, message });

const galatServer = (res, label, error) => {
    console.error(label, error);
    res.status(500).json({
        success: false,
        code: "server_error",
        message: "Terjadi kesalahan server",
    });
};

// Apakah email / nomor ini sudah terdaftar?
exports.contactExists = async (req, res) => {
    try {
        const { contact_type, contact } = req.body;
        const row = await cariKontak(contact_type, contact);
        res.json({ success: true, exists: Boolean(row) });
    } catch (error) {
        galatServer(res, "[MOBILE contactExists]", error);
    }
};

// Buat kode 6 digit. Pengiriman email / SMS masih simulasi: kode tampil di terminal backend.
exports.sendCode = async (req, res) => {
    try {
        const { contact_type, contact } = req.body;
        if (await cariKontak(contact_type, contact)) {
            return gagal(res, 409, "contact_taken", pesanTerpakai(contact_type));
        }

        const code = crypto.randomInt(100000, 1000000).toString();
        await Verifikasi.simpanKode(contact, code);
        console.log(`[SIMULASI KODE DAFTAR] ${contact} -> ${code}`);

        res.json({ success: true, message: "Kode verifikasi dikirim" });
    } catch (error) {
        galatServer(res, "[MOBILE sendCode]", error);
    }
};

exports.verifyCode = async (req, res) => {
    try {
        const { contact, code } = req.body;
        if (!(await Verifikasi.cekKode(contact, code))) {
            return gagal(res, 400, "code_invalid", "Kode salah atau kedaluwarsa");
        }
        res.json({ success: true });
    } catch (error) {
        galatServer(res, "[MOBILE verifyCode]", error);
    }
};

// Buat akun baru -> otomatis muncul di menu Data User (web admin) dan langsung Online
exports.register = async (req, res) => {
    try {
        const { name, contact_type, contact, password, code } = req.body;

        // Kode dicek ulang di sini supaya endpoint ini tidak bisa dipakai tanpa verifikasi
        if (!(await Verifikasi.cekKode(contact, code))) {
            return gagal(res, 400, "code_invalid", "Kode salah atau kedaluwarsa");
        }
        if (await cariKontak(contact_type, contact)) {
            return gagal(res, 409, "contact_taken", pesanTerpakai(contact_type));
        }

        const isPhone = contact_type === "phone";
        const email = isPhone ? null : contact;
        const phone = isPhone ? contact : null;

        const id = await Pengunjung.createMobile({
            nama: name,
            email,
            noTelp: phone,
            passwordHash: await bcrypt.hash(password, 10),
        });
        await Verifikasi.hapus(contact);

        res.status(201).json({
            success: true,
            token: createVisitorToken({ id }),
            user: { id: String(id), name, email, phone },
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return gagal(res, 409, "contact_taken", pesanTerpakai(req.body.contact_type));
        }
        galatServer(res, "[MOBILE register]", error);
    }
};

// Dipanggil aplikasi tiap ~60 detik selama dibuka -> status Online
exports.heartbeat = async (req, res) => {
    try {
        const ditemukan = await Pengunjung.tandaiAktif(req.user.id);
        if (!ditemukan) {
            return gagal(res, 404, "account_missing", "Akun tidak ditemukan");
        }
        res.json({ success: true });
    } catch (error) {
        galatServer(res, "[MOBILE heartbeat]", error);
    }
};

// Dipanggil saat Log Out / aplikasi ke latar belakang -> langsung Offline
exports.goOffline = async (req, res) => {
    try {
        await Pengunjung.tandaiOffline(req.user.id);
        res.json({ success: true });
    } catch (error) {
        galatServer(res, "[MOBILE offline]", error);
    }
};

// =====================================================================
// LOGIN: email / nomor + password -> kode verifikasi -> token
// =====================================================================
const kunciLogin = (kontak) => `login:${kontak}`;

// Langkah 1: cek password. Kalau benar, kirim kode (simulasi: tampil di terminal backend).
// Pesan salah dibuat sama untuk "akun tidak ada" dan "password salah".
exports.login = async (req, res) => {
    try {
        const { contact_type, contact, password } = req.body;
        const akun = await Pengunjung.findLogin(contact_type, contact);
        const cocok =
            akun?.password_hash &&
            (await bcrypt.compare(password, akun.password_hash));
        if (!cocok) {
            return gagal(
                res,
                401,
                "invalid_credentials",
                "Email / nomor telepon atau password salah",
            );
        }

        const code = crypto.randomInt(100000, 1000000).toString();
        await Verifikasi.simpanKode(kunciLogin(contact), code);
        console.log(`[SIMULASI KODE LOGIN] ${contact} -> ${code}`);

        res.json({ success: true, message: "Kode verifikasi dikirim" });
    } catch (error) {
        galatServer(res, "[MOBILE login]", error);
    }
};

// Langkah 2: cek kode. Kalau benar, akun masuk (token dikirim) dan langsung Online.
exports.loginVerify = async (req, res) => {
    try {
        const { contact, code } = req.body;
        if (!(await Verifikasi.cekKode(kunciLogin(contact), code))) {
            return gagal(res, 400, "code_invalid", "Kode salah atau kedaluwarsa");
        }

        const akun = await Pengunjung.findLogin(
            contact.includes("@") ? "email" : "phone",
            contact,
        );
        if (!akun) {
            return gagal(res, 404, "account_missing", "Akun tidak ditemukan");
        }

        await Verifikasi.hapus(kunciLogin(contact));
        await Pengunjung.tandaiAktif(akun.id);

        res.json({
            success: true,
            token: createVisitorToken({ id: akun.id }),
            user: {
                id: String(akun.id),
                name: akun.nama,
                email: akun.email,
                phone: akun.no_telp,
            },
        });
    } catch (error) {
        galatServer(res, "[MOBILE loginVerify]", error);
    }
};

// =====================================================================
// PESANAN TIKET (disimpan di tabel keuangan -> otomatis muncul di Uang Masuk web)
// =====================================================================
const TYPE_KEY = { Mandiri: "booking_title", Guide: "guide_title" };

const orderJson = (r) => ({
    user_id: String(r.pengunjung_id),
    type_key: TYPE_KEY[r.jenis_tiket] ?? "booking_title",
    count: r.jumlah_tiket,
    pay: r.jenis_pembayaran === "QRIS" ? "qr" : "cash",
    total: Number(r.nominal),
    name: r.nama,
    created_at: new Date(r.tanggal).toISOString(),
    access_code: r.kode_akses,
    transaction_id: r.id_trx,
    status:
        r.status === "Berhasil" ? "paid" : r.status === "Gagal" ? "failed" : "pending",
    access_expires_at: r.kedaluwarsa_akses
        ? new Date(r.kedaluwarsa_akses).toISOString()
        : null,
});

// Pesanan milik akun yang sedang masuk (atau null bila bukan miliknya)
const pesananMilik = async (idTrx, pengunjungId) => {
    const row = await Keuangan.findByTrx(idTrx);
    return row && row.pengunjung_id === pengunjungId ? row : null;
};

exports.createOrder = async (req, res) => {
    try {
        const { type_key, count, pay } = req.body;
        const akun = await Pengunjung.findById(req.user.id);
        if (!akun) {
            return gagal(res, 404, "account_missing", "Akun tidak ditemukan");
        }

        const jenisTiket = type_key === "guide_title" ? "Guide" : "Mandiri";
        const hasil = await Keuangan.createPesanan({
            jenis: "Pemasukan",
            nominal: hitungNominal(count, jenisTiket),
            keterangan: `Pemesanan tiket ${jenisTiket} (aplikasi mobile) - ${akun.nama}`,
            nama: akun.nama,
            jumlahTiket: count,
            jenisTiket,
            jenisPembayaran: pay === "qr" ? "QRIS" : "Tunai",
            // QRIS menunggu simulasi bayar, Tunai menunggu konfirmasi admin di web
            status: "Pending",
            pengunjungId: akun.id,
            kodeAkses: buatKodeAkses(),
        });

        const row = await Keuangan.findByTrx(hasil.idTrx);
        res.status(201).json({ success: true, order: orderJson(row) });
    } catch (error) {
        galatServer(res, "[MOBILE createOrder]", error);
    }
};

// Simulasi pembayaran QRIS berhasil (aplikasi memanggilnya setelah jeda).
// Tunai TIDAK bisa lewat sini; harus dikonfirmasi admin di web.
exports.payOrder = async (req, res) => {
    try {
        const row = await pesananMilik(req.params.trx, req.user.id);
        if (!row) return gagal(res, 404, "order_missing", "Pesanan tidak ditemukan");
        if (row.jenis_pembayaran !== "QRIS") {
            return gagal(res, 403, "cash_needs_admin", "Pembayaran tunai dikonfirmasi oleh admin");
        }
        if (row.status === "Pending") {
            await Keuangan.konfirmasi(row.id);
        }
        res.json({ success: true });
    } catch (error) {
        galatServer(res, "[MOBILE payOrder]", error);
    }
};

exports.listOrders = async (req, res) => {
    try {
        const rows = await Keuangan.listByPengunjung(req.user.id);
        res.json({ success: true, orders: rows.map(orderJson) });
    } catch (error) {
        galatServer(res, "[MOBILE listOrders]", error);
    }
};

exports.getOrder = async (req, res) => {
    try {
        const row = await pesananMilik(req.params.trx, req.user.id);
        if (!row) return gagal(res, 404, "order_missing", "Pesanan tidak ditemukan");
        res.json({ success: true, order: orderJson(row) });
    } catch (error) {
        galatServer(res, "[MOBILE getOrder]", error);
    }
};

// Kode akses sah = transaksi berhasil + belum lewat 23:59 + milik akun ini / dari loket
exports.verifyAccess = async (req, res) => {
    try {
        const valid = await Keuangan.cekKodeAkses(req.body.code, req.user.id);
        res.json({ success: true, valid });
    } catch (error) {
        galatServer(res, "[MOBILE verifyAccess]", error);
    }
};

// =====================================================================
// ULASAN (FEEDBACK) - tampil di menu Feed Back web admin
// =====================================================================
const feedbackJson = (r) => ({
    id: r.id,
    rating: r.rating,
    review: r.ulasan,
    photo: r.foto, // path relatif, mis. "/uploads/feedback/xxx.jpg"; null = tanpa foto
    reply: r.balasan_admin, // null = belum dibalas
    status: r.balasan_admin ? "replied" : "pending",
    created_at: new Date(r.tanggal).toISOString(),
});

// Sudah mengirim ulasan hari ini? (kuota 1x per hari per akun)
exports.feedbackToday = async (req, res) => {
    try {
        res.json({
            success: true,
            sent: await Feedback.sudahKirimHariIni(req.user.id),
        });
    } catch (error) {
        galatServer(res, "[MOBILE feedbackToday]", error);
    }
};

exports.createFeedback = async (req, res) => {
    const foto = req.file ? PUBLIC_PREFIX + req.file.filename : null;
    try {
        const parsed = feedbackKirimSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
            hapusFileFoto(foto);
            return gagal(
                res,
                400,
                "validation_error",
                parsed.error.issues[0]?.message ?? "Data tidak valid",
            );
        }

        const akun = await Pengunjung.findById(req.user.id);
        if (!akun) {
            hapusFileFoto(foto);
            return gagal(res, 404, "account_missing", "Akun tidak ditemukan");
        }
        if (await Feedback.sudahKirimHariIni(akun.id)) {
            hapusFileFoto(foto);
            return gagal(
                res,
                409,
                "already_sent_today",
                "Ulasan hanya bisa dikirim sekali sehari",
            );
        }

        const id = await Feedback.create({
            pengunjungId: akun.id,
            nama: akun.nama,
            rating: parsed.data.rating,
            ulasan: parsed.data.review,
            foto,
        });
        const row = await Feedback.findOwn(id, akun.id);
        res.status(201).json({ success: true, feedback: feedbackJson(row) });
    } catch (error) {
        hapusFileFoto(foto);
        galatServer(res, "[MOBILE createFeedback]", error);
    }
};

exports.listFeedback = async (req, res) => {
    try {
        const rows = await Feedback.listByPengunjung(req.user.id);
        res.json({ success: true, feedbacks: rows.map(feedbackJson) });
    } catch (error) {
        galatServer(res, "[MOBILE listFeedback]", error);
    }
};

exports.getFeedback = async (req, res) => {
    try {
        const row = await Feedback.findOwn(req.params.id, req.user.id);
        if (!row) return gagal(res, 404, "feedback_missing", "Ulasan tidak ditemukan");
        res.json({ success: true, feedback: feedbackJson(row) });
    } catch (error) {
        galatServer(res, "[MOBILE getFeedback]", error);
    }
};

// =====================================================================
// HAPUS AKUN
// =====================================================================
// Baris akun dihapus -> tidak bisa login lagi, dan hilang dari Data User di web admin.
// Catatan keuangan (tiket) dan ulasan lama sengaja DIPERTAHANKAN sebagai arsip museum;
// keduanya tidak bisa dipakai siapa pun karena id akun yang dihapus tidak dipakai ulang.
exports.deleteAccount = async (req, res) => {
    try {
        await Pengunjung.delete(req.user.id);
        res.json({ success: true });
    } catch (error) {
        galatServer(res, "[MOBILE deleteAccount]", error);
    }
};
