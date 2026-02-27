# LinuxHunter

LeetCode-style Linux terminal command training with RPG progression.

## Supabase Setup

1. Create a Supabase project.
2. In the SQL editor, run the migration in `supabase/migrations/001_schema.sql`.
3. Seed data by running `supabase/seed.sql` in the SQL editor.
4. Enable email + GitHub OAuth in Supabase Auth settings.

## Environment Variables

Create `.env.local` in the Next.js app root (`linuxhunter/`):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SANDBOX_URL=https://your-railway-sandbox-url
SANDBOX_SERVICE_URL=https://your-railway-sandbox-url
```

For the sandbox service (`linuxhunter/sandbox-service`):

```
PORT=8080
PUBLIC_WS_BASE_URL=https://your-railway-sandbox-url
```

## Build and Run Sandbox Docker Image

From `linuxhunter/sandbox-service`:

```
docker build -f Dockerfile.sandbox -t linuxhunter-sandbox:latest .
```

## Run Sandbox Service Locally

From `linuxhunter/sandbox-service`:

```
npm install
npm run dev
```

## Deploy Sandbox to Railway

1. Create a new Railway project.
2. Add a new service from the `linuxhunter/sandbox-service` folder.
3. Set environment variables (`PORT`, `PUBLIC_WS_BASE_URL`).
4. Build the Docker image on the server or add a build step to create `linuxhunter-sandbox:latest` on the host running Docker.

## Deploy Next.js App to Vercel

1. Import the `linuxhunter` repo to Vercel.
2. Add environment variables from `.env.local` in Vercel project settings.
3. Deploy.

## Connect Vercel to Supabase and Railway

1. In Vercel, set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
2. Set `NEXT_PUBLIC_SANDBOX_URL` to your Railway sandbox service URL.
3. Confirm OAuth callback URLs in Supabase match Vercel deployment URLs.
