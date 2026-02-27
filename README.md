# LinuxHunter

The System has awakened.
`LinuxHunter` is a Solo Leveling-inspired platform to train Linux terminal skills in a real browser terminal, with RPG progression from `E` rank to `SSS`.

## Features

- Real-time terminal practice with `xterm.js`
- Docker-backed challenge sandbox service (separate Express app)
- Chapter progression map (14 chapters)
- XP, levels, rank badges, streaks, titles, quests
- Hint penalty system (`-10% XP` per hint)
- Local progression fallback when cloud DB is unreachable
- Level-up cinematic overlay: `LEVEL UP — The System acknowledges your growth.`

## Stack

- Next.js 14 + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth)
- Sandbox service: Node.js + Express + Docker + WebSocket PTY
- Deploy: Vercel (web) + Railway (sandbox)

## Project Structure

```text
linuxhunter/
  app/
  components/
  lib/
  sandbox-service/
  supabase/
```

## Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SANDBOX_URL=http://localhost:8080
SANDBOX_SERVICE_URL=http://localhost:8080
```

For `sandbox-service`:

```bash
PORT=8080
PUBLIC_WS_BASE_URL=http://localhost:8080
```

## Supabase Setup (Cloud)

1. Create a Supabase project.
2. In SQL Editor, run:
   - `supabase/migrations/001_schema.sql`
   - `supabase/seed.sql`
3. Enable Auth providers:
   - Email
   - GitHub OAuth
4. Add redirect URLs for local and production.

Beginner shortcut: run the combined SQL script in:
`supabase/supabase_sql_to_run.txt`

## Run Web App Locally

```bash
cd /home/igris/linuxhunter
npm install
npm run dev
```

Open `http://localhost:3000` (or the port Next selects).

## Run Sandbox Service Locally

1. Build sandbox image:

```bash
cd /home/igris/linuxhunter/sandbox-service
docker build -f Dockerfile.sandbox -t linuxhunter-sandbox:latest .
```

2. Start sandbox service:

```bash
npm install
npm run dev
```

## Deploy

### Sandbox -> Railway

1. Create Railway project.
2. Deploy `sandbox-service` directory.
3. Set env vars: `PORT`, `PUBLIC_WS_BASE_URL`.
4. Ensure Docker runtime can access `linuxhunter-sandbox:latest` image build process.

### Web App -> Vercel

1. Import repository.
2. Set env vars from `.env.local`.
3. Deploy.

## Local Fallback Mode

If Supabase is unreachable due to ISP/DNS blocking:

- Dashboard progression still works via `localStorage`.
- Challenge page has fallback challenge pack (`echo-hello`, `chmod-01`).
- XP, rank, level-up events continue locally.

This keeps the dungeon playable until cloud connectivity is restored.

## Current Status

- Initial MVP scaffold completed.
- Chapter/challenge structure seeded (14 chapters, 56 challenges).
- Solo Leveling visual direction active across core pages.
- Local progression loop implemented for offline continuity.
