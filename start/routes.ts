/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/auth/status', [controllers.NewAccount, 'status']).as('auth.status')
router.get('/auth/current', [controllers.Session, 'current']).as('auth.current')

router.get('/user/signup', [controllers.NewAccount, 'createVisitor']).as('visitor.signup')
router.get('/user/login', [controllers.NewAccount, 'createVisitorLogin']).as('visitor.login')
router.post('/user/login', [controllers.NewAccount, 'loginViewer']).as('visitor.login.store')
router.get('/welcome', [controllers.NewAccount, 'welcomeVisitor']).as('visitor.welcome')
router.post('/welcome/continue', [controllers.NewAccount, 'continueVisitor']).as('visitor.continue')
router
  .post('/user/logout', [controllers.NewAccount, 'logoutVisitor'])
  .use(middleware.auth())
  .as('visitor.logout')

router.get('/help', [controllers.Companies, 'help']).as('help')

router.get('/', [controllers.Companies, 'index']).as('home')
router
  .get('/companies/create', [controllers.Companies, 'create'])
  .use(middleware.manageCompanies())
  .as('companies.create')
router
  .get('/companies/edit', [controllers.Companies, 'edit'])
  .use(middleware.manageCompanies())
  .as('companies.edit')
router
  .get('/companies/:id/address/edit', [controllers.Companies, 'edit'])
  .use(middleware.manageCompanies())
  .as('companies.address.edit')
router
  .get('/companies/:id/edit', [controllers.Companies, 'edit'])
  .use(middleware.manageCompanies())
  .as('companies.edit.selected')
router
  .post('/companies/:id', [controllers.Companies, 'update'])
  .use(middleware.manageCompanies())
  .as('companies.update')
router
  .post('/companies', [controllers.Companies, 'store'])
  .use(middleware.manageCompanies())
  .as('companies.store')
router.get('/companies/:id/image', [controllers.Companies, 'image']).as('companies.image')
router.get('/companies/:id', [controllers.Companies, 'show']).as('companies.show')
router.get('/companies', [controllers.Companies, 'list']).as('companies.index')

router
  .group(() => {
    router.get('/admin/access', [controllers.Access, 'index']).as('admin.access')
    router.post('/admin/access', [controllers.Access, 'grant']).as('admin.access.grant')
    router
      .post('/admin/access/:id/revoke', [controllers.Access, 'revoke'])
      .as('admin.access.revoke')
  })
  .use(middleware.admin())

router
  .group(() => {
    router.get('/signup', [controllers.NewAccount, 'create']).as('new_account.create')
    router.post('/signup', [controllers.NewAccount, 'store']).as('new_account.store')

    router.get('/login', [controllers.Session, 'create']).as('session.create')
    router.post('/login', [controllers.Session, 'store']).as('session.store')
    router
      .post('/email-registration', [controllers.NewAccount, 'registerViewer'])
      .as('email.registration')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('/logout', [controllers.Session, 'destroy']).as('session.destroy')
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('/account/edit', [controllers.Account, 'edit']).as('account.edit')
    router.post('/account', [controllers.Account, 'update']).as('account.update')
    router
      .post('/admin/access/:id/delete', [controllers.Access, 'destroy'])
      .as('admin.access.destroy')
  })
  .use(middleware.admin())
