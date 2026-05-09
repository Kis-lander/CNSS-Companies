type Coordinates = {
  latitude: number
  longitude: number
}

const DRC_VIEWBOX = '12.18,5.39,31.31,-13.46'
const COUNTRY_NAME = 'Republique democratique du Congo'
const COUNTRY_CODE = 'cd'

function addressHasCountry(address: string) {
  const normalizedAddress = address
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')

  return (
    normalizedAddress.includes('republique democratique du congo') ||
    normalizedAddress.includes('rd congo') ||
    normalizedAddress.includes('rdc') ||
    normalizedAddress.includes('congo kinshasa')
  )
}

function addressWithCountry(address: string) {
  return addressHasCountry(address) ? address : `${address}, ${COUNTRY_NAME}`
}

function withoutHouseNumber(parts: string[]) {
  return parts.filter((part) => !/^\d+[a-z]?\b/i.test(part)).join(', ')
}

function broaderAddressCandidates(address: string) {
  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  const candidates = [addressWithCountry(address)]

  if (parts.length >= 3) {
    candidates.push(addressWithCountry(withoutHouseNumber(parts)))
  }

  if (parts.length >= 4) {
    candidates.push(addressWithCountry(parts.slice(-3).join(', ')))
  }

  if (parts.length >= 3) {
    candidates.push(addressWithCountry(parts.slice(-2).join(', ')))
  }

  if (addressHasCountry(address)) {
    candidates.push(address)
  }

  return [...new Set(candidates.filter(Boolean))]
}

function searchParams(query: string, bounded: boolean) {
  const params = new URLSearchParams({
    'q': query,
    'format': 'jsonv2',
    'limit': '3',
    'countrycodes': COUNTRY_CODE,
    'accept-language': 'fr',
  })

  if (bounded) {
    params.set('viewbox', DRC_VIEWBOX)
    params.set('bounded', '1')
  }

  return params
}

async function geocodeQuery(query: string, bounded: boolean): Promise<Coordinates | null> {
  const params = searchParams(query, bounded)

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: {
      'User-Agent': 'gestion-entreprises-cnss/1.0',
    },
  })

  if (!response.ok) {
    return null
  }

  const results = (await response.json()) as Array<{ lat?: string; lon?: string }>
  const firstResult = results.find((result) => result.lat && result.lon)

  if (!firstResult) {
    return null
  }

  const latitude = Number(firstResult.lat)
  const longitude = Number(firstResult.lon)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  return {
    latitude,
    longitude,
  }
}

export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  try {
    const queries = broaderAddressCandidates(address)

    for (const query of queries) {
      const boundedResult = await geocodeQuery(query, true)

      if (boundedResult) {
        return boundedResult
      }

      const countryResult = await geocodeQuery(query, false)

      if (countryResult) {
        return countryResult
      }
    }

    return null
  } catch {
    return null
  }
}
