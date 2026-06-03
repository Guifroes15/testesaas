import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Store, TrendingUp, Lightbulb,
  Settings, Users, ShieldCheck, LogOut, Zap, Sun, Moon,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { useTheme } from '@/contexts/ThemeContext'

const navItems = [
  { label: 'Dashboard', path: '/app',          icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Lojas',     path: '/app/lojas',     icon: <Store className="w-4 h-4" /> },
  { label: 'Ranking',   path: '/app/ranking',   icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Ideias',    path: '/app/ideias',    icon: <Lightbulb className="w-4 h-4" /> },
  { label: 'Equipe',    path: '/app/equipe',    icon: <Users className="w-4 h-4" /> },
  { label: 'Admin',     path: '/app/admin',     icon: <ShieldCheck className="w-4 h-4" />, adminOnly: true },
  { label: 'Ajustes',   path: '/app/ajustes',   icon: <Settings className="w-4 h-4" /> },
]

export function Sidebar() {
  const { pathname }      = useLocation()
  const { profile, logout } = useAuth()
  const { workspace }     = useWorkspace()
  const { theme, toggle } = useTheme()

  return (
    <aside className="flex flex-col w-72 h-screen bg-brand-medium border-r border-brand-light shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-brand-light">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-purple flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-[var(--text-primary)]">Aure Digital</span>
        </div>
        <button onClick={toggle} className="text-gray-500 hover:text-[var(--text-primary)] transition-colors p-1 rounded-lg hover:bg-brand-light" title="Alternar tema">
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Workspace */}
      {workspace && (
        <div className="px-4 py-3 border-b border-brand-light">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
            <div className="w-5 h-5 rounded bg-brand-purple/20 flex items-center justify-center text-brand-purple text-xs font-bold shrink-0">
              {workspace.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{workspace.name}</p>
              <p className="text-[9px] text-[var(--text-muted)] capitalize">{workspace.planId} · {workspace.status}</p>
            </div>
          </div>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-brand-purple/20 text-brand-purple2'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-brand-light'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-brand-purple" />}
            </Link>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-brand-light">
        <div className="flex items-center gap-3 px-2 py-2">
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple text-xs font-bold">
              {profile?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--text-primary)] truncate">{profile?.name}</p>
            <p className="text-[9px] text-[var(--text-muted)] truncate">{profile?.email}</p>
          </div>
          <button onClick={logout} className="text-gray-500 hover:text-[var(--text-primary)] transition-colors p-1 rounded-lg hover:bg-brand-light" title="Sair">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
