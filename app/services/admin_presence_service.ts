const ADMIN_ONLINE_WINDOW_IN_MS = 10_000

let lastAdminSeenAt = 0

export function markAdminOnline() {
  lastAdminSeenAt = Date.now()
}

export function markAdminOffline() {
  lastAdminSeenAt = 0
}

export function isAdminOnline() {
  return Date.now() - lastAdminSeenAt < ADMIN_ONLINE_WINDOW_IN_MS
}
