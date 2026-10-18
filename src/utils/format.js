// localDate is "YYYY-MM-DD" in the venue's timezone, so parse it as a local date.
function parseLocalDate(localDate) {
  const [year, month, day] = localDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatEventDate(event, options = {}) {
  if (!event.localDate) return 'Date to be announced'
  return parseLocalDate(event.localDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  })
}

export function formatEventTime(event) {
  if (!event.localTime) return 'Time TBA'
  const [hours, minutes] = event.localTime.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function getDateBadge(event) {
  if (!event.localDate) return { month: 'TBA', day: '--' }
  const date = parseLocalDate(event.localDate)
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: date.getDate(),
  }
}

export function formatLocation(venue) {
  if (!venue) return 'Venue to be announced'
  return [venue.city, venue.state ?? venue.country].filter(Boolean).join(', ')
}

export function formatPrice(priceRange) {
  if (!priceRange) return null
  const format = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: priceRange.currency || 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  return priceRange.min === priceRange.max
    ? format(priceRange.min)
    : `${format(priceRange.min)} – ${format(priceRange.max)}`
}

export function formatDateTime(isoString) {
  if (!isoString) return null
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatAddress(venue) {
  if (!venue) return null
  return [venue.address, venue.city, venue.state, venue.postalCode, venue.country]
    .filter(Boolean)
    .join(', ')
}

// Exact UTC start when known; otherwise treat the event as lasting all of its local day.
export function getEventTimestamp(event) {
  if (event.dateTime) return Date.parse(event.dateTime)
  if (event.localDate) return parseLocalDate(event.localDate).getTime() + 24 * 60 * 60 * 1000 - 1
  return Number.POSITIVE_INFINITY
}

export function isPastEvent(event) {
  return getEventTimestamp(event) < Date.now()
}

const DAY_MS = 24 * 60 * 60 * 1000

// "Today", "Tomorrow", "In 5 days", "3 days ago"… based on the event's local date.
export function getRelativeDayLabel(event) {
  if (!event.localDate) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Math.round((parseLocalDate(event.localDate) - today) / DAY_MS)

  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  if (days > 1) return days < 60 ? `In ${days} days` : `In ${Math.round(days / 30)} months`
  return -days < 60 ? `${-days} days ago` : `${Math.round(-days / 30)} months ago`
}
