# Role

Kamu adalah seorang Senior Full-Stack Web Developer yang sudah berpengalaman membangun ribuan software yang digunakan oleh jutaan orang. Tugas kamu adalah membangun sebuah aplikasi pendidikan, di mana kamu berperan dalam merancang tampilan aplikasi (Front-End) dan logika aplikasi (Back-End).

Dalam menjalankan tugasmu, kamu wajib:
- Mengikuti konvensi penulisan kode yang bersih (clean code) dan mudah dipahami
- Menerapkan prinsip separation of concerns antara Front-End dan Back-End
- Memastikan keamanan data pengguna (validasi input, hashing password, proteksi rute)
- Mendokumentasikan setiap perubahan yang kamu lakukan di file `MEMORY.md`
- Membaca ulang `AGENTS.md` di setiap awal sesi baru untuk memastikan konsistensi pengembangan


# Tentang Aplikasi

Aplikasi yang akan dibangun adalah sebuah aplikasi di bidang pendidikan, di mana seorang murid atau mahasiswa dapat mengetahui performa belajarnya berdasarkan beberapa fitur yang diinputkan. Hasil akhirnya, user dapat mengetahui performa belajarnya, apakah **Low**, **Medium**, atau **High**.

Nama aplikasi: **EduPerform**

Alur utama aplikasi:
1. User mendaftar akun dan login ke aplikasi
2. User mengisi form input berisi fitur-fitur terkait kebiasaan dan kondisi belajarnya
3. Sistem mengirimkan data input ke model Machine Learning (Logistic Regression) melalui API back-end
4. Model mengembalikan hasil prediksi performa: **Low**, **Medium**, atau **High**
5. Aplikasi menampilkan hasil prediksi beserta rekomendasi: apa yang perlu ditingkatkan dan apa yang sudah baik untuk dipertahankan
6. Setiap sesi prediksi disimpan ke database sebagai riwayat untuk referensi user di masa mendatang


# Tech Stack

Berikut adalah teknologi yang digunakan untuk membangun aplikasi ini:

| Layer        | Teknologi              | Keterangan                                               |
|--------------|------------------------|----------------------------------------------------------|
| Front-End    | React.js               | UI interaktif berbasis komponen                          |
| Back-End     | Express.js             | REST API server (Node.js)                                |
| Database     | MySQL                  | Penyimpanan data user dan riwayat prediksi               |
| ML Inference | Python (Flask/FastAPI) | Menjalankan model `.joblib` dan mengembalikan prediksi   |
| ML Model     | Logistic Regression    | Model klasifikasi performa belajar                       |
| Preprocessing| OneHotEncoder          | Transformasi fitur kategorikal sebelum inferensi         |

> **Catatan:** Karena model ML disimpan dalam format `.joblib` (Python), diperlukan sebuah microservice Python terpisah (misalnya Flask atau FastAPI) yang dipanggil oleh Express.js via HTTP internal untuk menjalankan inferensi.


# Struktur Project

Berikut adalah struktur direktori lengkap dari aplikasi ini:

```
app/
├── client/                                             # Front-End (React.js)
│   ├── public/
│   ├── src/
│   │   ├── assets/                                     # Gambar, ikon, dan aset statis
│   │   ├── components/                                 # Komponen UI yang dapat digunakan ulang
│   │   ├── pages/                                      # Halaman utama (Register, Login, Dashboard, Predict, dll.)
│   │   ├── services/                                   # Fungsi pemanggil API (axios)
│   │   ├── store/                                      # State management (Context API / Redux)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                                            # Konfigurasi environment Front-End
│   └── package.json
│
├── data/                                               # Dataset
│   ├── ai_impact_student_performance_dataset.csv       # Dataset original (sebelum preprocessing)
│   └── CLEANED_ai_impact_student_performance_dataset.csv # Dataset setelah preprocessing
│
├── models/                                             # Model Machine Learning
│   ├── LogisticRegressionModel.joblib                  # Model klasifikasi performa
│   └── OneHotEncoder.joblib                            # Model preprocessing One-Hot Encoding
│
├── server/                                             # Back-End (Express.js)
│   ├── config/
│   │   └── db.js                                       # Koneksi ke database MySQL
│   ├── controllers/                                    # Logika bisnis per fitur
│   │   ├── authController.js                           # Register, Login, Logout
│   │   ├── userController.js                           # Update dan hapus akun
│   │   └── predictionController.js                     # Input fitur dan prediksi
│   ├── middleware/
│   │   ├── authMiddleware.js                           # Verifikasi JWT token
│   │   └── validateInput.js                            # Validasi body request
│   ├── models/                                         # Query SQL (tidak menggunakan ORM)
│   │   ├── userModel.js
│   │   └── datasetModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── predictionRoutes.js
│   ├── ml_service/                                     # Microservice Python untuk inferensi ML
│   │   ├── app.py                                      # Flask/FastAPI server
│   │   └── predict.py                                  # Logika preprocessing + prediksi
│   ├── .env                                            # Konfigurasi environment Back-End
│   ├── app.js                                          # Entry point Express.js
│   └── package.json
│
├── AGENTS.md                                           # Instruksi pengembangan aplikasi (file ini)
├── MEMORY.md                                           # Catatan setiap perubahan yang dilakukan
└── requirements.txt                                    # Dependensi Python (untuk ml_service)
```


# Pengguna

Target utama aplikasi ini adalah murid atau mahasiswa yang masih menempuh pendidikan. Ke depannya mereka akan disebut sebagai **user**. Berikut adalah hal-hal yang dapat dilakukan user:

1. **Register** — Membuat akun baru dengan mengisi:
   - Email
   - Nama Depan
   - Nama Belakang
   - Jenjang Pendidikan: SMP, SMA, atau Mahasiswa
   - Password (akan di-hash menggunakan bcrypt sebelum disimpan)

2. **Login** — Masuk ke aplikasi menggunakan Email dan Password. Sistem mengembalikan JWT token yang disimpan di sisi client untuk autentikasi rute-rute yang dilindungi.

3. **Prediksi Performa** — Menginputkan fitur-fitur belajar (dijelaskan di bagian Dataset) untuk mendapatkan prediksi performa: **Low**, **Medium**, atau **High**, beserta rekomendasi tindakan.

4. **Update Profil** — Memperbarui data akun. Field yang **tidak dapat** diubah: Nama Depan, Nama Belakang, dan Email. Field yang **dapat** diubah: Password dan Jenjang Pendidikan.

5. **Logout** — Keluar dari sesi aktif (invalidasi token di sisi client).

6. **Hapus Akun** — User dapat menghapus akunnya secara permanen. Konsekuensinya: email yang digunakan **tidak dapat** dipakai untuk mendaftar ulang selama **90 hari** sejak tanggal penghapusan. Implementasi: tambahkan kolom `deleted_at` pada tabel `users` dan cek durasi 90 hari saat proses register.


# Dataset

Dataset berisi fitur-fitur untuk menentukan performa belajar user. Total data: **8.000 baris**.

## Fitur Sebelum Preprocessing (26 kolom)

| No | Nama Fitur                      | Tipe    | Nilai / Keterangan                                                         |
|----|---------------------------------|---------|----------------------------------------------------------------------------|
| 1  | student_id                      | INT     | ID unik setiap siswa                                                       |
| 2  | age                             | INT     | Usia siswa (14 – 24)                                                       |
| 3  | gender                          | STRING  | `Male`, `Female`, `Other` → One-Hot Encoding                               |
| 4  | grade_level                     | STRING  | `10th`, `11th`, `12th`, `1st Year`, `2nd Year`, `3rd Year` → encode 0/1/2 |
| 5  | study_hours_per_day             | FLOAT   | 0.5 – 6.0                                                                  |
| 6  | uses_ai                         | INT     | 0 = Tidak, 1 = Ya                                                          |
| 7  | ai_usage_time_minutes           | INT     | 0 – 179 menit/hari                                                         |
| 8  | ai_tools_used                   | STRING  | `ChatGPT`, `Gemini`, `Claude`, `Copilot`, `ChatGPT+Gemini`, atau NaN       |
| 9  | ai_usage_purpose                | STRING  | `Exam Prep`, `Doubt Solving`, `Homework`, `Coding`, `Notes`, atau NaN      |
| 10 | ai_dependency_score             | INT     | 1 – 10                                                                     |
| 11 | ai_generated_content_percentage | INT     | 0 – 100 (%)                                                                |
| 12 | ai_prompts_per_week             | INT     | 0 – 119                                                                    |
| 13 | ai_ethics_score                 | INT     | 1 – 10                                                                     |
| 14 | last_exam_score                 | INT     | 20 – 99                                                                    |
| 15 | assignment_scores_avg           | FLOAT   | 30.0 – 100.0                                                               |
| 16 | attendance_percentage           | FLOAT   | 40.0 – 100.0 (%)                                                           |
| 17 | concept_understanding_score     | INT     | 1 – 10                                                                     |
| 18 | study_consistency_index         | FLOAT   | 1.0 – 10.0                                                                 |
| 19 | improvement_rate                | FLOAT   | −20.0 – 40.0                                                               |
| 20 | sleep_hours                     | FLOAT   | 4.0 – 9.0                                                                  |
| 21 | social_media_hours              | FLOAT   | 0.0 – 6.0                                                                  |
| 22 | tutoring_hours                  | FLOAT   | 0.0 – 5.0                                                                  |
| 23 | class_participation_score       | INT     | 1 – 10                                                                     |
| 24 | final_score                     | FLOAT   | **Dihapus** — data leakage ke target                                       |
| 25 | passed                          | INT     | **Dihapus** — data leakage ke target (semua bernilai 1)                    |
| 26 | performance_category            | STRING  | **Variabel target:** `Low` (2.542), `Medium` (4.705), `High` (753)         |

> **Catatan penting tentang `ai_tools_used`:** Kolom ini bisa berisi **satu tool** (`ChatGPT`, `Gemini`, `Claude`, `Copilot`) **atau kombinasi** (contoh: `ChatGPT+Gemini`). Nilai NaN menandakan user tidak menggunakan AI. OneHotEncoder menangani ini dengan menghasilkan 4 kolom biner terpisah.

> **Catatan penting tentang `gender`:** Nilai yang valid adalah `Male`, `Female`, dan `Other` (bukan `Others`).

## Fitur Setelah Preprocessing (35 kolom — input ke model)

Empat fitur dihapus karena **data leakage** ke variabel target: `performance_encoded`, `final_score`, `passed`, `score_gap`.

| No | Nama Kolom (di dataset cleaned)    | Tipe di Dataset | Keterangan                                         |
|----|------------------------------------|-----------------|----------------------------------------------------|
| 1  | age                                | INT             | Usia (14 – 24)                                     |
| 2  | study_hours_per_day                | FLOAT           | Jam belajar/hari (0.5 – 6.0)                       |
| 3  | uses_ai                            | INT             | 0 / 1                                              |
| 4  | ai_usage_time_minutes              | INT             | 0 – 179                                            |
| 5  | ai_dependency_score                | INT             | 1 – 10                                             |
| 6  | ai_generated_content_percentage    | INT             | 0 – 100                                            |
| 7  | ai_prompts_per_week                | INT             | 0 – 119                                            |
| 8  | ai_ethics_score                    | INT             | 1 – 10                                             |
| 9  | last_exam_score                    | INT             | 20 – 99                                            |
| 10 | assignment_scores_avg              | FLOAT           | 30.0 – 100.0                                       |
| 11 | attendance_percentage              | FLOAT           | 40.0 – 100.0                                       |
| 12 | concept_understanding_score        | INT             | 1 – 10                                             |
| 13 | study_consistency_index            | FLOAT           | 1.0 – 10.0                                         |
| 14 | improvement_rate                   | FLOAT           | −20.0 – 40.0                                       |
| 15 | sleep_hours                        | FLOAT           | 4.0 – 9.0                                         |
| 16 | social_media_hours                 | FLOAT           | 0.0 – 6.0                                          |
| 17 | tutoring_hours                     | FLOAT           | 0.0 – 5.0                                          |
| 18 | class_participation_score          | INT             | 1 – 10                                             |
| 19 | ai_usage_hours                     | FLOAT           | Fitur turunan: `ai_usage_time_minutes / 60`        |
| 20 | ai_study_ratio                     | FLOAT           | Fitur turunan: `ai_usage_hours / study_hours_per_day` |
| 21 | ai_tools_used_ChatGPT              | FLOAT (0/1)     | One-Hot Encoding                                   |
| 22 | ai_tools_used_Claude               | FLOAT (0/1)     | One-Hot Encoding                                   |
| 23 | ai_tools_used_Copilot              | FLOAT (0/1)     | One-Hot Encoding                                   |
| 24 | ai_tools_used_Gemini               | FLOAT (0/1)     | One-Hot Encoding                                   |
| 25 | ai_usage_purpose_Coding            | FLOAT (0/1)     | One-Hot Encoding                                   |
| 26 | ai_usage_purpose_Doubt Solving     | FLOAT (0/1)     | One-Hot Encoding (nama kolom mengandung spasi)     |
| 27 | ai_usage_purpose_Exam Prep         | FLOAT (0/1)     | One-Hot Encoding (nama kolom mengandung spasi)     |
| 28 | ai_usage_purpose_Homework          | FLOAT (0/1)     | One-Hot Encoding                                   |
| 29 | ai_usage_purpose_Notes             | FLOAT (0/1)     | One-Hot Encoding                                   |
| 30 | grade_level                        | INT             | 0 = Kelas 10 / Thn 1, 1 = Kelas 11 / Thn 2, 2 = Kelas 12 / Thn 3 |
| 31 | performance_category               | INT             | **Target:** `0` = Low, `1` = Medium, `2` = High   |

> **Catatan:** Di cleaned dataset, kolom `performance_category` dan `performance_encoded` **identik** (keduanya bernilai 0/1/2). Saat menyimpan hasil prediksi ke database, konversi kembali ke label string: `0 → Low`, `1 → Medium`, `2 → High`.

Untuk detail lebih lengkap, baca file `CLEANED_ai_impact_student_performance_dataset.csv`.


# Skema Basis Data

Pada aplikasi ini, terdapat satu (1) basis data bernama **`codingcamp`** dan dua (2) tabel: `users` dan `dataset`.

## SQL Inisialisasi

```sql
CREATE DATABASE IF NOT EXISTS codingcamp;
USE codingcamp;
```

## 1. Tabel `users`

Menyimpan data akun setiap user yang terdaftar.

```sql
CREATE TABLE users (
    student_id      INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,       -- Hasil hash bcrypt
    education_level VARCHAR(15)  NOT NULL,       -- 'SMP', 'SMA', 'Mahasiswa'
    deleted_at      DATETIME     DEFAULT NULL,   -- NULL = aktif, diisi saat akun dihapus
    created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP
);
```

| Kolom           | Tipe          | Keterangan                                           |
|-----------------|---------------|------------------------------------------------------|
| student_id      | INT PK AI     | ID unik user, auto-increment                         |
| first_name      | VARCHAR(100)  | Nama depan                                           |
| last_name       | VARCHAR(100)  | Nama belakang                                        |
| email           | VARCHAR(100)  | Email unik, digunakan untuk login                    |
| password        | VARCHAR(255)  | Password yang sudah di-hash dengan bcrypt            |
| education_level | VARCHAR(15)   | Jenjang pendidikan: `SMP`, `SMA`, `Mahasiswa`        |
| deleted_at      | DATETIME      | Diisi saat akun dihapus; `NULL` = akun masih aktif   |
| created_at      | DATETIME      | Waktu pendaftaran akun                               |

## 2. Tabel `dataset`

Menyimpan setiap sesi input dan hasil prediksi performa belajar dari user. Satu user dapat memiliki banyak riwayat prediksi.

Tipe data kolom mengikuti tipe aktual di dataset (`INT` untuk nilai bulat, `FLOAT` untuk nilai desimal), sesuai hasil pembacaan file `CLEANED_ai_impact_student_performance_dataset.csv`.

```sql
CREATE TABLE dataset (
    dataset_id                          INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
    student_id                          INT          NOT NULL,

    -- Informasi Demografis
    age                                 INT          NOT NULL,  -- 14 – 24
    grade_level                         INT          NOT NULL,  -- 0, 1, atau 2

    -- Kebiasaan Belajar
    study_hours_per_day                 FLOAT        NOT NULL,  -- 0.5 – 6.0
    sleep_hours                         FLOAT        NOT NULL,  -- 4.0 – 9.0
    social_media_hours                  FLOAT        NOT NULL,  -- 0.0 – 6.0
    tutoring_hours                      FLOAT        NOT NULL,  -- 0.0 – 5.0
    attendance_percentage               FLOAT        NOT NULL,  -- 40.0 – 100.0
    class_participation_score           INT          NOT NULL,  -- 1 – 10
    study_consistency_index             FLOAT        NOT NULL,  -- 1.0 – 10.0
    improvement_rate                    FLOAT        NOT NULL,  -- -20.0 – 40.0

    -- Performa Akademik
    last_exam_score                     INT          NOT NULL,  -- 20 – 99
    assignment_scores_avg               FLOAT        NOT NULL,  -- 30.0 – 100.0
    concept_understanding_score         INT          NOT NULL,  -- 1 – 10

    -- Penggunaan AI
    uses_ai                             TINYINT(1)   NOT NULL,  -- 0 = Tidak, 1 = Ya
    ai_usage_time_minutes               INT          NOT NULL,  -- 0 – 179
    ai_dependency_score                 INT          NOT NULL,  -- 1 – 10
    ai_generated_content_percentage     INT          NOT NULL,  -- 0 – 100
    ai_prompts_per_week                 INT          NOT NULL,  -- 0 – 119
    ai_ethics_score                     INT          NOT NULL,  -- 1 – 10

    -- Fitur Turunan (dihitung di back-end sebelum disimpan)
    ai_usage_hours                      FLOAT        NOT NULL,  -- ai_usage_time_minutes / 60
    ai_study_ratio                      FLOAT        NOT NULL,  -- ai_usage_hours / study_hours_per_day

    -- One-Hot Encoding: AI Tools Used (boleh lebih dari satu = 1)
    ai_tools_used_ChatGPT               TINYINT(1)   NOT NULL DEFAULT 0,
    ai_tools_used_Claude                TINYINT(1)   NOT NULL DEFAULT 0,
    ai_tools_used_Copilot               TINYINT(1)   NOT NULL DEFAULT 0,
    ai_tools_used_Gemini                TINYINT(1)   NOT NULL DEFAULT 0,

    -- One-Hot Encoding: AI Usage Purpose (hanya satu yang bernilai 1)
    ai_usage_purpose_Coding             TINYINT(1)   NOT NULL DEFAULT 0,
    ai_usage_purpose_Doubt_Solving      TINYINT(1)   NOT NULL DEFAULT 0,
    ai_usage_purpose_Exam_Prep          TINYINT(1)   NOT NULL DEFAULT 0,
    ai_usage_purpose_Homework           TINYINT(1)   NOT NULL DEFAULT 0,
    ai_usage_purpose_Notes              TINYINT(1)   NOT NULL DEFAULT 0,

    -- Hasil Prediksi (disimpan sebagai label string untuk keterbacaan)
    performance_category                VARCHAR(10)  NOT NULL,  -- 'Low', 'Medium', 'High'

    -- Timestamp
    created_at                          DATETIME     DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_student
        FOREIGN KEY (student_id) REFERENCES users(student_id)
        ON DELETE CASCADE
);
```

| Kelompok              | Kolom                                      | Tipe         | Keterangan                                                  |
|-----------------------|--------------------------------------------|--------------|-------------------------------------------------------------|
| Primary Key           | dataset_id                                 | INT PK AI    | ID unik setiap sesi prediksi                                |
| Foreign Key           | student_id                                 | INT FK       | Merujuk ke `users.student_id`, cascade delete               |
| Demografis            | age, grade_level                           | INT          | Usia (14–24) dan tingkat kelas (0/1/2)                      |
| Kebiasaan Belajar     | study_hours_per_day, sleep_hours, dll.     | FLOAT / INT  | Pola aktivitas harian                                       |
| Performa Akademik     | last_exam_score, assignment_scores_avg     | INT / FLOAT  | Nilai-nilai akademik                                        |
| Penggunaan AI         | uses_ai, ai_usage_time_minutes, dll.       | INT          | Pola dan intensitas penggunaan AI                           |
| Fitur Turunan         | ai_usage_hours, ai_study_ratio             | FLOAT        | Dihitung otomatis di back-end sebelum disimpan              |
| One-Hot: AI Tools     | ai_tools_used_*                            | TINYINT(1)   | Bisa lebih dari satu bernilai 1 (misal: ChatGPT+Gemini)     |
| One-Hot: AI Purpose   | ai_usage_purpose_*                         | TINYINT(1)   | Hanya satu yang bernilai 1 per baris                        |
| Hasil Prediksi        | performance_category                       | VARCHAR(10)  | Label string: `Low`, `Medium`, `High`                       |
| Timestamp             | created_at                                 | DATETIME     | Waktu sesi prediksi dilakukan                               |

> **Catatan encoding:** Model mengembalikan nilai integer (`0`, `1`, `2`). Back-end wajib mengonversi sebelum menyimpan ke tabel: `0 → 'Low'`, `1 → 'Medium'`, `2 → 'High'`.

> **Catatan nama kolom OHE di Python vs MySQL:** Nama kolom di cleaned dataset mengandung spasi (contoh: `ai_usage_purpose_Doubt Solving`). Di MySQL, nama kolom menggunakan underscore (`ai_usage_purpose_Doubt_Solving`). Pastikan mapping ini ditangani secara eksplisit di `predict.py`.


# API Endpoints

Berikut adalah daftar endpoint REST API yang perlu diimplementasikan di Express.js:

## Auth

| Method | Endpoint            | Akses  | Deskripsi                        |
|--------|---------------------|--------|----------------------------------|
| POST   | /api/auth/register  | Public | Daftar akun baru                 |
| POST   | /api/auth/login     | Public | Login dan mendapat JWT token     |
| POST   | /api/auth/logout    | Auth   | Logout (invalidasi token client) |

## User

| Method | Endpoint            | Akses | Deskripsi                                         |
|--------|---------------------|-------|---------------------------------------------------|
| GET    | /api/user/profile   | Auth  | Ambil data profil user yang sedang login          |
| PUT    | /api/user/update    | Auth  | Perbarui password dan/atau jenjang pendidikan     |
| DELETE | /api/user/delete    | Auth  | Hapus akun (catat `deleted_at`)                   |

## Prediksi

| Method | Endpoint                 | Akses | Deskripsi                                        |
|--------|--------------------------|-------|--------------------------------------------------|
| POST   | /api/predict             | Auth  | Kirim fitur → dapatkan prediksi performa         |
| GET    | /api/predict/history     | Auth  | Ambil riwayat prediksi milik user yang login     |
| GET    | /api/predict/history/:id | Auth  | Ambil detail satu sesi prediksi berdasarkan ID   |


# Aturan Keamanan

- **Password** wajib di-hash menggunakan `bcrypt` (salt rounds minimal 10) sebelum disimpan ke database
- **JWT** digunakan untuk autentikasi. Token dikirim melalui header `Authorization: Bearer <token>`
- **Validasi input** wajib dilakukan di back-end untuk setiap endpoint (gunakan `express-validator` atau middleware kustom)
- **Penghapusan akun** tidak menghapus data fisik dari database, melainkan mengisi kolom `deleted_at`. Email yang terhubung diblokir selama 90 hari
- **CORS** dikonfigurasi agar hanya menerima request dari domain front-end yang diizinkan
- **Environment variable** (`.env`) wajib digunakan untuk menyimpan kredensial database, JWT secret, dan konfigurasi sensitif lainnya — jangan pernah di-hardcode


# Catatan Implementasi ML

- Model `.joblib` hanya dapat dijalankan menggunakan Python. Oleh karena itu, buat microservice terpisah di `server/ml_service/` menggunakan **Flask** atau **FastAPI**
- Express.js akan memanggil microservice Python ini via HTTP internal (misalnya `http://localhost:5001/predict`)
- Sebelum dikirim ke model, data input dari user harus diproses:
  1. Hitung `ai_usage_hours = ai_usage_time_minutes / 60`
  2. Hitung `ai_study_ratio = ai_usage_hours / study_hours_per_day`
  3. Terapkan `OneHotEncoder.joblib` untuk kolom `ai_tools_used` dan `ai_usage_purpose`
  4. Encode `grade_level`: `10th/1st Year → 0`, `11th/2nd Year → 1`, `12th/3rd Year → 2`
- Urutan fitur yang dikirim ke model **harus sama persis** dengan urutan kolom di cleaned dataset (30 fitur, tidak termasuk `performance_category`)
- Model mengembalikan integer: `0 = Low`, `1 = Medium`, `2 = High`. Back-end wajib mengonversi ke label string sebelum menyimpan ke database dan mengirim respons ke front-end
- Nama kolom OHE di Python mengandung spasi (`Doubt Solving`, `Exam Prep`) — pastikan mapping ke nama kolom MySQL (underscore) ditangani secara eksplisit di `predict.py`
