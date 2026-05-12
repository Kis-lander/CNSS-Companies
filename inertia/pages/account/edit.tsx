import { Form } from '@adonisjs/inertia/react'

type AccountEditProps = {
  account: {
    fullName: string | null
    email: string
  }
}

export default function EditAccount({ account }: AccountEditProps) {
  return (
    <div className="form-container">
      <div>
        <h1>Éditer le compte administrateur</h1>
        <p>Modifier les informations du compte administrateur CNSS.</p>
      </div>

      <div>
        <Form action={{ url: '/account', method: 'post' }}>
          {({ processing }) => (
            <>
              <div>
                <label htmlFor="fullName">Nom complet</label>
                <input type="text" name="fullName" id="fullName" defaultValue={account.fullName ?? ''} />
              </div>

              <div>
                <label htmlFor="email">Adresse email</label>
                <input type="email" name="email" id="email" defaultValue={account.email} autoComplete="email" />
              </div>

              <div>
                <label htmlFor="currentPassword">Mot de passe actuel</label>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div>
                <label htmlFor="password">Nouveau mot de passe</label>
                <input type="password" name="password" id="password" autoComplete="new-password" />
              </div>

              <div>
                <label htmlFor="passwordConfirmation">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="company-submit-button" disabled={processing}>
                {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
