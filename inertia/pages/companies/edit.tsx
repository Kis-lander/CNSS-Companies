import { Form } from '@adonisjs/inertia/react'
import { useMemo, useState } from 'react'

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

type EditCompanyProps = {
  companies: Company[]
  selectedCompanyId: number | null
}

export default function EditCompany({ companies, selectedCompanyId }: EditCompanyProps) {
  const [selectedId, setSelectedId] = useState<number | null>(selectedCompanyId)
  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === selectedId) ?? null,
    [companies, selectedId]
  )

  return (
    <div className="companies-page">
      <section className="companies-toolbar">
        <div>
          <p className="eyebrow">Modification</p>
          <h1>Modifier une entreprise</h1>
        </div>
        <div className="toolbar-actions">
          <a
            href={selectedCompany ? `/companies/${selectedCompany.id}` : '/companies'}
            className="button-link button-link-secondary"
          >
            Annuler
          </a>
        </div>
      </section>

      <section className="company-edit-workspace">
        <aside className="company-selector-panel">
          <label htmlFor="company">Entreprise</label>
          <select
            id="company"
            value={selectedId ?? ''}
            onChange={(event) => setSelectedId(Number(event.target.value))}
          >
            {companies.length === 0 ? (
              <option value="">Aucune entreprise enregistrée</option>
            ) : (
              <>
                <option value="">Sélectionner une entreprise</option>
                {companies.map((company) => (
                  <option value={company.id} key={company.id}>
                    {company.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </aside>

        {selectedCompany && (
          <section className="company-edit-panel">
            <Form
              key={selectedCompany.id}
              action={{ url: `/companies/${selectedCompany.id}`, method: 'post' }}
              encType="multipart/form-data"
            >
              {({ errors, processing }) => (
                <>
                  <div className="company-edit-preview">
                    {selectedCompany.image ? (
                      <img src={selectedCompany.image} alt={selectedCompany.name} />
                    ) : (
                      <div className="company-detail-placeholder">Image</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="name">Nom de l'entreprise</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={selectedCompany.name}
                      data-invalid={errors.name ? 'true' : undefined}
                    />
                    {errors.name && <div>{errors.name}</div>}
                  </div>

                  <div>
                    <label htmlFor="address">Adresse</label>
                    <textarea
                      name="address"
                      id="address"
                      rows={5}
                      defaultValue={selectedCompany.address}
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
                      defaultValue={selectedCompany.phone ?? ''}
                      placeholder="Ex. : +243 812 345 678"
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
                      defaultValue={selectedCompany.affiliationNumber ?? ''}
                      placeholder="Ex. : AFF-2026-001"
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

                  <div className="coordinate-grid">
                    <div>
                      <label htmlFor="latitude">Latitude</label>
                      <input
                        type="number"
                        name="latitude"
                        id="latitude"
                        step="any"
                        min="-90"
                        max="90"
                        defaultValue={selectedCompany.latitude ?? ''}
                        data-invalid={errors.latitude ? 'true' : undefined}
                      />
                      {errors.latitude && <div>{errors.latitude}</div>}
                    </div>

                    <div>
                      <label htmlFor="longitude">Longitude</label>
                      <input
                        type="number"
                        name="longitude"
                        id="longitude"
                        step="any"
                        min="-180"
                        max="180"
                        defaultValue={selectedCompany.longitude ?? ''}
                        data-invalid={errors.longitude ? 'true' : undefined}
                      />
                      {errors.longitude && <div>{errors.longitude}</div>}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="company-submit-button" disabled={processing}>
                      {processing ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    <a
                      href={`/companies/${selectedCompany.id}`}
                      className="button-link button-link-secondary"
                    >
                      Annuler
                    </a>
                  </div>
                </>
              )}
            </Form>
          </section>
        )}
      </section>
    </div>
  )
}
