import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCategories, searchEvents } from '../../services/ticketmaster'

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
  categories: {
    items: [],
    status: 'idle',
    error: null,
  },
}

// Load cached data only once: skip while a request is running or after success.
const notLoadedYet = (key) => (_, { getState }) => {
  const { status } = getState().events[key]
  return status !== 'loading' && status !== 'succeeded'
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
  { condition: notLoadedYet('upcoming') },
)

export const fetchCategories = createAsyncThunk(
  'events/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await getCategories()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
  { condition: notLoadedYet('categories') },
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
      .addCase(fetchCategories.pending, (state) => {
        state.categories.status = 'loading'
        state.categories.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.status = 'succeeded'
        state.categories.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.status = 'failed'
        state.categories.error = action.payload ?? 'Could not load categories.'
      })
  },
})

export const selectEventList = (state) => state.events.list
export const selectUpcomingEvents = (state) => state.events.upcoming
export const selectCategories = (state) => state.events.categories

export default eventsSlice.reducer
