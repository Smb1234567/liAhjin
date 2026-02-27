# LinuxHunter Build Log (Run 1)

This document summarizes everything completed from the first scaffold to the current local-first feature set.

## 1) Goal

Build **LinuxHunter**, a LeetCode-style Linux command training platform with:

1. Next.js 14 + TypeScript frontend/backend
2. Supabase DB/Auth
3. xterm.js browser terminal
4. Separate sandbox microservice (Express + Docker + WebSocket PTY)
5. Solo Leveling-inspired RPG progression (XP, ranks, titles, quests, chapter unlock flow)

## 2) Project Scaffold

Created project at `/home/igris/linuxhunter` with:

1. `app/` routes
2. `components/` UI modules
3. `lib/` game and integration logic
4. `sandbox-service/` microservice
5. `supabase/` migrations and seed data

Core setup files:

1. `package.json`
2. `tailwind.config.ts`
3. `app/layout.tsx`
4. `app/globals.css`
5. `README.md`

## 3) Supabase Schema + Seed

Implemented SQL schema and RLS policies for:

1. `users`
2. `chapters`
3. `challenges`
4. `user_challenge_attempts`
5. `quests`
6. `user_quests`

Files:

1. `supabase/migrations/001_schema.sql`
2. `supabase/seed.sql`
3. `supabase/supabase_sql_to_run.txt` (single copy/paste script for SQL editor)

Seed coverage:

1. 14 chapters
2. 56 challenges (4 per chapter)

## 4) Frontend Pages Built

Implemented:

1. `app/page.tsx` (landing)
2. `app/dashboard/page.tsx`
3. `app/learn/page.tsx`
4. `app/learn/[chapter]/page.tsx`
5. `app/challenges/[slug]/page.tsx`
6. `app/profile/[username]/page.tsx`
7. `app/leaderboard/page.tsx`

## 5) Components + Core Logic

UI components created:

1. `Terminal.tsx`
2. `ChapterMap.tsx`
3. `XPBar.tsx`
4. `RankBadge.tsx`
5. `QuestPanel.tsx`
6. `HunterCard.tsx`
7. `LevelUpOverlay.tsx`
8. `HintAccordion.tsx`
9. `AuthPanel.tsx`
10. `RankExamPanel.tsx`

Logic modules created:

1. `lib/xp.ts`
2. `lib/titles.ts`
3. `lib/quests.ts`
4. `lib/rankExams.ts`
5. `lib/slug.ts`
6. `lib/supabase.ts`
7. `lib/supabaseServer.ts`

## 6) Sandbox Service

Implemented separate sandbox service:

1. `sandbox-service/index.ts`
2. `sandbox-service/docker.ts`
3. `sandbox-service/pty.ts`
4. `sandbox-service/Dockerfile.sandbox`

Next.js API proxy routes:

1. `app/api/sandbox/create/route.ts`
2. `app/api/sandbox/validate/route.ts`
3. `app/api/sandbox/session/[id]/route.ts`

## 7) Supabase Connectivity Debugging Outcome

Observed behavior:

1. `/learn` loading issues
2. challenge not found states
3. `fetch failed` diagnostics

Validation done:

1. SQL rows existed (`chapters=14`, `challenges=56`)
2. env keys were present
3. direct network checks to Supabase domain timed out

Conclusion:

1. issue was network/DNS reachability to Supabase domain in the current environment
2. not a schema/seed or app-query logic failure

## 8) Git + GitHub Setup

Completed:

1. git init + branch `main`
2. `.gitignore` setup
3. git user/email config
4. remote set to `https://github.com/Smb1234567/liAhjin.git`

Security note handled:

1. exposed PAT token was flagged and revocation was advised

## 9) Local-First Features Added (to continue building without Supabase)

### 9.1 Local progression engine

File: `lib/localProgress.ts`

Tracks in `localStorage`:

1. level/rank
2. total XP + current/next XP
3. streak
4. completed challenges
5. attempts
6. hints used
7. last level-up timestamp

Applies:

1. hint penalty (`-10%` each)
2. speed bonus (`+10%` if under par)
3. rank recalculation and level-up loops

### 9.2 Challenge arena UX upgrade

Files:

1. `components/ChallengeArena.tsx`
2. `components/ChallengeSession.tsx`
3. `app/challenges/[slug]/page.tsx`

Added:

1. countdown timer
2. attempts counter
3. live PASS/FAIL feedback
4. XP award display
5. level-up count on success
6. hint count integration into XP calculation

### 9.3 Local challenge fallback pack

File: `lib/localChallengeData.ts`

Fallback challenges:

1. `echo-hello`
2. `chmod-01`

Used when Supabase query fails.

### 9.4 Dashboard progression card + level-up trigger

Files:

1. `components/DashboardProgressCard.tsx`
2. `app/dashboard/page.tsx`

Replaced static XP block with local progression-driven card and level-up overlay trigger.

### 9.5 Profile + leaderboard local mode

Profile:

1. `app/profile/[username]/page.tsx`
2. `components/ProfileLocalView.tsx`

Leaderboard:

1. `app/leaderboard/page.tsx`
2. `components/LeaderboardLocalView.tsx`

These pages now work without Supabase cloud availability.

## 10) README Rewrite

`README.md` was rewritten with:

1. Solo Leveling style positioning
2. setup instructions
3. env config
4. deployment notes
5. local fallback mode explanation

## 11) Commit History

1. `9969c97` Initial commit
2. `bd68b92` Add local progression, challenge arena UX, and Solo Leveling README
3. `ef6647b` Add local-mode profile and leaderboard views

## 12) Current Status

Working without Supabase cloud reachability:

1. local progression loop
2. challenge UX (timer/hints/attempts/XP)
3. level-up overlay trigger
4. local profile
5. local leaderboard
6. fallback challenge loading

Still cloud-dependent:

1. real multi-device persistence in Supabase
2. real Supabase-backed leaderboard
3. full remote auth-backed state sync

## 13) Next Recommended Steps

1. push latest commits when GitHub DNS/network is stable
2. add sync queue (`local -> Supabase`) for delayed writes
3. show `Cloud` vs `Local Fallback` data source badge in UI
4. add export/import for local progression backup
