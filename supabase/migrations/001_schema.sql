create extension if not exists "uuid-ossp";

create table if not exists users (
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
);

create table if not exists chapters (
  id serial primary key,
  order_index int unique,
  title text,
  description text,
  rank_required text,
  icon text
);

create table if not exists challenges (
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
);

create table if not exists user_challenge_attempts (
  id serial primary key,
  user_id uuid references users(id),
  challenge_id int references challenges(id),
  status text,
  time_taken int,
  xp_earned int,
  attempts int default 0,
  completed_at timestamptz
);

create table if not exists quests (
  id serial primary key,
  type text,
  title text,
  description text,
  xp_reward int,
  condition jsonb,
  expires_at timestamptz
);

create table if not exists user_quests (
  id serial primary key,
  user_id uuid references users(id),
  quest_id int references quests(id),
  progress int default 0,
  completed boolean default false
);

alter table users enable row level security;
alter table chapters enable row level security;
alter table challenges enable row level security;
alter table user_challenge_attempts enable row level security;
alter table quests enable row level security;
alter table user_quests enable row level security;

create policy "Users can read own profile" on users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on users
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on users
  for insert with check (auth.uid() = id);

create policy "Chapters are readable" on chapters
  for select using (true);

create policy "Challenges are readable" on challenges
  for select using (true);

create policy "Quests are readable" on quests
  for select using (true);

create policy "User attempts are readable" on user_challenge_attempts
  for select using (auth.uid() = user_id);

create policy "User attempts insert" on user_challenge_attempts
  for insert with check (auth.uid() = user_id);

create policy "User attempts update" on user_challenge_attempts
  for update using (auth.uid() = user_id);

create policy "User quests are readable" on user_quests
  for select using (auth.uid() = user_id);

create policy "User quests insert" on user_quests
  for insert with check (auth.uid() = user_id);

create policy "User quests update" on user_quests
  for update using (auth.uid() = user_id);
