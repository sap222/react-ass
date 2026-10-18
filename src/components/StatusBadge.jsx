import './StatusBadge.css'

const STATUSES = {
  onsale: { label: 'On sale', tone: 'success' },
  offsale: { label: 'Off sale', tone: 'muted' },
  canceled: { label: 'Cancelled', tone: 'danger' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
  postponed: { label: 'Postponed', tone: 'warning' },
  rescheduled: { label: 'Rescheduled', tone: 'warning' },
}

function StatusBadge({ status }) {
  const config = STATUSES[status]
  if (!config) return null
  return <span className={`status-badge status-${config.tone}`}>{config.label}</span>
}

export default StatusBadge
