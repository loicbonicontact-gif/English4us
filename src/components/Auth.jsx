import { Link } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../supabaseClient'
import Mascot from './Mascot'

// Traduit les erreurs Supabase (anglais) en messages clairs en français.
function translateAuthError(message = '') {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'E-mail ou mot de passe incorrect.'
  if (m.includes('user already registered')) return 'Un compte existe déjà avec cet e-mail. Essaie de te connecter.'
  if (m.includes('password should be at least')) return 'Le mot de passe doit contenir au moins 6 caractères.'
  if (m.includes('unable to validate email')) return "Cette adresse e-mail n'est pas valide."
  if (m.includes('email not confirmed')) return 'Confirme ton e-mail avant de te connecter (vérifie ta boîte de réception).'
  if (m.includes('rate limit') || m.includes('too many')) return 'Trop de tentatives. Patiente une minute avant de réessayer.'
  if (m.includes('failed to fetch') || m.includes('networkerror')) return 'Connexion au serveur impossible. Vérifie ta connexion internet.'
  return message || 'Une erreur inattendue est survenue.'
}

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  const isSignup = mode === 'signup'

  function switchMode() {
    setMode(isSignup ? 'login' : 'signup')
    setError(null)
    setInfo(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setInfo(null)

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)
    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          // Le pseudo transite par les métadonnées : le profil est créé
          // à la première session valide (voir ensureProfile dans App.jsx).
          options: { data: { username: username.trim() } }
        })
        if (signUpError) throw signUpError

        // Pas de session => Supabase attend une confirmation par email.
        if (!data.session) {
          setInfo("Compte créé. Ouvre ta boîte mail et clique sur le lien de confirmation, puis reviens te connecter.")
          setMode('login')
        }
        // Si une session existe, App.jsx détecte le changement et bascule sur le tableau de bord.
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
      }
    } catch (err) {
      setError(translateAuthError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <Mascot mood={loading ? 'thinking' : 'idle'} size={110} />
          <h1>English4us</h1>
          <p className="auth-tagline">Apprends l'anglais gratuitement, de A1 à C2.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <label className="field">
              <span className="field-label">Pseudo</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ton pseudo public"
                autoComplete="nickname"
                maxLength={20}
              />
              <span className="field-hint">Ton nom dans l'application. Laisse vide pour en générer un.</span>
            </label>
          )}

          <label className="field">
            <span className="field-label">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="toi@exemple.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 caractères minimum"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              required
            />
          </label>

          {error && <p className="alert alert-error" role="alert">{error}</p>}
          {info && <p className="alert alert-info" role="status">{info}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Un instant…' : isSignup ? 'Créer mon compte' : 'Se connecter'}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? 'Tu as déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button type="button" className="btn-link" onClick={switchMode}>
            {isSignup ? 'Se connecter' : "S'inscrire"}
          </button>
        </p>

        {/* Le lien doit etre ICI, avant la creation du compte : c'est le
            moment ou l'on decide de confier son adresse e-mail. Le reporter
            au profil reviendrait a informer apres coup. */}
        <p className="auth-legal">
          En créant un compte, tu acceptes que ta progression soit enregistrée.{' '}
          <Link to="/confidentialite" className="btn-link">Confidentialité</Link>
          {' · '}Moins de 15 ans : demande à un parent.
        </p>
      </div>
    </div>
  )
}
