import './Loader.css'

function Loader({ message = 'Loading…' }) {
  return (
    <div className="loader" role="status">
      <span className="loader-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}

export default Loader
