import User from '#models/user'
import { getCurrentUser } from '#services/current_user_service'
import { isAdminOnline, markAdminOffline, markAdminOnline } from '#services/admin_presence_service'
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

  async create({ inertia, response }: HttpContext) {
    const adminExists = await User.query().where('role', 'admin').first()

    if (!adminExists) {
      return response.redirect().toRoute('new_account.create')
    }

    if (isAdminOnline()) {
      return response.redirect().toRoute('visitor.login')
    }

    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.all()
    const existingUser = await User.findBy('email', email)

    if (existingUser && !existingUser.password) {
      session.flash('error', 'Ce compte est enregistre pour la consultation seulement.')
      return response.redirect().back()
    }

    try {
      const user = await User.verifyCredentials(email, password)

      await auth.use('web').login(user)

      if (user.isAdmin) {
        markAdminOnline()
      }
    } catch {
      session.flash('error', 'Email ou mot de passe incorrect.')
      return response.redirect().back()
    }

    response.redirect().toRoute('home')
  }

  async destroy({ auth, response, session }: HttpContext) {
    if (session.get('visitor_email')) {
      session.forget('visitor_email')
      return response.redirect().toRoute('visitor.login')
    }

    if (auth.user?.isAdmin) {
      markAdminOffline()
    }

    await auth.use('web').logout()
    response.redirect().toRoute('session.create')
  }
}
