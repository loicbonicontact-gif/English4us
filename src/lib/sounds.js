// Sons de l'application, générés par l'ordinateur (Web Audio API).
//
// Pourquoi pas des fichiers MP3 ? Trois raisons :
//   1. zéro octet à télécharger — l'appli reste instantanée, même en 3G d'école
//   2. aucun problème de droits : ces sons n'existent nulle part ailleurs
//   3. modifiables en une ligne (hauteur, durée) sans repasser par un studio
//
// Le navigateur interdit tout son avant une action de l'utilisateur :
// le contexte audio n'est donc créé qu'au premier clic.

const STORAGE_KEY = 'e4u-sound'
let ctx = null

function getContext() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    ctx = new AudioCtx()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function isSoundOn() {
  if (typeof localStorage === 'undefined') return true
  return localStorage.getItem(STORAGE_KEY) !== 'off'
}

export function setSoundOn(on) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
}

// Joue une note. type : 'sine' (doux), 'triangle' (rond), 'square' (jeu vidéo)
function note(freq, startAt = 0, duration = 0.14, type = 'sine', volume = 0.16) {
  const audio = getContext()
  if (!audio) return

  const osc = audio.createOscillator()
  const gain = audio.createGain()
  const t = audio.currentTime + startAt

  osc.type = type
  osc.frequency.setValueAtTime(freq, t)

  // Enveloppe : montée très courte puis extinction douce.
  // Sans elle, on entend un « clic » désagréable au début et à la fin.
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(volume, t + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)

  osc.connect(gain).connect(audio.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

// Glissando descendant : utilisé pour l'erreur et le cœur perdu.
function slide(from, to, duration = 0.22, type = 'triangle', volume = 0.14) {
  const audio = getContext()
  if (!audio) return

  const osc = audio.createOscillator()
  const gain = audio.createGain()
  const t = audio.currentTime

  osc.type = type
  osc.frequency.setValueAtTime(from, t)
  osc.frequency.exponentialRampToValueAtTime(to, t + duration)

  gain.gain.setValueAtTime(volume, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)

  osc.connect(gain).connect(audio.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

function play(fn) {
  if (!isSoundOn()) return
  try { fn() } catch { /* un son raté ne doit jamais interrompre la leçon */ }
}

// --- Sons du jeu -------------------------------------------------

// Bonne réponse : deux notes qui montent (do -> mi). Bref et net.
export const soundCorrect = () => play(() => {
  note(523.25, 0, 0.11, 'sine', 0.15)
  note(659.25, 0.09, 0.16, 'sine', 0.15)
})

// Mauvaise réponse : descente courte. Volontairement discret —
// un son d'échec agressif décourage, surtout un enfant.
export const soundWrong = () => play(() => {
  slide(320, 180, 0.24, 'triangle', 0.12)
})

// Cœur perdu : note sourde et basse, distincte de l'erreur.
export const soundHeart = () => play(() => {
  slide(200, 90, 0.3, 'sine', 0.16)
})

// Leçon terminée : arpège majeur do-mi-sol-do. Récompense claire.
export const soundComplete = () => play(() => {
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((f, i) => note(f, i * 0.11, 0.28, 'triangle', 0.15))
})

// Nouveau jour de série : deux notes montantes plus larges.
export const soundStreak = () => play(() => {
  note(659.25, 0, 0.14, 'triangle', 0.14)
  note(987.77, 0.12, 0.3, 'triangle', 0.14)
})

// Clic léger sur une option de QCM.
export const soundTap = () => play(() => {
  note(880, 0, 0.045, 'sine', 0.07)
})
