import { Navigate, Route, Routes } from 'react-router-dom'
// The landing / dashboard / timeline / cases / entities app (state-routed internally).
import SiteApp from './src/App.jsx'
import Login from './pages/Login.jsx'
import Reports from './pages/Reports.jsx'

function ProtectedRoute({ children }) {
  const isAuthenticated = Boolean(localStorage.getItem('crimelens_token'))

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Deep links into the state-routed site app.
          Distinct `key`s force a remount so initialPage is re-read —
          without them React reuses the instance and useState keeps the
          page from whichever route mounted first. */}
      <Route
        path="/"
        element={<SiteApp key="home" initialPage="home" />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <SiteApp key="dashboard" initialPage="dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cases"
        element={
          <ProtectedRoute>
            <SiteApp key="cases" initialPage="cases" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/entities"
        element={
          <ProtectedRoute>
            <SiteApp key="entities" initialPage="entities" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/timeline"
        element={
          <ProtectedRoute>
            <SiteApp key="timeline" initialPage="timeline" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/network"
        element={
          <ProtectedRoute>
            <SiteApp key="network" initialPage="network" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/location"
        element={
          <ProtectedRoute>
            <SiteApp key="location" initialPage="location" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SiteApp key="settings" initialPage="settings" />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
