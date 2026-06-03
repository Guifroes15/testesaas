import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus, TrendingUp, TrendingDown, Search,
  DollarSign, MessageSquare, ShoppingBag, BarChart2,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DEMO_STORES } from '@/lib/demoData'
import type { Store } from '@/types'

const MESES = ['Jan/25','Fev/25','Mar/25','Abr/25','Mai/25','Jun/25']

function StoreCard({ store, index }: { store: Store; index: number }) {
  const ultimo = store.historico[store.historico.length - 1]
  const penultimo = store.historico[store.historico.length - 2]

  const deltaVendas = penultimo
    ? ((ultimo.vendas - penultimo.vendas) / penultimo.vendas) * 100
    : 0
  const deltaConv = penultimo ? ultimo.conversao - penultimo.conversao : 0
  const maxVendas  = Math.max(...store.historico.map(m => m.vendas))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        to={`/app/lojas/${store.id}`}
        className="card block p-5 hover:border-green-500/30 hover:shadow-green-glow/10 transition-all group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: store.color + '33', color: store.color }}
            >
              {store.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold group-hover:text-green-500 transition-colors">
                {store.name}
              </p>
              <p className="text-xs text-muted">Taxa Aure: {store.fee}%</p>
            </div>
          </div>
          <Badge variant={deltaVendas >= 0 ? 'green' : 'red'} dot>
            {deltaVendas >= 0 ? '+' : ''}{deltaVendas.toFixed(1)}%
          </Badge>
        </div>

        {/* Mini chart — últimos 6 meses */}
        <div className="flex items-end gap-1 h-12 mb-4">
          {store.historico.map((m, i) => {
            const h = Math.round((m.vendas / maxVendas) * 100)
            const isLast = i === store.historico.length - 1
            return (
              <div key={m.chave} className="flex-1 flex flex-col items-center justify-end gap-0.5">
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${h}%`,
                    backgroundColor: isLast ? store.color : store.color + '40',
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[var(--color-border)]/40">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3 h-3 text-muted" />
              <p className="text-xs text-muted">Faturamento</p>
            </div>
            <p className="font-bold text-sm">R$ {ultimo.vendas.toLocaleString('pt-BR')}</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--color-border)]/40">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart2 className="w-3 h-3 text-muted" />
              <p className="text-xs text-muted">Conversão</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="font-bold text-sm">{ultimo.conversao}%</p>
              <span className={`text-xs ${deltaConv >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {deltaConv >= 0 ? '↑' : '↓'}{Math.abs(deltaConv).toFixed(1)}pp
              </span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--color-border)]/40">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageSquare className="w-3 h-3 text-muted" />
              <p className="text-xs text-muted">Mensagens</p>
            </div>
            <p className="font-bold text-sm">{ultimo.mensagens.toLocaleString('pt-BR')}</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--color-border)]/40">
            <div className="flex items-center gap-1.5 mb-1">
              <ShoppingBag className="w-3 h-3 text-muted" />
              <p className="text-xs text-muted">Ticket Médio</p>
            </div>
            <p className="font-bold text-sm">R$ {ultimo.ticketMedio.toLocaleString('pt-BR')}</p>
          </div>
        </div>

        {/* Verba Meta Ads */}
        <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
          <span className="text-xs text-muted">Verba Meta Ads</span>
          <span className="text-xs font-medium">R$ {ultimo.verba.toLocaleString('pt-BR')}</span>
        </div>
        {ultimo.metaAds && (
          <div className="mt-2 flex gap-3">
            <div className="text-center flex-1">
              <p className="text-[10px] text-muted">ROAS</p>
              <p className="text-xs font-bold" style={{ color: store.color }}>
                {ultimo.metaAds.roas.toFixed(1)}x
              </p>
            </div>
            <div className="text-center flex-1">
              <p className="text-[10px] text-muted">CTR</p>
              <p className="text-xs font-bold">{ultimo.metaAds.ctr.toFixed(1)}%</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-[10px] text-muted">CPC</p>
              <p className="text-xs font-bold">R$ {ultimo.metaAds.cpc.toFixed(2)}</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-[10px] text-muted">Cliques</p>
              <p className="text-xs font-bold">{ultimo.metaAds.cliques.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  )
}

export function Lojas() {
  const [search, setSearch] = useState('')
  const stores = DEMO_STORES

  const filtered = stores.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalFat    = stores.reduce((a, s) => a + s.historico[s.historico.length - 1].vendas, 0)
  const totalMsgs   = stores.reduce((a, s) => a + s.historico[s.historico.length - 1].mensagens, 0)
  const totalVerba  = stores.reduce((a, s) => a + s.historico[s.historico.length - 1].verba, 0)
  const avgConv     = stores.reduce((a, s) => a + s.historico[s.historico.length - 1].conversao, 0) / stores.length

  return (
    <div>
      <Header title="Lojas" subtitle="Gestão e desempenho por unidade" />

      <div className="p-6 space-y-6 max-w-7xl">
        {/* Resumo geral */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Faturamento total', value: `R$ ${totalFat.toLocaleString('pt-BR')}`, icon: <DollarSign className="w-4 h-4" />, change: '+18%', up: true },
            { label: 'Conversão média',   value: `${avgConv.toFixed(1)}%`,                 icon: <TrendingUp className="w-4 h-4" />, change: '+0.4pp', up: true },
            { label: 'Total mensagens',   value: totalMsgs.toLocaleString('pt-BR'),         icon: <MessageSquare className="w-4 h-4" />, change: '+12%', up: true },
            { label: 'Verba Meta Ads',    value: `R$ ${totalVerba.toLocaleString('pt-BR')}`, icon: <BarChart2 className="w-4 h-4" />, change: '+8%', up: true },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                  {m.icon}
                </div>
                <span className={`text-xs font-medium ${m.up ? 'text-green-500' : 'text-red-500'}`}>
                  {m.up ? <TrendingUp className="w-3 h-3 inline mr-0.5" /> : <TrendingDown className="w-3 h-3 inline mr-0.5" />}
                  {m.change}
                </span>
              </div>
              <p className="text-xl font-bold">{m.value}</p>
              <p className="text-xs text-muted mt-0.5">{m.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Barra de ações */}
        <div className="flex items-center justify-between gap-4">
          <div className="w-72">
            <Input
              placeholder="Buscar loja..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5" />}
            />
          </div>
          <Button icon={<Plus className="w-4 h-4" />}>Nova loja</Button>
        </div>

        {/* Grid de lojas */}
        {filtered.length === 0 ? (
          <div className="card p-12 text-center text-muted text-sm">
            Nenhuma loja encontrada.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((store, i) => (
              <StoreCard key={store.id} store={store} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
