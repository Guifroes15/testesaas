import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Store, TrendingUp, Lightbulb,
  Settings, Users, ShieldCheck, LogOut, ChevronDown,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { Badge } from '@/components/ui/Badge'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  badge?: string
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard',  path: '/app',           icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Lojas',      path: '/app/lojas',      icon: <Store className="w-4 h-4" /> },
  { label: 'Ranking',    path: '/app/ranking',    icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Ideias',     path: '/app/ideias',     icon: <Lightbulb className="w-4 h-4" /> },
  { label: 'Equipe',     path: '/app/equipe',     icon: <Users className="w-4 h-4" /> },
  { label: 'Admin',      path: '/app/admin',      icon: <ShieldCheck className="w-4 h-4" />, adminOnly: true },
  { label: 'Ajustes',    path: '/app/ajustes',    icon: <Settings className="w-4 h-4" /> },
]

export function Sidebar() {
  const { pathname } = useLocation()
  const { profile, logout } = useAuth()
  const { workspace } = useWorkspace()

  return (
    <aside className="flex flex-col w-60 h-screen border-r border-[var(--color-border)] bg-[var(--color-surface)] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[var(--color-border)]">
        <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
          <Zap className="w-4 h-4 text-black" />
        </div>
        <span className="font-bold text-base tracking-tight">Aure</span>
        {workspace?.planId && (
          <Badge variant={workspace.planId === 'enterprise' ? 'purple' : workspace.planId === 'pro' ? 'green' : 'gray'}>
            {workspace.planId}
          </Badge>
        )}
      </div>

      {/* Workspace Selector */}
      {workspace && (
        <div className="px-3 py-3 border-b border-[var(--color-border)]">
          <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--color-border)] transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center text-green-500 text-xs font-bold shrink-0">
                {workspace.name[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium truncate">{workspace.name}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--color-muted)] shrink-0" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map(item => {
          if (item.adminOnly && profile?.role !== 'superadmin') return null
          const isActive = item.path === '/app'
            ? pathname === '/app'
            : pathname.startsWith(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && <Badge variant="green">{item.badge}</Badge>}
            </Link>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3 px-2 py-2">
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs font-bold">
              {profile?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.name}</p>
            <p className="text-xs text-muted truncate">{profile?.email}</p>
          </div>
          <button onClick={logout} className="btn-ghost p-1.5 rounded-md" title="Sair">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
