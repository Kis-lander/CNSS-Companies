import { Form } from '@adonisjs/inertia/react'

export default function Login() {
  return (
    <div className="form-container">
      <div>
        <h1>Connexion administrateur</h1>
        <p>Entrez vos informations pour accéder à votre compte.</p>
      </div>

      <div>
        <Form route="session.store">
          {({ errors }) => (
            <>
              <div>
                <label htmlFor="email">Adresse email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="username"
                  data-invalid={errors.email ? 'true' : undefined}
                />
                {errors.email && <div>{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                />
                {errors.password ? <span>{errors.password}</span> : ''}
              </div>

              <div>
                <button type="submit" className="button admin-login-button">
                  Connexion
                </button>
              </div>

              <p className="auth-switch-text">
                Vous n&apos;avez pas de compte ? <a href="/signup">S&apos;inscrire</a>
              </p>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
