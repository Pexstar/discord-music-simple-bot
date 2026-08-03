# Discord Music Bot 🎵

Bot Discord Music super stabil dan responsif, dibangun dengan Node.js, TypeScript, dan `@discordjs/voice`. Bot ini menggunakan pipeline `yt-dlp` -> `ffmpeg` -> `Discord Voice` yang sangat mulus dan mendukung sistem antrian (queue) lengkap beserta fitur **Autoplay cerdas** bergaya YouTube Music!

## 🌟 Fitur Utama
- Kualitas audio jernih dan anti-lag
- **Sistem Antrian (Queue):** Putar puluhan lagu berurutan.
- **Autoplay Cerdas:** Saat antrian habis, bot akan mencari lagu serupa dari *YouTube Mix* dan memutarnya otomatis. (Lagu disiapkan secara transparan di belakang layar agar pemutaran *seamless* tanpa jeda!).
- **Commands Lengkap:** `/play`, `/stop`, `/skip`, `/pause`, `/resume`, `/queue`, `/nowplaying`, `/volume`, `/shuffle`, `/autoplay`, dll.

---

## 🔑 Cara Mendapatkan Token & Client ID Bot
Sebelum menjalankan bot, Anda perlu mendaftarkannya di Discord Developer Portal:
1. Buka [Discord Developer Portal](https://discord.com/developers/applications) dan login.
2. Klik tombol **New Application** di pojok kanan atas, beri nama bot Anda, lalu klik **Create**.
3. **Mendapatkan Client ID:**
   - Di menu **General Information**, temukan/copy **Application ID**. Ini adalah `CLIENT_ID` Anda.
   - *(Note: `GUILD_ID` adalah ID Server Discord Anda. Anda bisa mendapatkannya dengan mengaktifkan Developer Mode di seting aplikasi Discord, lalu klik kanan nama server > Copy Server ID. **Anda juga bisa mengosongkan `GUILD_ID` di file `.env`** jika ingin bot Anda bersifat global dan bisa digunakan di banyak server sekaligus).*
4. **Mendapatkan Token:**
   - Masuk ke menu **Bot** (panel kiri).
   - Klik **Reset Token** untuk memunculkan token. **Copy dan simpan rahasia token ini**. Ini adalah `DISCORD_TOKEN` Anda.
5. **Mengaktifkan Privileged Intents (Penting!):**
   - Masih di halaman **Bot**, scroll ke bawah ke bagian **Privileged Gateway Intents**.
   - Wajib nyalakan **Message Content Intent** (dan opsi lainnya jika diperlukan).
   - Klik **Save Changes**.
6. **Mengundang Bot ke Server Anda:**
   - Masuk ke menu **OAuth2 > URL Generator**.
   - Di bagian Scopes, centang **bot** dan **applications.commands**.
   - Di bagian Bot Permissions, centang **Send Messages**, **Connect**, dan **Speak**.
   - Copy URL yang dihasilkan di bagian bawah, buka URL tersebut di tab browser baru, lalu undang bot ke server Anda!

---

## 💻 Cara Menjalankan di PC (Windows / Linux / MacOS)

1. **Install Node.js** (Minimal versi 18+)
2. **Clone Repository ini:**
   ```bash
   git clone <URL_GITHUB_ANDA>
   cd discord-music
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```
4. **Siapkan Environment Variables:**
   - Copy file `.env.example` dan ubah namanya menjadi `.env`
   - Isi `DISCORD_TOKEN`, `CLIENT_ID`, dan `GUILD_ID` di dalam file `.env` tersebut.
5. **Jalankan Bot:**
   ```bash
   npm run dev
   ```

---

## 📱 Cara Menjalankan 24/7 di HP Android (Termux)

Anda bisa meng-host bot ini langsung dari saku Anda menggunakan HP Android!

1. **Download & Install Termux** (WAJIB dari [F-Droid](https://f-droid.org/packages/com.termux/), jangan dari Play Store).
2. **Buka Termux dan siapkan environment:**
   ```bash
   pkg update && pkg upgrade -y
   pkg install nodejs python ffmpeg git -y
   ```
3. **Clone Repository ini:**
   ```bash
   git clone <URL_GITHUB_ANDA>
   cd discord-music-simple-bot
   ```
4. **Install Dependencies:**
   Jalankan perintah di bawah ini. (Jika muncul pesan error merah tentang `ffmpeg-static` saat proses install, abaikan saja karena itu wajar di Termux dan instalasi akan tetap dilanjutkan).
   ```bash
   npm install
   ```
5. **Siapkan File .env:**
   ```bash
   cp .env.example .env
   nano .env
   ```
   *(Isi token bot Anda, lalu tekan `Ctrl + X`, lalu `Y`, lalu `Enter` untuk menyimpan).*
6. **Jalankan Bot:**
   ```bash
   npm run dev
   ```

**⚠️ Tips untuk HP Android:**
Sistem operasi HP (Xiaomi, Oppo, Vivo, Samsung, dll) biasanya membunuh aplikasi di latar belakang untuk menghemat baterai. Agar bot tetap hidup 24/7 di Termux walau layar dimatikan:
- Matikan fitur **Battery Optimization** untuk aplikasi Termux.
- Kunci (*Lock*) aplikasi Termux di *Recent Apps*.

### 🔧 Troubleshooting Termux
- **Error Instalasi Modul / Exec format error:**
  Pastikan Anda menjalankan `npm install` biasa. Meskipun muncul pesan gagal di modul `ffmpeg-static`, instalasi paket lain akan tetap berlanjut (karena kita sudah menjadikannya *optional*). Bot akan **langsung beradaptasi** menggunakan `ffmpeg` dari Termux Anda jika dijalankan di Android.
- **Tidak dapat menemukan yt-dlp:**
  Pastikan instalasi `youtube-dl-exec` berhasil. Bot tidak lagi melakukan *hardcode* pada file `yt-dlp.exe` milik Windows, melainkan otomatis menggunakan binary Linux/Termux bawaan package.
