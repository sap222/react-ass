import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import CategoryChips from '../components/CategoryChips'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import EventGrid from '../components/EventGrid'
import FilterPanel from '../components/FilterPanel'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import {
  fetchCategories,
  fetchEvents,
  selectCategories,
  selectEventList,
} from '../features/events/eventsSlice'
import { DEFAULT_FILTERS, PAGE_SIZE, parseFilters } from '../utils/eventFilters'
import './Events.css'

function Events() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { items, status, error, page } = useSelector(selectEventList)
  const categories = useSelector(selectCategories)
  const [reloadKey, setReloadKey] = useState(0)

  const filters = useMemo(() => parseFilters(searchParams), [searchParams])

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const request = dispatch(fetchEvents({ ...filters, size: PAGE_SIZE }))
    return () => request.abort()
  }, [dispatch, filters, reloadKey])

  // Merge changes into the URL. Any filter change sends you back to page 1.
  const updateFilters = (patch, { resetPage = true } = {}) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(patch).forEach(([key, value]) => {
      if (!value || value === DEFAULT_FILTERS[key]) next.delete(key)
      else next.set(key, value)
    })
    if (resetPage) next.delete('page')
    setSearchParams(next)
  }

  const handlePageChange = (newPage) => {
    updateFilters({ page: newPage > 0 ? String(newPage + 1) : '' }, { resetPage: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categoryLink = (segmentId) => {
    const next = new URLSearchParams(searchParams)
    next.delete('page')
    next.delete('genreId')
    if (segmentId) next.set('segmentId', segmentId)
    else next.delete('segmentId')
    const query = next.toString()
    return query ? `/events?${query}` : '/events'
  }

  const isLoading = status === 'loading' || status === 'idle'
  const activeCategory = categories.items.find((c) => c.id === filters.segmentId)

  const renderResults = () => {
    if (status === 'failed') {
      return (
        <ErrorMessage
          title="Couldn't load events"
          message={error}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      )
    }
    if (!isLoading && items.length === 0) {
      return (
        <EmptyState
          title="No events found"
          message="Try a different search term, widen your date range or clear some filters."
          action={
            <button type="button" className="btn btn-primary" onClick={() => setSearchParams({})}>
              Clear all filters
            </button>
          }
        />
      )
    }
    return (
      <>
        <EventGrid events={items} loading={isLoading} skeletonCount={PAGE_SIZE} />
        {!isLoading && (
          <Pagination page={page.number} totalPages={page.totalPages} onPageChange={handlePageChange} />
        )}
      </>
    )
  }

  return (
    <section className="container events-page">
      <header className="page-header">
        <div>
          <h1>{activeCategory ? `${activeCategory.name} events` : 'Explore events'}</h1>
          <p>Upcoming concerts, sports, theatre and more from Ticketmaster.</p>
        </div>
      </header>

      <SearchBar
        key={filters.keyword}
        initialValue={filters.keyword}
        onSearch={(keyword) => updateFilters({ keyword })}
      />

      {categories.items.length > 0 && (
        <div className="events-categories">
          <CategoryChips
            categories={categories.items}
            activeId={filters.segmentId}
            getLink={categoryLink}
          />
        </div>
      )}

      <div className="events-layout">
        <FilterPanel
          filters={filters}
          categories={categories.items}
          onChange={updateFilters}
          onReset={() => setSearchParams({})}
        />

        <div className="events-results">
          {status === 'succeeded' && items.length > 0 && (
            <p className="results-count">
              {page.totalElements.toLocaleString()} events found
              {filters.keyword && (
                <>
                  {' '}for <strong>&ldquo;{filters.keyword}&rdquo;</strong>
                </>
              )}
              {' · '}Page {page.number + 1} of {page.totalPages}
            </p>
          )}
          {renderResults()}
        </div>
      </div>
    </section>
  )
}

export default Events
