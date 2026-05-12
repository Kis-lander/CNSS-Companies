import { Form } from '@adonisjs/inertia/react'

export default function UserSignup() {
  return (
    <div className="form-container">
      <div>
        <h1>Inscription utilisateur</h1>
        <p>
          Entrez votre adresse email pour accéder à la recherche et à la localisation des
          entreprises.
        </p>
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
                <button type="submit" className="visitor-register-button" disabled={processing}>
                  {processing ? 'Vérification...' : "S'inscrire"}
                </button>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
