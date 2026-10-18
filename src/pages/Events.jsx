import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ErrorMessage from '../components/ErrorMessage'
import EventGrid from '../components/EventGrid'
import { fetchEvents, selectEventList } from '../features/events/eventsSlice'
import './Events.css'

function Events() {
  const dispatch = useDispatch()
  const { items, status, error, page } = useSelector(selectEventList)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const request = dispatch(fetchEvents({ page: 0 }))
    return () => request.abort()
  }, [dispatch, reloadKey])

  return (
    <section className="container events-page">
      <header className="page-header">
        <div>
          <h1>Explore events</h1>
          <p>Upcoming concerts, sports, theatre and more from Ticketmaster.</p>
        </div>
        {status === 'succeeded' && (
          <span className="results-count">
            {page.totalElements.toLocaleString()} events found
          </span>
        )}
      </header>

      {status === 'failed' ? (
        <ErrorMessage
          title="Couldn't load events"
          message={error}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      ) : (
        <EventGrid events={items} loading={status === 'loading' || status === 'idle'} skeletonCount={12} />
      )}
    </section>
  )
}

export default Events
