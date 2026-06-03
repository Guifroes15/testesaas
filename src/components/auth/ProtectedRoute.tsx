import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { PageSpinner } from '@/components/ui/Spinner'
import { IS_DEMO } from '@/lib/demo'

export function ProtectedRoute() {
  const { firebaseUser, profile, loading } = useAuth()

  if (loading) return <PageSpinner />

  // no demo mode, only check profile (no firebaseUser)
  if (!IS_DEMO && !firebaseUser) return <Navigate to="/login" replace />
  if (IS_DEMO && !profile) return <Navigate to="/login" replace />

  if (!profile?.workspaceId) return <Navigate to="/onboarding" replace />

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { firebaseUser, profile, loading } = useAuth()
  if (loading) return <PageSpinner />
  if (IS_DEMO ? !!profile : !!firebaseUser) return <Navigate to="/app" replace />
  return <Outlet />
}
