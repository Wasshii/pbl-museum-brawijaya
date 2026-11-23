// Pengiriman notifikasi push lewat Firebase Cloud Messaging (FCM).
// Rahasia TIDAK ditulis di kode: letak file kunci akun layanan dibaca dari .env
//   FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json
// Jika belum diatur / paket firebase-admin belum dipasang, notifikasi dilewati (backend tetap jalan).

const path = require("path");

let messaging = null;

const ambilMessaging = () => {
    if (messaging) return messaging;

    const berkas = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!berkas) {
        console.warn("[PUSH] FIREBASE_SERVICE_ACCOUNT belum diatur di .env: notifikasi push dimatikan.");
        return null;
    }
    try {
        // Impor modular: berlaku untuk firebase-admin versi 10 ke atas (npm install firebase-admin)
        const { initializeApp, cert, getApps } = require("firebase-admin/app");
        const { getMessaging } = require("firebase-admin/messaging");
        const akun = require(path.resolve(berkas));
        const app = getApps().length > 0 ? getApps()[0] : initializeApp({ credential: cert(akun) });
        messaging = getMessaging(app);
        console.log("[PUSH] Firebase siap.");
    } catch (error) {
        // Tidak dicatat "sudah dicoba": setelah file / paket diperbaiki, balasan berikutnya langsung memakainya
        console.error("[PUSH] Firebase gagal dimulai:", error.message);
    }
    return messaging;
};

const TOKEN_MATI = new Set([
    "messaging/registration-token-not-registered",
    "messaging/invalid-registration-token",
]);

// tokens: daftar token FCM. Mengembalikan { terkirim, mati } (mati = token yang sudah tidak berlaku).
const kirimPush = async (tokens, { title, body, data }) => {
    const m = ambilMessaging();
    if (!m || tokens.length === 0) return { terkirim: 0, mati: [] };

    const hasil = await m.sendEachForMulticast({
        tokens,
        notification: { title, body },
        data: data ?? {},
        android: { priority: "high", notification: { channelId: "ulasan" } },
    });

    const mati = [];
    hasil.responses.forEach((r, i) => {
        if (!r.success) {
            console.error("[PUSH] Gagal ke satu HP:", r.error?.code, r.error?.message);
            if (TOKEN_MATI.has(r.error?.code)) mati.push(tokens[i]);
        }
    });
    console.log(`[PUSH] Terkirim ${hasil.successCount} dari ${tokens.length} HP.`);
    return { terkirim: hasil.successCount, mati };
};

module.exports = { kirimPush };
