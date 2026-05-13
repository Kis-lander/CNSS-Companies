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

type HomeProps = {
  companiesCount: number
  companies: Company[]
}

export default function Home({ companiesCount, companies = [] }: HomeProps) {
  const page = usePage<
    Data.SharedProps & { user?: Data.SharedProps['user'] & { canManageCompanies?: boolean } }
  >()
  const [search, setSearch] = useState('')
  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return companies.slice(0, 6)
    }

    return companies
      .filter((company) => {
        return (
          company.name.toLowerCase().includes(query) ||
          company.address.toLowerCase().includes(query) ||
          (company.affiliationNumber?.toLowerCase().includes(query) ?? false)
        )
      })
      .slice(0, 8)
  }, [companies, search])

  return (
    <div className="companies-page">
      <section className="companies-toolbar">
        <div>
          <p className="eyebrow">Gestion CNSS</p>
          <h1>Localiser une entreprise</h1>
        </div>
        <div className="toolbar-actions">
          <a href="/companies" className="button-link">
            Voir la liste
          </a>
          {page.props.user?.canManageCompanies && (
            <a href="/companies/create" className="button-link button-link-secondary">
              Nouvelle entreprise
            </a>
          )}
          <div className="company-count">
            <strong>{companiesCount}</strong>
            <span>{companiesCount > 1 ? 'entreprises' : 'entreprise'}</span>
          </div>
        </div>
      </section>

      <section className="home-workspace">
        <aside className="home-search-panel">
          <h2>Rechercher une entreprise</h2>
          <label htmlFor="company-search">Nom, adresse ou numéro d'affiliation</label>
          <input
            id="company-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ex. : CNSS Kinshasa"
          />

          <div className="home-company-results">
            {companies.length === 0 ? (
              <div className="home-empty-result">Aucune entreprise enregistrée.</div>
            ) : filteredCompanies.length === 0 ? (
              <div className="home-empty-result">Aucune entreprise trouvée.</div>
            ) : (
              filteredCompanies.map((company) => (
                <a
                  href={`/companies/${company.id}`}
                  className="home-company-option"
                  key={company.id}
                >
                  {company.image ? (
                    <img src={company.image} alt={company.name} />
                  ) : (
                    <div className="company-image-placeholder">Image</div>
                  )}
                  <span>
                    <strong>{company.name}</strong>
                    <small>{company.address}</small>
                    {company.affiliationNumber && <small>{company.affiliationNumber}</small>}
                    {company.phone && <small>{company.phone}</small>}
                  </span>
                </a>
              ))
            )}
          </div>
        </aside>

        <section className="home-image-panel" aria-label="Illustration CNSS">
          <img
            src="https://deskeco.com/sites/default/files/styles/1024x578/public/2025-06/cnss.jpg?itok=OIkravJV"
            alt="Bâtiment de la CNSS"
          />
        </section>
      </section>
    </div>
  )
}
