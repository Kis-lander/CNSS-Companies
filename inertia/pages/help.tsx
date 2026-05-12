import { usePage } from '@inertiajs/react'
import { Data } from '@generated/data'

const adminHelpSteps = [
  {
    title: 'Enregistrer une entreprise',
    text: "Ajoutez le nom, l'adresse, le numéro de téléphone et l'image. L'application cherche automatiquement les coordonnées à partir de l'adresse.",
  },
  {
    title: "Rechercher depuis l'accueil",
    text: "Utilisez le champ de recherche pour retrouver une entreprise par nom ou adresse, puis ouvrez sa fiche de localisation.",
  },
  {
    title: 'Consulter la carte',
    text: "La fiche entreprise affiche l'image, les informations enregistrées et la position sur la carte quand les coordonnées sont disponibles.",
  },
  {
    title: 'Modifier les informations',
    text: "Mettez à jour le nom, l'adresse, le téléphone ou l'image. Si l'adresse change, les coordonnées peuvent être recalculées automatiquement.",
  },
]

const userHelpSteps = [
  {
    title: "Rechercher depuis l'accueil",
    text: "Utilisez le champ de recherche pour retrouver une entreprise par nom ou adresse, puis ouvrez sa fiche de localisation.",
  },
  {
    title: 'Consulter la localisation',
    text: "La fiche entreprise affiche l'image, les informations disponibles et la position sur la carte quand les coordonnées sont disponibles.",
  },
]

export default function Help() {
  const page = usePage<Data.SharedProps & { user?: Data.SharedProps['user'] & { canManageCompanies?: boolean } }>()
  const canManageCompanies = Boolean(page.props.user?.canManageCompanies)
  const helpSteps = canManageCompanies ? adminHelpSteps : userHelpSteps

  return (
    <div className="companies-page">
      <section className="companies-toolbar">
        <div>
          <p className="eyebrow">Aide</p>
          <h1>Comment utiliser l'application</h1>
        </div>
        <div className="toolbar-actions">
          <a href="/" className="button-link button-link-secondary">
            Accueil
          </a>
          {canManageCompanies && (
            <a href="/companies/create" className="button-link">
              Enregistrer
            </a>
          )}
        </div>
      </section>

      <section className="help-grid">
        {helpSteps.map((step, index) => (
          <article className="help-card" key={step.title}>
            <span>{index + 1}</span>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </article>
        ))}
      </section>

      <section className="help-note">
        {canManageCompanies ? (
          <>
            <h2>Conseil pour les adresses</h2>
            <p>
              Utilisez un format précis comme: 11, Avenue Lubefu, Ngaliema, Kinshasa, RDC. Plus l'adresse est complète,
              plus la localisation automatique a de chances de trouver une position correcte.
            </p>
          </>
        ) : (
          <>
            <h2>Conseil de recherche</h2>
            <p>
              Saisissez quelques lettres du nom ou de l'adresse. Si l'entreprise existe dans la base, ouvrez sa fiche
              pour consulter sa position.
            </p>
          </>
        )}
      </section>
    </div>
  )
}
