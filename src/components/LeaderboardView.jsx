// Affichage pur du classement.
// La ligne de l'utilisateur courant sort de la carte : c'est la seule
// information qu'il cherche, elle ne doit pas se perdre dans la liste.
export default function LeaderboardView({ rows, me, myRank, total }) {
  // Le rappel hors carte n'a de sens que si l'utilisateur ne figure pas
  // deja dans le tableau : sinon sa ligne apparaitrait deux fois.
  const inTop = Boolean(me) && rows.some((r) => r.id === me.id)

  return (
    <div className="board-screen">
      <header className="board-head">
        <p className="board-eyebrow">Classement général</p>
        <h1 className="board-title">Les plus assidus</h1>
      </header>

      <section className="board-card">
        <ol className="board-list">
          {rows.map((row, i) => (
            <li key={row.id} className={`board-row ${row.id === me?.id ? 'is-me' : ''}`}>
              <span className="board-rank">{i + 1}</span>
              <span className={`board-avatar av-${i % 4}`} aria-hidden="true">
                {(row.username || '?').charAt(0).toUpperCase()}
              </span>
              <span className="board-name">{row.username}</span>
              <span className="board-xp">{row.xp} XP</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Rappel hors carte : utile des que l'utilisateur sort du haut du tableau */}
      {me && !inTop && (
        <section className="board-me">
          <span className="board-rank">{myRank ?? '—'}</span>
          <span className="board-avatar is-mine" aria-hidden="true">
            {(me.username || '?').charAt(0).toUpperCase()}
          </span>
          <span className="board-name">{me.username} <span className="board-you">(toi)</span></span>
          <span className="board-xp">{me.xp} XP</span>
        </section>
      )}

      <p className="board-note">
        {total > rows.length
          ? `Les ${rows.length} premiers sur ${total} apprenants.`
          : `${total} apprenant${total > 1 ? 's' : ''} au total.`}
      </p>
    </div>
  )
}
