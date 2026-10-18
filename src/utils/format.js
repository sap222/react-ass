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
