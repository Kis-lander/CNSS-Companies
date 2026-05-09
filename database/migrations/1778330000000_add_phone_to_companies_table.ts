import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  async up() {
    const hasPhoneColumn = await this.schema.hasColumn(this.tableName, 'phone')

    if (hasPhoneColumn) {
      return
    }

    this.schema.alterTable(this.tableName, (table) => {
      table.string('phone').nullable()
    })
  }

  async down() {
    const hasPhoneColumn = await this.schema.hasColumn(this.tableName, 'phone')

    if (!hasPhoneColumn) {
      return
    }

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('phone')
    })
  }
}
