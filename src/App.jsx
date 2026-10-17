import { Route, Routes } from 'react-router-dom'
import GuestRoute from './components/GuestRoute'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import EventDetails from './pages/EventDetails'
import Events from './pages/Events'
import Home from './pages/Home'
import Login from './pages/Login'
import MyEvents from './pages/MyEvents'
import NotFound from './pages/NotFound'
import Register from './pages/Register'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />

        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="my-events" element={<MyEvents />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
