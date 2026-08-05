# 🎛️ EDM Remix Studio - Billboard Grade AI Remixer

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Web Audio API](https://img.shields.io/badge/Web%20Audio%20API-red) ![Gemini](https://img.shields.io/badge/Gemini-3_Flash-purple) ![Bun](https://img.shields.io/badge/Bun-1.3.14-yellow)

> Billboard-Grade AI Remixer — Upload any song and transform it into Techno, House, Dubstep, Trance, DnB + 6 Artist DNA Engines (Zedd, Slushii, Alan Walker, Skrillex, Excision, Zomboy). Vocal Magic Studio, Slowed+Reverb / Nightcore Lab, 24-bit WAV/MP3 at -6 LUFS.

**🚀 Live Demo:** https://ai.studio/apps/7e6621fd-c261-4a28-9ce6-90a3f0a38d06

### 🔥 What it does

- **14 Engine Presets:** 8 Billboard EDM Genres (Techno 126, House 126, Dubstep 140, Chillstep 85, Trance 138, DnB 174, Future Bass 150, Lo-fi House 122) + 6 Artist DNA Engines
- **Vocal Magic Studio:** Pro Mode that deletes clashing vocals and rebuilds them as chopped Billboard hooks, auto-tune, speed/pitch/reverb fitting
- **Time & Space Lab:** 0.5x-2.0x speed, -12 to +12st pitch, slowed+reverb & nightcore presets - each genre auto-applies its signature
- **Billboard Structure:** Auto extends tracks to 3:15-3:45 with Intro/Build/Drop/Breakdown/Build2/Drop2/Outro
- **Export Quality Selector (NEW):** Toggle between 24-Bit Lossless WAV (uncompressed) and 320kbps MP3 in ExportModal.tsx
- **Player Card Metadata Editor (NEW):** Edit song title, artist name, and tempo BPM inside main player card before export
- **Export:** 24-bit WAV + 320kbps MP3 at -6 LUFS radio-ready loudness

### 🛠️ Built with

React + TypeScript + Web Audio API + Gemini 3 Flash + Bun

## 💿 Installation & Run

```bash
git clone https://github.com/MidnightMarie9/EDM-Remix-Studio.git
cd EDM-Remix-Studio
bun install
bun run dev
```

Then open `http://localhost:5173`

### 🔑 Env Setup

Create `.env` from `.env.example`:

```
VITE_GEMINI_API_KEY=your_key_here
```

Requires Bun 1.3.14+. See `bun.lock` and `package.json`.

### 🚀 How Billboard Mode Works

Each Artist Engine has its own vocalConfig:

- **Slushii:** 1.15x speed +3st bubbly
- **Alan Walker:** 0.9x speed cathedral reverb
- **Excision:** 0.8x -4st brutal slowed
- **Zedd:** Clean future bass chops
- **Skrillex:** Aggressive vocal stutters
- **Zomboy:** Riddim growl pitching

All engines auto-tune vocals, match BPM/Key, and rebuild drops.

## 📸 Screenshots

### Main Studio
![Main Studio](screenshots/main.jpg)

### Waveform Visualizer
![Waveform](screenshots/waveform.jpg)

### Export
![Export](screenshots/export.jpg)

---

Made with ❤️ by MidnightMarie9 - Billboard Ready
