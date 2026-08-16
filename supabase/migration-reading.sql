-- ============================================
-- MIGRATION — compréhension écrite
-- À exécuter dans Supabase SQL Editor.
--
-- Dernier pilier du TOEIC absent de l'application. Les parties 6 et 7
-- représentent 70 questions sur 200 — plus que n'importe quel autre bloc.
--
-- Deux formats :
--   text_completion  un texte troué, on choisit le mot qui manque (partie 6)
--   passage          un ou plusieurs documents, puis des questions (partie 7)
--
-- Le champ `documents` porte les textes anglais :
--   [{"kind":"email","title":"…","text":"…"}, …]
-- « kind » sert à l'habillage (un e-mail ne se présente pas comme une
-- annonce), pas à la logique. Un « passage double » contient simplement
-- deux entrées — c'est le format le plus difficile du TOEIC, où la réponse
-- se trouve en croisant les deux documents.
-- ============================================

create table if not exists reading_passages (
  id serial primary key,
  level text not null check (level in ('A1','A2','B1','B2','C1','C2')),
  format text not null check (format in ('text_completion','passage')),
  title text not null,          -- en français, affiché avant la lecture
  context text,                 -- mise en situation, en français
  documents jsonb not null,
  position integer not null default 1,
  xp_reward integer not null default 15
);

create table if not exists reading_questions (
  id serial primary key,
  passage_id integer references reading_passages(id) on delete cascade,
  position integer not null default 1,
  question text not null,       -- en anglais, comme au TOEIC
  options jsonb not null,
  correct_answer text not null,
  explanation text              -- en français : c'est l'explication, pas l'exercice
);

create index if not exists reading_questions_passage_idx
  on reading_questions (passage_id, position);

create index if not exists reading_passages_level_idx
  on reading_passages (level, position);

create table if not exists reading_progress (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  passage_id integer references reading_passages(id) on delete cascade,
  score integer not null default 0,
  completed_at timestamp with time zone default now(),
  unique(user_id, passage_id)
);

-- ============================================
-- SÉCURITÉ
-- Lecture publique du contenu, chacun ne voit que sa propre progression.
-- ============================================
alter table reading_passages enable row level security;
alter table reading_questions enable row level security;
alter table reading_progress enable row level security;

drop policy if exists "Lecture publique des textes" on reading_passages;
create policy "Lecture publique des textes"
  on reading_passages for select using (true);

drop policy if exists "Lecture publique des questions de lecture" on reading_questions;
create policy "Lecture publique des questions de lecture"
  on reading_questions for select using (true);

drop policy if exists "Utilisateur gere sa progression de lecture" on reading_progress;
create policy "Utilisateur gere sa progression de lecture"
  on reading_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
