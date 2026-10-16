const BASE_URL = 'https://app.ticketmaster.com/discovery/v2'
const API_KEY = import.meta.env.VITE_TM_API_KEY

// The Discovery API only allows paging through the first 1000 results.
const MAX_RESULTS = 1000

async function request(path, params = {}, signal) {
  if (!API_KEY) {
    throw new Error('Missing Ticketmaster API key. Add VITE_TM_API_KEY to your .env file.')
  }

  const query = new URLSearchParams({ apikey: API_KEY })
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value)
  })

  let response
  try {
    response = await fetch(`${BASE_URL}${path}?${query}`, { signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new Error('Network error. Check your connection and try again.')
  }

  if (!response.ok) {
    if (response.status === 401) throw new Error('Invalid Ticketmaster API key.')
    if (response.status === 404) throw new Error('The requested event could not be found.')
    if (response.status === 429) {
      throw new Error('Too many requests to Ticketmaster. Please wait a moment and try again.')
    }
    throw new Error(`Ticketmaster request failed (${response.status}).`)
  }
  return response.json()
}

// Ticketmaster expects "YYYY-MM-DDTHH:mm:ssZ" (no milliseconds).
const toApiDateTime = (date) => `${date.toISOString().split('.')[0]}Z`

const validName = (value) => (value && value !== 'Undefined' ? value : null)

function pickImage(images = [], minWidth) {
  const wide = images.filter((img) => img.ratio === '16_9').sort((a, b) => a.width - b.width)
  const pool = wide.length ? wide : [...images].sort((a, b) => a.width - b.width)
  return (pool.find((img) => img.width >= minWidth) ?? pool[pool.length - 1])?.url ?? null
}

// Flatten the raw API event into the shape the app works with.
export function normalizeEvent(event) {
  const venue = event._embedded?.venues?.[0]
  const classification =
    event.classifications?.find((c) => c.primary) ?? event.classifications?.[0]
  const price = event.priceRanges?.[0]
  const publicSale = event.sales?.public

  return {
    id: event.id,
    name: event.name,
    url: event.url ?? null,
    image: pickImage(event.images, 640),
    imageLarge: pickImage(event.images, 1024),
    localDate: event.dates?.start?.localDate ?? null,
    localTime: event.dates?.start?.localTime ?? null,
    dateTime: event.dates?.start?.dateTime ?? null,
    timezone: event.dates?.timezone ?? venue?.timezone ?? null,
    status: event.dates?.status?.code ?? null,
    segment: validName(classification?.segment?.name),
    genre: validName(classification?.genre?.name),
    subGenre: validName(classification?.subGenre?.name),
    venue: venue
      ? {
          name: venue.name,
          address: venue.address?.line1 ?? null,
          city: venue.city?.name ?? null,
          state: venue.state?.stateCode ?? venue.state?.name ?? null,
          country: venue.country?.name ?? null,
          postalCode: venue.postalCode ?? null,
          latitude: venue.location?.latitude ?? null,
          longitude: venue.location?.longitude ?? null,
          url: venue.url ?? null,
        }
      : null,
    priceRange: price ? { min: price.min, max: price.max, currency: price.currency } : null,
    sales: publicSale
      ? { start: publicSale.startDateTime ?? null, end: publicSale.endDateTime ?? null }
      : null,
    info: event.info ?? event.description ?? null,
    pleaseNote: event.pleaseNote ?? null,
    seatmap: event.seatmap?.staticUrl ?? null,
    ageRestricted: event.ageRestrictions?.legalAgeEnforced ?? false,
    attractions: (event._embedded?.attractions ?? []).map((a) => ({
      id: a.id,
      name: a.name,
      url: a.url ?? null,
      image: pickImage(a.images, 300),
    })),
  }
}

export async function searchEvents(
  { keyword, segmentId, city, countryCode, startDate, endDate, sort = 'date,asc', page = 0, size = 12 } = {},
  signal,
) {
  // Only show upcoming events: never search earlier than "now".
  const now = new Date()
  const start = startDate ? new Date(`${startDate}T00:00:00`) : now

  const data = await request(
    '/events.json',
    {
      keyword,
      segmentId,
      city,
      countryCode,
      sort,
      page,
      size,
      startDateTime: toApiDateTime(start < now ? now : start),
      endDateTime: endDate ? toApiDateTime(new Date(`${endDate}T23:59:59`)) : undefined,
    },
    signal,
  )

  return {
    events: (data._embedded?.events ?? []).map(normalizeEvent),
    page: {
      number: data.page?.number ?? page,
      totalElements: data.page?.totalElements ?? 0,
      totalPages: Math.min(data.page?.totalPages ?? 0, Math.floor(MAX_RESULTS / size)),
    },
  }
}
