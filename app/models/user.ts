import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  get canManageCompanies() {
    return this.role === 'admin' || this.role === 'manager'
  }

  get isAdmin() {
    return this.role === 'admin'
  }

  get initials() {
    if (!this.fullName) {
      return this.email.split('@')[0].slice(0, 2).toUpperCase()
    }

    const [first, last] = this.fullName.split(' ')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${first.slice(0, 2)}`.toUpperCase()
  }
}
