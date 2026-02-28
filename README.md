# 🗡️ LinuxHunter

> **"The System has awakened."**

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/Database-Neon-4F46E5?logo=postgresql)
![Auth](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)

**Solo Leveling-inspired terminal training platform**  
*From E-Rank Novice → SSS-Rank Terminal Master*

[Features](#-features) • [Quick Start](#-quick-start) • [Demo](#-demo) • [Stack](#-tech-stack)

</div>

---

## 🎮 What Is This?

**LinuxHunter** transforms boring terminal practice into an epic RPG adventure. Inspired by the Solo Leveling universe, you'll grind through challenges, earn XP, level up, and climb the ranks from a weak **E-Rank Hunter** to the legendary **SSS-Rank Shadow Monarch** of the Linux terminal.

```bash
$ whoami
> shadow_monarch_in_training
$ echo "The System acknowledges your growth."
> LEVEL UP — You are now Level 5!
```

No more dry tutorials. No more copy-pasting commands you don't understand. Just pure, addictive progression with that *"one more challenge"* energy.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖥️ **Real Terminal** | Practice in a genuine browser terminal powered by `xterm.js` |
| 🏆 **RPG Progression** | Earn XP, level up, unlock titles, and track your streak |
| 📚 **14 Chapters** | 56 challenges spanning from basic `echo` to advanced scripting |
| 🎬 **Level-Up Cinematics** | Satisfying overlays when you grow stronger |
| 💡 **Hint System** | Stuck? Get hints (but -10% XP penalty — the System is strict) |
| 🌐 **Cloud + Local** | Progress saves to Neon DB, with localStorage fallback for offline grinding |
| 🐳 **Sandbox Service** | Docker-backed challenge isolation (Express + WebSocket PTY) |

---

## 🚀 Quick Start

### Prerequisites

```bash
node --version    # v18+
npm --version     # v9+
docker --version  # For sandbox service
```

### 1️⃣ Clone & Install

```bash
git clone https://github.com/Smb1234567/linuxhunter.git
cd linuxhunter
npm install
```

### 2️⃣ Environment Setup

Create `.env.local` in the project root:

```bash
# Database (Neon Serverless Postgres)
NEON_DATABASE_URL=postgres://user:pass@host/db
DATABASE_URL=postgres://user:pass@host/db

# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Sandbox Service
NEXT_PUBLIC_SANDBOX_URL=http://localhost:8080
SANDBOX_SERVICE_URL=http://localhost:8080
```

### 3️⃣ Database Setup

```bash
# Run the schema migration
psql $NEON_DATABASE_URL -f neon_schema.sql
```

### 4️⃣ Launch the Dungeon

```bash
npm run dev
```

Open **http://localhost:3000** and begin your journey.

---

## 🐳 Sandbox Service (Optional)

For full challenge isolation with Docker:

```bash
cd sandbox-service

# Build the sandbox image
docker build -f Dockerfile.sandbox -t linuxhunter-sandbox:latest .

# Start the service
npm install
npm run dev
```

Set environment variables in `sandbox-service/.env`:

```bash
PORT=8080
PUBLIC_WS_BASE_URL=http://localhost:8080
```

---

## 🛠️ Tech Stack

```
Frontend
├── Next.js 14 (App Router)
├── TypeScript
├── Tailwind CSS + Framer Motion
└── xterm.js (Terminal Emulation)

Backend
├── Neon (Serverless PostgreSQL)
├── Clerk (Authentication)
└── Express + WebSocket (Sandbox Service)

Infrastructure
├── Vercel (Web App Deployment)
└── Railway (Sandbox Service Deployment)
```

---

## 📁 Project Structure

```
linuxhunter/
├── app/                 # Next.js app directory
├── components/          # React components (UI, Terminal, Progression)
├── lib/                 # Utilities, DB clients, helpers
├── sandbox-service/     # Express + Docker challenge isolation
├── neon_schema.sql      # Database schema
└── setup-db.js          # Database initialization script
```

---

## 🎯 Rank System

| Rank | Title | Description |
|------|-------|-------------|
| 🟤 **E-Rank** | Novice | Just awakened. Knows `ls` and `cd`. |
| 🟢 **D-Rank** | Apprentice | Can `grep` without Googling. |
| 🔵 **C-Rank** | Acolyte | `sed` and `awk` no longer scary. |
| 🟣 **B-Rank** | Hunter | Writes bash scripts for fun. |
| 🟠 **A-Rank** | Elite | Automates everything. Sysadmins notice you. |
| ⚪ **S-Rank** | Master | The terminal obeys your will. |
| ⚫ **SSS-Rank** | Shadow Monarch | **You are the terminal.** |

---

## 🌍 Deployment

### Sandbox → Railway

1. Create a Railway project
2. Deploy `sandbox-service/` directory
3. Set env vars: `PORT`, `PUBLIC_WS_BASE_URL`
4. Ensure Docker build access

### Web App → Vercel

1. Import repository to Vercel
2. Set all `.env.local` variables
3. Deploy and conquer

---

## 🛡️ Offline Mode

ISP blocking your DB connection? The System adapts:

- ✅ Progression continues via `localStorage`
- ✅ Fallback challenge pack available (`echo-hello`, `chmod-01`)
- ✅ XP, ranks, and level-ups still track locally

The dungeon remains playable. No excuses.

---

## 📸 Screenshots

> *Coming soon — The System is still rendering.*

---

## 🤝 Contributing

Found a bug? Want to add a new chapter? The System welcomes contributions:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/epic-new-challenge`)
3. Commit your changes (`git commit -m 'Add epic new challenge'`)
4. Push to the branch (`git push origin feature/epic-new-challenge`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — even the System believes in freedom.

---

## 🙏 Acknowledgments

- **Solo Leveling** — For the epic inspiration
- **xterm.js** — For bringing the terminal to the browser
- **Neon** — For serverless Postgres magic
- **Clerk** — For painless authentication

---

## ⚠️ Disclaimer

> **Hunter Cha Hae-In will NOT be appearing in this dungeon.**
> 
> This platform is for learning Linux commands, not hunting high-rank monsters. Please do not summon shadows or expect the Shadow Monarch to show up. The only thing you'll be commanding is your terminal. 🖤

---

<div align="center">

### 🎮 Ready to begin your journey?

```bash
npm run dev
```

**The System awaits your command.**

---

Made with ⚡ by [Smb1234567](https://github.com/Smb1234567)

</div>
