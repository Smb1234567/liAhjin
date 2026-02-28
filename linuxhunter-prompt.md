# LinuxHunter — Full Codex Build Prompt

Paste everything below this line into Codex (or Cursor / Claude Code) as your prompt.

---

Build a "LeetCode for Linux terminal commands" web app called **LinuxHunter**. This is a gamified platform where users practice Linux commands in a real browser-based terminal, progressing through a structured learning path from beginner to advanced. The app has a Solo Leveling-inspired RPG progression system.

---

## Tech Stack

- **Frontend + Backend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email + GitHub OAuth)
- **Deployment:** Vercel (frontend/API) + Railway (sandbox service)
- **Terminal:** xterm.js in the browser
- **Sandbox service:** Separate Node.js + Express microservice that manages Docker containers, communicates via WebSocket

---

## Architecture

Two services:

1. **Next.js app** (on Vercel) — UI, auth, challenge data, XP/progression logic
2. **Sandbox service** (on Railway) — manages Docker containers, exposes WebSocket endpoint for terminal sessions

The Next.js app calls the sandbox service API to spin up/tear down containers and get a WebSocket URL. The browser then connects directly to that WebSocket for the terminal session.

---

## Supabase Schema

```sql
-- Users
users (
  id uuid primary key,
  email text,
  username text unique,
  rank text default 'E',
  xp int default 0,
  level int default 1,
  streak int default 0,
  last_active timestamptz,
  stats jsonb default '{"STR":0,"INT":0,"AGI":0,"END":0}',
  titles text[] default '{}',
  unlocked_chapter_ids int[] default '{1}'
)

-- Chapters
chapters (
  id serial primary key,
  order_index int unique,
  title text,
  description text,
  rank_required text,
  icon text
)

-- Challenges
challenges (
  id serial primary key,
  chapter_id int references chapters(id),
  order_index int,
  slug text unique,
  title text,
  description text,
  difficulty text,
  rank_required text,
  xp_reward int,
  time_limit_seconds int,
  tags text[],
  setup_script text,
  validator_script text,
  hints text[],
  prerequisite_challenge_ids int[]
)

-- Attempts
user_challenge_attempts (
  id serial primary key,
  user_id uuid references users(id),
  challenge_id int references challenges(id),
  status text,
  time_taken int,
  xp_earned int,
  attempts int default 0,
  completed_at timestamptz
)

-- Quests
quests (
  id serial primary key,
  type text, -- daily | weekly | hidden
  title text,
  description text,
  xp_reward int,
  condition jsonb,
  expires_at timestamptz
)

-- User Quests
user_quests (
  id serial primary key,
  user_id uuid references users(id),
  quest_id int references quests(id),
  progress int default 0,
  completed boolean default false
)
```

Enable Row Level Security on all tables.

---

## Challenge System

Each challenge has:

- `setup_script` — bash that runs inside Docker to create the initial dirty/starting state
- `validator_script` — bash that checks if user succeeded (echoes PASS or FAIL)
- `hints[]` — array of progressive hints, each hint costs 10% of XP reward
- `prerequisite_challenge_ids` — enforced at DB and UI level

**Critical rule: Validators check OUTCOME, not syntax.** It does not matter how the user typed the command — only the resulting system state matters.

Example validator:

```bash
perms=$(stat -c "%a" secret.txt)
[ "$perms" = "600" ] && echo PASS || echo FAIL
```

Example challenge YAML (for seeding):

```yaml
id: chmod-01
title: "Lock it down"
description: "Make secret.txt readable only by its owner. No one else should be able to read, write, or execute it."
difficulty: E
chapter: 5
order_index: 2
xp_reward: 50
time_limit_seconds: 120
tags: [permissions, chmod]
hints:
  - "Think about what permission number means owner-read-only"
  - "chmod uses numeric notation — 6 means read+write, 0 means no access"
  - "The answer is chmod 600 secret.txt"
setup: |
  echo "topsecret" > secret.txt
  chmod 777 secret.txt
validator: |
  perms=$(stat -c "%a" secret.txt)
  [ "$perms" = "600" ] && echo PASS || echo FAIL
```

---

## Structured Learning Path (Chapters — strict sequential order)

Challenges are locked by default. A user must complete all challenges in a chapter before the next chapter unlocks. Chapters are tied to ranks. Seed all chapters and challenges into the database.

### Chapter 1 — "Awakening" (E Rank) — Terminal Basics

1. What is the terminal — run your first command: `echo "hello world"`
2. Navigating the filesystem — `pwd`, `ls`, `cd`
3. Absolute vs relative paths
4. Listing files with options — `ls -la`, `ls -lh`
5. Getting help — `man`, `--help`, `whatis`
6. Clearing and navigating terminal history — `clear`, `history`, Ctrl+R

### Chapter 2 — "First Steps" (E Rank) — File & Directory Management

1. Creating files — `touch`, `echo >`
2. Creating directories — `mkdir`, `mkdir -p`
3. Copying files and folders — `cp`, `cp -r`
4. Moving and renaming — `mv`
5. Deleting safely — `rm`, `rm -r`, `rmdir`
6. Viewing file contents — `cat`, `less`, `more`, `head`, `tail`

### Chapter 3 — "Reading the World" (E→D Rank) — Text Processing Basics

1. Searching inside files — `grep` basics
2. grep flags — `-i`, `-r`, `-n`, `-v`, `-c`
3. Counting lines, words, characters — `wc`
4. Sorting output — `sort`, `sort -r`, `sort -n`
5. Removing duplicates — `uniq`, `sort | uniq`
6. Cutting columns — `cut -d -f`

### Chapter 4 — "Power of Pipes" (D Rank) — Pipes & Redirection

1. Piping output — `|`
2. Redirecting output — `>`, `>>`
3. Redirecting errors — `2>`, `2>&1`
4. `/dev/null` — silencing output
5. `tee` — writing to file and stdout simultaneously
6. `xargs` — building commands from input

### Chapter 5 — "Hidden Knowledge" (D Rank) — File Permissions & Ownership

1. Understanding permission strings — `rwxr-xr-x`
2. `chmod` numeric — `chmod 755`, `chmod 600`
3. `chmod` symbolic — `chmod u+x`, `chmod go-w`
4. `chown` — changing file owner
5. `chgrp` — changing group
6. Special permissions — setuid, setgid, sticky bit

### Chapter 6 — "Finding the Path" (D→C Rank) — Search & Find

1. `find` by name — `find . -name`
2. `find` by type — `find . -type f/d`
3. `find` by size — `find . -size`
4. `find` by modification time — `find . -mtime`
5. `find` + exec — `find . -name "*.log" -exec rm {} \;`
6. `locate` and `updatedb`

### Chapter 7 — "The Architect" (C Rank) — Advanced Text Processing

1. `sed` basics — substitution `s/old/new/g`
2. `sed` — delete lines, print specific lines
3. `awk` basics — `$1 $2 $NF`, print columns
4. `awk` — filtering rows with conditions
5. `awk` — computing sums and counts
6. Combining `sed` and `awk` in pipelines

### Chapter 8 — "Process Hunter" (C Rank) — Process Management

1. Listing processes — `ps`, `ps aux`
2. Real-time monitoring — `top`, `htop`
3. Finding by name — `pgrep`, `pidof`
4. Killing processes — `kill`, `killall`, `kill -9`
5. Background and foreground — `&`, `jobs`, `fg`, `bg`
6. Process priority — `nice`, `renice`

### Chapter 9 — "Network Scout" (C→B Rank) — Networking Basics

1. Checking connectivity — `ping`
2. Network interfaces — `ip addr`, `ifconfig`
3. Open ports — `ss`, `netstat`
4. Transferring files — `curl`, `wget`
5. DNS lookup — `dig`, `nslookup`, `host`
6. Tracing routes — `traceroute`, `mtr`

### Chapter 10 — "System Whisperer" (B Rank) — System Info & Monitoring

1. Disk usage — `df -h`, `du -sh`
2. Memory usage — `free -h`, `/proc/meminfo`
3. CPU info — `lscpu`, `/proc/cpuinfo`
4. System uptime and load — `uptime`, `w`
5. Logged in users — `who`, `last`
6. System logs — `journalctl`, `/var/log/syslog`

### Chapter 11 — "Shell Scribe" (B Rank) — Shell Scripting

1. Writing your first script — shebang, `chmod +x`
2. Variables and input — `read`, `$1 $2`
3. Conditionals — `if/else/elif`, `test`, `[ ]`
4. Loops — `for`, `while`, `until`
5. Functions in shell scripts
6. Error handling — exit codes, `$?`, `set -e`

### Chapter 12 — "The Dungeon Master" (B→A Rank) — Advanced Scripting & Automation

1. `cron` jobs — `crontab -e`, cron syntax
2. `at` — one-time scheduled tasks
3. `trap` — handling signals in scripts
4. Here documents — `heredoc <<EOF`
5. Regular expressions deep dive
6. Writing a full automation script combining all skills

### Chapter 13 — "Shadow Admin" (A Rank) — Users, Groups & Security

1. User management — `useradd`, `usermod`, `userdel`
2. Group management — `groupadd`, `groups`, `id`
3. `sudo` and `/etc/sudoers`
4. SSH key generation — `ssh-keygen`
5. File encryption — `gpg` basics
6. Auditing — `last`, `lastlog`, `faillog`

### Chapter 14 — "S-Rank Trial" (A→S Rank) — Real World Scenarios

Timed dungeon-style multi-part challenges:

1. Rescue the broken server — fix 5 misconfigured things on a corrupted system
2. Log forensics — find the intruder in system logs using grep/awk/sed
3. Automate the datacenter — write a script that monitors disk and auto-cleans logs
4. Permission lockdown — secure an entire directory tree correctly
5. Pipeline master — solve a data processing problem using only pipes and text tools

---

## Challenge Unlock Rules

- Challenges within a chapter unlock sequentially — complete challenge N to unlock N+1
- Chapters unlock when ALL challenges in the previous chapter are completed
- Rank-up exam unlocks when all chapters for that rank group are done
- Failing a rank-up exam applies a 24-hour cooldown before retry

---

## RPG Progression System (Solo Leveling Style)

### Ranks (in order)

E → D → C → B → A → S → SS → SSS

### Stats (stored as jsonb on user)

- **STR** (scripting) — earned by completing scripting challenges
- **INT** (knowledge) — earned by concept/theory challenges
- **AGI** (speed) — based on solve time vs par time for each challenge
- **END** (endurance) — streak based, increases with daily consistency

### XP & Levels

- Each challenge awards XP on completion
- Using hints reduces XP earned (each hint = -10% XP)
- Level bar animates on every XP gain
- Level up triggers a dramatic full-screen animation — dark overlay, gold animated text: **"LEVEL UP — The System acknowledges your growth."**
- XP bar always starts partially filled at the beginning of a new level (never shows 0%)

### Quests

- **Daily quests** (reset every 24h): e.g. "Complete 3 challenges", "Solve a challenge without using any hints"
- **Weekly quests**: e.g. "Complete an entire chapter", "Solve 5 permission challenges"
- **Hidden quests**: trigger on behavior patterns, e.g. "You used grep 10 times — Hidden Quest Unlocked: The Grep Trials"

### Titles

Earned by milestones, displayed on profile and leaderboard:

- "The Awakened One" — complete Chapter 1
- "Pipe Dream" — complete Chapter 4
- "The One Who Reads Manpages" — used `man` or `--help` 50 times
- "Grep God" — solved 50 text processing challenges
- "Silent Hunter" — completed 10 challenges with zero hints and zero wrong attempts
- "Speed Demon" — solved 20 challenges faster than par time
- "S-Rank Hunter" — reached S rank

---

## Pages

### `/` — Landing Page
Dramatic Solo Leveling aesthetic. Hero section with tagline, animated rank badge display, login and signup CTA.

### `/dashboard`
- XP bar with animated fill
- Current rank badge with glow effect
- Active daily and weekly quests with progress bars
- Streak flame counter
- "Continue Learning" card — picks up where user left off
- Today's featured challenge

### `/learn` — Chapter Map
Visual node-based roadmap showing all 14 chapters as connected nodes. Locked chapters are dark with a padlock icon. Completed chapters glow with rank color and show a checkmark. Current chapter is highlighted and pulsing. Clicking a node goes to the chapter detail page.

### `/learn/[chapter-slug]` — Chapter Detail
Lists all challenges in the chapter in order. Each shows: title, difficulty badge, completion status (locked / unlocked / completed), XP reward, estimated time. Locked challenges show a padlock. Click an unlocked challenge to start it.

### `/challenges/[slug]` — Challenge Page
Split layout:
- **Left panel:** Challenge title, description, difficulty, tags, hints accordion (each hint costs XP to reveal), attempt counter, par time
- **Right panel:** xterm.js terminal connected to Docker container, countdown timer, Submit button

On submit: runs validator, shows PASS (XP reward animation) or FAIL (increment attempt counter, show encouragement).

### `/profile/[username]` — Hunter ID Card
- Large rank badge with glow
- Stats radar chart (STR, INT, AGI, END)
- Titles earned, displayed as styled badges
- Chapter completion progress bar
- Recent solve history
- Current streak with flame icon

### `/leaderboard`
Table ranked by total XP. Columns: rank position, username, rank badge, top title, challenges completed, current streak. Filterable by rank tier.

---

## Sandbox Service (Separate Express App on Railway)

### Endpoints

```
POST   /session/create      — spin up container, run setup_script, return { session_id, websocket_url }
POST   /session/validate    — run validator_script inside container, return { result: "PASS" | "FAIL", output: string }
DELETE /session/:id         — destroy container
```

### Docker Config

- **Base image:** `ubuntu:22.04`
- **Pre-installed tools:** curl, wget, grep, awk, sed, find, vim, nano, net-tools, procps, cron, ssh, gpg, python3
- **Resource limits:** 256MB RAM, 0.5 CPU, no outbound network access, 15 minute max container lifetime
- **PTY bridge:** Use `node-pty` to create a PTY inside the container, bridge to browser via WebSocket
- **Security:** No privileged mode, seccomp profile applied, no host mounts

---

## UI Aesthetic (Solo Leveling)

- **Theme:** Dark throughout — `bg-gray-950` background, `bg-gray-900` panels
- **Rank badge glow colors:**
  - E = gray
  - D = green
  - C = blue
  - B = purple
  - A = gold
  - S = red
  - SS = orange with animated pulse
  - SSS = rainbow gradient with CSS keyframe animation
- **System notification messages:** Black panel, gold border, monospace font — e.g. *"The System has acknowledged your growth."*
- **Chapter map:** Visual skill-tree style with connecting lines between nodes
- **Level-up screen:** Full screen dark overlay, animated gold text, brief screen flash, then fades out
- **Streak flame:** Icon that visually grows larger with higher streak counts
- **XP bar:** Always partially filled even at the very start of a new level

---

## Folder Structure

```
linuxhunter/
  app/
    page.tsx                        # Landing page
    dashboard/
      page.tsx
    learn/
      page.tsx                      # Chapter map
      [chapter]/
        page.tsx                    # Chapter detail
    challenges/
      [slug]/
        page.tsx                    # Challenge page
    profile/
      [username]/
        page.tsx
    leaderboard/
      page.tsx
  components/
    Terminal.tsx                    # xterm.js wrapper component
    ChapterMap.tsx                  # Visual learning path
    XPBar.tsx
    RankBadge.tsx
    QuestPanel.tsx
    HunterCard.tsx
    LevelUpOverlay.tsx
    HintAccordion.tsx
  lib/
    supabase.ts                     # Supabase client (browser + server)
    xp.ts                           # XP calculation, leveling, rank logic
    titles.ts                       # Title unlock checking logic
    quests.ts                       # Quest progress logic
  sandbox-service/
    index.ts                        # Express app entry point
    docker.ts                       # Container spin up/tear down
    pty.ts                          # node-pty + WebSocket bridge
    Dockerfile.sandbox              # Ubuntu base image for user containers
  supabase/
    migrations/
      001_schema.sql                # Full DB schema
    seed.sql                        # All 14 chapters + all challenges seeded
  README.md
```

---

## README Must Include

1. How to create a Supabase project and run migrations
2. Environment variables needed (Supabase URL, anon key, service key, sandbox service URL)
3. How to build and run the sandbox Docker image locally
4. How to deploy sandbox service to Railway
5. How to deploy the Next.js app to Vercel
6. How to connect Vercel environment variables to Supabase and Railway

---

Build the full working MVP end to end. Seed all 14 chapters and at least 4 challenges per chapter into `seed.sql`. Make the UI feel dramatic and polished — this app should feel addictive to use.
