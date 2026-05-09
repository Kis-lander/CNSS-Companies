import { Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { router, usePage } from '@inertiajs/react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'

const cnssLogo = 'https://cnss.cd/wp-content/uploads/2025/01/LOGO-CNSSPDF_preview_rev_1.png'
const mapSplashImage = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="520" height="300" viewBox="0 0 520 300">
    <rect width="520" height="300" fill="#ffffff"/>
    <g transform="translate(74 54)">
      <path d="M42 40h300c26 0 48 22 48 48v76c0 26-22 48-48 48H42c-26 0-48-22-48-48V88c0-26 22-48 48-48z" fill="#1f2933"/>
      <path d="M50 62h270c21 0 38 17 38 38v50c0 21-17 38-38 38H50c-21 0-38-17-38-38v-50c0-21 17-38 38-38z" fill="#f6f1df"/>
      <path d="M20 116c58-28 108-29 151-4 46 27 98 27 166 0" fill="none" stroke="#d8b96c" stroke-width="7"/>
      <path d="M34 84c49 17 93 17 131 1 43-18 94-10 171 24" fill="none" stroke="#cbd5e1" stroke-width="7"/>
      <path d="M45 168c42-29 82-35 120-18 58 26 111 17 178-28" fill="none" stroke="#9cc7b0" stroke-width="7"/>
      <circle cx="356" cy="126" r="13" fill="#0b1220"/>
    </g>
    <g>
      <path d="M150 54c0-27 22-49 49-49s49 22 49 49c0 36-49 87-49 87s-49-51-49-87z" fill="#1d9bf0"/>
      <circle cx="199" cy="54" r="18" fill="#eaf7ff"/>
      <path d="M330 70c0-27 22-49 49-49s49 22 49 49c0 36-49 87-49 87s-49-51-49-87z" fill="#d82735"/>
      <circle cx="379" cy="70" r="18" fill="#fff1f2"/>
      <path d="M245 145c0-24 20-44 44-44s44 20 44 44c0 32-44 78-44 78s-44-46-44-78z" fill="#2b7de9"/>
      <circle cx="289" cy="145" r="16" fill="#eef5ff"/>
    </g>
  </svg>
`)}`

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const page = usePage<
    Data.SharedProps & {
      user?: Data.SharedProps['user'] & {
        canManageCompanies?: boolean
        isAdmin?: boolean
        role?: 'admin' | 'manager' | 'viewer'
      }
    }
  >()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [adminExists, setAdminExists] = useState(true)
  const [adminOnline, setAdminOnline] = useState(false)
  const [splashVisible, setSplashVisible] = useState(true)
  const [splashStep, setSplashStep] = useState<'logo' | 'map'>('logo')
  const roleSyncPending = useRef(false)
  const sharedProps = page.props
  const roleLabels = {
    admin: 'Administrateur CNSS',
    manager: 'Gestion entreprises',
    viewer: 'Consultation',
  }
  const navigationLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/companies', label: 'Entreprises' },
    ...(sharedProps.user?.canManageCompanies
      ? [
          { href: '/companies/create', label: 'Enregistrer' },
          { href: '/companies/edit', label: 'Modifier' },
        ]
      : []),
    ...(sharedProps.user?.isAdmin ? [{ href: '/admin/access', label: 'Accès' }] : []),
    { href: '/help', label: 'Help' },
  ]
  const navigationClassName = sharedProps.user?.canManageCompanies
    ? 'header-navigation is-admin'
    : 'header-navigation is-user'

  useEffect(() => {
    toast.dismiss()
    setMenuOpen(false)
    setProfileOpen(false)
  }, [page.url])

  useEffect(() => {
    fetch('/auth/status')
      .then((response) => response.json())
      .then((data: { adminExists?: boolean; adminOnline?: boolean }) => {
        setAdminExists(Boolean(data.adminExists))
        setAdminOnline(Boolean(data.adminOnline))
      })
      .catch(() => setAdminExists(true))
  }, [])

  useEffect(() => {
    if (!sharedProps.user) {
      return () => {}
    }

    const currentUser = sharedProps.user
    const syncUserRole = () => {
      if (roleSyncPending.current) {
        return
      }

      fetch('/auth/current', {
        headers: {
          Accept: 'application/json',
        },
      })
        .then((response) => response.json())
        .then(
          (data: {
            user?: {
              id: number
              role?: 'admin' | 'manager' | 'viewer'
              canManageCompanies?: boolean
              isAdmin?: boolean
            } | null
          }) => {
            const remoteUser = data.user

            if (
              !remoteUser ||
              remoteUser.id !== currentUser.id ||
              remoteUser.role !== currentUser.role ||
              remoteUser.canManageCompanies !== currentUser.canManageCompanies ||
              remoteUser.isAdmin !== currentUser.isAdmin
            ) {
              roleSyncPending.current = true

              if (!remoteUser) {
                router.visit('/user/login')
                return
              }

              if (page.url.startsWith('/admin') && !remoteUser.isAdmin) {
                router.visit('/')
                return
              }

              if (
                (page.url.startsWith('/companies/create') || page.url.startsWith('/companies/edit')) &&
                !remoteUser.canManageCompanies
              ) {
                router.visit('/')
                return
              }

              router.reload({
                only: ['user'],
                onFinish: () => {
                  roleSyncPending.current = false
                },
              })
            }
          }
        )
        .catch(() => {})
    }
    const interval = window.setInterval(syncUserRole, 2500)

    return () => window.clearInterval(interval)
  }, [page.url, sharedProps.user])

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme')

    if (savedTheme === 'dark') {
      setTheme('dark')
      document.documentElement.classList.add('theme-dark')
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const secondStep = window.setTimeout(() => setSplashStep('map'), 1900)
    const hideSplash = window.setTimeout(() => setSplashVisible(false), 3900)

    return () => {
      window.clearTimeout(secondStep)
      window.clearTimeout(hideSplash)
    }
  }, [])

  useEffect(() => {
    if (children.props.flash.error) {
      toast.error(children.props.flash.error)
    }
    if (children.props.flash.success) {
      toast.success(children.props.flash.success)
    }
  })

  return (
    <>
      {splashVisible && (
        <div className="app-splash" aria-label="Chargement de l'application">
          <div className={splashStep === 'logo' ? 'splash-frame is-active' : 'splash-frame'}>
            <img className="splash-logo" src={cnssLogo} alt="CNSS" />
          </div>
          <div className={splashStep === 'map' ? 'splash-frame is-active' : 'splash-frame'}>
            <img className="splash-map" src={mapSplashImage} alt="Localisation des entreprises" />
          </div>
        </div>
      )}
      <header>
        <div className="header-shell">
          <div className="header-brand">
            <a href="/" className="header-logo-link">
              <img
                className="header-logo"
                src={cnssLogo}
                alt="CNSS"
              />
            </a>
          </div>

          <button
            type="button"
            className="menu-toggle"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={menuOpen ? 'header-menu is-open' : 'header-menu'}>
            <nav className={navigationClassName} aria-label="Navigation principale">
              {navigationLinks.map((link) => (
                <a className={page.url === link.href ? 'current' : undefined} href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>

            <nav className="header-auth" aria-label="Compte">
              <button
                type="button"
                className="theme-toggle"
                aria-label={theme === 'dark' ? 'Passer au mode normal' : 'Passer au mode sombre'}
                onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
              >
                <span className="theme-icon" aria-hidden="true" />
              </button>

              {sharedProps.user ? (
                <>
                  <div className="profile-menu">
                    <button
                      type="button"
                      className="profile-button"
                      aria-label="Afficher les informations du compte"
                      aria-expanded={profileOpen}
                      onClick={() => setProfileOpen((isOpen) => !isOpen)}
                    >
                      {sharedProps.user.initials}
                    </button>
                    {profileOpen && (
                      <div className="profile-panel" role="status">
                        <strong>{sharedProps.user.fullName || 'Administrateur CNSS'}</strong>
                        <span>{sharedProps.user.email}</span>
                        <small>{roleLabels[sharedProps.user.role ?? 'viewer']}</small>
                      </div>
                    )}
                  </div>
                  <Form route="session.destroy">
                    <button type="submit" className="logout-button">
                      Logout
                    </button>
                  </Form>
                </>
              ) : (
                <>
                  {adminExists && (
                    <a href={adminOnline ? '/user/login' : '/login'} className="auth-button auth-button-login">
                      Login
                    </a>
                  )}
                  {!adminExists && (
                    <Link route="new_account.create" className="auth-button auth-button-signup">
                      Sign up
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="site-footer-grid">
          <div className="footer-brand">
            <a href="/" className="footer-logo-link">
              <img
                className="footer-logo"
                src={cnssLogo}
                alt="CNSS"
              />
            </a>
            <p>Plateforme de gestion et localisation des entreprises enregistrées auprès de la CNSS.</p>
          </div>

          <div className="footer-column">
            <h2>Liens utiles</h2>
            <a href="/">Accueil</a>
            <a href="/companies">Entreprises enregistrées</a>
            <a href="/companies/create">Enregistrer une entreprise</a>
            <a href="/help">Help</a>
          </div>

          <div className="footer-column">
            <h2>Services</h2>
            <a href="/companies">Recherche d'entreprise</a>
            <a href="/companies/edit">Modification des informations</a>
            <a href="/">Localisation sur carte</a>
          </div>

          <div className="footer-column footer-contact">
            <h2>Contact</h2>
            <p>CNSS RDC</p>
            <a href="tel:+243000000000">+243 000 000 000</a>
            <a href="mailto:contact@cnss.cd">contact@cnss.cd</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright © 2026 Gestion CNSS. Tous droits réservés.</p>
        </div>
      </footer>
      <Toaster position="top-center" richColors />
    </>
  )
}
