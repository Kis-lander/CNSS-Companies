import User from '#models/user'
import { getCurrentUser } from '#services/current_user_service'
import { markAdminOffline, markAdminOnline } from '#services/admin_presence_service'
import {
  clearLoginAttempts,
  isLoginBlocked,
  recordFailedLogin,
} from '#services/login_attempt_service'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async current(ctx: HttpContext) {
    const { response } = ctx
    const user = await getCurrentUser(ctx)

    if (!user) {
      return response.json({
        user: null,
      })
    }

    if (user.isAdmin) {
      markAdminOnline()
    }

    return response.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        canManageCompanies: user.canManageCompanies,
        isAdmin: user.isAdmin,
        initials: user.initials,
      },
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response, session }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)
    const email = payload.email.toLowerCase()
    const attemptKey = `${request.ip()}:${email}`

    if (isLoginBlocked(attemptKey)) {
      session.flash('error', 'Trop de tentatives. Veuillez réessayer dans 15 minutes.')
      return response.redirect().back()
    }

    const existingUser = await User.findBy('email', email)

    if (existingUser && !existingUser.password) {
      session.flash('error', 'Ce compte est enregistré pour la consultation seulement.')
      return response.redirect().back()
    }

    try {
      const user = await User.verifyCredentials(email, payload.password)

      await auth.use('web').login(user)
      clearLoginAttempts(attemptKey)

      if (user.isAdmin) {
        markAdminOnline()
      }
    } catch {
      recordFailedLogin(attemptKey)
      session.flash('error', 'Email ou mot de passe incorrect.')
      return response.redirect().back()
    }

    response.redirect().toRoute('home')
  }

  async destroy({ auth, response }: HttpContext) {
    if (auth.user?.isAdmin) {
      markAdminOffline()
    }

    await auth.use('web').logout()
    response.redirect().toRoute('session.create')
  }
}
