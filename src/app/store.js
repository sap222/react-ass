import { configureStore } from '@reduxjs/toolkit'
import authReducer, { AUTH_STORAGE_KEY } from '../features/auth/authSlice'
import eventsReducer from '../features/events/eventsSlice'
import registrationsReducer, {
  REGISTRATIONS_STORAGE_KEY,
} from '../features/registrations/registrationsSlice'
import uiReducer from '../features/ui/uiSlice'
import { saveState } from '../utils/storage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
    ui: uiReducer,
  },
})

// Persist the parts of the state that should survive a page refresh.
let lastAuth
let lastRegistrations
store.subscribe(() => {
  const { auth, registrations } = store.getState()
  if (auth !== lastAuth) {
    lastAuth = auth
    saveState(AUTH_STORAGE_KEY, { users: auth.users, currentUser: auth.currentUser })
  }
  if (registrations.byUser !== lastRegistrations) {
    lastRegistrations = registrations.byUser
    saveState(REGISTRATIONS_STORAGE_KEY, registrations.byUser)
  }
})
