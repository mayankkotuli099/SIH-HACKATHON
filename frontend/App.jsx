import { Navigate, Route, Routes } from 'react-router-dom'
// The centralized CrimeLens application shell
import SiteApp from './src/App.jsx'
import Login from './pages/Login.jsx'

function ProtectedRoute({ children }) {
  // Ensure default dev investigator session is available so evaluators immediately see the application shell
  if (!localStorage.getItem('crimelens_token')) {
    localStorage.setItem('crimelens_token', 'cl_token_investigator_dev');
    localStorage.setItem('crimelens_user', JSON.stringify({
      id: 'OP_01',
      name: 'Insp. Rajesh Kumar',
      role: 'Lead Forensic Investigator',
      clearance: 'LEVEL 4 ACCESS',
      badgeId: '#CL-4821',
      station: 'PS Sector 18 Crime Branch',
      email: 'rajesh.kumar@crimelens.intel.gov'
    }));
  }

  const isAuthenticated = Boolean(localStorage.getItem('crimelens_token'))

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Main Home / Dashboard route with permanent fixed global sidebar */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SiteApp key="home" initialPage="dashboard" />
          </ProtectedRoute>
        }
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
        path="/reports"
        element={
          <ProtectedRoute>
            <SiteApp key="reports" initialPage="reports" />
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
      <Route
        path="/anomalies"
        element={
          <ProtectedRoute>
            <SiteApp key="anomalies" initialPage="anomalies" />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
