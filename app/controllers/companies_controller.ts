import Company from '#models/company'
import User from '#models/user'
import { readFile } from 'node:fs/promises'
import { geocodeAddress } from '#services/geocoding_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { MultipartFile } from '@adonisjs/bodyparser'
import { companyUpdateValidator, companyValidator } from '#validators/company'

function parseCoordinate(value: unknown, min: number, max: number) {
  if (value === undefined || value === null) {
    return null
  }

  const normalizedValue = String(value).trim()

  if (normalizedValue === '') {
    return null
  }

  const coordinate = Number(normalizedValue)

  if (!Number.isFinite(coordinate) || coordinate < min || coordinate > max) {
    return undefined
  }

  return coordinate
}

function serializeCoordinate(value: number | string | null) {
  if (value === null) {
    return null
  }

  const coordinate = Number(value)

  return Number.isFinite(coordinate) ? coordinate : null
}

function coordinatesMatch(
  latitude: number | null,
  longitude: number | null,
  company: Pick<Company, 'latitude' | 'longitude'>
) {
  return (
    latitude === serializeCoordinate(company.latitude) &&
    longitude === serializeCoordinate(company.longitude)
  )
}

function serializeCompany(company: Company) {
  return {
    id: company.id,
    name: company.name,
    address: company.address,
    phone: company.phone,
    affiliationNumber: company.affiliationNumber,
    image: company.image ? `/companies/${company.id}/image` : null,
    latitude: serializeCoordinate(company.latitude),
    longitude: serializeCoordinate(company.longitude),
  }
}

function normalizeOptionalText(value: string | undefined) {
  const text = value?.trim()

  return text ? text : null
}

async function imageToDataUrl(image: MultipartFile) {
  if (!image.tmpPath) {
    return null
  }

  const buffer = await readFile(image.tmpPath)
  const mimeType =
    image.type && image.subtype ? `${image.type}/${image.subtype}` : `image/${image.extname}`

  return `data:${mimeType};base64,${buffer.toString('base64')}`
}

export default class CompaniesController {
  async help({ inertia }: HttpContext) {
    return inertia.render('help', {})
  }

  async index({ inertia, response, auth, session }: HttpContext) {
    const adminExists = await User.query().where('role', 'admin').first()

    if (!adminExists) {
      return response.redirect().toRoute('new_account.create')
    }

    if (!auth.user && !session.get('visitor_email')) {
      return response.redirect().toRoute('session.create')
    }

    const companies = await Company.query().orderBy('created_at', 'desc')

    return inertia.render('home', {
      companiesCount: companies.length,
      companies: companies.map((company) => serializeCompany(company)),
    })
  }

  async create({ inertia }: HttpContext) {
    const companiesCount = await Company.query().count('* as total').first()

    return inertia.render('companies/create', {
      companiesCount: Number(companiesCount?.$extras.total ?? 0),
    })
  }

  async list({ inertia }: HttpContext) {
    const companies = await Company.query().orderBy('created_at', 'desc')

    return inertia.render('companies/index', {
      companies: companies.map((company) => serializeCompany(company)),
    })
  }

  async show({ params, inertia }: HttpContext) {
    const company = await Company.findOrFail(params.id)

    return inertia.render('companies/show', {
      company: serializeCompany(company),
    })
  }

  async image({ params, response }: HttpContext) {
    const company = await Company.findOrFail(params.id)
    const image = company.image

    if (!image) {
      return response.notFound()
    }

    if (image.startsWith('/uploads/')) {
      return response.redirect(image)
    }

    const dataUrlMatch = image.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i)
    const mimeType = dataUrlMatch?.[1] ?? 'image/jpeg'
    const base64 = dataUrlMatch?.[2] ?? image

    try {
      const imageBuffer = Buffer.from(base64, 'base64')

      response.header('Content-Type', mimeType)
      response.header('Cache-Control', 'public, max-age=31536000, immutable')

      return response.send(imageBuffer)
    } catch {
      return response.notFound()
    }
  }

  async edit({ params, inertia }: HttpContext) {
    const companies = await Company.query().orderBy('name', 'asc')
    const selectedCompany = params.id
      ? companies.find((company) => company.id === Number(params.id))
      : null

    return inertia.render('companies/edit', {
      companies: companies.map((company) => serializeCompany(company)),
      selectedCompanyId: selectedCompany?.id ?? null,
    })
  }

  async update({ params, request, response, session }: HttpContext) {
    const company = await Company.findOrFail(params.id)
    const payload = await request.validateUsing(companyUpdateValidator)
    const rawLatitude = request.input('latitude')
    const rawLongitude = request.input('longitude')
    const latitude = parseCoordinate(rawLatitude, -90, 90)
    const longitude = parseCoordinate(rawLongitude, -180, 180)
    const image = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (latitude === undefined || longitude === undefined) {
      session.flash('error', 'La latitude ou la longitude est invalide.')
      return response.redirect().back()
    }

    if ((latitude === null && longitude !== null) || (latitude !== null && longitude === null)) {
      session.flash('error', 'La latitude et la longitude doivent etre renseignees ensemble.')
      return response.redirect().back()
    }

    if (image && !image.isValid) {
      session.flash('error', "L'image doit etre un fichier jpg, png ou webp de 5 Mo maximum.")
      return response.redirect().back()
    }

    let imagePath = company.image

    if (image) {
      imagePath = await imageToDataUrl(image)
    }

    const addressChanged = payload.address !== company.address
    const previousLatitude = serializeCoordinate(company.latitude)
    const previousLongitude = serializeCoordinate(company.longitude)
    const previousCoordinates =
      previousLatitude !== null && previousLongitude !== null
        ? {
            latitude: previousLatitude,
            longitude: previousLongitude,
          }
        : null
    const submittedCoordinates =
      latitude !== null && longitude !== null
        ? {
            latitude,
            longitude,
          }
        : null
    const coordinatesWereSubmitted = rawLatitude !== undefined || rawLongitude !== undefined
    const coordinatesWereCleared =
      coordinatesWereSubmitted &&
      String(rawLatitude ?? '').trim() === '' &&
      String(rawLongitude ?? '').trim() === ''
    const coordinatesChanged = !coordinatesMatch(latitude, longitude, company)
    const geocodedCoordinates =
      addressChanged && !coordinatesChanged ? await geocodeAddress(payload.address) : null
    const coordinates = coordinatesWereCleared
      ? null
      : (geocodedCoordinates ?? submittedCoordinates ?? previousCoordinates)

    company.merge({
      name: payload.name,
      address: payload.address,
      phone: normalizeOptionalText(payload.phone),
      affiliationNumber: normalizeOptionalText(payload.affiliationNumber),
      image: imagePath,
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,
    })

    await company.save()

    session.flash('success', "L'entreprise a été modifiée avec succès.")
    return response.redirect(`/companies/${company.id}`)
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(companyValidator)
    const image = request.file('image', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (image && !image.isValid) {
      session.flash('error', "L'image doit etre un fichier jpg, png ou webp de 5 Mo maximum.")
      return response.redirect().back()
    }

    const coordinates = await geocodeAddress(payload.address)

    if (!coordinates) {
      session.flash(
        'error',
        "L'adresse n'a pas pu être localisée. Ajoutez plus de précision: avenue, commune, ville et RDC."
      )
      return response.redirect().back()
    }

    let imagePath: string | null = null

    if (image) {
      imagePath = await imageToDataUrl(image)
    }

    await Company.create({
      name: payload.name,
      address: payload.address,
      phone: normalizeOptionalText(payload.phone),
      affiliationNumber: normalizeOptionalText(payload.affiliationNumber),
      image: imagePath,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    })

    session.flash('success', 'Entreprise enregistrée avec succès.')
    return response.redirect('/companies')
  }
}
