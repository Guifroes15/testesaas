import React, { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  DollarSign, Percent, MessageSquare, TrendingUp, TrendingDown,
  BarChart2, Calculator, Target, Calendar, Info, AlertCircle,
  Eye, MousePointer, ThumbsUp, Users, Minus,
} from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { ChartCard, ChartTooltip } from '@/components/ui/ChartCard'
import { HealthBadge } from '@/components/ui/HealthBadge'
import { ProjecaoCard } from '@/components/ui/ProjecaoCard'
import { RoiPanel } from '@/components/ui/RoiPanel'
import { MonthFilter } from '@/components/ui/MonthFilter'
import { calcRoi, formatBRL, ultimoMes } from '@/utils/store'
import { calcularSimulador } from '@/types'
import { DEMO_STORES } from '@/lib/demoData'
import type { Store, PlanStatus } from '@/types'

type Tab = 'visao' | 'simulador' | 'meta-ads'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 150, damping: 18 } },
}

const planStatusConfig: Record<PlanStatus, { label: string; color: string; bg: string }> = {
  Alta:    { label: 'Alta',    color: '#ef4444', bg: 'rgba(239,68,68,.1)'   },
  Média:   { label: 'Média',   color: '#f59e0b', bg: 'rgba(245,158,11,.1)'  },
  Baixa:   { label: 'Baixa',   color: '#60a5fa', bg: 'rgba(96,165,250,.1)'  },
  Sucesso: { label: 'Concluído', color: '#22c55e', bg: 'rgba(34,197,94,.1)' },
  Teste:   { label: 'Teste',   color: '#a78bfa', bg: 'rgba(167,139,250,.1)' },
}

// ─── Simulador Tab ────────────────────────────────────────────────────────────

function SimuladorTab({ store }: { store: Store }) {
  const last = ultimoMes(store)
  const [verba, setVerba]       = useState(last.verba)
  const [mensagens, setMensagens] = useState(last.mensagens)

  const result = calcularSimulador(store.historico, { verbaPlanning: verba, mensagensPlanning: mensagens })
  const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  const scenarios = [
    { label: 'Pessimista', icon: <TrendingDown className="w-4 h-4" />, fat: result.pessimista, roi: result.roiPessimista, color: '#ef4444' },
    { label: 'Base',       icon: <Minus        className="w-4 h-4" />, fat: result.base,       roi: result.roiBase,       color: '#22c55e', highlight: true },
    { label: 'Otimista',   icon: <TrendingUp   className="w-4 h-4" />, fat: result.otimista,   roi: result.roiOtimista,   color: '#a78bfa' },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={itemVariants} className="bg-brand-medium border border-brand-light rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Calculator className="w-5 h-5 text-brand-purple" />
          <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Parâmetros do planejamento</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[var(--text-secondary)]">Verba Meta Ads</label>
              <span className="text-sm font-bold text-green-400">{formatBRL(verba)}</span>
            </div>
            <input type="range" min={500} max={20000} step={100} value={verba}
              onChange={e => setVerba(Number(e.target.value))} className="w-full accent-brand-purple" />
            <div className="flex justify-between text-[9px] text-[var(--text-muted)]">
              <span>R$ 500</span><span>R$ 20.000</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[var(--text-secondary)]">Mensagens esperadas</label>
              <span className="text-sm font-bold text-green-400">{fmt(mensagens)}</span>
            </div>
            <input type="range" min={100} max={3000} step={50} value={mensagens}
              onChange={e => setMensagens(Number(e.target.value))} className="w-full accent-brand-purple" />
            <div className="flex justify-between text-[9px] text-[var(--text-muted)]">
              <span>100</span><span>3.000</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-brand-medium border border-brand-light rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
          <div className="grid grid-cols-3 gap-4 flex-1 text-sm">
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-0.5">Conv. hist.</p>
              <p className="font-bold text-green-400">{result.convMediaHist.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-0.5">Ticket médio</p>
              <p className="font-bold text-[var(--text-primary)]">{formatBRL(result.ticketMedioHist)}</p>
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-0.5">Meses usados</p>
              <p className="font-bold text-[var(--text-primary)]">{result.mesesUsados}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-4">
        {scenarios.map(s => (
          <motion.div key={s.label} variants={itemVariants}
            className={`bg-brand-medium border rounded-xl p-5 ${s.highlight ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-brand-light'}`}>
            {s.highlight && <p className="text-[9px] font-bold text-green-400 uppercase tracking-widest mb-2">Cenário base</p>}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.color + '20', color: s.color }}>
                {s.icon}
              </div>
              <span className="font-semibold text-[var(--text-primary)]">{s.label}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Faturamento</span>
                <span className="font-bold text-[var(--text-primary)]">{formatBRL(s.fat)}</span>
              </div>
              <div className="pt-2 border-t border-brand-light flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">ROI</span>
                <span className="font-bold text-lg" style={{ color: s.roi >= 0 ? '#22c55e' : '#ef4444' }}>
                  {s.roi >= 0 ? '+' : ''}{formatBRL(s.roi)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

// ─── Meta Ads Tab ─────────────────────────────────────────────────────────────

function MetaAdsTab({ store }: { store: Store }) {
  const ultimo = ultimoMes(store)
  const meta   = ultimo.metaAds

  if (!meta) return (
    <div className="bg-brand-medium border border-brand-light rounded-xl p-12 text-center">
      <p className="text-[var(--text-muted)] text-sm">Nenhum dado de Meta Ads para este período.</p>
    </div>
  )

  const cards = [
    { label: 'Valor Gasto',     value: formatBRL(meta.investimento), icon: DollarSign,    color: 'text-brand-purple2' },
    { label: 'Alcance',         value: meta.alcance.toLocaleString('pt-BR'), icon: Users, color: 'text-amber-400' },
    { label: 'Impressões',      value: meta.impressoes.toLocaleString('pt-BR'), icon: Eye, color: 'text-cyan-400' },
    { label: 'Cliques',         value: meta.cliques.toLocaleString('pt-BR'), icon: MousePointer, color: 'text-pink-400' },
    { label: 'Conversões',      value: meta.conversoes.toLocaleString('pt-BR'), icon: MessageSquare, color: 'text-green-400' },
    { label: 'CPC',             value: formatBRL(meta.cpc), icon: Target, color: 'text-blue-400' },
    { label: 'CPM',             value: formatBRL(meta.cpm), icon: TrendingUp, color: 'text-indigo-400' },
    { label: 'CTR',             value: `${meta.ctr.toFixed(2)}%`, icon: Percent, color: 'text-orange-400' },
    { label: 'ROAS',            value: `${meta.roas.toFixed(2)}x`, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Curtidas/Seguid.', value: (meta.conversoes * 3).toLocaleString('pt-BR'), icon: ThumbsUp, color: 'text-rose-400' },
  ]

  const roasData = store.historico
    .filter(m => m.metaAds)
    .map(m => ({ name: m.mes, roas: m.metaAds!.roas, gasto: m.metaAds!.investimento }))

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(card => (
          <motion.div key={card.label} variants={itemVariants} className="bg-brand-medium border border-brand-light rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 shrink-0 ${card.color}`} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 leading-tight">{card.label}</p>
            </div>
            <p className={`text-xl font-black ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={itemVariants}>
          <ChartCard title="Gasto mensal (R$)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roasData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e28" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 9 }} tickFormatter={v => `R$${(v / 1000).toFixed(1)}k`} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [formatBRL(v), 'Gasto']} />
                <Bar dataKey="gasto" fill="#2563eb" radius={[3, 3, 0, 0]} name="Gasto" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
        <motion.div variants={itemVariants}>
          <ChartCard title="Evolução do ROAS">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roasData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e28" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={v => `${v}x`} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${v.toFixed(2)}x`, 'ROAS']} />
                <Line dataKey="roas" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3, fill: '#22c55e' }} name="ROAS" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-brand-medium border border-brand-light rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-brand-light">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Histórico de campanhas</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-light">
                {['Mês','Investimento','Alcance','Impressões','Cliques','Conversões','CPC','CTR','ROAS'].map(h => (
                  <th key={h} className="text-left text-[9px] font-bold uppercase tracking-widest text-gray-600 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...store.historico].reverse().map((m, i) => {
                if (!m.metaAds) return null
                const a = m.metaAds
                return (
                  <tr key={m.chave} className={`border-b border-brand-light/50 hover:bg-brand-light/20 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.01]' : ''}`}>
                    <td className="px-4 py-3 text-xs font-semibold text-white">{m.mes}</td>
                    <td className="px-4 py-3 text-xs font-bold text-white">{formatBRL(a.investimento)}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{a.alcance.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{a.impressoes.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{a.cliques.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-xs font-bold text-green-400">{a.conversoes.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatBRL(a.cpc)}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{a.ctr.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-xs font-bold" style={{ color: a.roas >= 3 ? '#22c55e' : a.roas >= 2 ? '#f59e0b' : '#ef4444' }}>
                      {a.roas.toFixed(2)}x
                    </td>
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export function LojaDetalhe() {
  const { id } = useParams<{ id: string }>()
  const [tab, setTab]             = useState<Tab>('visao')
  const [showFilter, setShowFilter] = useState(false)

  const store = DEMO_STORES.find(s => s.id === id)

  if (!store) {
    return (
      <div className="p-10">
        <Link to="/app/lojas" className="text-brand-purple2 text-sm hover:underline">← Voltar para Lojas</Link>
        <p className="text-[var(--text-muted)] mt-4">Loja não encontrada.</p>
      </div>
    )
  }

  const allChaves    = store.historico.map(m => m.chave)
  const allLabels    = store.historico.map(m => m.mes)
  const [selectedMonths, setSelectedMonths] = React.useState(new Set(allChaves))

  React.useEffect(() => { setSelectedMonths(new Set(store.historico.map(m => m.chave))) }, [store.id])

  const filtered = useMemo(() => store.historico.filter(m => selectedMonths.has(m.chave)), [store, selectedMonths])
  const storeFiltered = { ...store, historico: filtered }

  const roi      = calcRoi(store, store.fee)
  const comVendas = store.historico.filter(m => m.vendas > 0)
  const ultimo   = ultimoMes(store)
  const penultimo = comVendas.length >= 2 ? comVendas[comVendas.length - 2] : null

  const hasConversao   = store.historico.some(m => m.conversao > 0)
  const hasMensagens   = store.historico.some(m => m.mensagens > 0)
  const hasFaturamento = store.historico.some(m => m.faturamentoLoja > 0)
  const hasVerba       = store.historico.some(m => m.verba > 0)

  const change = (cur: number, prev: number | null) => {
    if (!prev || prev === 0) return undefined
    const pct = ((cur - prev) / prev) * 100
    return { value: `${Math.abs(pct).toFixed(1)}%`, isPositive: pct >= 0 }
  }

  const chartData = filtered.map(m => ({ name: m.mes, vendas: m.vendas, conversao: m.conversao, mensagens: m.mensagens }))

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 md:p-10 space-y-5">

      {/* Header */}
      <motion.header variants={itemVariants} className="mb-5">
        <Link to="/app/lojas" className="text-[10px] text-[var(--text-muted)] hover:text-brand-purple2 transition-colors mb-3 inline-block">
          ← Todas as lojas
        </Link>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-1" style={{ color: store.color }}>
              {store.name}
            </h1>
            <p className="text-xs text-gray-500">
              {store.historico[0].mes} — {store.historico[store.historico.length - 1].mes}
              {!hasFaturamento && <span className="ml-2 text-amber-700">· Sem faturamento da loja</span>}
            </p>
          </div>
          <div className="text-right shrink-0 hidden sm:block">
            <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">ROI acumulado</p>
            <p className="text-xl font-bold" style={{ color: roi.status === 'positivo' ? '#22c55e' : '#ef4444' }}>
              {formatBRL(roi.roiTotal)}
            </p>
            <p className="text-[9px] text-gray-600">{roi.mesesPositivos}/{roi.meses.length} meses pagos</p>
          </div>
        </div>
        <HealthBadge store={store} />

        <div className="mt-3 p-3 rounded-xl bg-brand-medium border border-brand-light/50">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-3 h-3 text-brand-purple" />
            <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-tight">Entenda a classificação do resultado</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { cor: 'text-green-500', label: 'Saudável (60+ pts)', desc: 'Vendas em crescimento, conversão acima de 5% e boa relação investimento/faturamento.' },
              { cor: 'text-amber-500', label: 'Atenção (30-59 pts)', desc: 'Performance estável ou com sinais de queda. Requer ajuste de criativos ou abordagem.' },
              { cor: 'text-red-500',   label: 'Crítico (< 30 pts)',  desc: 'Mesmo que deu lucro (ROI+), a loja apresenta queda real de vendas ou conversão baixa.' },
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <p className={`text-[9px] font-bold uppercase ${item.cor}`}>{item.label}</p>
                <p className="text-[9px] text-[var(--text-secondary)] leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2">
        <div className="flex-1 flex gap-1 bg-brand-medium border border-brand-light rounded-xl p-1">
          <button onClick={() => setTab('visao')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${tab === 'visao' ? 'bg-brand-light text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            <BarChart2 className="w-3.5 h-3.5" />Resultados
          </button>
          <button onClick={() => setTab('simulador')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${tab === 'simulador' ? 'bg-brand-purple text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            <Calculator className="w-3.5 h-3.5" />Simulador
          </button>
          <button onClick={() => setTab('meta-ads')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${tab === 'meta-ads' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            <Target className="w-3.5 h-3.5" />Meta Ads
          </button>
        </div>
        {tab === 'visao' && (
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              showFilter ? 'bg-brand-purple border-brand-purple text-white shadow-lg shadow-brand-purple/20' : 'bg-brand-light border-brand-light text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />{showFilter ? 'Ocultar' : 'Filtrar'}
          </button>
        )}
      </motion.div>

      {/* ── RESULTADOS ── */}
      {tab === 'visao' && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
          <AnimatePresence>
            {showFilter && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="bg-brand-medium border border-brand-light rounded-2xl px-5 py-4">
                  <MonthFilter allMonths={allChaves} monthLabels={allLabels} selected={selectedMonths} onChange={setSelectedMonths} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {selectedMonths.size < allChaves.length && (
            <motion.div variants={itemVariants} className="px-3 py-2 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-between">
              <p className="text-[10px] text-brand-purple2">Exibindo {selectedMonths.size} de {allChaves.length} meses</p>
              <button onClick={() => setSelectedMonths(new Set(allChaves))} className="text-[10px] text-brand-purple2 underline">Ver todos</button>
            </motion.div>
          )}

          {/* KPIs */}
          <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <motion.div variants={itemVariants}><StatCard label="Faturamento Total" value={hasFaturamento ? formatBRL(ultimo.faturamentoLoja) : '—'} subtext={ultimo.mes} icon={DollarSign} /></motion.div>
            <motion.div variants={itemVariants}><StatCard label="Venda Tráfego" value={formatBRL(ultimo.vendas)} change={change(ultimo.vendas, penultimo?.vendas ?? null)} icon={TrendingUp} /></motion.div>
            <motion.div variants={itemVariants}>
              {hasConversao
                ? <StatCard label={`Conversão (${ultimo.mes})`} value={`${ultimo.conversao.toFixed(1)}%`} change={change(ultimo.conversao, penultimo?.conversao ?? null)} icon={Percent} />
                : <StatCard label="Meses ROI +" value={`${roi.mesesPositivos} / ${roi.meses.length}`} subtext="no período" icon={Percent} />}
            </motion.div>
            <motion.div variants={itemVariants}>
              {hasMensagens
                ? <StatCard label="Contatos" value={ultimo.mensagens} subtext={`Ticket: ${formatBRL(ultimo.ticketMedio)}`} icon={MessageSquare} />
                : <StatCard label="ROI Período" value={formatBRL(roi.roiTotal)} subtext={roi.status === 'positivo' ? 'Positivo ✓' : 'Negativo'} icon={MessageSquare} />}
            </motion.div>
          </motion.div>

          {/* Charts */}
          <motion.div variants={containerVariants} className={`grid grid-cols-1 ${hasConversao ? 'lg:grid-cols-2' : ''} gap-4`}>
            <motion.div variants={itemVariants}>
              <ChartCard title="Evolução de vendas (R$)">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`g-${store.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={store.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={store.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e28" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dy={6} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="vendas" name="Vendas (R$)" stroke={store.color} strokeWidth={2} fill={`url(#g-${store.id})`} dot={{ r: 3, fill: store.color }} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </motion.div>
            {hasConversao && (
              <motion.div variants={itemVariants}>
                <ChartCard title="Conversão mensal (%)">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e1e28" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} dy={6} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={v => `${v}%`} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="conversao" name="Conversão (%)" fill={store.color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </motion.div>
            )}
          </motion.div>

          {/* Projeção + ROI */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <motion.div variants={itemVariants}><ProjecaoCard store={store} /></motion.div>
            <motion.div variants={itemVariants} className="lg:col-span-2"><RoiPanel store={storeFiltered} fee={store.fee} /></motion.div>
          </motion.div>

          {/* Plano de tarefas */}
          {store.planos.length > 0 && (
            <motion.div variants={itemVariants} className="bg-brand-medium border border-brand-light rounded-xl overflow-hidden">
              <div className="p-4 border-b border-brand-light">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Plano de ação</h3>
              </div>
              <div className="divide-y divide-brand-light">
                {store.planos.map(item => {
                  const cfg = planStatusConfig[item.status]
                  return (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-brand-light/20 transition-colors">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <span className={`text-xs text-[var(--text-secondary)] flex-1 ${item.status === 'Sucesso' ? 'line-through opacity-50' : ''}`}>
                        {item.tarefa}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Histórico */}
          <motion.div variants={itemVariants} className="bg-brand-medium border border-brand-light rounded-xl overflow-hidden">
            <div className="p-4 border-b border-brand-light flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Histórico</h3>
              {selectedMonths.size < allChaves.length && (
                <span className="text-[9px] text-brand-purple2 bg-brand-purple/10 px-2 py-0.5 rounded">{selectedMonths.size} meses filtrados</span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ minWidth: hasMensagens ? 640 : 420 }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    {['Mês','Vendas', ...(hasFaturamento ? ['Fat. Loja'] : []), ...(hasMensagens ? ['Msgs'] : []), ...(hasConversao ? ['Conv.'] : []), ...(hasMensagens ? ['Ticket'] : []), ...(hasVerba ? ['Verba'] : []), 'Custo','ROI'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-[8px] font-bold text-gray-600 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light">
                  {filtered.map((m, i) => {
                    const custo  = store.fee + m.verba
                    const roiMes = m.vendas - custo
                    return (
                      <tr key={i} className="hover:bg-brand-light/20 transition-colors">
                        <td className="px-3 py-3 text-xs font-semibold text-gray-300 whitespace-nowrap">{m.mes}</td>
                        <td className="px-3 py-3 text-xs font-bold whitespace-nowrap" style={{ color: m.vendas > 0 ? '#fff' : '#374151' }}>{formatBRL(m.vendas)}</td>
                        {hasFaturamento && <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{m.faturamentoLoja > 0 ? formatBRL(m.faturamentoLoja) : '—'}</td>}
                        {hasMensagens  && <td className="px-3 py-3 text-xs text-gray-500">{m.mensagens || '—'}</td>}
                        {hasConversao  && <td className="px-3 py-3 text-xs whitespace-nowrap" style={{ color: m.conversao >= 10 ? '#22c55e' : m.conversao >= 3 ? '#f59e0b' : '#6b7280' }}>{m.conversao > 0 ? `${m.conversao.toFixed(1)}%` : '—'}</td>}
                        {hasMensagens  && <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{m.ticketMedio > 0 ? formatBRL(m.ticketMedio) : '—'}</td>}
                        {hasVerba      && <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{m.verba > 0 ? formatBRL(m.verba) : '—'}</td>}
                        <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{formatBRL(custo)}</td>
                        <td className="px-3 py-3 text-xs font-bold whitespace-nowrap" style={{ color: roiMes >= 0 ? '#22c55e' : '#ef4444' }}>{formatBRL(roiMes)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}

      {tab === 'simulador' && <SimuladorTab store={store} />}
      {tab === 'meta-ads'  && <MetaAdsTab  store={store} />}
    </motion.div>
  )
}
