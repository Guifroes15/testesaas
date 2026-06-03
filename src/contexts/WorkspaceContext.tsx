import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { IS_DEMO, DEMO_WORKSPACE } from '@/lib/demo'
import type { Workspace, Store } from '@/types'

interface WorkspaceContextValue {
  workspace: Workspace | null
  stores: Store[]
  loading: boolean
  refresh: () => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth()
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    if (IS_DEMO) {
      if (profile?.workspaceId) setWorkspace(DEMO_WORKSPACE)
      setStores([])
      setLoading(false)
      return
    }

    if (!profile?.workspaceId) {
      setWorkspace(null)
      setStores([])
      setLoading(false)
      return
    }

    setLoading(true)
    const { getWorkspace, getWorkspaceStores } = await import('@/lib/firestore')
    const [ws, st] = await Promise.all([
      getWorkspace(profile.workspaceId),
      getWorkspaceStores(profile.workspaceId),
    ])
    setWorkspace(ws)
    setStores(st)
    setLoading(false)
  }

  useEffect(() => { load() }, [profile?.workspaceId])

  return (
    <WorkspaceContext.Provider value={{ workspace, stores, loading, refresh: load }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return ctx
}
