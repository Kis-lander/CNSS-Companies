import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { getCurrentUser } from '#services/current_user_service'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = await getCurrentUser(ctx)

    if (!user?.isAdmin) {
      ctx.session.flash('error', "Seul l'administrateur CNSS peut gerer les acces.")
      return ctx.response.redirect().toRoute('home')
    }

    return next()
  }
}
