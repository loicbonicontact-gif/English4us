import Mascot from './Mascot'
import { LEVEL_BLURB } from './PathView'
import { blockPassed, lessonsSkipped } from '../lib/placement'

// Resultat du test de placement.
//
// Trois choses doivent tenir sur cet ecran, dans cet ordre :
//   1. ou l'apprenant demarre, et ce que cela lui epargne
//   2. le detail par niveau, pour que le resultat ne tombe pas du ciel
//   3. le fait que rien n'est ferme — ni definitif
//
// Le point 3 n'est pas de la politesse. Un test qui « decide » de votre
// niveau sans recours est vecu comme un jugement ; celui-ci choisit un
// point de depart, et l'apprenant garde la main.
export default function PlacementResult({ level, blocks, onStart, onRedo }) {
  const skipped = lessonsSkipped(level)
  const beginner = skipped === 0

  return (
    <div className="listen-intro">
      <Mascot mood="happy" size={90} />

      <p className="listen-format">Résultat du placement</p>
      <h1 className="listen-title">Tu démarres en {level}</h1>
      <p className="placement-blurb">{LEVEL_BLURB[level]}</p>

      {beginner ? (
        <p className="listen-hint">
          Tu commences au tout début du parcours, à la première leçon. C'est
          le bon endroit : rien n'est supposé acquis.
        </p>
      ) : (
        <p className="listen-hint">
          Les {skipped} leçons des niveaux précédents restent{' '}
          <b>ouvertes et non terminées</b> : tu peux y redescendre quand tu
          veux, mais tu n'es pas obligé de les traverser pour avancer.
        </p>
      )}

      <ul className="placement-recap" aria-label="Détail par niveau">
        {blocks.map((block) => {
          // Le dernier bloc peut être réussi : c'est le cas de qui va au
          // bout des six niveaux. Se fier au niveau retenu le marquerait
          // à tort comme échoué.
          const passed = blockPassed(block.correct, block.total)
          return (
            <li key={block.level} className={passed ? 'is-passed' : 'is-stop'}>
              <span className="level-pill">{block.level}</span>
              <span className="placement-recap-score">
                {block.correct} / {block.total}
              </span>
              <span className="placement-recap-note">
                {passed ? 'Acquis' : "C'est ici que ça commence"}
              </span>
            </li>
          )
        })}
      </ul>

      <p className="listen-hint">
        Ce test donne un point de départ, pas une note. Il s'appuie sur les
        questions à choix multiple du parcours, écrites pour enseigner et non
        pour évaluer — un établissement le lira comme une orientation, jamais
        comme une certification.
      </p>

      <button type="button" className="btn-wide is-primary" onClick={onStart}>
        Commencer en {level}
      </button>
      <button type="button" className="placement-skip" onClick={onRedo}>
        Refaire le test
      </button>
    </div>
  )
}
