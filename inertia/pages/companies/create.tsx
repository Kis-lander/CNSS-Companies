import { Form } from '@adonisjs/inertia/react'

type CreateCompanyProps = {
  companiesCount: number
}

export default function CreateCompany({ companiesCount }: CreateCompanyProps) {
  return (
    <div className="companies-page">
      <section className="companies-toolbar">
        <div>
          <p className="eyebrow">Gestion CNSS</p>
          <h1>Enregistrer une entreprise</h1>
        </div>
        <div className="toolbar-actions">
          <a href="/companies" className="button-link">
            Voir la liste
          </a>
          <div className="company-count">
            <strong>{companiesCount}</strong>
            <span>{companiesCount > 1 ? 'entreprises' : 'entreprise'}</span>
          </div>
        </div>
      </section>

      <section className="registration-workspace registration-form-workspace">
        <aside className="company-panel">
          <h2>Nouvelle entreprise</h2>
          <Form route="companies.store" encType="multipart/form-data">
            {({ errors, processing }) => (
              <>
                <div>
                  <label htmlFor="name">Nom de l'entreprise</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Ex: CNSS Kinshasa"
                    data-invalid={errors.name ? 'true' : undefined}
                  />
                  {errors.name && <div>{errors.name}</div>}
                </div>

                <div>
                  <label htmlFor="address">Adresse</label>
                  <textarea
                    name="address"
                    id="address"
                    rows={4}
                    placeholder="Ex: Renseigner l'adresse complète de l'entreprise"
                    data-invalid={errors.address ? 'true' : undefined}
                  />
                  {errors.address && <div>{errors.address}</div>}
                </div>

                <div>
                  <label htmlFor="phone">Numéro de téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="Ex: +243 812 345 678"
                    data-invalid={errors.phone ? 'true' : undefined}
                  />
                  {errors.phone && <div>{errors.phone}</div>}
                </div>

                <div>
                  <label htmlFor="affiliationNumber">Numéro d'affiliation</label>
                  <input
                    type="text"
                    name="affiliationNumber"
                    id="affiliationNumber"
                    placeholder="Ex: AFF-2026-001"
                    data-invalid={errors.affiliationNumber ? 'true' : undefined}
                  />
                  {errors.affiliationNumber && <div>{errors.affiliationNumber}</div>}
                </div>

                <div>
                  <label htmlFor="image">Image de l'entreprise</label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/png,image/jpeg,image/webp"
                  />
                </div>

                <button type="submit" className="company-submit-button" disabled={processing}>
                  {processing ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </>
            )}
          </Form>
        </aside>
      </section>
    </div>
  )
}
