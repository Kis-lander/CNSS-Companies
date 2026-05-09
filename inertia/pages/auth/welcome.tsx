import { Form } from '@adonisjs/inertia/react'

type WelcomeProps = {
  email: string
}

export default function Welcome({ email }: WelcomeProps) {
  return (
    <div className="form-container">
      <div>
        <h1>Bienvenue</h1>
        <p>
          {email} est enregistré. Vous pouvez maintenant chercher une entreprise et consulter sa
          localisation.
        </p>
      </div>

      <Form action={{ url: '/welcome/continue', method: 'post' }}>
        {({ processing }) => (
          <button type="submit" className="visitor-register-button" disabled={processing}>
            Chercher une entreprise
          </button>
        )}
      </Form>
    </div>
  )
}
