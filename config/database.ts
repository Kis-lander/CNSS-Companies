import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const databaseUrl = env.get('DATABASE_URL')

const dbConfig = defineConfig({
  connection: env.get('DB_CONNECTION') || 'pg',
  connections: {
    pg: {
      client: 'pg',
      connection: databaseUrl
        ? { connectionString: databaseUrl }
        : {
            host: env.get('DB_HOST'),
            port: Number(env.get('DB_PORT') || 5432),
            user: env.get('DB_USER'),
            password: env.get('DB_PASSWORD'),
            database: env.get('DB_DATABASE'),
          },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
