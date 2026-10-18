import { useState } from 'react'
import { COUNTRIES, SORT_OPTIONS, countActiveFilters, todayISO } from '../utils/eventFilters'
import './FilterPanel.css'

// Free-text city is applied on Enter/blur instead of on every keystroke.
function CityFilter({ value, onApply }) {
  const [city, setCity] = useState(value)

  const apply = (e) => {
    e.preventDefault()
    if (city.trim() !== value) onApply(city.trim())
  }

  return (
    <form className="filter-group" onSubmit={apply}>
      <label htmlFor="filter-city">City</label>
      <input
        id="filter-city"
        type="text"
        placeholder="e.g. London"
        value={city}
        maxLength={60}
        onChange={(e) => setCity(e.target.value)}
        onBlur={apply}
      />
    </form>
  )
}

function FilterPanel({ filters, categories, onChange, onReset }) {
  const [open, setOpen] = useState(false)

  const activeCount = countActiveFilters(filters)
  const genres = categories.find((c) => c.id === filters.segmentId)?.genres ?? []
  const today = todayISO()

  const handleStartDate = (value) => {
    // Keep the range valid: drop the end date if it is now before the start.
    const patch = { startDate: value }
    if (value && filters.endDate && filters.endDate < value) patch.endDate = ''
    onChange(patch)
  }

  return (
    <aside className="filter-panel">
      <button
        type="button"
        className="filter-toggle btn btn-outline"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Filters{activeCount > 0 && <span className="filter-count">{activeCount}</span>}
      </button>

      <div className={`filter-body ${open ? 'is-open' : ''}`}>
        <div className="filter-group">
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            value={filters.segmentId}
            onChange={(e) => onChange({ segmentId: e.target.value, genreId: '' })}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-genre">Genre</label>
          <select
            id="filter-genre"
            value={filters.genreId}
            disabled={!genres.length}
            onChange={(e) => onChange({ genreId: e.target.value })}
          >
            <option value="">{filters.segmentId ? 'All genres' : 'Pick a category first'}</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-country">Country</label>
          <select
            id="filter-country"
            value={filters.countryCode}
            onChange={(e) => onChange({ countryCode: e.target.value })}
          >
            <option value="">Any country</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <CityFilter
          key={filters.city}
          value={filters.city}
          onApply={(city) => onChange({ city })}
        />

        <div className="filter-group">
          <label htmlFor="filter-start">From</label>
          <input
            id="filter-start"
            type="date"
            min={today}
            value={filters.startDate}
            onChange={(e) => handleStartDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-end">To</label>
          <input
            id="filter-end"
            type="date"
            min={filters.startDate || today}
            value={filters.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-sort">Sort by</label>
          <select id="filter-sort" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value })}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-block"
          disabled={activeCount === 0 && !filters.keyword}
          onClick={onReset}
        >
          Clear all filters
        </button>
      </div>
    </aside>
  )
}

export default FilterPanel
