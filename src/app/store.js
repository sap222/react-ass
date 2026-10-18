import { configureStore } from '@reduxjs/toolkit'
import authReducer, { AUTH_STORAGE_KEY } from '../features/auth/authSlice'
import eventsReducer from '../features/events/eventsSlice'
import { saveState } from '../utils/storage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
  },
})

// Persist the parts of the state that should survive a page refresh.
let lastAuth
store.subscribe(() => {
  const { auth } = store.getState()
  if (auth === lastAuth) return
  lastAuth = auth
  saveState(AUTH_STORAGE_KEY, { users: auth.users, currentUser: auth.currentUser })
})
