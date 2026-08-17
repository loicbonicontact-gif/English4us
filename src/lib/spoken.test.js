import { describe, expect, it } from 'vitest'
import { englishToSpeak, fillBlank, isEnglish, quotedSegments } from './spoken'

// Deux erreurs sont possibles, et elles ne coûtent PAS la même chose :
//   - se taire sur une phrase anglaise : l'apprenant perd un bouton ;
//   - lire une phrase française avec la voix anglaise : il apprend une
//     prononciation fausse, dans une application qui enseigne justement
//     la prononciation.
// Ces tests verrouillent la prudence : au moindre doute, on ne lit rien.
//
// Tous les énoncés ci-dessous sont copiés tels quels des scripts de contenu.

describe('isEnglish — reconnaître la langue d’une citation', () => {
  it('reconnaît une phrase anglaise', () => {
    expect(isEnglish('She has a new car.')).toBe(true)
    expect(isEnglish('Hello, how are you?')).toBe(true)
    expect(isEnglish('The shop opens at 9 a.m.')).toBe(true)
  })

  it('refuse une phrase française, même sans accent', () => {
    // Le piège : « Je m'appelle Marie » ne contient aucun accent. C'est
    // l'élision « m' » et le mot « je » qui la trahissent.
    expect(isEnglish("Je m'appelle Marie")).toBe(false)
    expect(isEnglish('du pain')).toBe(false)
    expect(isEnglish('Comment dit-on cela ?')).toBe(false)
  })

  it('refuse une phrase mixte plutôt que de parier', () => {
    expect(isEnglish('Le prétérit de « buy » est bought')).toBe(false)
  })

  it('ne se laisse pas piéger par les mots communs aux deux langues', () => {
    // « on », « son », « pas », « a », « note » existent dans les deux
    // langues : ils ne doivent jamais faire basculer la décision.
    expect(isEnglish('Put the bags on the seats')).toBe(true)
    expect(isEnglish('I have a note for his son')).toBe(true)
  })

  it('se tait sur un mot isolé, faute d’indice', () => {
    // « bought » est anglais, mais rien dans la chaîne ne le prouve : un
    // mot seul peut appartenir aux deux langues (« relance », « note »).
    expect(isEnglish('bought')).toBe(false)
    expect(isEnglish('')).toBe(false)
  })
})

describe('quotedSegments — extraire les citations', () => {
  it('lit les guillemets français', () => {
    expect(quotedSegments('Complète : « Hello, ___ are you? » (Bonjour)'))
      .toEqual(['Hello, ___ are you?'])
  })

  it('accepte plusieurs citations', () => {
    expect(quotedSegments('« Since » + point de départ, « for » + durée'))
      .toEqual(['Since', 'for'])
  })

  it('retombe sur les guillemets droits', () => {
    expect(quotedSegments('Complète : "She is here"')).toEqual(['She is here'])
  })

  it('renvoie une liste vide sans citation', () => {
    expect(quotedSegments('Quelle heure est-il ? — 10:45')).toEqual([])
    expect(quotedSegments(null)).toEqual([])
  })
})

describe('fillBlank — compléter le trou', () => {
  it('remplace le trou par la réponse', () => {
    expect(fillBlank('Hello, ___ are you?', 'how')).toBe('Hello, how are you?')
  })

  it('laisse la phrase intacte sans réponse', () => {
    expect(fillBlank('Hello, ___ are you?', '')).toBe('Hello, ___ are you?')
  })
})

const qcmFrench = { type: 'qcm', question: "Comment dit-on « Je m'appelle Marie » ?", correct_answer: 'My name is Marie' }
const qcmEnglish = { type: 'qcm', question: 'Choisis la forme correcte : « She ___ a new car. »', correct_answer: 'has' }
const gap = { type: 'trous', question: 'Complète : « Hello, ___ are you? » (Bonjour, comment vas-tu ?)', correct_answer: 'how' }
const translation = { type: 'traduction', question: "Traduis en anglais : « J'ai vingt ans. »", correct_answer: 'I am twenty years old' }
const dictation = { type: 'ecoute', question: 'Écris ce que tu entends', correct_answer: 'The train leaves at nine' }
const speaking = { type: 'oral', question: 'Lis à voix haute', correct_answer: 'This is my mother' }

describe('englishToSpeak — le défaut d’origine', () => {
  it('NE LIT PLUS l’énoncé français d’un QCM', () => {
    // Le défaut corrigé : « Comment dit-on "ma tante" ? » était lu par la
    // voix anglaise. C'est le test central de ce fichier.
    expect(englishToSpeak(qcmFrench, { revealed: false })).toBe(null)
    expect(englishToSpeak(qcmFrench, { revealed: true })).toBe(null)
  })

  it('lit l’anglais cité dans un QCM', () => {
    expect(englishToSpeak(qcmEnglish, { revealed: true })).toBe('She has a new car.')
  })
})

describe('englishToSpeak — ne jamais donner la réponse', () => {
  it('se tait sur une traduction tant qu’elle n’est pas validée', () => {
    // Sinon l'exercice se résout en un appui : on entend la réponse.
    expect(englishToSpeak(translation, { revealed: false })).toBe(null)
  })

  it('lit la traduction une fois validée', () => {
    expect(englishToSpeak(translation, { revealed: true })).toBe('I am twenty years old')
  })

  it('ne comble pas le trou avant validation', () => {
    expect(englishToSpeak(gap, { revealed: false })).toBe(null)
  })

  it('comble le trou après validation', () => {
    expect(englishToSpeak(gap, { revealed: true })).toBe('Hello, how are you?')
  })
})

describe('englishToSpeak — les phrases qui sont l’exercice même', () => {
  it('lit toujours la dictée : sans le son, il n’y a pas de question', () => {
    expect(englishToSpeak(dictation, { revealed: false })).toBe('The train leaves at nine')
  })

  it('lit toujours le modèle de l’exercice oral', () => {
    // La phrase est affichée à l'écran de toute façon : le travail est de
    // la prononcer, pas de la deviner.
    expect(englishToSpeak(speaking, { revealed: false })).toBe('This is my mother')
  })
})

describe('englishToSpeak — robustesse', () => {
  it('ne plante pas sur un exercice absent ou incomplet', () => {
    expect(englishToSpeak(null)).toBe(null)
    expect(englishToSpeak({ type: 'qcm' })).toBe(null)
    expect(englishToSpeak({ type: 'traduction' }, { revealed: true })).toBe(null)
  })

  it('préfère la citation la plus longue quand il y en a plusieurs', () => {
    const ex = {
      type: 'qcm',
      question: 'Complète avec « for » ou « I have been here for two years » ?',
      correct_answer: 'for'
    }
    expect(englishToSpeak(ex, { revealed: true })).toBe('I have been here for two years')
  })

  it('se tait plutôt que de lire un trou impossible à combler', () => {
    const ex = { type: 'trous', question: 'Complète : « I ___ here. »', correct_answer: '' }
    expect(englishToSpeak(ex, { revealed: true })).toBe(null)
  })
})
