import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import ScrollToTop from './ScrollToTop'
import ToastContainer from './ToastContainer'
import './Layout.css'

function Layout() {
  return (
    <div className="layout">
      <ScrollToTop />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="layout-main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="layout-footer">
        <div className="container">
          <p>
            © {new Date().getFullYear()} EventHub · Event data provided by the{' '}
            <a href="https://developer.ticketmaster.com/" target="_blank" rel="noreferrer">
              Ticketmaster Discovery API
            </a>
          </p>
        </div>
      </footer>
      <ToastContainer />
    </div>
  )
}

export default Layout
