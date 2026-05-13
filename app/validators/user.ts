import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(12).maxLength(128)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  fullName: vine.string().nullable(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})

export const emailRegistrationValidator = vine.create({
  fullName: vine.string().nullable().optional(),
  email: email(),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})

export const loginValidator = vine.create({
  email: email(),
  password: vine.string().minLength(1).maxLength(128),
})

export const accessGrantValidator = vine.create({
  email: email(),
  fullName: vine.string().nullable(),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
})
