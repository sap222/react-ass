export const PAGE_SIZE = 12

export const SORT_OPTIONS = [
  { value: 'date,asc', label: 'Soonest first' },
  { value: 'relevance,desc', label: 'Most relevant' },
  { value: 'name,asc', label: 'Name (A–Z)' },
  { value: 'name,desc', label: 'Name (Z–A)' },
]

export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IE', name: 'Ireland' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'MX', name: 'Mexico' },
  { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'SE', name: 'Sweden' },
]

export const DEFAULT_FILTERS = {
  keyword: '',
  segmentId: '',
  genreId: '',
  countryCode: '',
  city: '',
  startDate: '',
  endDate: '',
  sort: 'date,asc',
}

const FILTER_KEYS = Object.keys(DEFAULT_FILTERS)

// The URL is the source of truth for filters so searches can be shared and
// the browser back button works. "page" is 1-based in the URL.
export function parseFilters(searchParams) {
  const filters = { ...DEFAULT_FILTERS }
  FILTER_KEYS.forEach((key) => {
    const value = searchParams.get(key)
    if (value) filters[key] = value
  })
  const page = Number.parseInt(searchParams.get('page'), 10)
  filters.page = Number.isFinite(page) && page > 1 ? page - 1 : 0
  return filters
}

export function countActiveFilters(filters) {
  return FILTER_KEYS.filter(
    (key) => key !== 'sort' && key !== 'keyword' && filters[key] !== DEFAULT_FILTERS[key],
  ).length
}

export function todayISO() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now - offset).toISOString().slice(0, 10)
}
