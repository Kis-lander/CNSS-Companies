import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  async up() {
    const hasAffiliationNumberColumn = await this.schema.hasColumn(
      this.tableName,
      'affiliation_number'
    )

    if (hasAffiliationNumberColumn) {
      return
    }

    this.schema.alterTable(this.tableName, (table) => {
      table.string('affiliation_number').nullable().index()
    })
  }

  async down() {
    const hasAffiliationNumberColumn = await this.schema.hasColumn(
      this.tableName,
      'affiliation_number'
    )

    if (!hasAffiliationNumberColumn) {
      return
    }

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('affiliation_number')
    })
  }
}
