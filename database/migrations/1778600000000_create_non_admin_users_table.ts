import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'non_admin_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .nullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('role', 24).notNullable().defaultTo('viewer')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.defer(async (db) => {
      await db.rawQuery(`
        insert into non_admin_users (user_id, full_name, email, role, created_at, updated_at)
        select id, full_name, email, role, created_at, updated_at
        from users
        where role != 'admin'
        on conflict (email) do nothing
      `)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
