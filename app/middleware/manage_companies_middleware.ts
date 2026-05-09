import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { getCurrentUser } from '#services/current_user_service'

export default class ManageCompaniesMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = await getCurrentUser(ctx)

    if (!user?.canManageCompanies) {
      ctx.session.flash('error', "Vous n'avez pas le droit d'acceder a cette page.")
      return ctx.response.redirect().toRoute('home')
    }

    return next()
  }
}
