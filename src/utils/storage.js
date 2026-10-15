// Small wrappers so a full/blocked localStorage never crashes the app.

export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore write errors (private mode, quota exceeded, etc.)
  }
}
