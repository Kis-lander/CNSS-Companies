import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'admin/access': ExtractProps<(typeof import('../../inertia/pages/admin/access.tsx'))['default']>
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'auth/user_login': ExtractProps<(typeof import('../../inertia/pages/auth/user_login.tsx'))['default']>
    'auth/user_signup': ExtractProps<(typeof import('../../inertia/pages/auth/user_signup.tsx'))['default']>
    'auth/welcome': ExtractProps<(typeof import('../../inertia/pages/auth/welcome.tsx'))['default']>
    'companies/create': ExtractProps<(typeof import('../../inertia/pages/companies/create.tsx'))['default']>
    'companies/edit': ExtractProps<(typeof import('../../inertia/pages/companies/edit.tsx'))['default']>
    'companies/index': ExtractProps<(typeof import('../../inertia/pages/companies/index.tsx'))['default']>
    'companies/show': ExtractProps<(typeof import('../../inertia/pages/companies/show.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'help': ExtractProps<(typeof import('../../inertia/pages/help.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
  }
}
