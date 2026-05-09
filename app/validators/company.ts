import vine from '@vinejs/vine'

export const companyValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120),
  address: vine.string().trim().minLength(5).maxLength(255),
  phone: vine.string().trim().maxLength(30).optional(),
})

export const companyUpdateValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120),
  address: vine.string().trim().minLength(5).maxLength(255),
  phone: vine.string().trim().maxLength(30).optional(),
})
