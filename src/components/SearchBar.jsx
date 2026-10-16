import { useState } from 'react'
import './SearchBar.css'

// Remount with a new `key` to sync it with an externally changed keyword.
function SearchBar({ initialValue = '', onSearch, placeholder = 'Search events, artists, teams or venues' }) {
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(value.trim())
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <span className="search-bar-icon" aria-hidden="true">⌕</span>
      <input
        type="search"
        aria-label="Search events"
        placeholder={placeholder}
        value={value}
        maxLength={100}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button type="button" className="search-bar-clear" aria-label="Clear search" onClick={handleClear}>
          ×
        </button>
      )}
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  )
}

export default SearchBar
