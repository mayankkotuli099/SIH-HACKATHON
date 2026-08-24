import { Navigate, Route, Routes } from 'react-router-dom'
// The landing / dashboard / timeline / cases / entities app (state-routed internally).
import SiteApp from './src/App.jsx'
import Login from './pages/Login.jsx'
import Reports from './pages/Reports.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reports" element={<Reports />} />

      {/* Deep links into the state-routed site app.
          Distinct `key`s force a remount so initialPage is re-read —
          without them React reuses the instance and useState keeps the
          page from whichever route mounted first. */}
      <Route path="/" element={<SiteApp key="home" initialPage="home" />} />
      <Route
        path="/dashboard"
        element={<SiteApp key="dashboard" initialPage="dashboard" />}
      />
      <Route
        path="/cases"
        element={<SiteApp key="cases" initialPage="cases" />}
      />
      <Route
        path="/entities"
        element={<SiteApp key="entities" initialPage="entities" />}
      />
      <Route
        path="/timeline"
        element={<SiteApp key="timeline" initialPage="timeline" />}
      />
      <Route
        path="/network"
        element={<SiteApp key="network" initialPage="network" />}
      />
      <Route
        path="/settings"
        element={<SiteApp key="settings" initialPage="settings" />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
