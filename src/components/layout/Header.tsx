import { Sun, Moon, Bell } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { theme, toggle } = useTheme()

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={toggle} className="btn-ghost p-2 rounded-lg" title="Alternar tema">
          {theme === 'dark'
            ? <Sun className="w-4 h-4" />
            : <Moon className="w-4 h-4" />}
        </button>
        <button className="btn-ghost p-2 rounded-lg relative" title="Notificações">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-green-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
