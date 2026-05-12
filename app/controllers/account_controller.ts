import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AccountController {
  async edit({ inertia, auth, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.redirect().toRoute('session.create')
    }

    return inertia.render('account/edit' as any, {
      account: {
        fullName: user.fullName,
        email: user.email,
      },
    })
  }

  async update({ request, auth, response, session }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.redirect().toRoute('session.create')
    }

    const fullName = request.input('fullName')?.trim() || null
    const email = String(request.input('email') || '').trim().toLowerCase()
    const currentPassword = String(request.input('currentPassword') || '')
    const password = String(request.input('password') || '')
    const passwordConfirmation = String(request.input('passwordConfirmation') || '')

    if (!email || !email.includes('@')) {
      session.flash('error', 'Veuillez saisir une adresse email valide.')
      return response.redirect().back()
    }

    const existingUser = await User.findBy('email', email)

    if (existingUser && existingUser.id !== user.id) {
      session.flash('error', 'Cette adresse email est deja utilisee par un autre compte.')
      return response.redirect().back()
    }

    try {
      await user.verifyPassword(currentPassword)
    } catch {
      session.flash('error', 'Le mot de passe actuel est incorrect.')
      return response.redirect().back()
    }

    user.fullName = fullName
    user.email = email

    if (password || passwordConfirmation) {
      if (password.length < 8 || password.length > 32) {
        session.flash('error', 'Le nouveau mot de passe doit contenir entre 8 et 32 caracteres.')
        return response.redirect().back()
      }

      if (password !== passwordConfirmation) {
        session.flash('error', 'La confirmation du nouveau mot de passe ne correspond pas.')
        return response.redirect().back()
      }

      user.password = password
    }

    await user.save()

    session.flash('success', 'Votre compte a été mis à jour.')
    return response.redirect('/account/edit')
  }
}
