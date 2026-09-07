# 🍅 PomoSheets - Pomodoro & To-Do List Sync

Aplikasi Pomodoro & To-Do List modern berbasis **Vue 3 + Vite** dengan pendekatan **Offline-First (LocalStorage)** dan sinkronisasi otomatis ke **Google Sheets** via Google Apps Script Web App. 

Aplikasi ini 100% frontend (*backendless*) dan siap langsung di-deploy ke **Cloudflare Pages**.

---

## ✨ Fitur Utama

- 🎯 **Pomodoro Timer Visual**:
  - Tampilan SVG circular progress ring halus dengan glowing effect.
  - Mode: Fokus (25m), Istirahat Pendek (5m), Istirahat Panjang (15m) — durasi dapat diatur secara kustom.
  - Notifikasi audio menggunakan **Web Audio API** (tanpa dependensi audio eksternal yang rawan 404).
  - Title tab browser dinamis yang menampilkan waktu tersisa.
  - Efek konfeti visual saat menyelesaikan sesi fokus.
- 📋 **To-Do List Terintegrasi**:
  - Tambah tugas dengan **Estimasi Sesi Pomodoro** (🍅 1 - 10).
  - Hubungkan tugas langsung ke timer (*Focus on this task*).
  - Hitungan pomodoro otomatis bertambah saat sesi fokus tuntas.
  - Filter: Semua, Aktif, Selesai.
- 🔄 **Pola Dual Storage (LocalStorage + Google Sheets)**:
  - **LocalStorage**: Menyimpan instan (0ms latency), tetap berfungsi normal saat offline.
  - **Google Sheets**: Mencatat daftar tugas dan riwayat sesi secara otomatis melalui Google Apps Script.
  - Indikator status sinkronisasi visual (Synced / Syncing / Offline / Error).
- 🌓 **Tema Gelap & Terang (Dark/Light Mode)** dengan estetika glassmorphism modern.
- 💾 **Ekspor & Impor Data (JSON)** untuk pencadangan manual.

---

## 🚀 Menjalankan Secara Lokal

Pastikan Anda telah menginstal **Node.js** (v18+).

```bash
# 1. Masuk ke folder project
cd c:/laragon/www/pomodoro

# 2. Install dependensi (jika belum)
npm install

# 3. Jalankan server pengembangan lokal
npm run dev
```

Buka browser di `http://localhost:3000`.

---

## ☁️ Cara Deploy ke Cloudflare Pages

Karena aplikasi ini adalah Single Page Application (SPA) statis murni:

### Metode 1: Hubungkan ke Git (GitHub / GitLab)
1. Push repositori ini ke GitHub / GitLab Anda.
2. Buka dashboard [Cloudflare Pages](https://dash.cloudflare.com/).
3. Klik **Create a project** -> **Connect to Git**.
4. Pilih repositori Anda, lalu isi konfigurasi build:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Klik **Save and Deploy**. Selesai! Aplikasi Anda langsung online di URL `*.pages.dev`.

### Metode 2: Direct Upload (Tanpa Git)
1. Jalankan `npm run build` di terminal lokal.
2. Buka dashboard Cloudflare Pages, pilih **Upload assets**.
3. Tarik dan lepas (*drag and drop*) seluruh folder `dist` ke Cloudflare Pages.

---

## 📊 Cara Menghubungkan ke Google Sheets (Google Apps Script)

Tidak perlu setup Google Cloud Console atau OAuth yang rumit:

1. Buka [sheets.new](https://sheets.new) di Google Chrome.
2. Di spreadsheet baru tersebut, buka menu:
   **Ekstensi (Extensions)** &rarr; **Apps Script**.
3. Hapus seluruh isi kode di editor `Code.gs`.
4. Buka file [`google-apps-script/Code.gs`](file:///c:/laragon/www/pomodoro/google-apps-script/Code.gs) di project ini, lalu salin dan tempel ke editor Apps Script.
5. Klik tombol **Terapkan (Deploy)** di pojok kanan atas &rarr; **Penerapan baru (New deployment)**.
6. Konfigurasi:
   - Jenis: **Aplikasi Web (Web app)**
   - Keterangan: `PomoSheets Webhook`
   - Jalankan sebagai (Execute as): **Saya (email Anda)**
   - **Yang memiliki akses (Who has access)**: **Siapa saja (Anyone)** *(Wajib agar dapat diakses dari browser)*
7. Klik **Terapkan (Deploy)**, berikan izin akun Google jika diminta.
8. Salin **URL Aplikasi Web** yang berakhiran `/exec`.
9. Buka aplikasi PomoSheets di browser Anda, klik ikon ⚙️ **Pengaturan (Settings)**, tempel URL tersebut, lalu klik **Uji Koneksi**.
10. Klik **Simpan Perubahan**. Sheet `Tasks` dan `Sessions` akan otomatis dibuatkan dan terisi rapi di Google Sheets Anda!
