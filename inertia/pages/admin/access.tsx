import { Form } from '@adonisjs/inertia/react'

type AccessUser = {
  id: number
  fullName: string | null
  email: string
  role: 'admin' | 'manager' | 'viewer'
}

type AccessProps = {
  users: AccessUser[]
}

const roleLabels = {
  admin: 'Administrateur CNSS',
  manager: 'Gestion entreprises',
  viewer: 'Consultation',
}

export default function Access({ users }: AccessProps) {
  return (
    <div className="companies-page">
      <section className="companies-toolbar">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Gérer les accès</h1>
        </div>
        <div className="toolbar-actions">
          <a href="/" className="button-link button-link-secondary">
            Accueil
          </a>
        </div>
      </section>

      <section className="access-workspace">
        <aside className="company-panel access-form-panel">
          <h2>Donner le droit de gestion</h2>
          <Form action={{ url: '/admin/access', method: 'post' }}>
            {({ errors, processing }) => (
              <>
                <div>
                  <label htmlFor="fullName">Nom complet</label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    data-invalid={errors.fullName ? 'true' : undefined}
                  />
                  {errors.fullName && <div>{errors.fullName}</div>}
                </div>

                <div>
                  <label htmlFor="email">Adresse email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    data-invalid={errors.email ? 'true' : undefined}
                  />
                  {errors.email && <div>{errors.email}</div>}
                </div>

                <div>
                  <label htmlFor="password">Mot de passe temporaire</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="new-password"
                    data-invalid={errors.password ? 'true' : undefined}
                  />
                  {errors.password && <div>{errors.password}</div>}
                </div>

                <div>
                  <label htmlFor="passwordConfirmation">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    name="passwordConfirmation"
                    id="passwordConfirmation"
                    autoComplete="new-password"
                    data-invalid={errors.passwordConfirmation ? 'true' : undefined}
                  />
                  {errors.passwordConfirmation && <div>{errors.passwordConfirmation}</div>}
                </div>

                <button type="submit" className="company-submit-button" disabled={processing}>
                  {processing ? 'Enregistrement...' : 'Accorder le droit'}
                </button>
              </>
            )}
          </Form>
        </aside>

        <section className="company-edit-panel access-users-panel">
          <h2>Utilisateurs</h2>
          <div className="access-list">
            {users.map((user) => (
              <article className="access-row" key={user.id}>
                <div>
                  <strong>{user.fullName || user.email}</strong>
                  <span>{user.email}</span>
                  <small>{roleLabels[user.role]}</small>
                </div>
                <div className="access-actions">
                  {user.role === 'manager' && (
                    <Form action={{ url: `/admin/access/${user.id}/revoke`, method: 'post' }}>
                      {({ processing }) => (
                        <button type="submit" className="button-link button-link-secondary" disabled={processing}>
                          Retirer
                        </button>
                      )}
                    </Form>
                  )}
                  {user.role !== 'admin' && (
                    <Form action={{ url: `/admin/access/${user.id}/delete`, method: 'post' }}>
                      {({ processing }) => (
                        <button type="submit" className="button-link button-link-danger" disabled={processing}>
                          Supprimer
                        </button>
                      )}
                    </Form>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  )
}
