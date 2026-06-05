# EduPerform Development Changelog

## Session 1: Initial Project Setup (May 31, 2026)

### Project Overview
- **Aplikasi**: EduPerform - Platform prediksi performa belajar siswa/mahasiswa
- **Tech Stack**: React.js (Front-End), Express.js (Back-End), MySQL (Database), Python + Flask (ML Service)
- **Target User**: Siswa SMP, SMA, dan Mahasiswa

### Struktur Folder Dibuat
Semua folder sesuai dengan struktur di AGENTS.md berhasil dibuat:

**Client (React)**
- `client/public/` - File statis
- `client/src/assets/` - Gambar dan aset
- `client/src/components/` - Komponen UI reusable
- `client/src/pages/` - Halaman aplikasi
- `client/src/services/` - API service handlers
- `client/src/store/` - State management (Context API)

**Server (Express)**
- `server/config/` - Konfigurasi database
- `server/controllers/` - Business logic (auth, user, prediction)
- `server/middleware/` - Middleware (auth, validation)
- `server/models/` - Database models
- `server/routes/` - API routes
- `server/ml_service/` - Python ML microservice

### File Backend dibuat:

**Konfigurasi & Entry Point**
- `server/app.js` - Express main server
- `server/config/db.js` - MySQL connection pool
- `server/package.json` - Node.js dependencies
- `server/.env` - Environment variables
- `server/.env.development` - Development config

**Middleware**
- `server/middleware/authMiddleware.js` - JWT verification
- `server/middleware/validateInput.js` - Request validation using express-validator

**Database Models**
- `server/models/userModel.js` - User table operations (CRUD, soft delete, 90-day check)
- `server/models/datasetModel.js` - Dataset table operations (prediction history)

**Controllers**
- `server/controllers/authController.js` - Register, Login, Logout dengan bcrypt hashing
- `server/controllers/userController.js` - Profile, Update, Delete account
- `server/controllers/predictionController.js` - Prediction, History, Detail

**Routes**
- `server/routes/authRoutes.js` - /api/auth/* endpoints
- `server/routes/userRoutes.js` - /api/user/* endpoints (protected)
- `server/routes/predictionRoutes.js` - /api/predict/* endpoints (protected)

**ML Service (Python)**
- `server/ml_service/app.py` - Flask server dengan 3 endpoints: /health, /predict, /info
- `server/ml_service/predict.py` - Preprocessing dan model prediction logic
  - Load model dan encoder dari file .joblib
  - Preprocessing: hitung ai_usage_hours dan ai_study_ratio
  - Feature ordering sesuai cleaned dataset (30 fitur)
  - Generate recommendations berdasarkan hasil prediksi

### File Frontend dibuat:

**Konfigurasi & Entry Point**
- `client/src/App.jsx` - Main routing component
- `client/src/main.jsx` - React DOM renderer
- `client/src/main.css` - Global styles
- `client/src/main.css` - Global CSS dengan responsive design
- `client/package.json` - React dependencies (React, React Router, Axios)
- `client/.env` - Environment variables
- `client/.env.development` - Development config
- `client/vite.config.js` - Vite configuration (port 5173)
- `client/public/index.html` - HTML entry point

**Services (API Handlers)**
- `client/src/services/authService.js` - Auth API calls (register, login, logout)
- `client/src/services/userService.js` - User API calls (profile, update, delete)
- `client/src/services/predictionService.js` - Prediction API calls

**State Management**
- `client/src/store/AuthContext.jsx` - Context API untuk authentication state

**Components**
- `client/src/components/Header.jsx` - Navigation header dengan user menu
- `client/src/components/Header.css` - Header styling

**Pages**
- `client/src/pages/LoginPage.jsx` - Login form dengan validasi
- `client/src/pages/RegisterPage.jsx` - Register form dengan education level selection
- `client/src/pages/Auth.css` - Authentication page styling (gradient background)
- `client/src/pages/DashboardPage.jsx` - Dashboard placeholder
- `client/src/pages/PredictPage.jsx` - Prediction form placeholder
- `client/src/pages/HistoryPage.jsx` - Prediction history placeholder
- `client/src/pages/ProfilePage.jsx` - User profile placeholder

### Database Schema Dibuat
- `database_init.sql` - SQL script untuk inisialisasi database
  - Database: `codingcamp`
  - Tabel 1: `users` (user accounts dengan soft delete)
  - Tabel 2: `dataset` (prediction history dengan 35+ kolom)

### Configuration Files
- `requirements.txt` - Python dependencies (Flask, scikit-learn, pandas, numpy, joblib)

### Security Features Implemented
- ✅ Password hashing dengan bcrypt (salt rounds: 10)
- ✅ JWT authentication dengan token expiry
- ✅ Input validation dengan express-validator
- ✅ CORS configuration
- ✅ Soft delete dengan 90-day email reuse blocking
- ✅ Protected routes dengan authMiddleware

### API Endpoints Implemented
**Auth**
- `POST /api/auth/register` - Daftar akun baru
- `POST /api/auth/login` - Login dan dapatkan JWT token
- `POST /api/auth/logout` - Logout (client-side token removal)

**User** (protected)
- `GET /api/user/profile` - Ambil profil user
- `PUT /api/user/update` - Update password dan/atau education level
- `DELETE /api/user/delete` - Soft delete akun

**Prediction** (protected)
- `POST /api/predict` - Kirim fitur dan dapatkan prediksi
- `GET /api/predict/history` - Riwayat prediksi user
- `GET /api/predict/history/:id` - Detail satu prediksi

### ML Service Features
- ✅ Load Logistic Regression model dan OneHotEncoder
- ✅ Input preprocessing (derived features, feature ordering)
- ✅ Prediction dengan confidence scores
- ✅ Recommendations generation
- ✅ Error handling

### Next Steps (To Be Done)
1. ✓ Create complete project structure
2. ✓ Install npm and pip dependencies (fixed versions)
3. ✓ Implement Frontend pages (Dashboard, Predict, History, Profile)
4. ⏳ Complete styling untuk semua halaman
5. ⏳ Testing API endpoints
6. ⏳ Error handling & user feedback
7. ⏳ Deployment setup

### Developer Notes
- Database connection menggunakan mysql2 with connection pooling
- Frontend menggunakan Context API untuk state management (no Redux)
- ML Service standalone Flask server berjalan di port 5001
- Express server berjalan di port 5000
- React dev server berjalan di port 5173
- All sensitive data stored in .env files, never hardcoded

---

## Session 2: Frontend Implementation (May 31, 2026 - Continued)

### Dependencies Fixed
**Backend (server/package.json)**
- ✅ `jsonwebtoken`: `^9.1.0` → `^9.0.2` (fixed ETARGET error)
- ✅ `mysql2`: `^3.6.0` → `^3.6.5` (minor update)

**ML Service (requirements.txt)**
- ✅ `Flask`: 2.3.3 → 3.0.0
- ✅ `pandas`: 2.0.3 → 2.2.0 (fixed build error)
- ✅ `numpy`: 1.24.3 → 1.26.4
- ✅ `scikit-learn`: 1.3.0 → 1.4.1
- ✅ All dependencies successfully installed

**Database Configuration**
- ✅ `DB_PASSWORD=` (empty) untuk localhost root user tanpa password

### Frontend Pages Implemented (5 Pages + Styling)

**1. Dashboard Page** (DashboardPage.jsx + DashboardPage.css)
- Welcome greeting dengan user first name
- 3 cards untuk quick navigation:
  - 🎯 Make Prediction
  - 📊 View History
  - ⚙️ Profile Settings
- About EduPerform section dengan fitur-fitur

**2. Prediction Page** (PredictPage.jsx + PredictPage.css)
- Form kompleks dengan 30 input fields (sesuai ML model)
- Organized sections:
  - 📊 Demographic Information (age, gradeLevel)
  - 📚 Study Habits (study hours, sleep, social media, tutoring)
  - 📈 Academic Performance (exam score, assignments, attendance, participation)
  - 🤖 AI Usage Patterns (dependency, tools, purpose, ethics)
- Checkbox group untuk multiple AI tools
- Radio group untuk single AI purpose
- Form validation dengan min/max ranges
- Loading state dan error handling
- Success redirect ke history page

**3. History Page** (HistoryPage.jsx + HistoryPage.css)
- Table untuk display prediction history
- Columns: #, Date & Time, Performance (badge), Action
- Performance badges dengan color coding:
  - Red untuk Low
  - Yellow untuk Medium
  - Green untuk High
- Empty state jika belum ada predictions
- Detail Modal popup:
  - Performance result display
  - Academic information (exam, assignments, attendance, understanding)
  - Study patterns (study hours, sleep, social media, consistency)
  - AI usage details (dependencies, prompts, ethics)
  - Created timestamp

**4. Profile Page** (ProfilePage.jsx + ProfilePage.css)
- User information (read-only):
  - First Name, Last Name, Email
  - Member Since date
- Education Level selector (updatable)
- Change Password form:
  - Current password validation
  - New password confirmation
  - Min 6 characters validation
- Danger Zone:
  - Account deletion dengan confirmation
  - 90-day retention message
- Error/Success alerts

**5. Enhanced Components**
- Header.jsx sudah dengan navigation links dan logout button
- Auth pages (LoginPage, RegisterPage) dengan form validation

### Frontend Styling Details
- **Global CSS** (`main.css`): Variables, buttons, forms, alerts, tables, cards, loading spinner
- **Dashboard CSS**: Grid layout, card hover effects, info sections
- **Predict CSS**: Form sections dengan borders, responsive grid, checkbox/radio groups
- **History CSS**: Table styling, badges dengan color coding, modal popup, empty state
- **Profile CSS**: Info items display, form styling, danger zone highlighting
- **Auth CSS**: Gradient background, centered card layout

### API Integration
All pages connected ke backend API:
- **authService.js**: register, login, logout, token management
- **userService.js**: getProfile, updateProfile, deleteAccount
- **predictionService.js**: predict, getHistory, getHistoryDetail

### State Management
- **AuthContext**: manages user state, login/logout, token persistence
- **Local state**: forms, loading, error, success messages

### UX Features
- ✅ Loading spinners untuk async operations
- ✅ Error alerts dengan messages
- ✅ Success alerts dengan auto-dismiss
- ✅ Empty states untuk no data scenarios
- ✅ Modal popup untuk detail views
- ✅ Responsive design untuk mobile
- ✅ Color badges untuk performance levels
- ✅ Form validation dengan min/max ranges

### Remaining Tasks (Frontend)
1. ⏳ Test semua pages dengan mock data
2. ⏳ Connection testing ke backend API
3. ⏳ Error boundary implementation
4. ⏳ Loading states optimization
5. ⏳ Accessibility improvements
6. ⏳ Browser compatibility testing

---

## Session 3: Front-End UI/UX Premium Redesign (June 2, 2026)

### UI/UX Overhaul
Telah dilakukan *redesign* menyeluruh untuk aplikasi EduPerform menggunakan *design system* yang jauh lebih premium, modern, dan interaktif (Glassmorphism, gradients, micro-animations).

**Teknologi Baru yang Digunakan:**
- **Framer Motion**: Untuk animasi halaman transisi (*page enter/exit*), stagger animations pada dashboard cards, dan smooth interactions.
- **Lucide React**: Sebagai icon set utama untuk konsistensi desain ikon yang modern dan clean.
- **Google Fonts (Inter)**: Sebagai font utama untuk memberikan kesan *premium dan sleek*.

**Perubahan pada Level Global:**
- Global CSS (`main.css`) diupdate dengan *CSS variable system* baru (color palettes, radius, shadows, glassmorphism utilities).
- Semua routes di `App.jsx` dibungkus dengan `AnimatePresence` untuk memfasilitasi transisi halaman (*page transition*).

**Redesign Halaman demi Halaman:**
1. **Header**: Navigation bar sekarang menggunakan efek *glassmorphism* (blur), logo ikon dinamis, dan efek hover yang sangat halus.
2. **Auth Pages (Login/Register)**: Layout *split-screen* modern untuk desktop, form input ber-icon, *glass container*, floating gradient orbs di background.
3. **Dashboard Page**:
   - Layout *bento-box grid* modern dengan efek hover yang membesar sedikit (*scale-up*).
   - Animasi *staggering* sehingga komponen muncul berurutan.
4. **Profile Page**:
   - *Split-layout* memisahkan informasi read-only (Profile Overview) dari area berbahaya (Danger Zone).
   - *Glassmorphic design* untuk form reset password dan interaksi UI yang rapi.
5. **Predict Page**:
   - Mengganti input form konvensional dengan *range sliders* interaktif dan indikator angka langsung untuk UX yang lebih *playful*.
   - Mengelompokkan input ke dalam card yang jelas (*Demographic*, *Study Habits*, dsb).
6. **History Page**:
   - *Table UI* di-redesign menjadi lebih luas, *clean*, dan elegan.
   - Status badge (*Low, Medium, High*) menggunakan *linear-gradients* berwarna cerah sesuai konvensi modern.
   - Detail modal menggunakan *spring animations* dan layout grid untuk menampilkan detail prediksi.

Semua perombakan ini merubah aplikasi dari prototipe *basic* menjadi aplikasi *premium-grade* sesuai instruksi AGENTS.md.

### Security Features Implemented
- ✅ Password hashing dengan bcrypt (salt rounds: 10)
- ✅ JWT authentication dengan token expiry
- ✅ Input validation dengan express-validator
- ✅ CORS configuration
- ✅ Soft delete dengan 90-day email reuse blocking
- ✅ Protected routes dengan authMiddleware

### API Endpoints Implemented
**Auth**
- `POST /api/auth/register` - Daftar akun baru
- `POST /api/auth/login` - Login dan dapatkan JWT token
- `POST /api/auth/logout` - Logout (client-side token removal)

**User** (protected)
- `GET /api/user/profile` - Ambil profil user
- `PUT /api/user/update` - Update password dan/atau education level
- `DELETE /api/user/delete` - Soft delete akun

**Prediction** (protected)
- `POST /api/predict` - Kirim fitur dan dapatkan prediksi
- `GET /api/predict/history` - Riwayat prediksi user
- `GET /api/predict/history/:id` - Detail satu prediksi

### ML Service Features
- ✅ Load Logistic Regression model dan OneHotEncoder
- ✅ Input preprocessing (derived features, feature ordering)
- ✅ Prediction dengan confidence scores
- ✅ Recommendations generation
- ✅ Error handling

### Next Steps (To Be Done)
1. ✓ Create complete project structure
2. ✓ Install npm and pip dependencies (fixed versions)
3. ✓ Implement Frontend pages (Dashboard, Predict, History, Profile)
4. ⏳ Complete styling untuk semua halaman
5. ⏳ Testing API endpoints
6. ⏳ Error handling & user feedback
7. ⏳ Deployment setup

### Developer Notes
- Database connection menggunakan mysql2 with connection pooling
- Frontend menggunakan Context API untuk state management (no Redux)
- ML Service standalone Flask server berjalan di port 5001
- Express server berjalan di port 5000
- React dev server berjalan di port 5173
- All sensitive data stored in .env files, never hardcoded

---

## Session 2: Frontend Implementation (May 31, 2026 - Continued)

### Dependencies Fixed
**Backend (server/package.json)**
- ✅ `jsonwebtoken`: `^9.1.0` → `^9.0.2` (fixed ETARGET error)
- ✅ `mysql2`: `^3.6.0` → `^3.6.5` (minor update)

**ML Service (requirements.txt)**
- ✅ `Flask`: 2.3.3 → 3.0.0
- ✅ `pandas`: 2.0.3 → 2.2.0 (fixed build error)
- ✅ `numpy`: 1.24.3 → 1.26.4
- ✅ `scikit-learn`: 1.3.0 → 1.4.1
- ✅ All dependencies successfully installed

**Database Configuration**
- ✅ `DB_PASSWORD=` (empty) untuk localhost root user tanpa password

### Frontend Pages Implemented (5 Pages + Styling)

**1. Dashboard Page** (DashboardPage.jsx + DashboardPage.css)
- Welcome greeting dengan user first name
- 3 cards untuk quick navigation:
  - 🎯 Make Prediction
  - 📊 View History
  - ⚙️ Profile Settings
- About EduPerform section dengan fitur-fitur

**2. Prediction Page** (PredictPage.jsx + PredictPage.css)
- Form kompleks dengan 30 input fields (sesuai ML model)
- Organized sections:
  - 📊 Demographic Information (age, gradeLevel)
  - 📚 Study Habits (study hours, sleep, social media, tutoring)
  - 📈 Academic Performance (exam score, assignments, attendance, participation)
  - 🤖 AI Usage Patterns (dependency, tools, purpose, ethics)
- Checkbox group untuk multiple AI tools
- Radio group untuk single AI purpose
- Form validation dengan min/max ranges
- Loading state dan error handling
- Success redirect ke history page

**3. History Page** (HistoryPage.jsx + HistoryPage.css)
- Table untuk display prediction history
- Columns: #, Date & Time, Performance (badge), Action
- Performance badges dengan color coding:
  - Red untuk Low
  - Yellow untuk Medium
  - Green untuk High
- Empty state jika belum ada predictions
- Detail Modal popup:
  - Performance result display
  - Academic information (exam, assignments, attendance, understanding)
  - Study patterns (study hours, sleep, social media, consistency)
  - AI usage details (dependencies, prompts, ethics)
  - Created timestamp

**4. Profile Page** (ProfilePage.jsx + ProfilePage.css)
- User information (read-only):
  - First Name, Last Name, Email
  - Member Since date
- Education Level selector (updatable)
- Change Password form:
  - Current password validation
  - New password confirmation
  - Min 6 characters validation
- Danger Zone:
  - Account deletion dengan confirmation
  - 90-day retention message
- Error/Success alerts

**5. Enhanced Components**
- Header.jsx sudah dengan navigation links dan logout button
- Auth pages (LoginPage, RegisterPage) dengan form validation

### Frontend Styling Details
- **Global CSS** (`main.css`): Variables, buttons, forms, alerts, tables, cards, loading spinner
- **Dashboard CSS**: Grid layout, card hover effects, info sections
- **Predict CSS**: Form sections dengan borders, responsive grid, checkbox/radio groups
- **History CSS**: Table styling, badges dengan color coding, modal popup, empty state
- **Profile CSS**: Info items display, form styling, danger zone highlighting
- **Auth CSS**: Gradient background, centered card layout

### API Integration
All pages connected ke backend API:
- **authService.js**: register, login, logout, token management
- **userService.js**: getProfile, updateProfile, deleteAccount
- **predictionService.js**: predict, getHistory, getHistoryDetail

### State Management
- **AuthContext**: manages user state, login/logout, token persistence
- **Local state**: forms, loading, error, success messages

### UX Features
- ✅ Loading spinners untuk async operations
- ✅ Error alerts dengan messages
- ✅ Success alerts dengan auto-dismiss
- ✅ Empty states untuk no data scenarios
- ✅ Modal popup untuk detail views
- ✅ Responsive design untuk mobile
- ✅ Color badges untuk performance levels
- ✅ Form validation dengan min/max ranges

### Remaining Tasks (Frontend)
1. ⏳ Test semua pages dengan mock data
2. ⏳ Connection testing ke backend API
3. ⏳ Error boundary implementation
4. ⏳ Loading states optimization
5. ⏳ Accessibility improvements
6. ⏳ Browser compatibility testing

---

## Session 3: Front-End UI/UX Premium Redesign (June 2, 2026)

### UI/UX Overhaul
Telah dilakukan *redesign* menyeluruh untuk aplikasi EduPerform menggunakan *design system* yang jauh lebih premium, modern, dan interaktif (Glassmorphism, gradients, micro-animations).

**Teknologi Baru yang Digunakan:**
- **Framer Motion**: Untuk animasi halaman transisi (*page enter/exit*), stagger animations pada dashboard cards, dan smooth interactions.
- **Lucide React**: Sebagai icon set utama untuk konsistensi desain ikon yang modern dan clean.
- **Google Fonts (Inter)**: Sebagai font utama untuk memberikan kesan *premium dan sleek*.

**Perubahan pada Level Global:**
- Global CSS (`main.css`) diupdate dengan *CSS variable system* baru (color palettes, radius, shadows, glassmorphism utilities).
- Semua routes di `App.jsx` dibungkus dengan `AnimatePresence` untuk memfasilitasi transisi halaman (*page transition*).

**Redesign Halaman demi Halaman:**
1. **Header**: Navigation bar sekarang menggunakan efek *glassmorphism* (blur), logo ikon dinamis, dan efek hover yang sangat halus.
2. **Auth Pages (Login/Register)**: Layout *split-screen* modern untuk desktop, form input ber-icon, *glass container*, floating gradient orbs di background.
3. **Dashboard Page**:
   - Layout *bento-box grid* modern dengan efek hover yang membesar sedikit (*scale-up*).
   - Animasi *staggering* sehingga komponen muncul berurutan.
4. **Profile Page**:
   - *Split-layout* memisahkan informasi read-only (Profile Overview) dari area berbahaya (Danger Zone).
   - *Glassmorphic design* untuk form reset password dan interaksi UI yang rapi.
5. **Predict Page**:
   - Mengganti input form konvensional dengan *range sliders* interaktif dan indikator angka langsung untuk UX yang lebih *playful*.
   - Mengelompokkan input ke dalam card yang jelas (*Demographic*, *Study Habits*, dsb).
6. **History Page**:
   - *Table UI* di-redesign menjadi lebih luas, *clean*, dan elegan.
   - Status badge (*Low, Medium, High*) menggunakan *linear-gradients* berwarna cerah sesuai konvensi modern.
   - Detail modal menggunakan *spring animations* dan layout grid untuk menampilkan detail prediksi.

Semua perombakan ini merubah aplikasi dari prototipe *basic* menjadi aplikasi *premium-grade* sesuai instruksi AGENTS.md.

### Bug Fixes & Adjustments
1. **Registration Error**: Diperjelas bahwa error "Registration failed" terjadi ketika server Back-End (Express) tidak dinyalakan. Aplikasi React memerlukan server Express berjalan di *background* agar dapat memproses registrasi.
2. **Prediction Error ("ML Service temporarily unavailable")**:
   - Ditemukan bug berupa *SQL syntax error* pada `server/models/datasetModel.js`.
   - Penyebab: Jumlah kolom yang dimasukkan (32 kolom) tidak sesuai dengan jumlah placeholder tanda tanya (`?`) pada `VALUES` clause (berjumlah 33 tanda tanya).
   - Solusi: Menghapus 1 tanda tanya ekstra sehingga `VALUES` memiliki pas 32 tanda tanya. Error salah sasaran ini juga telah diatasi.
3. **Penghapusan Opsi "Mahasiswa"**:
   - Berdasarkan *feedback*, opsi jenjang pendidikan "Mahasiswa" dihapus karena opsi ini tidak sesuai dengan logika fitur form.
   - Perubahan dilakukan pada UI Front-End: `client/src/pages/RegisterPage.jsx` dan `client/src/pages/ProfilePage.jsx`.
   - Validasi Back-End juga diperbarui: `server/routes/authRoutes.js` dan `server/routes/userRoutes.js` tidak lagi mengizinkan input "Mahasiswa".

---

## Session 4: Security Inspection & Reporting (June 3, 2026)

### Security Inspection Conducted
Telah dilakukan inspeksi keamanan (*security audit*) secara menyeluruh terhadap seluruh arsitektur proyek EduPerform (Front-End React, Back-End Express, dan ML Microservice Python).

**Langkah yang dilakukan:**
- Memeriksa source code Express untuk mencari kerentanan seperti SQL Injection, token handling flaws, dan missing security headers.
- Memeriksa source code React untuk mengetahui cara penanganan token (disimpan di `localStorage`).
- Memeriksa source code Python ML Service untuk mengecek sistem autentikasi endpoint dan penanganan file `.joblib`.

### Hasil Inspeksi
Laporan hasil inspeksi telah ditulis secara detail ke dalam file `server/REPORT.md`.

**Beberapa temuan penting meliputi:**
1. **[Aman] SQL Injection Prevention**: Aplikasi sudah kebal terhadap SQL Injection karena selalu menggunakan query ter-parameterisasi (via `mysql2/promise`).
2. **[Aman] Password Hashing**: Hashing `bcrypt` dengan 10 salt rounds sudah sangat baik.
3. **[Kritis] Token Revocation Flaw**: `authMiddleware.js` tidak melakukan pengecekan `deleted_at`, sehingga user yang akunnya sudah "dihapus" secara soft-delete masih bisa menggunakan token JWT lama mereka yang belum expired (selama maksimal 7 hari).
4. **[Medium] Cross-Site Scripting (XSS) Risk**: Penyimpanan JWT di `localStorage` pada React client membuat aplikasi lebih rentan terhadap serangan XSS jika dibandingkan dengan `HttpOnly` cookies.
5. **[Medium] Missing Rate Limiting & Helmet**: Endpoint login/register belum dilindungi dengan *rate limiter* (rentan brute force/DoS) dan tidak adanya *security headers* dasar.
6. **[Low] Unauthenticated Internal ML API**: Endpoint `/predict` pada Flask dapat diakses tanpa autentikasi, yang bisa menjadi masalah jika port atau server tidak terisolasi dengan baik.

Perbaikan kerentanan-kerentanan di atas akan menjadi daftar tugas atau prioritas pada iterasi pengembangan selanjutnya.

---

## Session 5: Security Fixes & UI Enhancements (June 3, 2026)

### Security Fixes
1. **Token Revocation Fix**: Diimplementasikan pengecekan `deleted_at IS NULL` pada database setiap kali JWT divalidasi di `authMiddleware.js`. Ini memastikan akun yang telah di-soft-delete tidak bisa lagi menggunakan token yang masih aktif (sebelum expired).
2. **Rate Limiting & Security Headers**: Menambahkan `helmet` untuk security headers dasar dan `express-rate-limit` pada endpoint `/api/auth` untuk mencegah serangan brute force dan DoS.
3. **Internal ML Service Protection**: Mengubah alamat binding pada Flask server di `ml_service/app.py` dari `0.0.0.0` menjadi `127.0.0.1` (localhost) untuk mengamankan endpoint dari akses eksternal yang tidak sah.
4. **Error Masking**: Menyesuaikan Express error handler untuk tidak menampilkan detail `err.message` pada lingkungan produksi (`NODE_ENV === 'production'`) untuk menghindari *information leakage*.
5. **Git Ignore**: Menambahkan file `.gitignore` di folder `server/` untuk mencegah file sensitif (seperti `.env`) dan folder dependency (`node_modules`) masuk ke *version control*.

### UI Enhancements
- **Password Visibility Toggle**: Menambahkan tombol ber-ikon mata (`Eye` dan `EyeOff` dari *lucide-react*) pada form input password di halaman Login (`LoginPage.jsx`) dan Register (`RegisterPage.jsx`) untuk memberikan fitur *Show/Hide Password*. Hal ini meningkatkan *User Experience* (UX) agar pengguna dapat memverifikasi kata sandi yang mereka ketik.

---

## Session 6: Vercel Deployment Preparation (June 3, 2026)

### Frontend Separation for Demo
- Memisahkan bagian Front-End (aplikasi React di folder `client`) dan menduplikasinya ke folder baru bernama `codingcamp2` sesuai permintaan untuk keperluan deployment ke Vercel sebagai aplikasi demo (tanpa Back-End).
- Melakukan *mocking* pada logika autentikasi (Login & Register) di `codingcamp2/src/store/AuthContext.jsx`. Mengganti pemanggilan API ke Back-End dengan dummy user data dan dummy token, sehingga pengguna dapat langsung menekan tombol Login/Register dan masuk ke halaman Dashboard (`/dashboard`) tanpa perlu berinteraksi dengan server Back-End.
- Ini memungkinkan aplikasi front-end demo untuk tetap menampilkan antarmuka dan interaksi navigasinya (meskipun tanpa fitur prediktif nyata) pada platform hosting statis seperti Vercel.
