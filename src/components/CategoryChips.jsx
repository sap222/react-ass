import { Link } from 'react-router-dom'
import './CategoryChips.css'

const ICONS = {
  Music: '🎵',
  Sports: '🏟️',
  'Arts & Theatre': '🎭',
  Film: '🎬',
  Miscellaneous: '✨',
}

// `getLink(id)` lets each page decide where a chip points (id is '' for "All").
function CategoryChips({ categories, activeId = '', getLink, showAll = true }) {
  return (
    <div className="category-chips">
      {showAll && (
        <Link to={getLink('')} className={`category-chip ${activeId === '' ? 'is-active' : ''}`}>
          🎟️ All
        </Link>
      )}
      {categories.map((category) => (
        <Link
          key={category.id}
          to={getLink(category.id)}
          className={`category-chip ${activeId === category.id ? 'is-active' : ''}`}
        >
          {ICONS[category.name] ?? '🎟️'} {category.name}
        </Link>
      ))}
    </div>
  )
}

export default CategoryChips
