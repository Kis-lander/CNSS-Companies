import User from '#models/user'
import NonAdminUser from '#models/non_admin_user'
import { emailRegistrationValidator, signupValidator } from '#validators/user'
import { isRecognizedByGoogle } from '#services/email_recognition_service'
import { isAdminOnline } from '#services/admin_presence_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async status({ response }: HttpContext) {
    const adminExists = await User.query().where('role', 'admin').first()

    return response.json({
      adminExists: Boolean(adminExists),
      adminOnline: isAdminOnline(),
    })
  }

  async create({ inertia, response }: HttpContext) {
    const adminExists = await User.query().where('role', 'admin').first()

    if (adminExists) {
      return response.redirect().toRoute('session.create')
    }

    return inertia.render('auth/signup', {
      isInitialAdmin: true,
    })
  }

  async createVisitor({ inertia, response, auth, session }: HttpContext) {
    if (auth.user) {
      return response.redirect().toRoute('home')
    }

    if (session.get('visitor_email')) {
      return response.redirect('/welcome')
    }

    return inertia.render('auth/user_signup', {})
  }

  async createVisitorLogin({ inertia, response, auth, session }: HttpContext) {
    if (auth.user) {
      return response.redirect().toRoute('home')
    }

    if (session.get('visitor_email')) {
      return response.redirect('/welcome')
    }

    return inertia.render('auth/user_login', {})
  }

  async store({ request, response, session }: HttpContext) {
    const adminExists = await User.query().where('role', 'admin').first()

    if (adminExists) {
      session.flash('error', "L'administrateur CNSS existe deja. Connectez-vous.")
      return response.redirect().toRoute('session.create')
    }

    const payload = await request.validateUsing(signupValidator)
    await User.create({ ...payload, role: 'admin' })

    session.flash('success', 'Compte administrateur CNSS cree. Connectez-vous pour continuer.')
    response.redirect().toRoute('session.create')
  }

  async registerViewer({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(emailRegistrationValidator)
    const googleRecognized = await isRecognizedByGoogle(payload.email)

    if (!googleRecognized) {
      session.flash('error', "Cette adresse email n'existe pas")
      return response.redirect().back()
    }

    const existingUser = await User.findBy('email', payload.email)

    if (!existingUser) {
      const user = await User.create({
        email: payload.email,
        fullName: payload.fullName || null,
        password: null,
        role: 'viewer',
      })

      await NonAdminUser.create({
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        role: 'viewer',
      })
    } else if (!existingUser.fullName && payload.fullName) {
      existingUser.fullName = payload.fullName
      await existingUser.save()
    }

    if (existingUser && existingUser.role !== 'admin') {
      await NonAdminUser.updateOrCreate(
        { email: existingUser.email },
        {
          userId: existingUser.id,
          email: existingUser.email,
          fullName: existingUser.fullName,
          role: existingUser.role === 'manager' ? 'manager' : 'viewer',
        }
      )
    }

    session.put('visitor_email', payload.email)

    session.flash('success', 'Votre adresse email a ete enregistree avec succes.')
    return response.redirect('/welcome')
  }

  async welcomeVisitor({ inertia, response, auth, session }: HttpContext) {
    if (auth.user) {
      return response.redirect().toRoute('home')
    }

    if (!session.get('visitor_email')) {
      return response.redirect('/user/signup')
    }

    return inertia.render('auth/welcome', {
      email: session.get('visitor_email'),
    })
  }

  async continueVisitor({ response, session }: HttpContext) {
    if (!session.get('visitor_email')) {
      return response.redirect('/user/signup')
    }

    return response.redirect().toRoute('home')
  }
}
