import { useEffect, useState } from 'react'

function ShareButton({ title }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
      }
    } catch {
      // User closed the share sheet or clipboard access was denied.
    }
  }

  return (
    <button type="button" className="btn btn-outline btn-block" onClick={handleShare}>
      {copied ? '✓ Link copied' : '🔗 Share event'}
    </button>
  )
}

export default ShareButton
