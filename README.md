# Discord Music Bot 🎵

A super stable and responsive Discord Music Bot built with Node.js, TypeScript, and `@discordjs/voice`. This bot uses a `yt-dlp` -> `ffmpeg` -> `Discord Voice` pipeline which is extremely smooth and supports a complete queue system along with a smart **Autoplay** feature similar to YouTube Music!

## 🌟 Key Features
- Clear and lag-free audio quality
- **Queue System:** Play dozens of songs consecutively.
- **Smart Autoplay:** When the queue ends, the bot will search for related songs from *YouTube Mix* and play them automatically. (Songs are prepared seamlessly in the background so there are no interruptions!).
- **Complete Commands:** `/play`, `/stop`, `/skip`, `/pause`, `/resume`, `/queue`, `/nowplaying`, `/volume`, `/shuffle`, `/autoplay`, etc.

---

## 🔑 How to Get Bot Token & Client ID
Before running the bot, you need to register it on the Discord Developer Portal:
1. Open the [Discord Developer Portal](https://discord.com/developers/applications) and log in.
2. Click the **New Application** button in the top right corner, name your bot, and click **Create**.
3. **Getting the Client ID:**
   - In the **General Information** menu, find/copy the **Application ID**. This is your `CLIENT_ID`.
   - *(Note: `GUILD_ID` is your Discord Server ID. You can get it by enabling Developer Mode in Discord app settings, then right-click your server name > Copy Server ID. **You can also leave `GUILD_ID` empty in the `.env` file** if you want your bot to be global and available across multiple servers).*
4. **Getting the Token:**
   - Go to the **Bot** menu (left panel).
   - Click **Reset Token** to reveal the token. **Copy and keep this token secret**. This is your `DISCORD_TOKEN`.
5. **Enabling Privileged Intents (Important!):**
   - Still on the **Bot** page, scroll down to the **Privileged Gateway Intents** section.
   - You MUST enable **Message Content Intent** (and other options if necessary).
   - Click **Save Changes**.
6. **Inviting the Bot to Your Server:**
   - Go to the **OAuth2 > URL Generator** menu.
   - Under Scopes, check **bot** and **applications.commands**.
   - Under Bot Permissions, check **Send Messages**, **Connect**, and **Speak**.
   - Copy the generated URL at the bottom, open it in a new browser tab, and invite the bot to your server!

---

## 💻 How to Run on PC (Windows / Linux / MacOS)

1. **Install Node.js** (Minimum version 18+)
2. **Clone this Repository:**
   ```bash
   git clone <YOUR_GITHUB_URL>
   cd discord-music-simple-bot
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```
4. **Setup Environment Variables:**
   - Copy the `.env.example` file and rename it to `.env`
   - Fill in `DISCORD_TOKEN`, `CLIENT_ID`, and `GUILD_ID` inside the `.env` file.
5. **Run the Bot:**
   ```bash
   npm run dev
   ```

---

## 📱 How to Run 24/7 on Android Phone (Termux)

You can host this bot right from your pocket using an Android phone!

1. **Download & Install Termux** (MUST be from [F-Droid](https://f-droid.org/packages/com.termux/), do not use the Play Store version).
2. **Open Termux and setup the environment:**
   ```bash
   pkg update && pkg upgrade -y
   pkg install nodejs python ffmpeg git -y
   ```
3. **Clone this Repository:**
   ```bash
   git clone <YOUR_GITHUB_URL>
   cd discord-music-simple-bot
   ```
4. **Install Dependencies:**
   Run the command below. (If you see a red error message regarding `ffmpeg-static` during installation, just ignore it as it is normal in Termux and the installation will proceed).
   ```bash
   npm install
   ```
5. **Setup .env File:**
   ```bash
   cp .env.example .env
   nano .env
   ```
   *(Fill in your bot token, then press `Ctrl + X`, then `Y`, then `Enter` to save).*
6. **Run the Bot:**
   ```bash
   npm run dev
   ```

**⚠️ Tips for Android Phones:**
Mobile operating systems (Xiaomi, Oppo, Vivo, Samsung, etc.) usually kill background apps to save battery. To keep the bot running 24/7 in Termux even when the screen is off:
- Disable **Battery Optimization** for the Termux app.
- **Lock** the Termux app in *Recent Apps*.

### 🔧 Termux Troubleshooting
- **Module Installation Error / Exec format error:**
  Make sure you run standard `npm install`. Even if an error appears for the `ffmpeg-static` module, other packages will continue installing (since it is marked as *optional*). The bot will **automatically adapt** and use the `ffmpeg` installed from Termux when run on Android.
- **Cannot find yt-dlp:**
  Make sure `youtube-dl-exec` installed successfully. The bot no longer hardcodes the `yt-dlp.exe` Windows file; it automatically uses the native Linux/Termux binary provided by the package.
