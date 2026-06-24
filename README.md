# 🏥 Sistem Antrian IGD Rumah Sakit

Projek ini dibuat guna memenuhi final project Mata Kuliah Struktur Data

Identitas Kelompok:

| Nama | NIM |
|:---:|:---:|
| Pande Putu Agus Diva Surya Dinata. L. | 2508561001 | 
| I Putu Satria Mahatama | 2508561017 | 

Aplikasi sistem antrian pasien Instalasi Gawat Darurat (IGD) berbasis web dengan prioritas berdasarkan tingkat kegawatan (triage). Pasien dengan kondisi lebih kritis akan diprioritaskan untuk ditangani terlebih dahulu.

## ✨ Fitur Utama

- **Pendaftaran Pasien**: Input data pasien baru dengan level triage (1-5)
- **Antrian Prioritas**: Pasien diurutkan otomatis berdasarkan tingkat kegawatan menggunakan **Min Heap**
- **Panggil Pasien**: Memanggil pasien berikutnya sesuai prioritas untuk ditangani
- **Riwayat Penanganan**: Melihat daftar pasien yang sudah ditangani, disimpan menggunakan **Double Linked List**
- **Pencarian Riwayat**: Mencari pasien berdasarkan nama pada riwayat penanganan (Linear Search)
- **Hapus Riwayat**: Menghapus seluruh data riwayat penanganan

## 🏗️ Arsitektur & Struktur Data

| Komponen | Struktur Data | Kegunaan |
|---|---|---|
| Antrian pasien | **Min Heap** | Mengurutkan pasien berdasarkan level triage (prioritas) dan waktu masuk |
| Riwayat penanganan | **Double Linked List** | Menyimpan riwayat pasien yang sudah ditangani |
| Pencarian riwayat | **Linear Search** | Mencari nama pasien pada linked list riwayat |

### Level Triage

| Level | Kategori | Keterangan |
|:---:|---|---|
| 1 | 🔴 Kritis | Mengancam nyawa, perlu penanganan segera |
| 2 | 🟠 Darurat | Kondisi serius, prioritas tinggi |
| 3 | 🟡 Mendesak | Perlu penanganan cepat |
| 4 | 🟢 Ringan | Kondisi stabil, bisa menunggu |
| 5 | 🔵 Non-darurat | Tidak memerlukan penanganan segera |

## 📁 Struktur Proyek

```
Sistem-antrian-rumah-sakit/
├── backend/
│   └── app/
│       ├── __init__.py
│       ├── main.py            # API endpoints (FastAPI)
│       └── antrianRS.py       # Struktur data (MinHeap, DoubleLinkedList, dll.)
├── frontend/
│   └── src/
│       ├── antrian.html       # Halaman utama dashboard antrian
│       ├── antrian.js         # Logika frontend halaman antrian
│       ├── riwayat.html       # Halaman riwayat penanganan
│       ├── riwayat.js         # Logika frontend halaman riwayat
│       ├── input.css          # Source CSS (Tailwind)
│       └── output.css         # CSS hasil build Tailwind
├── pyproject.toml
├── requrements.txt
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/pasien` | Mendaftarkan pasien baru ke antrian |
| `GET` | `/antrian` | Menampilkan seluruh antrian aktif (terurut) |
| `POST` | `/proses` | Memanggil & memproses pasien berikutnya |
| `GET` | `/riwayat` | Menampilkan riwayat penanganan (opsional: `?search=nama`) |
| `DELETE` | `/riwayat/clear` | Menghapus seluruh riwayat penanganan |

## 🚀 Cara Menjalankan

### Prasyarat

- Python 3.10+
- Node.js (untuk build Tailwind CSS, opsional)

### 1. Install Dependencies Backend

```bash
pip install -r requrements.txt
```

### 2. Jalankan Backend Server

```bash
fastapi dev
```

Server akan berjalan di `http://127.0.0.1:8000`.

### 3. Buka Frontend

Buka file `frontend/src/antrian.html` di browser, atau gunakan extension **Live Server** di VS Code.

### 4. Build Tailwind CSS (Opsional)

Jika ingin mengubah styling:

```bash
cd frontend
npx @tailwindcss/cli -i src/input.css -o src/output.css --watch
```

## 🛠️ Tech Stack

- **Backend:** Python, FastAPI, Pydantic
- **Frontend:** HTML, JavaScript (Vanilla), Tailwind CSS v4
- **Icons:** Tabler Icons (Webfont)