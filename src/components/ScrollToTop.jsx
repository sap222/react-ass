import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll to the top when moving to a different page (not on query-string changes).
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
