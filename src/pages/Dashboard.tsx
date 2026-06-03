import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { DollarSign, TrendingUp, Store, Percent, Calendar } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { ChartCard, ChartTooltip } from '@/components/ui/ChartCard'
import { MonthFilter } from '@/components/ui/MonthFilter'
import { HealthDot } from '@/components/ui/HealthBadge'
import { ultimoMes, calcRoi, formatBRL } from '@/utils/store'
import { DEMO_STORES } from '@/lib/demoData'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { Badge } from '@/components/ui/Badge'
import { Link } from 'react-router-dom'

const ALL_MONTHS = ['2025-01','2025-02','2025-03','2025-04','2025-05','2025-06']
const LABELS: Record<string, string> = {
  '2025-01':'Jan/25','2025-02':'Fev/25','2025-03':'Mar/25',
  '2025-04':'Abr/25','2025-05':'Mai/25','2025-06':'Jun/25',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 150, damping: 18 } },
}

export function Dashboard() {
  const { workspace } = useWorkspace()
  const navigate = useNavigate()
  const stores = DEMO_STORES

  const presentChaves = useMemo(() => {
    const set = new Set<string>()
    stores.forEach(s => s.historico.forEach(m => set.add(m.chave)))
    return ALL_MONTHS.filter(m => set.has(m))
  }, [stores])

  const presentLabels = presentChaves.map(c => LABELS[c] ?? c)

  const [selectedMonths, setSelectedMonths] = useState(new Set(presentChaves))
  const [showFilter, setShowFilter] = useState(false)

  const filteredStores = useMemo(() =>
    stores.map(s => ({ ...s, historico: s.historico.filter(m => selectedMonths.has(m.chave)) })),
    [stores, selectedMonths]
  )

  const totalVendasTrafego    = filteredStores.reduce((a, s) => a + s.historico.reduce((b, m) => b + m.vendas, 0), 0)
  const totalFaturamentoGeral = filteredStores.reduce((a, s) => a + s.historico.reduce((b, m) => b + m.faturamentoLoja, 0), 0)

  const melhorLoja = [...stores].sort((a, b) => ultimoMes(b).vendas - ultimoMes(a).vendas)[0]
  const lojasPosRoi = filteredStores.filter(s => calcRoi(s, s.fee).roiTotal > 0).length

  const evolucaoData = presentChaves
    .filter(c => selectedMonths.has(c))
    .map(chave => ({
      name: LABELS[chave],
      total: stores.reduce((acc, s) => acc + (s.historico.find(h => h.chave === chave)?.vendas ?? 0), 0),
    }))

  const rankingData = stores.map(s => ({
    name: s.name.split(' ').slice(0, 2).join(' '),
    vendas: ultimoMes(s).vendas,
    color: s.color,
  })).sort((a, b) => b.vendas - a.vendas)

  const hasConversao = stores.some(s => s.historico.some(m => m.conversao > 0))

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 md:p-10 space-y-6">

      {/* Header */}
      <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {workspace?.name ?? 'Dashboard'}
            </h1>
          </div>
          <p className="text-xs lg:text-sm text-[var(--text-secondary)]">
            {stores.length} lojas · Visão Geral do Período
          </p>
        </div>

        <div className="flex items-center gap-3">
          {workspace?.status === 'trialing' && workspace.trialEndsAt && (
            <Link to="/app/ajustes">
              <Badge variant="blue" dot>
                Trial até {new Date(workspace.trialEndsAt).toLocaleDateString('pt-BR')}
              </Badge>
            </Link>
          )}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              showFilter
                ? 'bg-brand-purple border-brand-purple text-white shadow-lg shadow-brand-purple/20'
                : 'bg-brand-light border-brand-light text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {showFilter ? 'Ocultar Filtros' : 'Filtrar Período'}
          </button>
        </div>
      </motion.header>

      {/* Month Filter */}
      <AnimatePresence>
        {showFilter && presentChaves.length > 1 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-brand-medium border border-brand-light rounded-2xl px-5 py-4">
              <MonthFilter
                allMonths={presentChaves}
                monthLabels={presentLabels}
                selected={selectedMonths}
                onChange={setSelectedMonths}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedMonths.size < presentChaves.length && (
        <motion.div variants={itemVariants} className="px-3 py-2 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-between">
          <p className="text-[10px] text-brand-purple2">Exibindo {selectedMonths.size} de {presentChaves.length} meses</p>
          <button onClick={() => setSelectedMonths(new Set(presentChaves))} className="text-[10px] text-brand-purple2 underline">Ver todos</button>
        </motion.div>
      )}

      {/* KPIs */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <motion.div variants={itemVariants}><StatCard label="Faturamento Geral"  value={formatBRL(totalFaturamentoGeral)} icon={DollarSign} /></motion.div>
        <motion.div variants={itemVariants}><StatCard label="Venda Tráfego"      value={formatBRL(totalVendasTrafego)} icon={TrendingUp} /></motion.div>
        <motion.div variants={itemVariants}><StatCard label="Melhor Loja"        value={melhorLoja ? formatBRL(ultimoMes(melhorLoja).vendas) : '—'} subtext={melhorLoja?.name} icon={Store} /></motion.div>
        <motion.div variants={itemVariants}><StatCard label="Lojas c/ ROI +"     value={`${lojasPosRoi} / ${stores.length}`} subtext="no período selecionado" icon={Percent} /></motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={itemVariants}>
          <ChartCard title="Evolução consolidada (R$)" subtitle={`Soma de todas as lojas · ${selectedMonths.size} meses`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucaoData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e28" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dy={6} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="total" name="Vendas" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3, fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ChartCard title="Ranking — último mês (R$)" subtitle="Independente do filtro">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankingData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e28" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 9 }} width={90} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="vendas" name="Vendas" radius={[0, 4, 4, 0]}>
                  {rankingData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
      </motion.div>

      {/* Store table */}
      <motion.div variants={itemVariants} className="bg-brand-medium border border-brand-light rounded-xl overflow-hidden">
        <div className="p-4 border-b border-brand-light flex items-center justify-between">
          <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Resumo por loja</h3>
          {selectedMonths.size < presentChaves.length && (
            <span className="text-[9px] text-brand-purple2 bg-brand-purple/10 px-2 py-0.5 rounded">{selectedMonths.size} meses filtrados</span>
          )}
        </div>

        {/* Mobile */}
        <div className="block lg:hidden divide-y divide-brand-light">
          {filteredStores.map((store) => {
            const r    = calcRoi(store, store.fee)
            return (
              <button key={store.id} onClick={() => navigate(`/app/lojas/${store.id}`)}
                className="w-full p-4 text-left hover:bg-brand-light/20 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: store.color }} />
                  <span className="text-sm font-semibold text-[var(--text-primary)] flex-1">{store.name}</span>
                  <HealthDot store={store} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Fat. Total', v: formatBRL(store.historico.reduce((a, m) => a + m.faturamentoLoja, 0)) },
                    { label: 'Tráfego',   v: formatBRL(store.historico.reduce((a, m) => a + m.vendas, 0)) },
                    { label: 'ROI',       v: formatBRL(r.roiTotal), color: r.status === 'positivo' ? '#22c55e' : '#ef4444' },
                  ].map(item => (
                    <div key={item.label} className="bg-brand-light rounded p-1.5 text-center">
                      <p className="text-[8px] text-[var(--text-muted)] mb-0.5">{item.label}</p>
                      <p className="text-[10px] font-bold" style={{ color: item.color ?? 'var(--text-primary)' }}>{item.v}</p>
                    </div>
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {/* Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Loja', 'Fat. Total (período)', 'Venda Tráfego (período)', hasConversao ? 'Conv.' : '% Fat.', 'ROI período', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light">
              {filteredStores.map((store, idx) => {
                const u = ultimoMes(DEMO_STORES[idx])
                const r = calcRoi(store, store.fee)
                const fatAcum  = store.historico.reduce((a, m) => a + m.faturamentoLoja, 0)
                const vendAcum = store.historico.reduce((a, m) => a + m.vendas, 0)
                const convOuFat = hasConversao ? `${u?.conversao.toFixed(1) ?? 0}%` : `${u?.pctAureFat.toFixed(1) ?? 0}%`
                return (
                  <tr key={store.id} onClick={() => navigate(`/app/lojas/${store.id}`)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: store.color }} />
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{store.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-[var(--text-primary)]">{formatBRL(fatAcum)}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-brand-purple2">{formatBRL(vendAcum)}</td>
                    <td className="px-5 py-3.5 text-sm text-[var(--text-secondary)]">{convOuFat}</td>
                    <td className="px-5 py-3.5 text-sm font-bold" style={{ color: r.status === 'positivo' ? '#22c55e' : '#ef4444' }}>{formatBRL(r.roiTotal)}</td>
                    <td className="px-5 py-3.5"><HealthDot store={store} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
