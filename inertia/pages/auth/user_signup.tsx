import { Form } from '@adonisjs/inertia/react'

export default function UserSignup() {
  return (
    <div className="form-container">
      <div>
        <h1>Inscription utilisateur</h1>
        <p>
          Entrez votre adresse email pour acceder a la recherche et a la localisation des
          entreprises.
        </p>
      </div>

      <div>
        <Form action={{ url: '/email-registration', method: 'post' }}>
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
                  {processing ? 'Verification...' : "S'inscrire"}
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
