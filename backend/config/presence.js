// Aplikasi mobile mengirim "heartbeat" tiap HEARTBEAT_DETIK selama aplikasi dibuka.
// Jika heartbeat terakhir lebih lama dari BATAS_ONLINE_DETIK (aplikasi ditutup paksa,
// HP mati, sinyal hilang), pengunjung otomatis dianggap Offline.
const HEARTBEAT_DETIK = 60;
const BATAS_ONLINE_DETIK = 150; // 2 kali heartbeat + toleransi jaringan

module.exports = { HEARTBEAT_DETIK, BATAS_ONLINE_DETIK };
