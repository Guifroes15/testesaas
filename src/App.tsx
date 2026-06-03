import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { WorkspaceProvider } from '@/contexts/WorkspaceContext'
import { ProtectedRoute, PublicOnlyRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Onboarding } from '@/pages/Onboarding'
import { Dashboard } from '@/pages/Dashboard'
import { Admin } from '@/pages/Admin'
import { Settings } from '@/pages/Settings'

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center gap-3">
      <p className="text-4xl font-bold">🚧</p>
      <p className="font-semibold text-lg">{label}</p>
      <p className="text-muted text-sm">Em breve. Fique de olho!</p>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <WorkspaceProvider>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />

              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Onboarding — auth required, no workspace */}
              <Route path="/onboarding" element={<Onboarding />} />

              {/* App — auth + workspace required */}
              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="lojas"    element={<ComingSoon label="Gestão de lojas" />} />
                  <Route path="ranking"  element={<ComingSoon label="Ranking de lojas" />} />
                  <Route path="ideias"   element={<ComingSoon label="Gestão de ideias" />} />
                  <Route path="equipe"   element={<ComingSoon label="Equipe & membros" />} />
                  <Route path="admin"    element={<Admin />} />
                  <Route path="ajustes"  element={<Settings />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </WorkspaceProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
