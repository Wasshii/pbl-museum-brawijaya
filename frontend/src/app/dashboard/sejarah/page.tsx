"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Search,
    Plus,
    ArrowRight,
    Trash2,
    Edit3,
    X,
    Upload,
    Image as ImageIcon,
} from "lucide-react";

// --- DATA DUMMY ---
const initialData = [
    {
        id: 1,
        nama: "Seragam Belanda",
        jenis: "Seragam",
        tanggal: "8/10/2026",
        token: "HAU7718",
        deskripsi:
            "Seragam asli tentara Belanda yang digunakan pada masa agresi militer. Ditemukan di area perkemahan sisa peninggalan.",
        gambar: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 2,
        nama: "EG - 289",
        jenis: "Senjata",
        tanggal: "8/10/2026",
        token: "9019HHUA",
        deskripsi:
            "Senapan laras panjang yang digunakan oleh pasukan gerilya. Kondisi masih cukup baik namun sudah dinonaktifkan.",
        gambar: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 3,
        nama: "Mesin Ketik Kuno",
        jenis: "Alat Tulis",
        tanggal: "5/10/2026",
        token: "MSK0012",
        deskripsi:
            "Mesin ketik yang digunakan untuk menyusun dokumen-dokumen penting kemerdekaan di daerah Jawa Timur.",
        gambar: "https://images.unsplash.com/photo-1558051815-0f18e64e6280?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 4,
        nama: "Meriam Bambu",
        jenis: "Senjata Tradisional",
        tanggal: "2/10/2026",
        token: "MRM8821",
        deskripsi:
            "Meriam buatan pejuang lokal dari bambu pilihan untuk menakuti pasukan musuh dari kejauhan.",
        gambar: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 5,
        nama: "Helm Baja KNIL",
        jenis: "Perlengkapan",
        tanggal: "1/10/2026",
        token: "HLM4490",
        deskripsi:
            "Helm baja pasukan KNIL yang berhasil disita oleh pejuang setelah pertempuran sengit.",
        gambar: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 6,
        nama: "Peta Strategi 1945",
        jenis: "Dokumen",
        tanggal: "28/9/2026",
        token: "PTA1102",
        deskripsi:
            "Peta usang yang menunjukkan jalur logistik pejuang di wilayah pegunungan selatan.",
        gambar: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 7,
        nama: "Uang Kertas ORI",
        jenis: "Mata Uang",
        tanggal: "25/9/2026",
        token: "UANG77X",
        deskripsi:
            "Oeang Republik Indonesia (ORI) emisi pertama yang beredar sangat terbatas.",
        gambar: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 8,
        nama: "Keris Pusaka",
        jenis: "Senjata Tradisional",
        tanggal: "20/9/2026",
        token: "KRS9090",
        deskripsi:
            "Keris pusaka peninggalan bupati setempat yang diserahkan untuk mendukung perjuangan.",
        gambar: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 9,
        nama: "Bendera Robek",
        jenis: "Atribut",
        tanggal: "15/9/2026",
        token: "BND3321",
        deskripsi:
            "Sisa bendera Merah Putih yang berkibar saat pertempuran mempertahankan balai kota.",
        gambar: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 10,
        nama: "Sepeda Onthel",
        jenis: "Kendaraan",
        tanggal: "12/9/2026",
        token: "SPD8812",
        deskripsi:
            "Sepeda yang digunakan kurir pejuang untuk mengantar pesan rahasia antar markas.",
        gambar: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 11,
        nama: "Patung Perunggu",
        jenis: "Kesenian",
        tanggal: "10/9/2026",
        token: "PTG5567",
        deskripsi:
            "Patung kecil perunggu lambang persatuan yang disembunyikan dari perampasan penjajah.",
        gambar: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 12,
        nama: "Radio Komunikasi",
        jenis: "Elektronik",
        tanggal: "5/9/2026",
        token: "RDO1129",
        deskripsi:
            "Radio penerima siaran RRI untuk memantau pergerakan sekutu di pusat.",
        gambar: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 13,
        nama: "Medali Pejuang",
        jenis: "Penghargaan",
        tanggal: "1/9/2026",
        token: "MDL9900",
        deskripsi:
            "Medali Bintang Gerilya milik salah satu komandan pejuang tak dikenal.",
        gambar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 14,
        nama: "Sepatu Lars Hitam",
        jenis: "Perlengkapan",
        tanggal: "28/8/2026",
        token: "SPT6654",
        deskripsi:
            "Sepatu boot kulit milik perwira yang tertinggal di barak lama.",
        gambar: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: 15,
        nama: "Kotak P3K Kayu",
        jenis: "Medis",
        tanggal: "20/8/2026",
        token: "P3K7781",
        deskripsi:
            "Kotak medis kayu berisi botol-botol kaca kosong bekas obat-obatan palang merah.",
        gambar: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80",
    },
];

export default function KoleksiSejarahPage() {
    const [dataKoleksi, setDataKoleksi] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [detailData, setDetailData] = useState<any | null>(null);
    const [deleteItem, setDeleteItem] = useState<any | null>(null);
    const [editItem, setEditItem] = useState<any | null>(null);

    // Form States (Add & Edit)
    const [formNama, setFormNama] = useState("");
    const [formJenis, setFormJenis] = useState("");
    const [formToken, setFormToken] = useState("");
    const [formDeskripsi, setFormDeskripsi] = useState("");
    const [formGambar, setFormGambar] = useState("");

    // Ambil data dari LocalStorage atau gunakan Data Dummy awal
    useEffect(() => {
        const saved = localStorage.getItem("museum_koleksi");
        if (saved) {
            setDataKoleksi(JSON.parse(saved));
        } else {
            setDataKoleksi(initialData);
        }
    }, []);

    // Simpan ke LocalStorage setiap ada perubahan
    useEffect(() => {
        if (dataKoleksi.length > 0) {
            localStorage.setItem("museum_koleksi", JSON.stringify(dataKoleksi));
        }
    }, [dataKoleksi]);

    // Logic Pencarian
    const filteredData = useMemo(() => {
        return dataKoleksi.filter(
            (item) =>
                item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.token.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [dataKoleksi, searchQuery]);

    const getCurrentDate = () => {
        const d = new Date();
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    // Handle Gambar Upload (Simulasi Local Object URL)
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Terima gambar jpg, jpeg, png
            if (
                file.type !== "image/jpeg" &&
                file.type !== "image/jpg" &&
                file.type !== "image/png"
            ) {
                alert("Hanya menerima file gambar format JPG atau PNG.");
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setFormGambar(imageUrl);
        }
    };

    // --- ACTIONS ---

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newData = {
            id: Date.now(),
            nama: formNama,
            jenis: formJenis,
            token: formToken,
            deskripsi: formDeskripsi,
            tanggal: getCurrentDate(),
            gambar:
                formGambar ||
                "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80",
        };
        setDataKoleksi([newData, ...dataKoleksi]);
        closeModals();
    };

    const handleDeleteConfirm = () => {
        if (deleteItem) {
            setDataKoleksi(
                dataKoleksi.filter((item) => item.id !== deleteItem.id),
            );
        }
        closeModals();
    };

    const openEditModal = (item: any) => {
        setEditItem(item);
        setFormNama(item.nama);
        setFormJenis(item.jenis);
        setFormToken(item.token);
        setFormDeskripsi(item.deskripsi);
        setFormGambar(item.gambar);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editItem) {
            const updatedData = dataKoleksi.map((item) => {
                if (item.id === editItem.id) {
                    return {
                        ...item,
                        nama: formNama,
                        jenis: formJenis,
                        token: formToken,
                        deskripsi: formDeskripsi,
                        gambar: formGambar,
                        tanggal: getCurrentDate(), // Update tanggal
                    };
                }
                return item;
            });
            setDataKoleksi(updatedData);
        }
        closeModals();
    };

    const closeModals = () => {
        setIsAddModalOpen(false);
        setDetailData(null);
        setDeleteItem(null);
        setEditItem(null);
        // Reset forms
        setFormNama("");
        setFormJenis("");
        setFormToken("");
        setFormDeskripsi("");
        setFormGambar("");
    };

    return (
        <div className="w-full animate-in fade-in duration-500 pb-10">
            {/* INJEKSI CSS UNTUK GLASS SCROLLBAR */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .glass-scroll::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .glass-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 10px;
                }
                .glass-scroll::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.15); /* Transparan hitam (glass) */
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                .glass-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
            `,
                }}
            />

            <h2 className="text-[26px] font-bold text-black mb-8">
                Koleksi Sejarah
            </h2>

            {/* --- FILTER & TAMBAH BUTTON --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                {/* Search */}
                <div className="flex items-center gap-3 bg-[#222222] text-white px-5 py-3 rounded-full w-full md:w-[380px] shadow-sm">
                    <Search className="w-5 h-5 text-white/80 shrink-0" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari Berdasarkan Token / Nama Benda"
                        className="bg-transparent border-none outline-none text-[14px] font-semibold text-white w-full placeholder:text-white/60"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-white/60 hover:text-white cursor-pointer bg-transparent border-none p-0 shrink-0">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Button Tambah */}
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-[#222222] hover:bg-black text-white px-6 py-3 rounded-full font-bold text-[14px] transition-colors cursor-pointer shadow-sm">
                    <Plus className="w-5 h-5" /> Tambahkan Koleksi
                </button>
            </div>

            {/* --- KOTAK TABEL DENGAN SCROLL GLASS --- */}
            {/* Jika mode Edit aktif, tambahkan border biru seperti di mockup */}
            <div
                className={`bg-white rounded-[24px] shadow-sm overflow-hidden w-full transition-all duration-300 border border-gray-100 ${
                    isEditMode ? "ring-4 ring-blue-500/80" : ""
                }`}>
                {/* 
                    max-h-[460px]: Membatasi tinggi tabel agar bisa di-scroll 
                    overflow-y-auto: Menampilkan scrollbar vertikal
                    glass-scroll: Memanggil CSS custom scrollbar efek glass
                    Tanpa padding top/horizontal pada scroll container agar header sticky tepat di bibir atas tanpa celah
                */}
                <div className="max-h-[460px] overflow-y-auto overflow-x-auto glass-scroll">
                    <table className="w-full text-left min-w-[800px] border-collapse font-sans">
                        <thead className="sticky top-0 z-20 bg-white shadow-[0_1px_0_0_#dddddd]">
                            <tr className="bg-white">
                                <th className="py-4 pl-6 pr-4 font-bold text-black text-[15px] border-b border-black w-[25%] bg-white">
                                    Nama Benda
                                </th>
                                <th className="py-4 px-4 font-bold text-black text-[15px] border-b border-black w-[20%] bg-white">
                                    Jenis Benda
                                </th>
                                <th className="py-4 px-4 font-bold text-black text-[15px] border-b border-black text-center bg-white">
                                    Tanggal Di Updet
                                </th>
                                <th className="py-4 px-4 font-bold text-black text-[15px] border-b border-black text-center bg-white">
                                    Token
                                </th>
                                <th className="py-4 px-4 font-bold text-black text-[15px] border-b border-black text-center bg-white">
                                    Detail
                                </th>
                                <th className="py-4 pl-4 pr-6 font-bold text-black text-[15px] border-b border-black text-center bg-white">
                                    <button
                                        onClick={() =>
                                            setIsEditMode(!isEditMode)
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-full text-[13px] transition-colors cursor-pointer font-semibold shadow-sm">
                                        {isEditMode ? "Selesai" : "Edit"}
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-[#dddddd] last:border-b-0 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 pl-6 pr-4 font-semibold text-[14px] text-black">
                                        {row.nama}
                                    </td>
                                    <td className="py-4 px-4 font-semibold text-[14px] text-gray-700">
                                        {row.jenis}
                                    </td>
                                    <td className="py-4 px-4 text-center font-semibold text-[14px] text-gray-700">
                                        {row.tanggal}
                                    </td>
                                    <td className="py-4 px-4 text-center font-semibold text-[14px] text-gray-700 font-mono">
                                        {row.token}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() =>
                                                    setDetailData(row)
                                                }
                                                title="Lihat Detail Benda"
                                                className="bg-transparent border-0 cursor-pointer p-1 rounded hover:bg-gray-100 transition-colors">
                                                <ArrowRight className="w-5 h-5 text-black hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-4 pl-4 pr-6 text-center">
                                        {isEditMode && (
                                            <div className="flex justify-center items-center gap-3 animate-in fade-in zoom-in duration-200">
                                                <button
                                                    onClick={() =>
                                                        setDeleteItem(row)
                                                    }
                                                    title="Hapus Koleksi"
                                                    className="text-red-500 hover:text-red-700 transition-colors bg-transparent border-0 cursor-pointer p-1">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openEditModal(row)
                                                    }
                                                    title="Edit Koleksi"
                                                    className="text-blue-500 hover:text-blue-700 transition-colors bg-transparent border-0 cursor-pointer p-1">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {filteredData.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-12 text-center text-gray-500 font-semibold text-[15px]">
                                        Data tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- 1. MODAL TAMBAH KOLEKSI (Blur Background) --- */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={closeModals}
                    />
                    <div className="relative bg-white w-full max-w-[500px] rounded-[24px] p-8 shadow-xl z-10 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={closeModals}
                            className="absolute top-6 right-6 border-0 bg-transparent cursor-pointer">
                            <X className="w-6 h-6 text-gray-500 hover:text-black" />
                        </button>
                        <h2 className="text-[22px] font-bold text-black mb-6">
                            Tambahkan Koleksi Baru
                        </h2>

                        <form
                            onSubmit={handleAddSubmit}
                            className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Nama Benda
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formNama}
                                    onChange={(e) =>
                                        setFormNama(e.target.value)
                                    }
                                    placeholder="Contoh: Meriam Kuno"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Jenis Benda
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formJenis}
                                        onChange={(e) =>
                                            setFormJenis(e.target.value)
                                        }
                                        placeholder="Contoh: Senjata"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Token
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formToken}
                                        onChange={(e) =>
                                            setFormToken(e.target.value)
                                        }
                                        placeholder="XYZ123"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Upload Gambar (.jpg / .png)
                                </label>
                                <div className="flex items-center gap-3">
                                    <label className="cursor-pointer flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-black font-semibold py-3 px-4 rounded-xl border border-gray-300 w-full transition-colors">
                                        <Upload className="w-4 h-4" /> Pilih
                                        File Gambar
                                        <input
                                            type="file"
                                            accept=".jpg, .jpeg, .png"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                    {formGambar && (
                                        <img
                                            src={formGambar}
                                            alt="Preview"
                                            className="w-12 h-12 rounded-lg object-cover border border-gray-300"
                                        />
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Keterangan Penjelasan
                                </label>
                                <textarea
                                    required
                                    value={formDeskripsi}
                                    onChange={(e) =>
                                        setFormDeskripsi(e.target.value)
                                    }
                                    placeholder="Deskripsi sejarah benda ini..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-4 w-full bg-[#222] hover:bg-black text-white font-bold py-4 rounded-xl cursor-pointer transition-colors">
                                Konfirmasi Tambah
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- 2. MODAL DETAIL BENDA (Blur Background) --- */}
            {detailData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={closeModals}
                    />
                    <div className="relative bg-white w-full max-w-[450px] rounded-[24px] p-6 shadow-xl z-10 animate-in zoom-in-95 duration-200">
                        <button
                            onClick={closeModals}
                            className="absolute top-4 right-4 bg-white/80 rounded-full p-1 cursor-pointer z-10">
                            <X className="w-6 h-6 text-black" />
                        </button>
                        <div className="relative w-full h-[250px] mb-6 rounded-xl overflow-hidden bg-gray-100">
                            <img
                                src={detailData.gambar}
                                alt={detailData.nama}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-[24px] font-bold text-black mb-1">
                            {detailData.nama}
                        </h2>
                        <span className="inline-block bg-gray-100 text-gray-700 text-[12px] font-bold px-3 py-1 rounded-full mb-4">
                            {detailData.jenis}
                        </span>
                        <p className="text-[14px] text-gray-600 font-medium leading-relaxed mb-4">
                            {detailData.deskripsi}
                        </p>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <p className="text-[11px] text-gray-400 font-bold uppercase">
                                    Token
                                </p>
                                <p className="font-bold text-black text-[14px]">
                                    {detailData.token}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[11px] text-gray-400 font-bold uppercase">
                                    Update Terakhir
                                </p>
                                <p className="font-bold text-black text-[14px]">
                                    {detailData.tanggal}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 3. MODAL HAPUS KONFIRMASI (Card Hitam #1f1f1f) --- */}
            {deleteItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={closeModals}
                    />
                    <div className="relative bg-[#1f1f1f] w-full max-w-[400px] rounded-[24px] p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center border border-white/10">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-white text-[18px] font-bold mb-2">
                            Hapus Koleksi?
                        </h3>
                        <p className="text-gray-400 text-[14px] mb-8 font-medium">
                            Apakah anda benar benar ingin mengapusnya?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={closeModals}
                                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors cursor-pointer text-[14px]">
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-[14px]">
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 4. MODAL EDIT DATA (Blur Background) --- */}
            {editItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={closeModals}
                    />
                    <div className="relative bg-white w-full max-w-[500px] rounded-[24px] p-8 shadow-xl z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={closeModals}
                            className="absolute top-6 right-6 border-0 bg-transparent cursor-pointer z-10">
                            <X className="w-6 h-6 text-gray-500 hover:text-black" />
                        </button>
                        <h2 className="text-[22px] font-bold text-black mb-6">
                            Edit Koleksi Sejarah
                        </h2>

                        <form
                            onSubmit={handleEditSubmit}
                            className="flex flex-col gap-4">
                            {/* Image Editor Preview */}
                            <div className="relative w-full h-[200px] rounded-xl overflow-hidden bg-gray-100 mb-2 group">
                                <img
                                    src={formGambar}
                                    alt="Preview Edit"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <label className="cursor-pointer bg-white text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-[13px] hover:bg-gray-100">
                                        <ImageIcon className="w-4 h-4" /> Ganti
                                        Foto (JPG)
                                        <input
                                            type="file"
                                            accept=".jpg, .jpeg, .png"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Nama Benda
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formNama}
                                    onChange={(e) =>
                                        setFormNama(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Jenis Benda
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formJenis}
                                        onChange={(e) =>
                                            setFormJenis(e.target.value)
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Token
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formToken}
                                        onChange={(e) =>
                                            setFormToken(e.target.value)
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">
                                    Keterangan Penjelasan
                                </label>
                                <textarea
                                    required
                                    value={formDeskripsi}
                                    onChange={(e) =>
                                        setFormDeskripsi(e.target.value)
                                    }
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none font-semibold text-black resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl cursor-pointer transition-colors">
                                Konfirmasi Perubahan
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
