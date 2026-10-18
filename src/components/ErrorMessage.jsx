import './ErrorMessage.css'

function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <span className="error-message-icon" aria-hidden="true">!</span>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {onRetry && (
        <button type="button" className="btn btn-outline btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
