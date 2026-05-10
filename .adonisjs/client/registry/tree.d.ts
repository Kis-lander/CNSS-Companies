/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    status: typeof routes['auth.status']
    current: typeof routes['auth.current']
  }
  visitor: {
    signup: typeof routes['visitor.signup']
    login: typeof routes['visitor.login'] & {
      store: typeof routes['visitor.login.store']
    }
    welcome: typeof routes['visitor.welcome']
    continue: typeof routes['visitor.continue']
  }
  help: typeof routes['help']
  home: typeof routes['home']
  companies: {
    create: typeof routes['companies.create']
    edit: typeof routes['companies.edit'] & {
      selected: typeof routes['companies.edit.selected']
    }
    address: {
      edit: typeof routes['companies.address.edit']
    }
    update: typeof routes['companies.update']
    store: typeof routes['companies.store']
    show: typeof routes['companies.show']
    index: typeof routes['companies.index']
  }
  admin: {
    access: typeof routes['admin.access'] & {
      grant: typeof routes['admin.access.grant']
      revoke: typeof routes['admin.access.revoke']
      destroy: typeof routes['admin.access.destroy']
    }
  }
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  email: {
    registration: typeof routes['email.registration']
  }
  account: {
    edit: typeof routes['account.edit']
    update: typeof routes['account.update']
  }
}
