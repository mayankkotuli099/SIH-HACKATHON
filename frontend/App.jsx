import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Reports from './pages/Reports.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reports" element={<Reports />} />
      {/* Nav destinations that don't exist yet land on Reports */}
      <Route path="*" element={<Navigate to="/reports" replace />} />
    </Routes>
  )
}

export default App
