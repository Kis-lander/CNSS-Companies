import { Form } from '@adonisjs/inertia/react'

export default function UserLogin() {
  return (
    <div className="form-container">
      <div>
        <h1>Login utilisateur</h1>
        <p>Entrez votre adresse email pour acceder a la plateforme.</p>
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
                <button type="submit" className="visitor-register-button" disabled={processing}>
                  {processing ? 'Verification...' : 'Login'}
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
