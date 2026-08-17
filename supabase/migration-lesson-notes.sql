-- ============================================
-- MIGRATION — fiches de leçon
-- « La règle avant de commencer », consultable sans lancer la leçon.
--
-- À exécuter dans Supabase SQL Editor AVANT seed-lesson-notes.sql.
-- Ne touche à aucune table existante : elle en crée une.
--
-- LE MANQUE QUE ÇA COMBLE
-- Jusqu'ici la règle n'existait que dans le champ `explanation` d'un
-- exercice, donc APRÈS s'être trompé. On apprenait par l'erreur, sans
-- jamais pouvoir lire la règle d'abord. C'est tenable pour du vocabulaire,
-- pas pour une structure : personne ne devine le present perfect.
--
-- UNE FICHE PAR LEÇON, PAS PLUS
-- `lesson_id` est la clé primaire : la contrainte rend un doublon
-- impossible. Une leçon a une fiche ou n'en a pas — jamais deux versions
-- qui se contrediraient.
--
-- TANT QUE CETTE MIGRATION N'EST PAS PASSÉE
-- L'application fonctionne exactement comme avant. Le parcours interroge la
-- table dans un `catch` : sans elle, aucun bouton « Voir la fiche »
-- n'apparaît, plutôt qu'un bouton qui mènerait à un écran vide.
-- ============================================

create table if not exists lesson_notes (
  lesson_id integer primary key references lessons(id) on delete cascade,

  -- Titre de la fiche, en français. Il annonce la règle plutôt que de
  -- répéter le titre de la leçon : « Se présenter » devient « Dire son nom
  -- et son âge ».
  title text not null,

  -- La règle, en français, en deux à quatre phrases. Le format long est
  -- volontairement impossible : une fiche qu'on ne lit pas ne sert à rien.
  rule text not null,

  -- Les exemples : [{"en":"I am twenty.","fr":"J'ai vingt ans."}, …]
  -- L'anglais et le français côte à côte — c'est la comparaison qui
  -- enseigne, pas la phrase anglaise seule.
  examples jsonb not null,

  -- Le piège du francophone, en français. Facultatif, mais c'est la partie
  -- la plus utile de la fiche quand elle existe.
  pitfall text
);

-- ============================================
-- SÉCURITÉ
-- Contenu pédagogique : lecture publique, aucune écriture depuis le client.
-- Rien n'est propre à un apprenant ici, donc aucune politique d'écriture —
-- les fiches ne se modifient que par script, comme le reste du contenu.
-- ============================================
alter table lesson_notes enable row level security;

drop policy if exists "Lecture publique des fiches de lecon" on lesson_notes;
create policy "Lecture publique des fiches de lecon"
  on lesson_notes for select using (true);

-- Vérification : doit renvoyer la table et sa politique.
select tablename, policyname from pg_policies where tablename = 'lesson_notes';
