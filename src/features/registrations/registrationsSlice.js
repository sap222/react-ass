import { createSlice } from '@reduxjs/toolkit'
import { isPastEvent } from '../../utils/format'
import { loadState } from '../../utils/storage'
import { showToast } from '../ui/uiSlice'

export const REGISTRATIONS_STORAGE_KEY = 'eventhub_registrations'

// Registrations are grouped by user id: { [userId]: [{ eventId, registeredAt, event }] }.
// A snapshot of the event is stored so My Events works without re-fetching.
const initialState = {
  byUser: loadState(REGISTRATIONS_STORAGE_KEY, {}),
}

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    eventRegistered: {
      reducer(state, action) {
        const { userId, event, registeredAt } = action.payload
        const list = (state.byUser[userId] ??= [])
        // Reducer-level guard: never store the same event twice for a user.
        if (list.some((r) => r.eventId === event.id)) return
        list.push({ eventId: event.id, registeredAt, event })
      },
      prepare({ userId, event }) {
        return { payload: { userId, event, registeredAt: new Date().toISOString() } }
      },
    },
    registrationCancelled(state, action) {
      const { userId, eventId } = action.payload
      const list = state.byUser[userId]
      if (!list) return
      state.byUser[userId] = list.filter((r) => r.eventId !== eventId)
    },
  },
})

export const { eventRegistered, registrationCancelled } = registrationsSlice.actions

const EMPTY = []

export const selectUserRegistrations = (state) => {
  const userId = state.auth.currentUser?.id
  return (userId && state.registrations.byUser[userId]) || EMPTY
}

export const selectIsRegistered = (state, eventId) =>
  selectUserRegistrations(state).some((r) => r.eventId === eventId)

// Thunks: validate, update state and give the user feedback in one place.
export const registerForEvent = (event) => (dispatch, getState) => {
  const state = getState()
  const user = state.auth.currentUser

  if (!user) {
    dispatch(showToast({ type: 'error', message: 'Please log in to register for events.' }))
    return false
  }
  if (selectIsRegistered(state, event.id)) {
    dispatch(showToast({ type: 'info', message: `You're already registered for ${event.name}.` }))
    return false
  }
  if (event.status === 'canceled' || event.status === 'cancelled') {
    dispatch(showToast({ type: 'error', message: 'This event has been cancelled.' }))
    return false
  }
  if (isPastEvent(event)) {
    dispatch(showToast({ type: 'error', message: 'This event has already taken place.' }))
    return false
  }

  dispatch(eventRegistered({ userId: user.id, event }))
  dispatch(showToast({ type: 'success', message: `You're registered for ${event.name}! 🎉` }))
  return true
}

export const cancelRegistration = (event) => (dispatch, getState) => {
  const user = getState().auth.currentUser
  if (!user) return
  dispatch(registrationCancelled({ userId: user.id, eventId: event.id }))
  dispatch(showToast({ type: 'info', message: `Registration for ${event.name} cancelled.` }))
}

export default registrationsSlice.reducer
