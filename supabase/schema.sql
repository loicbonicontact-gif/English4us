-- ============================================
-- SCHEMA SUPABASE — English4us
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- Profils utilisateurs (lié à auth.users de Supabase)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  level text default 'A1' check (level in ('A1','A2','B1','B2','C1','C2')),
  xp integer default 0,
  hearts integer default 5,
  streak_count integer default 0,
  last_activity_date date default current_date,
  created_at timestamp with time zone default now()
);

-- Leçons (structure du parcours A1 -> C2)
create table lessons (
  id serial primary key,
  level text not null check (level in ('A1','A2','B1','B2','C1','C2')),
  unit_order integer not null,
  title text not null,
  theme text,
  xp_reward integer default 10
);

-- Exercices liés à chaque leçon
create table exercises (
  id serial primary key,
  lesson_id integer references lessons(id) on delete cascade,
  type text check (type in ('qcm','traduction','ecoute','trous','oral')),
  question text not null,
  options jsonb,
  correct_answer text not null,
  explanation text
);

-- Progression utilisateur par leçon
create table user_progress (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  lesson_id integer references lessons(id) on delete cascade,
  completed boolean default false,
  score integer default 0,
  completed_at timestamp with time zone,
  unique(user_id, lesson_id)
);

-- Historique des streaks (pour badges/statistiques)
create table streak_log (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  activity_date date default current_date,
  xp_earned integer default 0
);

-- ============================================
-- SÉCURITÉ (Row Level Security)
-- ============================================
alter table profiles enable row level security;
alter table user_progress enable row level security;
alter table streak_log enable row level security;

create policy "Utilisateurs lisent tous les profils (leaderboard)"
  on profiles for select using (true);

create policy "Utilisateur modifie son propre profil"
  on profiles for update using (auth.uid() = id);

-- Sans cette policy, la création du profil à l'inscription est bloquée par la RLS
create policy "Utilisateur crée son propre profil"
  on profiles for insert with check (auth.uid() = id);

create policy "Utilisateur gère sa propre progression"
  on user_progress for all using (auth.uid() = user_id);

create policy "Utilisateur gère son propre streak_log"
  on streak_log for all using (auth.uid() = user_id);

-- Lessons/exercises : lecture publique, écriture admin uniquement
alter table lessons enable row level security;
alter table exercises enable row level security;
create policy "Lecture publique des leçons" on lessons for select using (true);
create policy "Lecture publique des exercices" on exercises for select using (true);

-- ============================================
-- TEMPS RÉEL
-- Sans cette ligne, la Navbar ne se met pas à jour toute seule
-- après une leçon : il faudrait recharger la page.
-- ============================================
alter publication supabase_realtime add table profiles;
