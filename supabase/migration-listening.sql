-- ============================================
-- MIGRATION — compréhension orale
-- À exécuter dans Supabase SQL Editor.
--
-- Trois formats, calqués sur les parties 2, 3 et 4 du TOEIC — les seules
-- qui entraînent la compréhension d'un échange réel, là où une dictée
-- n'entraîne que le décodage des sons.
--
--   question_response  une question orale seule, on choisit la réplique
--   conversation       deux interlocuteurs, puis des questions de sens
--   talk               une annonce ou un exposé, puis des questions
--
-- POINT D'ARCHITECTURE — le champ `audio_url`
-- Il est volontairement laissé vide pour l'instant. Vide, l'application lit
-- le script avec la synthèse vocale du navigateur : gratuit, disponible
-- partout, qualité variable selon l'appareil. Rempli plus tard avec des
-- fichiers générés par une voix neuronale, l'application jouera le fichier
-- à la place, sans qu'une ligne de code d'exercice change.
-- ============================================

create table if not exists listening_passages (
  id serial primary key,
  level text not null check (level in ('A1','A2','B1','B2','C1','C2')),
  format text not null check (format in ('question_response','conversation','talk')),
  title text not null,          -- titre en français, affiché avant l'écoute
  context text,                 -- mise en situation, en français, sans mot anglais
  -- Script sous forme de répliques : [{"speaker":"A","text":"..."}, …]
  -- Un seul locuteur pour un « talk », deux pour une « conversation ».
  script jsonb not null,
  audio_url text,               -- null = lecture par la synthèse du navigateur
  position integer not null default 1,
  xp_reward integer not null default 15
);

create table if not exists listening_questions (
  id serial primary key,
  passage_id integer references listening_passages(id) on delete cascade,
  position integer not null default 1,
  question text not null,       -- en anglais : le TOEIC pose ses questions en anglais
  options jsonb not null,
  correct_answer text not null,
  explanation text              -- en français : c'est l'explication, pas l'exercice
);

create index if not exists listening_questions_passage_idx
  on listening_questions (passage_id, position);

create index if not exists listening_passages_level_idx
  on listening_passages (level, position);

-- ============================================
-- SÉCURITÉ
-- Même règle que les leçons : lecture publique, écriture réservée à
-- l'administration depuis le tableau de bord Supabase.
-- ============================================
alter table listening_passages enable row level security;
alter table listening_questions enable row level security;

drop policy if exists "Lecture publique des passages" on listening_passages;
create policy "Lecture publique des passages"
  on listening_passages for select using (true);

drop policy if exists "Lecture publique des questions d ecoute" on listening_questions;
create policy "Lecture publique des questions d ecoute"
  on listening_questions for select using (true);

-- Progression : un passage terminé, avec son score.
create table if not exists listening_progress (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  passage_id integer references listening_passages(id) on delete cascade,
  score integer not null default 0,
  completed_at timestamp with time zone default now(),
  unique(user_id, passage_id)
);

alter table listening_progress enable row level security;

drop policy if exists "Utilisateur gere sa progression d ecoute" on listening_progress;
create policy "Utilisateur gere sa progression d ecoute"
  on listening_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
