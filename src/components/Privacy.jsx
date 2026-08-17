import { useNavigate } from 'react-router-dom'

// Politique de confidentialité.
//
// POURQUOI CET ÉCRAN EXISTE
// L'application collecte une adresse e-mail, un pseudo, une progression et,
// pour les exercices de prononciation, de la voix. Sans ce document, aucune
// des obligations d'information du RGPD n'était remplie — pas une.
//
// CE QU'IL RESTE À COMPLÉTER PAR LOÏC
// Les deux valeurs marquées CONTACT_* ci-dessous. Elles ne peuvent pas être
// inventées : ce sont les coordonnées du responsable de traitement, et un
// document qui donne une fausse adresse est pire qu'un document absent.
//
// Ce texte a été écrit à partir de ce que le code fait RÉELLEMENT, table par
// table. Il ne remplace pas l'avis d'un juriste.

// ⚠️ À REMPLACER avant toute mise en ligne publique.
const CONTACT_EMAIL = 'à-compléter@exemple.fr'
const RESPONSABLE = 'Loïc Boni'

export default function Privacy() {
  const navigate = useNavigate()

  return (
    <div className="legal-screen">
      <h1 className="legal-title">Politique de confidentialité</h1>
      <p className="legal-updated">Dernière mise à jour : 17 août 2026</p>

      <section className="legal-block">
        <h2>Qui est responsable de tes données</h2>
        <p>
          {RESPONSABLE}, éditeur d'English4us. Pour toute question ou pour
          exercer tes droits : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section className="legal-block">
        <h2>Ce que nous collectons, et pourquoi</h2>
        <table className="legal-table">
          <thead>
            <tr><th>Donnée</th><th>Pourquoi</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Adresse e-mail et mot de passe</td>
              <td>Créer ton compte et te reconnecter. Le mot de passe n'est jamais lisible, même par nous.</td>
            </tr>
            <tr>
              <td>Pseudo</td>
              <td>T'identifier dans l'application.</td>
            </tr>
            <tr>
              <td>Progression : leçons terminées, scores, XP, série, exercices à revoir</td>
              <td>Faire fonctionner le parcours et la révision espacée. Sans elles, l'application ne peut pas savoir où tu en es.</td>
            </tr>
            <tr>
              <td>Note sur 5 (facultative)</td>
              <td>Savoir si l'application est utile. Tu peux la retirer à tout moment depuis ton profil.</td>
            </tr>
            <tr>
              <td>Ta voix, pendant un exercice de prononciation</td>
              <td>Comparer ce que tu prononces à la phrase attendue. Voir la section « Ta voix » ci-dessous.</td>
            </tr>
            <tr>
              <td>Une adresse d'abonnement, si tu actives les rappels (facultatif)</td>
              <td>T'envoyer un rappel par jour. Supprimée dès que tu coupes les rappels.</td>
            </tr>
          </tbody>
        </table>
        <p>
          Nous ne collectons rien d'autre : ni publicité, ni traceur, ni mesure
          d'audience, ni revente de quoi que ce soit à qui que ce soit.
        </p>
      </section>

      <section className="legal-block">
        <h2>Sur quelle base légale</h2>
        <p>
          L'exécution du service que tu demandes, pour le compte et la
          progression : sans ces données, l'application ne peut pas fonctionner.
          Pour la note sur 5, ton consentement — d'où le fait qu'elle soit
          facultative et retirable.
        </p>
      </section>

      <section className="legal-block">
        <h2>Ta voix</h2>
        <p>
          Les exercices de prononciation utilisent la reconnaissance vocale de
          ton navigateur. Aucun enregistrement n'est conservé ni envoyé à nos
          serveurs : nous ne recevons que le texte reconnu, le temps de le
          comparer à la phrase attendue.
        </p>
        <p>
          <b>Attention :</b> selon le navigateur, ce traitement n'a pas lieu sur
          ton appareil. Google Chrome, en particulier, transmet l'audio à ses
          propres serveurs pour le reconnaître. Si cela te gêne, n'utilise pas
          les exercices de prononciation, ou utilise un navigateur qui traite la
          voix localement. Les exercices oraux ne sont jamais obligatoires.
        </p>
      </section>

      <section className="legal-block">
        <h2>Les rappels quotidiens</h2>
        <p>
          Si tu actives les rappels, ton navigateur crée une adresse
          d'abonnement que nous conservons pour pouvoir t'envoyer un message
          par jour, à 18 h. Cette adresse ne contient ni ton nom ni ton
          e-mail, mais elle permet d'écrire sur ton écran : nous la protégeons
          comme le reste.
        </p>
        <p>
          Rien n'est envoyé les jours où tu t'es déjà entraîné. Tu peux couper
          les rappels à tout moment depuis ton profil : l'abonnement est alors
          supprimé, pas seulement désactivé.
        </p>
      </section>

      <section className="legal-block">
        <h2>Où sont tes données</h2>
        <p>
          Chez Supabase, dans un centre de données situé en Irlande, donc dans
          l'Union européenne. Aucun transfert hors de l'Union n'est organisé
          pour la base de données. L'hébergement du site est assuré par Vercel.
        </p>
      </section>

      <section className="legal-block">
        <h2>Combien de temps</h2>
        <p>
          Tant que ton compte existe. Si tu ne te connectes plus pendant trois
          ans, ton compte et tout ce qu'il contient sont supprimés. Tu peux
          aussi demander leur suppression immédiate à tout moment.
        </p>
      </section>

      <section className="legal-block">
        <h2>Si tu as moins de 15 ans</h2>
        <p>
          En France, en dessous de 15 ans, l'accord d'un parent ou du titulaire
          de l'autorité parentale est nécessaire en plus du tien. Parles-en à un
          adulte avant de créer un compte. Un parent peut nous écrire à l'adresse
          ci-dessus pour consulter ou faire supprimer le compte de son enfant.
        </p>
      </section>

      <section className="legal-block">
        <h2>Tes droits</h2>
        <p>
          Tu peux à tout moment demander à consulter tes données, les corriger,
          les faire supprimer, ou t'opposer à leur utilisation. Écris à
          l'adresse ci-dessus ; nous répondons sous un mois.
        </p>
        <p>
          Si la réponse ne te convient pas, tu peux saisir la CNIL, l'autorité
          française de protection des données :{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer noopener">www.cnil.fr</a>.
        </p>
      </section>

      <section className="legal-block">
        <h2>Sécurité</h2>
        <p>
          Les échanges sont chiffrés. Chaque compte ne peut lire et modifier que
          ses propres données : cette règle est appliquée par la base de données
          elle-même, et non par l'application — elle tient donc même en cas de
          défaut du site.
        </p>
      </section>

      <button type="button" className="btn-wide is-dark" onClick={() => navigate(-1)}>
        Retour
      </button>
    </div>
  )
}
