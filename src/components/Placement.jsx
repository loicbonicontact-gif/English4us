import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  buildBlocks,
  fetchPlacementQuestions,
  nextLevelToTest,
  placementLevelFrom,
  savePlacement,
  totalCorrect
} from '../lib/placement'
import { soundComplete, soundTap } from '../lib/sounds'
import Mascot from './Mascot'
import PlacementView from './PlacementView'
import PlacementResult from './PlacementResult'
import { IconClose } from './Icons'

// Test de placement — conteneur.
//
// Il enchaine des blocs de questions, un par niveau, en montant tant que
// l'apprenant reussit. Le detail de la regle vit dans lib/placement.js ;
// cet ecran ne fait que derouler.
//
// Aucun coeur n'est consomme et aucun XP n'est gagne : ce n'est pas une
// lecon, c'est une mesure. En faire une source d'XP encouragerait a le
// repasser pour farmer, ce qui n'a aucun sens.
export default function Placement({ profile, onProfileChange }) {
  const navigate = useNavigate()

  const [blocks, setBlocks] = useState(null)      // { A1: [...], A2: [...], … }
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState([])            // blocs joues : { level, correct, total }
  const [level, setLevel] = useState(null)        // niveau en cours de test
  const [index, setIndex] = useState(0)           // question dans le bloc
  const [correct, setCorrect] = useState(0)       // bonnes reponses dans le bloc
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)      // niveau retenu, en fin de test
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rows = await fetchPlacementQuestions()
      const built = buildBlocks(rows)
      if (!built.A1?.length) {
        throw new Error("Aucune question de placement en base. Lance supabase/seed.sql d'abord.")
      }
      setBlocks(built)
      setDone([])
      setLevel(null)
      setIndex(0)
      setCorrect(0)
      setAnswer('')
      setResult(null)
      setStarted(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Enregistre le niveau et renvoie au parcours.
  const commit = useCallback(async (chosenLevel, blocksPlayed) => {
    setSaving(true)
    try {
      const score = blocksPlayed.length ? totalCorrect(blocksPlayed) : null
      await savePlacement(profile.id, chosenLevel, score)
      await onProfileChange?.()
    } catch (err) {
      setError(err.message)
      setSaving(false)
      return false
    }
    setSaving(false)
    return true
  }, [profile.id, onProfileChange])

  // « Je débute » : pas de test, on enregistre A1 et on part.
  // Le résultat est enregistré quand même, sinon l'invitation reviendrait
  // à chaque visite devant un vrai débutant.
  async function declareBeginner() {
    if (await commit('A1', [])) navigate('/dashboard')
  }

  function start() {
    setStarted(true)
    setLevel('A1')
    setIndex(0)
    setCorrect(0)
    setAnswer('')
  }

  // Passe à la question suivante, ou clôt le bloc.
  // `giveUp` : le bouton « Je ne sais pas ». La réponse compte comme
  // fausse, mais elle est volontaire — mieux vaut cela qu'un tir au hasard
  // qui placerait l'apprenant trop haut.
  function handleNext(giveUp = false) {
    const block = blocks[level]
    const question = block[index]
    const gotIt = !giveUp && answer === question.correct_answer
    const nextCorrect = correct + (gotIt ? 1 : 0)

    soundTap()

    if (index < block.length - 1) {
      setCorrect(nextCorrect)
      setIndex(index + 1)
      setAnswer('')
      return
    }

    // Fin du bloc : on décide de monter ou de s'arrêter.
    const played = [...done, { level, correct: nextCorrect, total: block.length }]
    setDone(played)

    const next = nextLevelToTest(played)
    // Un niveau sans question en base ne peut pas être mesuré : on s'arrête
    // là plutôt que de le déclarer acquis sans preuve.
    const nextBlock = next ? blocks[next] : null

    if (next && nextBlock?.length) {
      setLevel(next)
      setIndex(0)
      setCorrect(0)
      setAnswer('')
      return
    }

    const placed = next && !nextBlock?.length ? next : placementLevelFrom(played)
    soundComplete()
    setResult({ level: placed, blocks: played })
  }

  async function acceptResult() {
    if (await commit(result.level, result.blocks)) navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="lesson-screen lesson-screen-center">
        <Mascot mood="thinking" size={90} />
        <p className="path-status">Préparation du test…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="lesson-screen lesson-screen-center">
        <p className="alert alert-error" role="alert">{error}</p>
        <button type="button" className="btn-wide is-dark" onClick={() => navigate('/dashboard')}>
          Retour au parcours
        </button>
      </div>
    )
  }

  if (result) {
    return (
      <PlacementResult
        level={result.level}
        blocks={result.blocks}
        onStart={acceptResult}
        onRedo={load}
      />
    )
  }

  if (!started) {
    return (
      <div className="listen-intro">
        <button
          type="button"
          className="lesson-close"
          onClick={() => navigate('/dashboard')}
          aria-label="Quitter"
        >
          <IconClose size={18} strokeWidth={2.25} />
        </button>

        <Mascot mood="idle" size={90} />
        <p className="listen-format">Test de placement</p>
        <h1 className="listen-title">Où commencer ?</h1>

        <p className="listen-hint">
          Cinq questions par niveau, en partant de A1. Tant que tu réussis, on
          monte d'un niveau. Dès que ça résiste, on s'arrête : c'est là que
          ton parcours commence.
        </p>

        <ul className="exam-brief">
          <li><span>Entre <b>5 et 30 questions</b> selon ton niveau — 1 à 6 minutes</span></li>
          <li><span>Aucun cœur perdu, aucun XP gagné : c'est une mesure, pas une leçon</span></li>
          <li><span>Refaisable à tout moment depuis ton profil</span></li>
        </ul>

        <button type="button" className="btn-wide is-primary" onClick={start} disabled={saving}>
          Passer le test
        </button>
        <button type="button" className="placement-skip" onClick={declareBeginner} disabled={saving}>
          Je débute en anglais — commencer en A1
        </button>
      </div>
    )
  }

  const block = blocks[level]

  return (
    <PlacementView
      question={block[index]}
      level={level}
      index={index}
      blockLength={block.length}
      answer={answer}
      onAnswer={setAnswer}
      onNext={handleNext}
      onQuit={() => navigate('/dashboard')}
    />
  )
}
