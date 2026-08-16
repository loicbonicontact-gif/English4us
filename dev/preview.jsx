// Previsualisation locale des ecrans, sans Supabase ni connexion.
// Ouvre http://localhost:5173/preview.html
//
// Sert a verifier le rendu et les points de rupture pendant la refonte.
// Ce fichier n'est jamais inclus dans le build de production.

import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import '../src/styles.css'

import AppShell from '../src/components/AppShell'
import PathView from '../src/components/PathView'
import ExerciseView from '../src/components/ExerciseView'
import LessonEnd from '../src/components/LessonEnd'
import ProfileView from '../src/components/ProfileView'
import { demoExercise, demoLesson, demoPath, demoProfile, demoResults } from './fixtures'

const SCREENS = [
  { key: 'parcours', label: '01 Parcours' },
  { key: 'question', label: '02 Question' },
  { key: 'juste', label: '03 Juste' },
  { key: 'faux', label: '03 Faux' },
  { key: 'vide', label: '03 Sans cœur' },
  { key: 'fin', label: '04 Fin' },
  { key: 'profil', label: '06 Profil' }
]

function Preview() {
  const [screen, setScreen] = useState('parcours')
  const [answer, setAnswer] = useState('')
  const [sound, setSound] = useState(true)

  const verdict = screen === 'juste' ? 'right' : (screen === 'faux' || screen === 'vide') ? 'wrong' : null
  const hearts = screen === 'vide' ? 0 : screen === 'faux' ? 1 : 2

  const exerciseProps = {
    exercise: demoExercise,
    index: 1,
    total: 8,
    // Juste : on choisit la bonne reponse. Faux : une autre, sinon l'ecran
    // afficherait une reponse a la fois juste et fausse.
    answer: verdict === 'right'
      ? demoExercise.correct_answer
      : verdict ? demoExercise.options[0] : answer,
    verdict,
    shake: false,
    hearts,
    breakingIndex: null,
    isLast: false,
    onAnswer: setAnswer,
    onValidate: () => {},
    onNext: () => {},
    onQuit: () => {},
    onSpeak: (t) => console.log('lire :', t)
  }

  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <nav className="preview-switch">
        {SCREENS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setScreen(s.key)}
            className={screen === s.key ? 'is-on' : ''}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {screen === 'parcours' && (
        <AppShell profile={demoProfile}>
          <PathView path={demoPath} hearts={demoProfile.hearts} onOpen={() => {}} />
        </AppShell>
      )}

      {['question', 'juste', 'faux', 'vide'].includes(screen) && <ExerciseView {...exerciseProps} />}

      {screen === 'profil' && (
        <AppShell profile={demoProfile}>
          <ProfileView
            username="malo"
            memberSince="août 2026"
            level={{ current: 'A1', next: 'A2', inLevel: 10, needed: 500, percent: 2 }}
            lessonsDone={1}
            streak={1}
            accuracy={89}
            soundOn={sound}
            onToggleSound={() => setSound((v) => !v)}
            onSignOut={() => {}}
          />
        </AppShell>
      )}

      {screen === 'fin' && (
        <LessonEnd
          lesson={demoLesson}
          score={88}
          correctCount={7}
          total={8}
          xpReward={10}
          streak={1}
          results={demoResults}
          nextLesson={{ id: 3, title: 'Les nombres' }}
          onNext={() => {}}
          onRetryMissed={() => {}}
        />
      )}
    </MemoryRouter>
  )
}

// La racine est conservee entre deux rechargements a chaud : sans cela,
// Vite rappelle createRoot sur le meme noeud et React proteste.
const container = document.getElementById('root')
const root = (window.__previewRoot ??= createRoot(container))
root.render(<StrictMode><Preview /></StrictMode>)
