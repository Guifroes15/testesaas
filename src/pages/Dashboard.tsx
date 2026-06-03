import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, DollarSign, Store,
  Users, MessageSquare, Plus, ArrowUpRight,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'

interface MetricCardProps {
  label: string
  value: string
  change: string
  positive: boolean
  icon: React.ReactNode
  delay?: number
}

function MetricCard({ label, value, change, positive, icon, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
          <span className="text-green-500">{icon}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-500' : 'text-red-500'}`}>
          {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </motion.div>
  )
}

const DEMO_STORES = [
  { name: 'Loja Centro',       conv: 5.2, fat: 48200, msgs: 920,  trend: 'up' },
  { name: 'Loja Norte',        conv: 4.7, fat: 39800, msgs: 847,  trend: 'up' },
  { name: 'Loja Sul',          conv: 3.9, fat: 33100, msgs: 710,  trend: 'down' },
  { name: 'Loja Shopping MG',  conv: 6.1, fat: 61000, msgs: 1002, trend: 'up' },
  { name: 'Loja Outlet',       conv: 2.8, fat: 21400, msgs: 764,  trend: 'down' },
]

const DEMO_IDEAS = [
  { title: 'Campanha Dia dos Pais', status: 'em_andamento', priority: 'alta' },
  { title: 'Stories com IA — produto novo', status: 'backlog', priority: 'media' },
  { title: 'Email retargeting VIP', status: 'backlog', priority: 'alta' },
]

const priorityColor = { alta: 'red', media: 'yellow', baixa: 'gray' } as const
const statusLabel = {
  backlog: 'Backlog',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  descartada: 'Descartada',
} as const

export function Dashboard() {
  const { workspace, stores } = useWorkspace()
  const displayStores = stores.length > 0 ? stores : DEMO_STORES.map((s, i) => ({ ...s, id: String(i) }))

  const totalFat = DEMO_STORES.reduce((a, s) => a + s.fat, 0)
  const avgConv  = (DEMO_STORES.reduce((a, s) => a + s.conv, 0) / DEMO_STORES.length).toFixed(1)

  return (
    <div>
      <Header
        title={`Olá, ${workspace?.name ?? 'seu workspace'} 👋`}
        subtitle="Resumo do mês atual"
      />

      <div className="p-6 space-y-6 max-w-6xl">
        {/* Trial banner */}
        {workspace?.status === 'trialing' && workspace.trialEndsAt && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20"
          >
            <div>
              <p className="text-sm font-medium text-green-500">Período de teste ativo</p>
              <p className="text-xs text-muted">
                Seu trial vai até {new Date(workspace.trialEndsAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <Link to="/app/ajustes">
              <Button size="sm">Assinar plano</Button>
            </Link>
          </motion.div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Faturamento total"
            value={`R$ ${totalFat.toLocaleString('pt-BR')}`}
            change="+18% vs mês ant."
            positive
            icon={<DollarSign className="w-4 h-4" />}
            delay={0}
          />
          <MetricCard
            label="Conversão média"
            value={`${avgConv}%`}
            change="+0,8pp"
            positive
            icon={<TrendingUp className="w-4 h-4" />}
            delay={0.05}
          />
          <MetricCard
            label="Lojas ativas"
            value={String(DEMO_STORES.length)}
            change="+2 este mês"
            positive
            icon={<Store className="w-4 h-4" />}
            delay={0.1}
          />
          <MetricCard
            label="Total de mensagens"
            value={DEMO_STORES.reduce((a, s) => a + s.msgs, 0).toLocaleString('pt-BR')}
            change="-3% vs mês ant."
            positive={false}
            icon={<MessageSquare className="w-4 h-4" />}
            delay={0.15}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Store table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 card"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
              <div>
                <h2 className="font-semibold">Desempenho por loja</h2>
                <p className="text-xs text-muted">Junho 2025</p>
              </div>
              <Link to="/app/lojas">
                <Button size="sm" variant="secondary" icon={<Plus className="w-3.5 h-3.5" />}>
                  Nova loja
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {DEMO_STORES.map(store => {
                const maxFat = Math.max(...DEMO_STORES.map(s => s.fat))
                const pct = Math.round((store.fat / maxFat) * 100)
                return (
                  <div key={store.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-border)]/40 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 text-xs font-bold shrink-0">
                      {store.name[5].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{store.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted shrink-0">{store.conv}% conv.</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">R$ {store.fat.toLocaleString('pt-BR')}</p>
                      <p className={`text-xs ${store.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {store.trend === 'up' ? '↑' : '↓'} {store.msgs} msgs
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Ideas panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card"
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
              <h2 className="font-semibold">Ideias recentes</h2>
              <Link to="/app/ideias">
                <button className="btn-ghost p-1.5">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {DEMO_IDEAS.map(idea => (
                <div key={idea.title} className="px-5 py-3.5">
                  <p className="text-sm font-medium mb-2">{idea.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusLabel[idea.status as keyof typeof statusLabel] === 'Em andamento' ? 'green' : 'gray'} dot>
                      {statusLabel[idea.status as keyof typeof statusLabel]}
                    </Badge>
                    <Badge variant={priorityColor[idea.priority as keyof typeof priorityColor]}>
                      {idea.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-[var(--color-border)]">
              <Link to="/app/ideias">
                <Button variant="secondary" size="sm" fullWidth icon={<Plus className="w-3.5 h-3.5" />}>
                  Nova ideia
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
