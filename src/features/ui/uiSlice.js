import { createSlice, nanoid } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
  },
  reducers: {
    showToast: {
      reducer(state, action) {
        // Keep the stack short so toasts never cover the page.
        state.toasts = [...state.toasts.slice(-2), action.payload]
      },
      prepare({ type = 'info', message }) {
        return { payload: { id: nanoid(), type, message } }
      },
    },
    dismissToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
  },
})

export const { showToast, dismissToast } = uiSlice.actions

export const selectToasts = (state) => state.ui.toasts

export default uiSlice.reducer
