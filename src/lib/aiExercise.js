// Génération dynamique d'exercices adaptés au niveau CECRL via API IA
// Nécessite une clé API (Claude ou OpenAI) côté backend — NE JAMAIS exposer la clé côté client en prod.
// En développement, passer par une fonction serverless (Vercel/Netlify Function) qui relaie l'appel.

export async function generateExercise(level, theme) {
  const prompt = `Génère un exercice d'anglais niveau CECRL ${level} sur le thème "${theme}".
Réponds UNIQUEMENT en JSON strict, sans texte autour, avec ce format :
{
  "type": "qcm",
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "correct_answer": "...",
  "explanation": "..."
}`

  const response = await fetch('/api/generate-exercise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la génération de l\'exercice IA')
  }

  const data = await response.json()
  return JSON.parse(data.result)
}
