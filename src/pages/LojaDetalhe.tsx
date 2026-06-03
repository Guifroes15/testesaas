import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, TrendingUp, TrendingDown, DollarSign,
  MessageSquare, ShoppingBag, BarChart2, Target,
  Megaphone, Calculator, ClipboardList, CheckCircle2,
  Circle, AlertCircle, Zap, Eye, MousePointerClick, Percent,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { DEMO_STORES } from '@/lib/demoData'
import { calcularSimulador } from '@/types'
import type { MonthData, PlanItem, PlanStatus } from '@/types'
import { Simulador } from '@/components/dashboard/Simulador'

type Tab = 'overview' | 'metaads' | 'simulador' | 'plano'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',  label: 'Visão Geral',  icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'metaads',   label: 'Meta Ads',     icon: <Megaphone className="w-4 h-4" /> },
  { id: 'simulador', label: 'Simulador',    icon: <Calculator className="w-4 h-4" /> },
  { id: 'plano',     label: 'Plano',        icon: <ClipboardList className="w-4 h-4" /> },
]

const planStatusConfig: Record<PlanStatus, { label: string; color: string; icon: React.ReactNode }> = {
  Alta:    { label: 'Alta',    color: 'text-red-500 bg-red-500/10 border-red-500/20',    icon: <AlertCircle className="w-3.5 h-3.5" /> },
  Média:   { label: 'Média',   color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: <Circle className="w-3.5 h-3.5" /> },
  Baixa:   { label: 'Baixa',   color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',   icon: <Circle className="w-3.5 h-3.5" /> },
  Sucesso: { label: 'Feito',   color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  Teste:   { label: 'Teste',   color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', icon: <Zap className="w-3.5 h-3.5" /> },
}

function MetricDelta({ value, suffix = '' }: { value: number; suffix?: string }) {
  const up = value >= 0
  return (
    <span className={`text-xs font-medium flex items-center gap-0.5 ${up ? 'text-green-500' : 'text-red-500'}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {up ? '+' : ''}{value.toFixed(1)}{suffix}
    </span>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ historico, color }: { historico: MonthData[]; color: string }) {
  const ultimo    = historico[historico.length - 1]
  const penultimo = historico[historico.length - 2]
  const maxVendas = Math.max(...historico.map(m => m.vendas))

  const delta = (curr: number, prev: number) => ((curr - prev) / prev) * 100

  const metricas = [
    {
      label: 'Faturamento',
      value: `R$ ${ultimo.vendas.toLocaleString('pt-BR')}`,
      delta: delta(ultimo.vendas, penultimo.vendas),
      suffix: '%',
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      label: 'Conversão',
      value: `${ultimo.conversao}%`,
      delta: ultimo.conversao - penultimo.conversao,
      suffix: 'pp',
      icon: <Percent className="w-4 h-4" />,
    },
    {
      label: 'Mensagens',
      value: ultimo.mensagens.toLocaleString('pt-BR'),
      delta: delta(ultimo.mensagens, penultimo.mensagens),
      suffix: '%',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      label: 'Qtd. Vendas',
      value: ultimo.qtdVendas.toLocaleString('pt-BR'),
      delta: delta(ultimo.qtdVendas, penultimo.qtdVendas),
      suffix: '%',
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    {
      label: 'Ticket Médio',
      value: `R$ ${ultimo.ticketMedio.toLocaleString('pt-BR')}`,
      delta: delta(ultimo.ticketMedio, penultimo.ticketMedio),
      suffix: '%',
      icon: <Target className="w-4 h-4" />,
    },
    {
      label: 'Fat. Líquido Loja',
      value: `R$ ${ultimo.faturamentoLoja.toLocaleString('pt-BR')}`,
      delta: delta(ultimo.faturamentoLoja, penultimo.faturamentoLoja),
      suffix: '%',
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Métricas do mês atual */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Mês atual — {ultimo.mes}</h3>
          <Badge variant="gray">vs {penultimo.mes}</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {metricas.map(m => (
            <div key={m.label} className="card p-4">
              <div className="flex items-center gap-2 mb-2 text-muted">
                {m.icon}
                <span className="text-xs">{m.label}</span>
              </div>
              <p className="text-xl font-bold">{m.value}</p>
              <div className="mt-1">
                <MetricDelta value={m.delta} suffix={m.suffix} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de barras histórico */}
      <div className="card p-5">
        <h3 className="font-semibold mb-4">Histórico de faturamento</h3>
        <div className="space-y-2.5">
          {historico.map(m => {
            const pct = Math.round((m.vendas / maxVendas) * 100)
            const isLast = m.chave === historico[historico.length - 1].chave
            return (
              <div key={m.chave} className="flex items-center gap-3">
                <span className="text-xs text-muted w-14 shrink-0 text-right">{m.mes}</span>
                <div className="flex-1 h-6 bg-[var(--color-border)] rounded-md overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="h-full rounded-md flex items-center px-2"
                    style={{ backgroundColor: isLast ? color : color + '50' }}
                  />
                  <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-white">
                    R$ {m.vendas.toLocaleString('pt-BR')}
                  </span>
                </div>
                <span className="text-xs text-muted w-10 shrink-0">{m.conversao}%</span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-muted">
          <span>← Mais antigo</span>
          <span>Mais recente →</span>
        </div>
      </div>

      {/* Tabela completa */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h3 className="font-semibold">Histórico completo por mês</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Mês','Mensagens','Vendas','Fat. Bruto','Fat. Loja','Conversão','Ticket Médio','Verba'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-muted font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...historico].reverse().map((m, i) => {
                const isFirst = i === 0
                return (
                  <tr
                    key={m.chave}
                    className={`border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/40 transition-colors ${
                      isFirst ? 'font-medium' : ''
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        {isFirst && (
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                        )}
                        {m.mes}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{m.mensagens.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{m.qtdVendas}</td>
                    <td className="px-4 py-3 whitespace-nowrap">R$ {m.vendas.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">R$ {m.faturamentoLoja.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{m.conversao}%</td>
                    <td className="px-4 py-3 whitespace-nowrap">R$ {m.ticketMedio}</td>
                    <td className="px-4 py-3 whitespace-nowrap">R$ {m.verba.toLocaleString('pt-BR')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Meta Ads Tab ─────────────────────────────────────────────────────────────

function MetaAdsTab({ historico, color }: { historico: MonthData[]; color: string }) {
  const ultimo = historico[historico.length - 1]
  const meta   = ultimo.metaAds

  if (!meta) return (
    <div className="card p-12 text-center text-muted text-sm">
      Nenhum dado de Meta Ads cadastrado para este período.
    </div>
  )

  const metricas = [
    { label: 'Investimento',  value: `R$ ${meta.investimento.toLocaleString('pt-BR')}`, icon: <DollarSign className="w-4 h-4" />,        sub: 'verba aplicada' },
    { label: 'Alcance',       value: meta.alcance.toLocaleString('pt-BR'),               icon: <Eye className="w-4 h-4" />,              sub: 'pessoas únicas' },
    { label: 'Impressões',    value: meta.impressoes.toLocaleString('pt-BR'),             icon: <BarChart2 className="w-4 h-4" />,         sub: 'total de exibições' },
    { label: 'Cliques',       value: meta.cliques.toLocaleString('pt-BR'),               icon: <MousePointerClick className="w-4 h-4" />, sub: 'cliques no link' },
    { label: 'Conversões',    value: meta.conversoes.toLocaleString('pt-BR'),            icon: <CheckCircle2 className="w-4 h-4" />,      sub: 'mensagens iniciadas' },
    { label: 'CPC',           value: `R$ ${meta.cpc.toFixed(2)}`,                        icon: <Target className="w-4 h-4" />,            sub: 'custo por clique' },
    { label: 'CPM',           value: `R$ ${meta.cpm.toFixed(2)}`,                        icon: <MessageSquare className="w-4 h-4" />,     sub: 'custo por 1.000 imp.' },
    { label: 'CTR',           value: `${meta.ctr.toFixed(2)}%`,                          icon: <Percent className="w-4 h-4" />,           sub: 'taxa de clique' },
    { label: 'ROAS',          value: `${meta.roas.toFixed(2)}x`,                         icon: <TrendingUp className="w-4 h-4" />,        sub: 'retorno sobre ads' },
  ]

  const maxRoas = Math.max(...historico.filter(m => m.metaAds).map(m => m.metaAds!.roas))

  return (
    <div className="space-y-6">
      {/* Header do período */}
      <div className="card p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold">Campanha — {ultimo.mes}</p>
          <p className="text-xs text-muted">Meta Ads · Resultados do período</p>
        </div>
        <div
          className="px-3 py-1.5 rounded-lg text-sm font-bold"
          style={{ backgroundColor: color + '20', color }}
        >
          ROAS {meta.roas.toFixed(1)}x
        </div>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {metricas.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card p-4"
          >
            <div className="flex items-center gap-2 text-muted mb-2">
              {m.icon}
              <span className="text-xs">{m.label}</span>
            </div>
            <p className="text-xl font-bold">{m.value}</p>
            <p className="text-xs text-muted mt-0.5">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Evolução ROAS */}
      <div className="card p-5">
        <h3 className="font-semibold mb-4">Evolução do ROAS</h3>
        <div className="space-y-2.5">
          {historico.filter(m => m.metaAds).map(m => {
            const pct = Math.round((m.metaAds!.roas / maxRoas) * 100)
            const isLast = m.chave === ultimo.chave
            return (
              <div key={m.chave} className="flex items-center gap-3">
                <span className="text-xs text-muted w-14 shrink-0 text-right">{m.mes}</span>
                <div className="flex-1 h-5 bg-[var(--color-border)] rounded overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded"
                    style={{ backgroundColor: isLast ? color : color + '50' }}
                  />
                  <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-white">
                    {m.metaAds!.roas.toFixed(1)}x ROAS · R$ {m.metaAds!.investimento.toLocaleString('pt-BR')} investido
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabela histórico Meta Ads */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h3 className="font-semibold">Histórico de campanhas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Mês','Investimento','Alcance','Impressões','Cliques','Conversões','CPC','CPM','CTR','ROAS'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-muted font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...historico].reverse().map((m, i) => {
                if (!m.metaAds) return null
                const a = m.metaAds
                return (
                  <tr key={m.chave} className={`border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/40 transition-colors ${i === 0 ? 'font-medium' : ''}`}>
                    <td className="px-4 py-3 whitespace-nowrap">{m.mes}</td>
                    <td className="px-4 py-3 whitespace-nowrap">R$ {a.investimento.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{a.alcance.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{a.impressoes.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{a.cliques.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{a.conversoes.toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">R$ {a.cpc.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">R$ {a.cpm.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{a.ctr.toFixed(2)}%</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ color: a.roas >= 3 ? '#22c55e' : a.roas >= 2 ? '#f59e0b' : '#ef4444' }}>
                        {a.roas.toFixed(2)}x
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Plano Tab ────────────────────────────────────────────────────────────────

function PlanoTab({ planos, color }: { planos: PlanItem[]; color: string }) {
  const groups: PlanStatus[] = ['Alta', 'Média', 'Baixa', 'Teste', 'Sucesso']

  return (
    <div className="space-y-4">
      {groups.map(status => {
        const items = planos.filter(p => p.status === status)
        if (items.length === 0) return null
        const cfg = planStatusConfig[status]
        return (
          <div key={status} className="card overflow-hidden">
            <div className={`flex items-center gap-2 px-5 py-3 border-b border-[var(--color-border)] ${cfg.color} border rounded-t-xl`}>
              {cfg.icon}
              <span className="text-sm font-semibold">{cfg.label}</span>
              <span className="ml-auto text-xs opacity-70">{items.length} {items.length === 1 ? 'tarefa' : 'tarefas'}</span>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className={`shrink-0 ${cfg.color} rounded-full p-0.5`}>
                    {cfg.icon}
                  </div>
                  <span className={`text-sm flex-1 ${status === 'Sucesso' ? 'line-through text-muted' : ''}`}>
                    {item.tarefa}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {planos.length === 0 && (
        <div className="card p-12 text-center text-muted text-sm">
          Nenhuma tarefa cadastrada para esta loja.
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function LojaDetalhe() {
  const { id } = useParams<{ id: string }>()
  const [tab, setTab] = useState<Tab>('overview')

  const store = DEMO_STORES.find(s => s.id === id)

  if (!store) {
    return (
      <div>
        <Header title="Loja não encontrada" />
        <div className="p-6">
          <Link to="/app/lojas" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar para Lojas
          </Link>
        </div>
      </div>
    )
  }

  const ultimo = store.historico[store.historico.length - 1]

  return (
    <div>
      <Header
        title={store.name}
        subtitle={`Última atualização: ${ultimo.mes}`}
      />

      <div className="p-6 space-y-6 max-w-6xl">
        {/* Back + breadcrumb */}
        <Link to="/app/lojas" className="inline-flex items-center gap-2 text-sm text-muted hover:text-[var(--color-text)] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Todas as lojas
        </Link>

        {/* Store header card */}
        <div className="card p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: store.color + '33', color: store.color }}
              >
                {store.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{store.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="green" dot>Ativa</Badge>
                  <span className="text-xs text-muted">Taxa Aure: {store.fee}%</span>
                  <span className="text-xs text-muted">·</span>
                  <span className="text-xs text-muted">{store.historico.length} meses de histórico</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="text-center px-4 py-2 rounded-lg bg-[var(--color-border)]/40">
                <p className="text-xs text-muted">Fat. mês atual</p>
                <p className="font-bold">R$ {ultimo.vendas.toLocaleString('pt-BR')}</p>
              </div>
              <div className="text-center px-4 py-2 rounded-lg bg-[var(--color-border)]/40">
                <p className="text-xs text-muted">Conversão</p>
                <p className="font-bold" style={{ color: store.color }}>{ultimo.conversao}%</p>
              </div>
              <div className="text-center px-4 py-2 rounded-lg bg-[var(--color-border)]/40">
                <p className="text-xs text-muted">Ticket médio</p>
                <p className="font-bold">R$ {ultimo.ticketMedio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] w-fit">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-green-500 text-black'
                  : 'text-muted hover:text-[var(--color-text)]'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'overview'  && <OverviewTab historico={store.historico} color={store.color} />}
            {tab === 'metaads'   && <MetaAdsTab  historico={store.historico} color={store.color} />}
            {tab === 'simulador' && <Simulador historico={store.historico} color={store.color} />}
            {tab === 'plano'     && <PlanoTab  planos={store.planos} color={store.color} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
