import { Form } from '@adonisjs/inertia/react'

export default function UserSignup() {
  return (
    <div className="form-container">
      <div>
        <h1>Inscription utilisateur</h1>
        <p>Créez un compte pour accéder à la recherche et à la localisation des entreprises.</p>
      </div>

      <div>
        <Form action={{ url: '/email-registration', method: 'post' }}>
          {({ errors, processing }) => (
            <>
              <div>
                <label htmlFor="fullName">Nom complet</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Votre nom complet"
                  data-invalid={errors.fullName ? 'true' : undefined}
                />
                {errors.fullName && <div>{errors.fullName}</div>}
              </div>

              <div>
                <label htmlFor="email">Adresse email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="vous@gmail.com"
                  data-invalid={errors.email ? 'true' : undefined}
                />
                {errors.email && <div>{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="password">Mot de passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  data-invalid={errors.password ? 'true' : undefined}
                />
                {errors.password && <div>{errors.password}</div>}
              </div>

              <div>
                <label htmlFor="passwordConfirmation">Confirmer le mot de passe</label>
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  autoComplete="new-password"
                  data-invalid={errors.passwordConfirmation ? 'true' : undefined}
                />
                {errors.passwordConfirmation && <div>{errors.passwordConfirmation}</div>}
              </div>

              <div>
                <button type="submit" className="visitor-register-button" disabled={processing}>
                  {processing ? 'Création...' : "S'inscrire"}
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
