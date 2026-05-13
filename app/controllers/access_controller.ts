import User from '#models/user'
import NonAdminUser from '#models/non_admin_user'
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
      session.flash('error', 'Le compte administrateur CNSS possède déjà tous les droits.')
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

    const manager = await User.findByOrFail('email', payload.email)

    await NonAdminUser.updateOrCreate(
      { email: manager.email },
      {
        userId: manager.id,
        email: manager.email,
        fullName: manager.fullName,
        role: 'manager',
      }
    )

    session.flash('success', "Le droit d'enregistrer et modifier les entreprises a été accordé.")
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

    await NonAdminUser.updateOrCreate(
      { email: user.email },
      {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        role: 'viewer',
      }
    )

    session.flash('success', 'Le droit de gestion a été retiré.')
    return response.redirect('/admin/access')
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (user.id === auth.user?.id || user.role === 'admin') {
      session.flash('error', 'Vous ne pouvez pas supprimer le compte administrateur CNSS.')
      return response.redirect().back()
    }

    await NonAdminUser.query().where('email', user.email).delete()
    await user.delete()

    session.flash('success', 'Le compte utilisateur a été supprimé.')
    return response.redirect('/admin/access')
  }
}
