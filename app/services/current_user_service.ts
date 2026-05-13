import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export async function getCurrentUser(ctx: HttpContext) {
  if (ctx.auth.user) {
    return User.find(ctx.auth.user.id)
  }

  return null
}
