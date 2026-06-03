import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Building2, TrendingUp, AlertCircle, Search } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { listWorkspaces } from '@/lib/firestore'
import type { Workspace } from '@/types'

const planColor = {
  starter:    'gray',
  pro:        'green',
  enterprise: 'purple',
} as const

const statusColor = {
  active:    'green',
  trialing:  'blue',
  suspended: 'yellow',
  cancelled: 'red',
} as const

const statusLabel = {
  active:    'Ativo',
  trialing:  'Trial',
  suspended: 'Suspenso',
  cancelled: 'Cancelado',
}

export function Admin() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    listWorkspaces()
      .then(setWorkspaces)
      .finally(() => setLoading(false))
  }, [])

  const filtered = workspaces.filter(ws =>
    ws.name.toLowerCase().includes(search.toLowerCase()) ||
    ws.slug.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total:     workspaces.length,
    active:    workspaces.filter(w => w.status === 'active').length,
    trialing:  workspaces.filter(w => w.status === 'trialing').length,
    pro:       workspaces.filter(w => w.planId === 'pro').length,
    enterprise: workspaces.filter(w => w.planId === 'enterprise').length,
    mrr:       workspaces
      .filter(w => w.status === 'active')
      .reduce((acc, w) => {
        const prices = { starter: 97, pro: 247, enterprise: 597 }
        return acc + (prices[w.planId] ?? 0)
      }, 0),
  }

  return (
    <div>
      <Header title="Painel Admin" subtitle="Gestão de workspaces e clientes" />

      <div className="p-6 space-y-6 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total de workspaces', value: stats.total, icon: <Building2 className="w-4 h-4" />, color: 'text-green-500' },
            { label: 'Em trial', value: stats.trialing, icon: <AlertCircle className="w-4 h-4" />, color: 'text-blue-500' },
            { label: 'Plano Pro / Enterprise', value: `${stats.pro + stats.enterprise}`, icon: <Users className="w-4 h-4" />, color: 'text-purple-500' },
            { label: 'MRR estimado', value: `R$ ${stats.mrr.toLocaleString('pt-BR')}`, icon: <TrendingUp className="w-4 h-4" />, color: 'text-green-500' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-4"
            >
              <div className={`mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Workspace list */}
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
            <h2 className="font-semibold">Workspaces ({filtered.length})</h2>
            <div className="w-56">
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5" />}
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-muted text-sm">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted text-sm">
              {search ? 'Nenhum workspace encontrado.' : 'Nenhum workspace criado ainda.'}
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {filtered.map(ws => (
                <div
                  key={ws.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--color-border)]/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 font-bold text-sm shrink-0">
                    {ws.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{ws.name}</p>
                    <p className="text-xs text-muted">/{ws.slug}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={planColor[ws.planId]}>
                      {ws.planId}
                    </Badge>
                    <Badge variant={statusColor[ws.status]} dot>
                      {statusLabel[ws.status]}
                    </Badge>
                  </div>
                  <div className="text-right shrink-0 hidden md:block">
                    <p className="text-xs text-muted">{ws.memberCount} membros</p>
                    <p className="text-xs text-muted">{ws.storeCount} lojas</p>
                  </div>
                  <div className="text-right shrink-0 hidden lg:block">
                    <p className="text-xs text-muted">
                      {new Date(ws.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                    {ws.status === 'trialing' && ws.trialEndsAt && (
                      <p className="text-xs text-blue-500">
                        Trial até {new Date(ws.trialEndsAt).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
