import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.status': { paramsTuple?: []; params?: {} }
    'auth.current': { paramsTuple?: []; params?: {} }
    'visitor.signup': { paramsTuple?: []; params?: {} }
    'visitor.login': { paramsTuple?: []; params?: {} }
    'visitor.login.store': { paramsTuple?: []; params?: {} }
    'visitor.welcome': { paramsTuple?: []; params?: {} }
    'visitor.continue': { paramsTuple?: []; params?: {} }
    'help': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'companies.create': { paramsTuple?: []; params?: {} }
    'companies.edit': { paramsTuple?: []; params?: {} }
    'companies.address.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'companies.edit.selected': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'companies.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'companies.store': { paramsTuple?: []; params?: {} }
    'companies.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'companies.index': { paramsTuple?: []; params?: {} }
    'admin.access': { paramsTuple?: []; params?: {} }
    'admin.access.grant': { paramsTuple?: []; params?: {} }
    'admin.access.revoke': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'email.registration': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'account.edit': { paramsTuple?: []; params?: {} }
    'account.update': { paramsTuple?: []; params?: {} }
    'admin.access.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'auth.status': { paramsTuple?: []; params?: {} }
    'auth.current': { paramsTuple?: []; params?: {} }
    'visitor.signup': { paramsTuple?: []; params?: {} }
    'visitor.login': { paramsTuple?: []; params?: {} }
    'visitor.welcome': { paramsTuple?: []; params?: {} }
    'help': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'companies.create': { paramsTuple?: []; params?: {} }
    'companies.edit': { paramsTuple?: []; params?: {} }
    'companies.address.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'companies.edit.selected': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'companies.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'companies.index': { paramsTuple?: []; params?: {} }
    'admin.access': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'account.edit': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'auth.status': { paramsTuple?: []; params?: {} }
    'auth.current': { paramsTuple?: []; params?: {} }
    'visitor.signup': { paramsTuple?: []; params?: {} }
    'visitor.login': { paramsTuple?: []; params?: {} }
    'visitor.welcome': { paramsTuple?: []; params?: {} }
    'help': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'companies.create': { paramsTuple?: []; params?: {} }
    'companies.edit': { paramsTuple?: []; params?: {} }
    'companies.address.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'companies.edit.selected': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'companies.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'companies.index': { paramsTuple?: []; params?: {} }
    'admin.access': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'account.edit': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'visitor.login.store': { paramsTuple?: []; params?: {} }
    'visitor.continue': { paramsTuple?: []; params?: {} }
    'companies.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'companies.store': { paramsTuple?: []; params?: {} }
    'admin.access.grant': { paramsTuple?: []; params?: {} }
    'admin.access.revoke': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'email.registration': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'account.update': { paramsTuple?: []; params?: {} }
    'admin.access.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}