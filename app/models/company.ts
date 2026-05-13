import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

function consumeCoordinate(value: unknown) {
  if (value === null || value === undefined) {
    return null
  }

  const coordinate = Number(value)

  return Number.isFinite(coordinate) ? coordinate : null
}

function prepareCoordinate(value: number | null) {
  return value === null ? null : value.toFixed(7)
}

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare address: string

  @column()
  declare phone: string | null

  @column()
  declare affiliationNumber: string | null

  @column()
  declare image: string | null

  @column({
    consume: consumeCoordinate,
    prepare: prepareCoordinate,
  })
  declare latitude: number | null

  @column({
    consume: consumeCoordinate,
    prepare: prepareCoordinate,
  })
  declare longitude: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
