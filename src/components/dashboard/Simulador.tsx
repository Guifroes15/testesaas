import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingDown, TrendingUp, Minus,
  Calculator, Info,
} from 'lucide-react'
import { calcularSimulador } from '@/types'
import type { MonthData } from '@/types'

interface SimuladorProps {
  historico: MonthData[]
  color: string
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function fmtPct(v: number) {
  return (v >= 0 ? '+' : '') + v.toFixed(1) + '%'
}

interface ScenarioCardProps {
  label: string
  icon: React.ReactNode
  vendas: number
  faturamento: number
  roi: number
  color: string
  highlighted?: boolean
}

function ScenarioCard({ label, icon, vendas, faturamento, roi, color, highlighted }: ScenarioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-5 ${highlighted ? 'border-green-500 shadow-green-glow' : ''}`}
    >
      {highlighted && (
        <div className="text-xs text-green-500 font-semibold mb-2 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> Cenário base
        </div>
      )}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color + '20', color }}
        >
          {icon}
        </div>
        <span className="font-semibold">{label}</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Faturamento projetado</span>
          <span className="font-bold">R$ {fmt(faturamento)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Qtd. vendas estimadas</span>
          <span className="font-bold">{fmt(vendas)}</span>
        </div>
        <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
          <span className="text-sm text-muted">ROI</span>
          <span
            className="font-bold text-lg"
            style={{ color: roi >= 0 ? '#22c55e' : '#ef4444' }}
          >
            {fmtPct(roi)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export function Simulador({ historico, color }: SimuladorProps) {
  const last = historico[historico.length - 1]

  const [verba, setVerba] = useState(last.verba)
  const [mensagens, setMensagens] = useState(last.mensagens)

  const result = calcularSimulador(historico, {
    verbaPlanning: verba,
    mensagensPlanning: mensagens,
  })

  const scenarios = [
    {
      label: 'Pessimista',
      icon: <TrendingDown className="w-4 h-4" />,
      faturamento: result.pessimista,
      vendas: Math.round(mensagens * ((result.convMediaHist * 0.7) / 100)),
      roi: result.roiPessimista,
      color: '#ef4444',
    },
    {
      label: 'Base',
      icon: <Minus className="w-4 h-4" />,
      faturamento: result.base,
      vendas: Math.round(mensagens * (result.convMediaHist / 100)),
      roi: result.roiBase,
      color: '#22c55e',
      highlighted: true,
    },
    {
      label: 'Otimista',
      icon: <TrendingUp className="w-4 h-4" />,
      faturamento: result.otimista,
      vendas: Math.round(mensagens * ((result.convMediaHist * 1.3) / 100)),
      roi: result.roiOtimista,
      color: '#8b5cf6',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Calculator className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold">Parâmetros do planejamento</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Verba */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Verba Meta Ads</label>
              <span className="text-sm font-bold text-green-500">R$ {fmt(verba)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={20000}
              step={100}
              value={verba}
              onChange={e => setVerba(Number(e.target.value))}
              className="w-full accent-green-500"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>R$ 500</span>
              <span>R$ 20.000</span>
            </div>
          </div>

          {/* Mensagens */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Mensagens esperadas</label>
              <span className="text-sm font-bold text-green-500">{fmt(mensagens)}</span>
            </div>
            <input
              type="range"
              min={100}
              max={3000}
              step={50}
              value={mensagens}
              onChange={e => setMensagens(Number(e.target.value))}
              className="w-full accent-green-500"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>100</span>
              <span>3.000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Base histórica */}
      <div className="card p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-muted shrink-0 mt-0.5" />
          <div className="grid grid-cols-3 gap-4 flex-1 text-sm">
            <div>
              <p className="text-xs text-muted mb-0.5">Conversão média histórica</p>
              <p className="font-bold" style={{ color }}>{result.convMediaHist.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">Ticket médio histórico</p>
              <p className="font-bold">R$ {fmt(result.ticketMedioHist)}</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-0.5">Meses usados no cálculo</p>
              <p className="font-bold">{result.mesesUsados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cenários */}
      <div className="grid md:grid-cols-3 gap-4">
        {scenarios.map(s => (
          <ScenarioCard key={s.label} {...s} />
        ))}
      </div>

      {/* Tabela comparativa */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h3 className="font-semibold">Comparativo de cenários</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-3 text-left text-xs text-muted font-medium">Cenário</th>
                <th className="px-5 py-3 text-left text-xs text-muted font-medium">Conversão</th>
                <th className="px-5 py-3 text-left text-xs text-muted font-medium">Vendas</th>
                <th className="px-5 py-3 text-left text-xs text-muted font-medium">Faturamento</th>
                <th className="px-5 py-3 text-left text-xs text-muted font-medium">ROI</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Pessimista', conv: result.convMediaHist * 0.7, fat: result.pessimista, roi: result.roiPessimista, c: '#ef4444' },
                { label: 'Base',       conv: result.convMediaHist,       fat: result.base,       roi: result.roiBase,       c: '#22c55e' },
                { label: 'Otimista',   conv: result.convMediaHist * 1.3, fat: result.otimista,   roi: result.roiOtimista,   c: '#8b5cf6' },
              ].map(row => (
                <tr key={row.label} className="border-b border-[var(--color-border)] hover:bg-[var(--color-border)]/40 transition-colors">
                  <td className="px-5 py-3 font-medium" style={{ color: row.c }}>{row.label}</td>
                  <td className="px-5 py-3">{row.conv.toFixed(2)}%</td>
                  <td className="px-5 py-3">{fmt(Math.round(mensagens * (row.conv / 100)))}</td>
                  <td className="px-5 py-3 font-semibold">R$ {fmt(row.fat)}</td>
                  <td className="px-5 py-3">
                    <span style={{ color: row.roi >= 0 ? '#22c55e' : '#ef4444' }} className="font-bold">
                      {fmtPct(row.roi)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
