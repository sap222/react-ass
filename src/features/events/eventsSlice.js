import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { searchEvents } from '../../services/ticketmaster'

const initialState = {
  list: {
    items: [],
    page: { number: 0, totalPages: 0, totalElements: 0 },
    status: 'idle',
    error: null,
    requestId: null,
  },
  upcoming: {
    items: [],
    status: 'idle',
    error: null,
  },
}

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params, { signal, rejectWithValue }) => {
    try {
      return await searchEvents(params, signal)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
)

export const fetchUpcomingEvents = createAsyncThunk(
  'events/fetchUpcoming',
  async (_, { rejectWithValue }) => {
    try {
      const { events } = await searchEvents({ size: 8, sort: 'date,asc' })
      return events
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
  {
    // Home page data is cached: don't refetch while loading or once loaded.
    condition: (_, { getState }) => {
      const { status } = getState().events.upcoming
      return status !== 'loading' && status !== 'succeeded'
    },
  },
)

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state, action) => {
        state.list.status = 'loading'
        state.list.error = null
        state.list.requestId = action.meta.requestId
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        // Ignore responses from searches that were replaced by a newer one.
        if (state.list.requestId !== action.meta.requestId) return
        state.list.status = 'succeeded'
        state.list.items = action.payload.events
        state.list.page = action.payload.page
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        if (action.meta.aborted || state.list.requestId !== action.meta.requestId) return
        state.list.status = 'failed'
        state.list.error = action.payload ?? 'Could not load events.'
      })
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.upcoming.status = 'loading'
        state.upcoming.error = null
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.upcoming.status = 'succeeded'
        state.upcoming.items = action.payload
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.upcoming.status = 'failed'
        state.upcoming.error = action.payload ?? 'Could not load upcoming events.'
      })
  },
})

export const selectEventList = (state) => state.events.list
export const selectUpcomingEvents = (state) => state.events.upcoming

export default eventsSlice.reducer
