import './DetailItem.css'

function DetailItem({ icon, label, children }) {
  return (
    <div className="detail-item">
      <span className="detail-item-icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <span className="detail-item-label">{label}</span>
        <div className="detail-item-value">{children}</div>
      </div>
    </div>
  )
}

export default DetailItem
