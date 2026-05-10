import User from '#models/user'
import { accessGrantValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

type UserRole = 'admin' | 'manager' | 'viewer'

function serializeAccessUser(user: User) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role as UserRole,
  }
}

export default class AccessController {
  async index({ inertia }: HttpContext) {
    const users = await User.query().orderBy('role', 'asc').orderBy('email', 'asc')

    return inertia.render('admin/access' as any, {
      users: users.map((user) => serializeAccessUser(user)),
    })
  }

  async grant({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(accessGrantValidator)
    const user = await User.findBy('email', payload.email)

    if (user?.role === 'admin') {
      session.flash('error', 'Le compte administrateur CNSS possede deja tous les droits.')
      return response.redirect().back()
    }

    if (user) {
      user.merge({
        fullName: payload.fullName ?? user.fullName,
        password: payload.password,
        role: 'manager',
      })
      await user.save()
    } else {
      await User.create({
        email: payload.email,
        fullName: payload.fullName,
        password: payload.password,
        role: 'manager',
      })
    }

    session.flash('success', "Le droit d'enregistrer et modifier les entreprises a ete accorde.")
    return response.redirect('/admin/access')
  }

  async revoke({ params, response, session, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (user.id === auth.user?.id || user.role === 'admin') {
      session.flash('error', "Vous ne pouvez pas retirer les droits de l'administrateur CNSS.")
      return response.redirect().back()
    }

    user.role = 'viewer'
    await user.save()

    session.flash('success', 'Le droit de gestion a ete retire.')
    return response.redirect('/admin/access')
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (user.id === auth.user?.id || user.role === 'admin') {
      session.flash('error', "Vous ne pouvez pas supprimer le compte administrateur CNSS.")
      return response.redirect().back()
    }

    await user.delete()

    session.flash('success', 'Le compte utilisateur a ete supprime.')
    return response.redirect('/admin/access')
  }
}
