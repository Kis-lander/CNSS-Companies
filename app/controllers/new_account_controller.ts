import User from '#models/user'
import NonAdminUser from '#models/non_admin_user'
import { emailRegistrationValidator, loginValidator, signupValidator } from '#validators/user'
import { isRecognizedByGoogle } from '#services/email_recognition_service'
import { isAdminOnline } from '#services/admin_presence_service'
import {
  clearLoginAttempts,
  isLoginBlocked,
  recordFailedLogin,
} from '#services/login_attempt_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async status({ response }: HttpContext) {
    const adminExists = await User.query().where('role', 'admin').first()

    return response.json({
      adminExists: Boolean(adminExists),
      adminOnline: isAdminOnline(),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {
      isInitialAdmin: true,
    })
  }

  async createVisitor({ inertia, response, auth, session }: HttpContext) {
    if (auth.user) {
      return response.redirect().toRoute('home')
    }

    session.forget('visitor_email')
    return inertia.render('auth/user_signup', {})
  }

  async createVisitorLogin({ inertia, response, auth, session }: HttpContext) {
    if (auth.user) {
      return response.redirect().toRoute('home')
    }

    session.forget('visitor_email')
    return inertia.render('auth/user_login', {})
  }

  async store({ request, response, session }: HttpContext) {
    const adminExists = await User.query().where('role', 'admin').first()

    if (adminExists) {
      session.flash('error', "L'administrateur CNSS existe déjà. Connectez-vous.")
      return response.redirect().toRoute('session.create')
    }

    const payload = await request.validateUsing(signupValidator)
    await User.create({ ...payload, email: payload.email.toLowerCase(), role: 'admin' })

    session.flash('success', 'Compte administrateur CNSS créé. Connectez-vous pour continuer.')
    response.redirect().toRoute('session.create')
  }

  async registerViewer({ request, response, session, auth }: HttpContext) {
    const payload = await request.validateUsing(emailRegistrationValidator)
    const email = payload.email.toLowerCase()
    const googleRecognized = await isRecognizedByGoogle(email)

    if (!googleRecognized) {
      session.flash('error', "Cette adresse email n'existe pas.")
      return response.redirect().back()
    }

    const existingUser = await User.findBy('email', email)

    if (existingUser) {
      session.flash('error', 'Cette adresse email est déjà associée à un compte. Connectez-vous.')
      return response.redirect().toRoute('visitor.login')
    }

    const user = await User.create({
      email,
      fullName: payload.fullName || null,
      password: payload.password,
      role: 'viewer',
    })

    await NonAdminUser.create({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: 'viewer',
    })

    await auth.use('web').login(user)

    session.flash('success', 'Votre compte utilisateur a été créé avec succès.')
    return response.redirect().toRoute('home')
  }

  async loginViewer({ request, response, session, auth }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)
    const email = payload.email.toLowerCase()
    const attemptKey = `${request.ip()}:${email}`

    if (isLoginBlocked(attemptKey)) {
      session.flash('error', 'Trop de tentatives. Veuillez réessayer dans 15 minutes.')
      return response.redirect().back()
    }

    try {
      const user = await User.verifyCredentials(email, payload.password)

      if (user.isAdmin) {
        session.flash('error', 'Utilisez la connexion administrateur pour ce compte.')
        return response.redirect().toRoute('session.create')
      }

      await auth.use('web').login(user)
      clearLoginAttempts(attemptKey)
    } catch {
      recordFailedLogin(attemptKey)
      session.flash('error', 'Email ou mot de passe incorrect.')
      return response.redirect().back()
    }

    return response.redirect().toRoute('home')
  }

  async welcomeVisitor({ response, auth, session }: HttpContext) {
    if (auth.user) {
      return response.redirect().toRoute('home')
    }

    session.forget('visitor_email')
    return response.redirect().toRoute('visitor.login')
  }

  async continueVisitor({ response, auth }: HttpContext) {
    if (!auth.user) {
      return response.redirect().toRoute('visitor.login')
    }

    return response.redirect().toRoute('home')
  }

  async logoutVisitor({ response, session, auth }: HttpContext) {
    session.forget('visitor_email')
    await auth.use('web').logout()
    return response.redirect().toRoute('visitor.login')
  }
}
