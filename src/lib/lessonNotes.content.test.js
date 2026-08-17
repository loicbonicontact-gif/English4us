import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { readExamples } from './lessonNotes'
import { isEnglish } from './spoken'

// ============================================
// Les 30 fiches RÉELLES, relues automatiquement
//
// Une faute de langue dans une fiche est plus grave que dans un exercice :
// la fiche est ce qu'on lit AVANT, en confiance, pour comprendre la règle.
// Un exemple « anglais » qui serait en fait du français y passerait inaperçu
// jusqu'à ce qu'un apprenant l'apprenne par cœur.
//
// D'où le contrôle central ici : chaque exemple est passé au test de langue
// déjà écrit pour la prononciation (lib/spoken). Le côté `en` doit être de
// l'anglais sûr, le côté `fr` ne doit surtout pas l'être.
// ============================================

const SQL = new URL('../../supabase/seed-lesson-notes.sql', import.meta.url)

function splitValues(line) {
  const parts = []
  let buf = ''
  let inString = false

  for (let k = 0; k < line.length; k++) {
    const c = line[k]
    if (inString) {
      if (c === "'") {
        if (line[k + 1] === "'") { buf += "'"; k++; continue }
        inString = false
        continue
      }
      buf += c
    } else if (c === "'") {
      inString = true
    } else if (c === ',') {
      parts.push(buf.trim()); buf = ''
    } else {
      buf += c
    }
  }
  parts.push(buf.trim())
  return parts
}

function readNotes() {
  const text = readFileSync(SQL, 'utf8')
  const out = []
  let lessonLabel = null

  for (const raw of text.split('\n')) {
    const line = raw.trim()

    // Les commentaires portent le titre de la leçon : « -- A1.1 Se présenter »
    if (line.startsWith('--') && /^-- [A-C][12]\.\d /.test(line)) {
      lessonLabel = line.slice(3).trim()
      continue
    }

    if (!line.startsWith('(')) continue
    const body = line.replace(/^\(/, '').replace(/\)[,;]?$/, '')
    const [lessonId, title, rule, examples, pitfall] = splitValues(body)
    if (!/^\d+$/.test(lessonId)) continue

    out.push({
      lesson_id: Number(lessonId),
      lessonLabel,
      title,
      rule,
      examples: readExamples(examples),
      pitfall
    })
  }

  return out
}

const NOTES = readNotes()

describe('seed-lesson-notes.sql — les 30 fiches', () => {
  it('couvre chaque leçon une fois et une seule', () => {
    expect(NOTES).toHaveLength(30)
    const ids = NOTES.map((n) => n.lesson_id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 30 }, (_, i) => i + 1))
  })

  it('annonce la règle au lieu de répéter le titre de la leçon', () => {
    // « Se présenter » → « Dire son nom et son âge ». Un titre qui recopie
    // celui de la leçon n'apprend rien de plus que la ligne du parcours.
    for (const note of NOTES) {
      const lessonTitle = (note.lessonLabel || '').replace(/^[A-C][12]\.\d\s+/, '')
      expect(note.title.toLowerCase(), note.lessonLabel).not.toBe(lessonTitle.toLowerCase())
    }
  })

  it('tient en deux à quatre phrases', () => {
    // Une fiche qu'on ne lit pas ne sert à rien. La borne haute est le vrai
    // garde-fou : c'est vers le long qu'on dérive en écrivant.
    for (const note of NOTES) {
      expect(note.rule.length, note.title).toBeGreaterThan(80)
      expect(note.rule.length, note.title).toBeLessThan(460)
    }
  })

  it('nomme toujours le piège du francophone', () => {
    for (const note of NOTES) {
      expect(note.pitfall.length, note.title).toBeGreaterThan(40)
    }
  })

  it('donne au moins trois exemples, tous traduits', () => {
    for (const note of NOTES) {
      expect(note.examples.length, note.title).toBeGreaterThanOrEqual(3)
      for (const example of note.examples) {
        expect(example.fr, `${note.title} → ${example.en}`).not.toBe('')
      }
    }
  })
})

describe('la langue de chaque exemple', () => {
  it('le côté anglais est sûrement de l’anglais', () => {
    // Même test que celui qui décide ce que la voix anglaise a le droit de
    // lire : il exige un indice anglais ET aucun indice français.
    for (const note of NOTES) {
      for (const example of note.examples) {
        expect(isEnglish(example.en), `${note.title} → « ${example.en} »`).toBe(true)
      }
    }
  })

  it('le côté français n’est jamais pris pour de l’anglais', () => {
    // L'erreur qu'on cherche : les deux colonnes inversées à la saisie.
    //
    // On vérifie seulement que le français n'est PAS reconnu comme anglais,
    // et non qu'il porte un indice français. Une première version exigeait
    // les deux ; elle a échoué sur « On parle anglais ici. », qui ne contient
    // aucun marqueur de la liste — « on » en est volontairement exclu, car il
    // existe aussi en anglais (voir lib/spoken). La phrase est pourtant du
    // français parfait : c'était l'assertion qui était trop stricte.
    //
    // Le contrôle reste suffisant : si les deux colonnes étaient inversées,
    // le côté `en` porterait du français et le test précédent le dirait.
    for (const note of NOTES) {
      for (const example of note.examples) {
        expect(isEnglish(example.fr), `${note.title} → « ${example.fr} »`).toBe(false)
        expect(example.fr, note.title).not.toBe(example.en)
      }
    }
  })
})
