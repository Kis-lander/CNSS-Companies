import { usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import { Data } from '@generated/data'

type Company = {
  id: number
  name: string
  address: string
  phone: string | null
  affiliationNumber: string | null
  image: string | null
  latitude: number | null
  longitude: number | null
}

type CompaniesIndexProps = {
  companies: Company[]
}

export default function CompaniesIndex({ companies }: CompaniesIndexProps) {
  const page = usePage<
    Data.SharedProps & { user?: Data.SharedProps['user'] & { canManageCompanies?: boolean } }
  >()
  const [search, setSearch] = useState('')
  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return companies
    }

    return companies.filter((company) => {
      return (
        company.name.toLowerCase().includes(query) ||
        company.address.toLowerCase().includes(query) ||
        (company.affiliationNumber?.toLowerCase().includes(query) ?? false)
      )
    })
  }, [companies, search])

  return (
    <div className="companies-page">
      <section className="companies-toolbar">
        <div>
          <p className="eyebrow">Gestion CNSS</p>
          <h1>Entreprises enregistrées</h1>
        </div>
        <div className="toolbar-actions">
          <input
            className="company-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une entreprise"
            aria-label="Rechercher une entreprise par nom, adresse ou numéro d'affiliation"
          />
          {page.props.user?.canManageCompanies && (
            <a href="/companies/create" className="button-link">
              Nouvelle entreprise
            </a>
          )}
          <div className="company-count">
            <strong>{companies.length}</strong>
            <span>{companies.length > 1 ? 'entreprises' : 'entreprise'}</span>
          </div>
        </div>
      </section>

      <section className="company-list" aria-label="Liste des entreprises">
        {companies.length === 0 ? (
          <div className="empty-state">
            <h2>Aucune entreprise enregistrée</h2>
            <p>
              Le formulaire d'enregistrement permet d'ajouter le nom, l'adresse, les coordonnées et
              l'image.
            </p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="empty-state">
            <h2>Aucun résultat</h2>
            <p>Aucune entreprise ne correspond à cette recherche.</p>
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <a
              className="company-card company-card-link"
              href={`/companies/${company.id}`}
              key={company.id}
            >
              {company.image ? (
                <img src={company.image} alt={company.name} />
              ) : (
                <div className="company-image-placeholder">Image</div>
              )}
              <div>
                <h3>{company.name}</h3>
                <p>{company.address}</p>
                {company.affiliationNumber && <p>{company.affiliationNumber}</p>}
                {company.phone && <p>{company.phone}</p>}
                <span>
                  {company.latitude !== null && company.longitude !== null
                    ? `${company.latitude.toFixed(5)}, ${company.longitude.toFixed(5)}`
                    : 'Coordonnées en attente'}
                </span>
              </div>
            </a>
          ))
        )}
      </section>
    </div>
  )
}
