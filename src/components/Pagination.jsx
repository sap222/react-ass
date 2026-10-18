import './Pagination.css'

// Builds e.g. [0, '…', 4, 5, 6, '…', 20] around the current (0-based) page.
function getPageItems(current, total) {
  const pages = new Set([0, total - 1, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 0 && p < total).sort((a, b) => a - b)
  return sorted.flatMap((page, i) => (i > 0 && page - sorted[i - 1] > 1 ? ['…', page] : [page]))
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination-btn"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        ‹ Prev
      </button>

      {getPageItems(page, totalPages).map((item, i) =>
        item === '…' ? (
          <span key={`gap-${i}`} className="pagination-gap">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`pagination-btn ${item === page ? 'is-active' : ''}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
          >
            {item + 1}
          </button>
        ),
      )}

      <button
        type="button"
        className="pagination-btn"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Next ›
      </button>
    </nav>
  )
}

export default Pagination
