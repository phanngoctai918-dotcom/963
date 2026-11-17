import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import ExperimentPage from '../pages/ExperimentPage'
import SettingsPage from '../pages/SettingsPage'
import HelpPage from '../pages/HelpPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/experiments/exp-001" replace />} />
        <Route path="experiments/:experimentId" element={<ExperimentPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
