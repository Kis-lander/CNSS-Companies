import { Form } from '@adonisjs/inertia/react'

export default function UserLogin() {
  return (
    <div className="form-container">
      <div>
        <h1>Connexion utilisateur</h1>
        <p>Connectez-vous avec votre adresse email et votre mot de passe.</p>
      </div>

      <div>
        <Form action={{ url: '/user/login', method: 'post' }}>
          {({ errors, processing }) => (
            <>
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
                  autoComplete="current-password"
                  data-invalid={errors.password ? 'true' : undefined}
                />
                {errors.password && <div>{errors.password}</div>}
              </div>

              <div>
                <button type="submit" className="visitor-register-button" disabled={processing}>
                  {processing ? 'Connexion...' : 'Connexion'}
                </button>
              </div>

              <p className="auth-switch-text">
                Vous n&apos;avez pas de compte ? <a href="/user/signup">S&apos;inscrire</a>
              </p>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
