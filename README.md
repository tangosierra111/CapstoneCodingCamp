# EduPerform - Student Learning Performance Predictor

EduPerform adalah sebuah platform pendidikan modern yang memungkinkan siswa (SMP, SMA) untuk memprediksi performa belajar mereka berdasarkan berbagai indikator kebiasaan belajar, penggunaan AI, dan partisipasi akademik. Sistem ini memanfaatkan model Machine Learning (Logistic Regression) untuk memberikan prediksi tingkat performa (**Low**, **Medium**, atau **High**) beserta rekomendasi belajar yang personal.

## 🚀 Fitur Utama

- **Sistem Autentikasi**: Registrasi dan Login yang aman menggunakan JWT dan *bcrypt password hashing*.
- **Profil Pengguna**: Manajemen akun termasuk pembaruan *password*, jenjang pendidikan, hingga penghapusan akun (*soft delete* 90 hari).
- **Prediksi Cerdas**: 30+ parameter input interaktif (menggunakan *range sliders* UI yang premium) untuk mengevaluasi performa.
- **Riwayat Prediksi**: Melacak hasil performa dari waktu ke waktu melalui tabel riwayat dan *detail modal* yang komprehensif.
- **Desain Premium**: Antarmuka modern dengan efek *glassmorphism*, tipografi bersih (Google Font Inter), animasi mulus (Framer Motion), dan ikon vektor (Lucide React).

## 🛠️ Tech Stack

Proyek ini dibangun menggunakan arsitektur *microservices* ringan dengan pembagian Front-End, Back-End, dan ML Service:

| Layer        | Teknologi              | Keterangan                                               |
|--------------|------------------------|----------------------------------------------------------|
| **Front-End**| React.js (Vite)        | UI interaktif berbasis komponen dengan *glassmorphism*   |
| **Back-End** | Express.js (Node.js)   | REST API server untuk logika bisnis dan autentikasi      |
| **Database** | MySQL                  | Penyimpanan data akun dan riwayat prediksi               |
| **ML Service**| Python (Flask)        | *Microservice* inferensi menjalankan model `.joblib`     |

## 📁 Struktur Direktori

```
codingcamp/
├── client/              # Front-End (React + Vite)
├── server/              # Back-End (Express.js)
│   ├── config/          # Konfigurasi Database
│   ├── controllers/     # Logika bisnis API
│   ├── middleware/      # JWT dan Validasi
│   ├── models/          # Query SQL MySQL
│   ├── routes/          # Definisi Endpoint API
│   └── ml_service/      # Python Flask Server untuk Inferensi AI
├── models/              # File .joblib model Machine Learning
├── data/                # Dataset mentah dan dataset bersih
└── database_init.sql    # Skema inisialisasi tabel Database MySQL
```

## ⚙️ Persyaratan Sistem (Prerequisites)

Sebelum menjalankan aplikasi, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (Versi 18+ disarankan)
- [Python](https://www.python.org/) (Versi 3.9+)
- [XAMPP](https://www.apachefriends.org/index.html) atau MySQL Server

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini membutuhkan 3 service yang berjalan secara bersamaan di terminal yang berbeda.

### 1. Persiapan Database
1. Buka XAMPP Control Panel dan nyalakan **MySQL**.
2. Buka *phpMyAdmin* (atau CLI MySQL) dan *import* file `database_init.sql` yang berada di folder *root* proyek.

### 2. Menjalankan Back-End (Express Server)
Buka terminal baru, arahkan ke folder `server`, lalu instal dependensi dan jalankan:
```bash
cd server
npm install
npm run dev
```
*(Server akan berjalan di `http://localhost:5000`)*

### 3. Menjalankan Machine Learning Service (Python Flask)
Buka terminal baru, arahkan ke folder `server/ml_service`, instal dependensi Python, dan jalankan:
```bash
cd server/ml_service
pip install -r ../../requirements.txt
python app.py
```
*(Flask API akan berjalan di `http://localhost:5001`)*

### 4. Menjalankan Front-End (React App)
Buka terminal baru, arahkan ke folder `client`, instal dependensi dan jalankan:
```bash
cd client
npm install
npm run dev
```
*(Aplikasi web akan terbuka di `http://localhost:5173`)*

---

## 🔒 Keamanan (Security)

- **Password Hashing**: Semua kata sandi diamankan di database menggunakan algoritma hashing `bcrypt`.
- **JWT Protection**: Endpoint privat seperti pengambilan profil dan prediksi dilindungi menggunakan JSON Web Tokens.
- **Data Retention**: Penghapusan akun menggunakan metode *soft-delete*. Email yang dihapus dikunci selama 90 hari untuk mencegah penyalahgunaan.

## 📝 Catatan Pengembangan
Proyek ini dikembangkan dalam lingkungan *Agentic Coding* yang dipantau melalui dokumen `AGENTS.md` (Instruksi Dasar) dan `MEMORY.md` (Changelog Pengembangan). Seluruh standar penulisan *clean code* diterapkan untuk memisahkan logika Front-End dan Back-End sepenuhnya.
