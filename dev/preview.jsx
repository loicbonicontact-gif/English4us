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
import LeaderboardView from '../src/components/LeaderboardView'
import ReviewEnd from '../src/components/ReviewEnd'
import ListeningView from '../src/components/ListeningView'
import ReadingView from '../src/components/ReadingView'
import ExamView from '../src/components/ExamView'
import ExamResult from '../src/components/ExamResult'
import { gradeExam } from '../src/lib/exam'
import Mascot from '../src/components/Mascot'
import { demoBoard, demoDictation, demoExercise, demoLesson, demoListeningQuestions, demoPassage, demoReading, demoReadingQuestions, demoSpeaking, demoPath, demoProfile, demoResults } from './fixtures'

const SCREENS = [
  { key: 'parcours', label: '01 Parcours' },
  { key: 'question', label: '02 Question' },
  { key: 'juste', label: '03 Juste' },
  { key: 'faux', label: '03 Faux' },
  { key: 'vide', label: '03 Sans cœur' },
  { key: 'fin', label: '04 Fin' },
  { key: 'classement', label: '05 Classement' },
  { key: 'profil', label: '06 Profil' },
  { key: 'revision', label: '07 Révision' },
  { key: 'revision-fin', label: '07 Fin révision' },
  { key: 'revision-vide', label: '07 Rien à revoir' },
  { key: 'dictee', label: '08 Dictée' },
  { key: 'oral', label: '10 Oral' },
  { key: 'oral-verdict', label: '10 Oral verdict' },
  { key: 'ecoute-intro', label: '09 Écoute intro' },
  { key: 'ecoute-question', label: '09 Écoute question' },
  { key: 'ecoute-verdict', label: '09 Écoute verdict' },
  { key: 'lecture-intro', label: '11 Lecture intro' },
  { key: 'lecture', label: '11 Lecture question' },
  { key: 'examen', label: '12 Examen' },
  { key: 'examen-fin', label: '12 Examen score' }
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
          <PathView path={demoPath} onOpen={() => {}} onOpenListening={() => {}} />
        </AppShell>
      )}

      {['question', 'juste', 'faux', 'vide'].includes(screen) && <ExerciseView {...exerciseProps} />}

      {/* Revision : meme ecran d'exercice, mode « review » — ni coeurs, ni
          menace de fin de lecon. */}
      {screen === 'revision' && (
        <ExerciseView {...exerciseProps} mode="review" verdict="wrong" answer={demoExercise.options[0]} />
      )}

      {screen === 'dictee' && (
        <ExerciseView {...exerciseProps} exercise={demoDictation} answer={answer} verdict={null} />
      )}

      {screen === 'oral' && (
        <ExerciseView {...exerciseProps} exercise={demoSpeaking} verdict={null} onSpeechResult={() => {}} />
      )}

      {screen === 'oral-verdict' && (
        <ExerciseView
          {...exerciseProps}
          exercise={demoSpeaking}
          verdict="wrong"
          onSpeechResult={() => {}}
          speech={{
            result: {
              score: 67,
              passed: false,
              said: 'this is my mother and my fatter',
              heard: true,
              words: [
                { word: 'this', ok: true }, { word: 'is', ok: true },
                { word: 'my', ok: true }, { word: 'mother', ok: true },
                { word: 'and', ok: true }, { word: 'my', ok: true },
                { word: 'father', ok: false }
              ]
            },
            feedback: 'Compris, à un mot près. Réécoute le modèle et refais la phrase entière.'
          }}
        />
      )}

      {['ecoute-intro', 'ecoute-question', 'ecoute-verdict'].includes(screen) && (
        <AppShell profile={demoProfile} dueCount={0}>
          <ListeningView
            passage={demoPassage}
            questions={demoListeningQuestions}
            started={screen !== 'ecoute-intro'}
            index={0}
            answer={screen === 'ecoute-verdict' ? demoListeningQuestions[0].options[1] : answer}
            verdict={screen === 'ecoute-verdict' ? 'wrong' : null}
            onStart={() => setScreen('ecoute-question')}
            onAnswer={setAnswer}
            onValidate={() => setScreen('ecoute-verdict')}
            onNext={() => {}}
            onQuit={() => setScreen('parcours')}
          />
        </AppShell>
      )}

      {['lecture-intro', 'lecture'].includes(screen) && (
        <AppShell profile={demoProfile} dueCount={0}>
          <ReadingView
            passage={demoReading}
            questions={demoReadingQuestions}
            started={screen === 'lecture'}
            index={0}
            answer={answer}
            verdict={null}
            onStart={() => setScreen('lecture')}
            onAnswer={setAnswer}
            onValidate={() => {}}
            onNext={() => {}}
            onQuit={() => setScreen('parcours')}
          />
        </AppShell>
      )}

      {screen === 'examen' && (
        <ExamView
          question={{ id: 1, question: 'What is the main purpose of the email?', options: ['To confirm a booking', 'To cancel an order', 'To request a refund', 'To apply for a job'], passage: demoReading }}
          index={44}
          total={114}
          section="reading"
          answer={answer}
          remainingMs={4 * 60 * 1000 + 12 * 1000}
          onAnswer={setAnswer}
          onNext={() => {}}
          onQuit={() => setScreen('parcours')}
        />
      )}

      {screen === 'examen-fin' && (
        <AppShell profile={demoProfile} dueCount={0}>
          <ExamResult
            result={gradeExam(
              { listening: [{ id: 1, correct_answer: 'A' }, { id: 2, correct_answer: 'B' }],
                reading: [{ id: 3, correct_answer: 'C' }, { id: 4, correct_answer: 'D' }] },
              { 1: 'A', 2: 'B', 3: 'C', 4: 'wrong' }
            )}
            timedOut={false}
            onBack={() => {}}
            onRetry={() => {}}
          />
        </AppShell>
      )}

      {screen === 'revision-fin' && (
        <AppShell profile={demoProfile} dueCount={4}>
          <ReviewEnd
            correctCount={6}
            total={8}
            xpEarned={12}
            remaining={4}
            onBack={() => {}}
            onAgain={() => {}}
          />
        </AppShell>
      )}

      {screen === 'revision-vide' && (
        <AppShell profile={demoProfile} dueCount={0}>
          <div className="review-empty">
            <Mascot mood="happy" size={96} />
            <h1 className="review-end-title">Rien à revoir</h1>
            <p className="review-end-sub">
              Tes erreurs passées sont à jour. Fais une leçon : ce que tu rateras
              reviendra ici demain, puis de plus en plus rarement.
            </p>
            <button type="button" className="btn-wide is-primary">Aller au parcours</button>
          </div>
        </AppShell>
      )}

      {screen === 'classement' && (
        <AppShell profile={demoProfile}>
          <LeaderboardView rows={demoBoard} me={demoBoard[3]} myRank={4} total={128} />
        </AppShell>
      )}

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
