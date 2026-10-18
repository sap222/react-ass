import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { hashPassword } from '../../utils/hash'
import { loadState } from '../../utils/storage'

export const AUTH_STORAGE_KEY = 'eventhub_auth'

const persisted = loadState(AUTH_STORAGE_KEY, {})

const initialState = {
  users: persisted.users ?? [],
  currentUser: persisted.currentUser ?? null,
  status: 'idle',
  error: null,
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { getState, rejectWithValue }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const exists = getState().auth.users.some((u) => u.email === normalizedEmail)
    if (exists) {
      return rejectWithValue('An account with this email already exists.')
    }
    return {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
    }
  },
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { getState, rejectWithValue }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const user = getState().auth.users.find((u) => u.email === normalizedEmail)
    const passwordHash = await hashPassword(password)
    if (!user || user.passwordHash !== passwordHash) {
      return rejectWithValue('Invalid email or password.')
    }
    return user
  },
)

const toSessionUser = ({ id, name, email, createdAt }) => ({ id, name, email, createdAt })

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'idle'
        state.users.push(action.payload)
        state.currentUser = toSessionUser(action.payload)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'idle'
        state.error = action.payload ?? 'Registration failed.'
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle'
        state.currentUser = toSessionUser(action.payload)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'idle'
        state.error = action.payload ?? 'Login failed.'
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions

export const selectCurrentUser = (state) => state.auth.currentUser
export const selectIsAuthenticated = (state) => Boolean(state.auth.currentUser)
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer
