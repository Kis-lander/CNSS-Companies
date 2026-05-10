import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'
import NonAdminUser from '#models/non_admin_user'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class SilentAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    await ctx.auth.check()

    const visitorEmail = ctx.session.get('visitor_email')

    if (visitorEmail) {
      const [user, nonAdminUser] = await Promise.all([
        User.findBy('email', visitorEmail),
        NonAdminUser.findBy('email', visitorEmail),
      ])

      if (!user || user.role === 'admin' || !nonAdminUser) {
        ctx.session.forget('visitor_email')

        if (ctx.request.accepts(['html', 'json']) === 'json') {
          return ctx.response.json({ user: null })
        }

        if (!ctx.request.url().startsWith('/user/login') && !ctx.request.url().startsWith('/user/signup')) {
          ctx.session.flash('error', "Votre compte utilisateur n'existe plus. Veuillez vous reconnecter.")
          return ctx.response.redirect('/user/login')
        }
      }
    }

    return next()
  }
}
