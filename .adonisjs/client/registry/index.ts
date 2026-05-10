/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.status': {
    methods: ["GET","HEAD"],
    pattern: '/auth/status',
    tokens: [{"old":"/auth/status","type":0,"val":"auth","end":""},{"old":"/auth/status","type":0,"val":"status","end":""}],
    types: placeholder as Registry['auth.status']['types'],
  },
  'auth.current': {
    methods: ["GET","HEAD"],
    pattern: '/auth/current',
    tokens: [{"old":"/auth/current","type":0,"val":"auth","end":""},{"old":"/auth/current","type":0,"val":"current","end":""}],
    types: placeholder as Registry['auth.current']['types'],
  },
  'visitor.signup': {
    methods: ["GET","HEAD"],
    pattern: '/user/signup',
    tokens: [{"old":"/user/signup","type":0,"val":"user","end":""},{"old":"/user/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['visitor.signup']['types'],
  },
  'visitor.login': {
    methods: ["GET","HEAD"],
    pattern: '/user/login',
    tokens: [{"old":"/user/login","type":0,"val":"user","end":""},{"old":"/user/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['visitor.login']['types'],
  },
  'visitor.login.store': {
    methods: ["POST"],
    pattern: '/user/login',
    tokens: [{"old":"/user/login","type":0,"val":"user","end":""},{"old":"/user/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['visitor.login.store']['types'],
  },
  'visitor.welcome': {
    methods: ["GET","HEAD"],
    pattern: '/welcome',
    tokens: [{"old":"/welcome","type":0,"val":"welcome","end":""}],
    types: placeholder as Registry['visitor.welcome']['types'],
  },
  'visitor.continue': {
    methods: ["POST"],
    pattern: '/welcome/continue',
    tokens: [{"old":"/welcome/continue","type":0,"val":"welcome","end":""},{"old":"/welcome/continue","type":0,"val":"continue","end":""}],
    types: placeholder as Registry['visitor.continue']['types'],
  },
  'help': {
    methods: ["GET","HEAD"],
    pattern: '/help',
    tokens: [{"old":"/help","type":0,"val":"help","end":""}],
    types: placeholder as Registry['help']['types'],
  },
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'companies.create': {
    methods: ["GET","HEAD"],
    pattern: '/companies/create',
    tokens: [{"old":"/companies/create","type":0,"val":"companies","end":""},{"old":"/companies/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['companies.create']['types'],
  },
  'companies.edit': {
    methods: ["GET","HEAD"],
    pattern: '/companies/edit',
    tokens: [{"old":"/companies/edit","type":0,"val":"companies","end":""},{"old":"/companies/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['companies.edit']['types'],
  },
  'companies.address.edit': {
    methods: ["GET","HEAD"],
    pattern: '/companies/:id/address/edit',
    tokens: [{"old":"/companies/:id/address/edit","type":0,"val":"companies","end":""},{"old":"/companies/:id/address/edit","type":1,"val":"id","end":""},{"old":"/companies/:id/address/edit","type":0,"val":"address","end":""},{"old":"/companies/:id/address/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['companies.address.edit']['types'],
  },
  'companies.edit.selected': {
    methods: ["GET","HEAD"],
    pattern: '/companies/:id/edit',
    tokens: [{"old":"/companies/:id/edit","type":0,"val":"companies","end":""},{"old":"/companies/:id/edit","type":1,"val":"id","end":""},{"old":"/companies/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['companies.edit.selected']['types'],
  },
  'companies.update': {
    methods: ["POST"],
    pattern: '/companies/:id',
    tokens: [{"old":"/companies/:id","type":0,"val":"companies","end":""},{"old":"/companies/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['companies.update']['types'],
  },
  'companies.store': {
    methods: ["POST"],
    pattern: '/companies',
    tokens: [{"old":"/companies","type":0,"val":"companies","end":""}],
    types: placeholder as Registry['companies.store']['types'],
  },
  'companies.show': {
    methods: ["GET","HEAD"],
    pattern: '/companies/:id',
    tokens: [{"old":"/companies/:id","type":0,"val":"companies","end":""},{"old":"/companies/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['companies.show']['types'],
  },
  'companies.index': {
    methods: ["GET","HEAD"],
    pattern: '/companies',
    tokens: [{"old":"/companies","type":0,"val":"companies","end":""}],
    types: placeholder as Registry['companies.index']['types'],
  },
  'admin.access': {
    methods: ["GET","HEAD"],
    pattern: '/admin/access',
    tokens: [{"old":"/admin/access","type":0,"val":"admin","end":""},{"old":"/admin/access","type":0,"val":"access","end":""}],
    types: placeholder as Registry['admin.access']['types'],
  },
  'admin.access.grant': {
    methods: ["POST"],
    pattern: '/admin/access',
    tokens: [{"old":"/admin/access","type":0,"val":"admin","end":""},{"old":"/admin/access","type":0,"val":"access","end":""}],
    types: placeholder as Registry['admin.access.grant']['types'],
  },
  'admin.access.revoke': {
    methods: ["POST"],
    pattern: '/admin/access/:id/revoke',
    tokens: [{"old":"/admin/access/:id/revoke","type":0,"val":"admin","end":""},{"old":"/admin/access/:id/revoke","type":0,"val":"access","end":""},{"old":"/admin/access/:id/revoke","type":1,"val":"id","end":""},{"old":"/admin/access/:id/revoke","type":0,"val":"revoke","end":""}],
    types: placeholder as Registry['admin.access.revoke']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'email.registration': {
    methods: ["POST"],
    pattern: '/email-registration',
    tokens: [{"old":"/email-registration","type":0,"val":"email-registration","end":""}],
    types: placeholder as Registry['email.registration']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'account.edit': {
    methods: ["GET","HEAD"],
    pattern: '/account/edit',
    tokens: [{"old":"/account/edit","type":0,"val":"account","end":""},{"old":"/account/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['account.edit']['types'],
  },
  'account.update': {
    methods: ["POST"],
    pattern: '/account',
    tokens: [{"old":"/account","type":0,"val":"account","end":""}],
    types: placeholder as Registry['account.update']['types'],
  },
  'admin.access.destroy': {
    methods: ["POST"],
    pattern: '/admin/access/:id/delete',
    tokens: [{"old":"/admin/access/:id/delete","type":0,"val":"admin","end":""},{"old":"/admin/access/:id/delete","type":0,"val":"access","end":""},{"old":"/admin/access/:id/delete","type":1,"val":"id","end":""},{"old":"/admin/access/:id/delete","type":0,"val":"delete","end":""}],
    types: placeholder as Registry['admin.access.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
