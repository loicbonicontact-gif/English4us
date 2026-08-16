-- ============================================
-- MIGRATION — file de révision espacée
-- À exécuter dans Supabase SQL Editor sur une base déjà installée.
-- (Pour une base neuve, schema.sql contient déjà ce bloc.)
--
-- Principe : chaque exercice raté entre dans une file personnelle et
-- revient à intervalle croissant (J+1, J+3, J+7, J+14, J+30). Réussi
-- au dernier palier, il quitte la file : il est considéré acquis.
-- ============================================

create table if not exists review_items (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  exercise_id integer references exercises(id) on delete cascade,
  box integer not null default 0,          -- palier d'espacement (0 = vient d'être raté)
  due_date date not null default current_date,
  wrong_count integer not null default 0,  -- nombre total d'échecs, pour les statistiques
  created_at timestamp with time zone default now(),
  unique(user_id, exercise_id)
);

-- La requête « qu'est-ce qui est dû aujourd'hui ? » est lancée à chaque
-- ouverture de l'app : elle doit rester instantanée même avec des milliers
-- de lignes par utilisateur.
create index if not exists review_items_due_idx
  on review_items (user_id, due_date);

-- ============================================
-- SÉCURITÉ
-- Chaque utilisateur ne voit et ne modifie que sa propre file.
-- ============================================
alter table review_items enable row level security;

drop policy if exists "Utilisateur gère sa propre file de révision" on review_items;
create policy "Utilisateur gère sa propre file de révision"
  on review_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
