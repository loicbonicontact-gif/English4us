// Mascotte English4us : visage d'éléphant dessiné en SVG (jamais un emoji,
// qui changerait d'apparence selon l'appareil et ne pourrait pas s'animer).
//
// mood pilote l'expression :
//   idle     -> clignement des yeux, oreilles qui battent, trompe qui balance
//   happy    -> yeux plissés, trompe levée (bonne réponse)
//   sad      -> yeux tombants, trompe basse (mauvaise réponse)
//   thinking -> regard de côté (chargement)
//
// Toutes les animations sont désactivées si l'utilisateur a activé
// « réduire les animations » dans son système (voir styles.css).
export default function Mascot({ mood = 'idle', size = 96, className = '' }) {
  return (
    <svg
      className={`mascot mascot-${mood} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 200 190"
      role="img"
      aria-label="Mascotte éléphant d'English4us"
    >
      <g className="mascot-body">
        {/* Oreilles — dessinées avant la tête pour passer derrière */}
        <g className="mascot-ear mascot-ear-left">
          <ellipse cx="46" cy="76" rx="38" ry="45" fill="var(--mascot-skin-dark)" />
          <ellipse cx="52" cy="78" rx="19" ry="24" fill="var(--mascot-ear-inner)" />
        </g>
        <g className="mascot-ear mascot-ear-right">
          <ellipse cx="154" cy="76" rx="38" ry="45" fill="var(--mascot-skin-dark)" />
          <ellipse cx="148" cy="78" rx="19" ry="24" fill="var(--mascot-ear-inner)" />
        </g>

        {/* Tête */}
        <ellipse cx="100" cy="82" rx="54" ry="56" fill="var(--mascot-skin)" />

        {/* Trompe : trait épais à bout arrondi, plus simple à animer qu'une forme fermée */}
        <path
          className="mascot-trunk"
          d="M100 112 C 100 136, 90 148, 95 163"
          stroke="var(--mascot-skin)"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
        />
        {/* Plis de la trompe */}
        <path
          className="mascot-trunk"
          d="M100 112 C 100 136, 90 148, 95 163"
          stroke="var(--mascot-skin-dark)"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="2 12"
          opacity="0.45"
        />

        {/* Défenses */}
        <path d="M74 116 q -7 14 -2 22" stroke="#FFF9EC" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M126 116 q 7 14 2 22" stroke="#FFF9EC" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Yeux */}
        <g className="mascot-eyes">
          <g className="mascot-eye">
            <circle cx="79" cy="72" r="12" fill="#FFFFFF" />
            <circle className="mascot-pupil" cx="80" cy="73" r="6" fill="#2A2E45" />
            <circle cx="82" cy="70" r="2" fill="#FFFFFF" />
          </g>
          <g className="mascot-eye">
            <circle cx="121" cy="72" r="12" fill="#FFFFFF" />
            <circle className="mascot-pupil" cx="122" cy="73" r="6" fill="#2A2E45" />
            <circle cx="124" cy="70" r="2" fill="#FFFFFF" />
          </g>
        </g>

        {/* Paupières : abaissées uniquement en mood "sad" ou "happy" */}
        <g className="mascot-lids">
          <path d="M67 72 q 12 -9 24 0" stroke="var(--mascot-skin-dark)" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M109 72 q 12 -9 24 0" stroke="var(--mascot-skin-dark)" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
      </g>
    </svg>
  )
}
