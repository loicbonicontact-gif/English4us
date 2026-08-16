-- ============================================
-- MIGRATION — recharge automatique des cœurs
--
-- Un cœur revient toutes les 4 heures. La recharge ne repose pas sur une
-- minuterie : l'application est fermée la plupart du temps, et c'est
-- justement là que les heures passent. On enregistre donc l'instant où le
-- compte est descendu, et l'application en déduit à l'ouverture combien de
-- cœurs ont eu le temps de revenir.
-- ============================================

alter table profiles
  add column if not exists hearts_updated_at timestamp with time zone;

-- Remise à cinq cœurs pour tout le monde, une fois.
--
-- Ce n'est pas un cadeau arbitraire : jusqu'à cette migration, un cœur
-- perdu l'était définitivement. Les comptes arrivés à zéro étaient bloqués
-- sans aucun moyen de repartir. On efface cette impasse avant d'activer la
-- recharge, sinon ces comptes resteraient à zéro pendant 20 heures.
update profiles set hearts = 5, hearts_updated_at = null;
