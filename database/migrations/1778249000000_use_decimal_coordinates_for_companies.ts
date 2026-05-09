import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('latitude', 10, 7).nullable().alter()
      table.decimal('longitude', 10, 7).nullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.double('latitude').nullable().alter()
      table.double('longitude').nullable().alter()
    })
  }
}
