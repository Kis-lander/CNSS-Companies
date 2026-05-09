import { promises as dns } from 'node:dns'

export async function isRecognizedByGoogle(email: string) {
  const domain = email.split('@')[1]?.toLowerCase()

  if (!domain) {
    return false
  }

  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return true
  }

  try {
    const records = await dns.resolveMx(domain)

    return records.some((record) => record.exchange.toLowerCase().includes('google.com'))
  } catch {
    return false
  }
}
