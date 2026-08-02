# Discord Music Bot 🎵

Bot Discord Music super stabil dan responsif, dibangun dengan Node.js, TypeScript, dan `@discordjs/voice`. Bot ini menggunakan pipeline `yt-dlp` -> `ffmpeg` -> `Discord Voice` yang sangat mulus dan mendukung sistem antrian (queue) lengkap beserta fitur **Autoplay cerdas** bergaya YouTube Music!

## 🌟 Fitur Utama
- Kualitas audio jernih dan anti-lag
- **Sistem Antrian (Queue):** Putar puluhan lagu berurutan.
- **Autoplay Cerdas:** Saat antrian habis, bot akan mencari lagu serupa dari *YouTube Mix* dan memutarnya otomatis. (Lagu disiapkan secara transparan di belakang layar agar pemutaran *seamless* tanpa jeda!).
- **Commands Lengkap:** `/play`, `/stop`, `/skip`, `/pause`, `/resume`, `/queue`, `/nowplaying`, `/volume`, `/shuffle`, `/autoplay`, dll.

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
   cd discord-music
   ```
4. **Install Dependencies:**
   ```bash
   npm install
   ```
   *(Catatan: Termux secara pintar akan mencocokkan arsitektur HP Anda seperti ARM64 / x86 untuk `yt-dlp` dan `ffmpeg` otomatis).*
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
