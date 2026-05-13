type Attempt = {
  count: number
  firstAttemptAt: number
  blockedUntil?: number
}

const attempts = new Map<string, Attempt>()
const windowMs = 15 * 60 * 1000
const blockMs = 15 * 60 * 1000
const maxAttempts = 5

function now() {
  return Date.now()
}

function getAttempt(key: string) {
  const currentTime = now()
  const attempt = attempts.get(key)

  if (!attempt || currentTime - attempt.firstAttemptAt > windowMs) {
    const freshAttempt: Attempt = { count: 0, firstAttemptAt: currentTime }
    attempts.set(key, freshAttempt)
    return freshAttempt
  }

  return attempt
}

export function isLoginBlocked(key: string) {
  const attempt = attempts.get(key)

  if (!attempt?.blockedUntil) {
    return false
  }

  if (attempt.blockedUntil <= now()) {
    attempts.delete(key)
    return false
  }

  return true
}

export function recordFailedLogin(key: string) {
  const attempt = getAttempt(key)
  attempt.count += 1

  if (attempt.count >= maxAttempts) {
    attempt.blockedUntil = now() + blockMs
  }
}

export function clearLoginAttempts(key: string) {
  attempts.delete(key)
}
