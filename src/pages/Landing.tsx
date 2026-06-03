import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, TrendingUp, Users, BarChart3, Brain, CheckCircle2,
  ArrowRight, Sun, Moon, Star, Shield,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { PLANS } from '@/types'
import { useState } from 'react'

const features = [
  {
    icon: <BarChart3 className="w-5 h-5 text-green-500" />,
    title: 'Analytics em tempo real',
    desc: 'Acompanhe vendas, faturamento e conversão de todas as lojas num só lugar.',
  },
  {
    icon: <Brain className="w-5 h-5 text-green-500" />,
    title: 'IA integrada',
    desc: 'Gere criativos, copy e insights com IA diretamente no painel.',
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-green-500" />,
    title: 'Simulador de ROI',
    desc: 'Projete resultados pessimistas, base e otimistas antes de investir.',
  },
  {
    icon: <Users className="w-5 h-5 text-green-500" />,
    title: 'Multi-usuário',
    desc: 'Colabore com seu time com roles e permissões granulares.',
  },
  {
    icon: <Shield className="w-5 h-5 text-green-500" />,
    title: 'Multi-tenant seguro',
    desc: 'Cada workspace é completamente isolado. Seus dados são só seus.',
  },
  {
    icon: <Star className="w-5 h-5 text-green-500" />,
    title: 'Gestão de ideias',
    desc: 'Capture e organize campanhas e ideias com prioridade e status.',
  },
]

const testimonials = [
  {
    name: 'Marina Souza',
    role: 'Gerente de Marketing — Rede Moda BR',
    text: 'Centralizamos 12 lojas numa semana. O simulador de ROI mudou como a gente aprova campanhas.',
    avatar: 'MS',
  },
  {
    name: 'Rafael Oliveira',
    role: 'Sócio — Agência Pulse',
    text: 'A IA pra criativos economiza pelo menos 3h por dia na nossa equipe. Produto incrível.',
    avatar: 'RO',
  },
  {
    name: 'Beatriz Lima',
    role: 'CMO — Franquia Calçados+',
    text: 'Finalmente um dashboard feito pra quem trabalha com rede de lojas físicas.',
    avatar: 'BL',
  },
]

export function Landing() {
  const { theme, toggle } = useTheme()
  const [yearly, setYearly] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg">Aure</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted">
            <a href="#features" className="hover:text-[var(--color-text)] transition-colors">Funcionalidades</a>
            <a href="#pricing" className="hover:text-[var(--color-text)] transition-colors">Preços</a>
            <a href="#testimonials" className="hover:text-[var(--color-text)] transition-colors">Depoimentos</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="btn-ghost p-2">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/login" className="btn-secondary text-sm px-4 py-2">Entrar</Link>
            <Link to="/login" className="btn-primary text-sm px-4 py-2">Começar grátis</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-500 text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            Novo: IA para geração de criativos
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            O dashboard que
            <br />
            <span className="text-green-500">seu time de marketing</span>
            <br />
            sempre quis
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
            Analytics de lojas, simulador de ROI, IA para criativos e gestão de equipe.
            Tudo no mesmo lugar, em minutos.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/login" className="btn-primary px-8 py-3 text-base shadow-green-glow animate-pulse-green">
              Começar 14 dias grátis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#features" className="btn-secondary px-8 py-3 text-base">
              Ver funcionalidades
            </a>
          </div>
          <p className="text-xs text-muted mt-4">Sem cartão de crédito. Cancele quando quiser.</p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-2xl shadow-black/50 bg-[var(--color-surface)]"
        >
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--color-border)]">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <div className="flex-1 mx-4 bg-[var(--color-border)] rounded-md px-3 py-1 text-xs text-muted">
              app.aure.digital/dashboard
            </div>
          </div>
          <div className="p-6 grid grid-cols-4 gap-4">
            {[
              { label: 'Faturamento', value: 'R$ 284.750', change: '+18%', positive: true },
              { label: 'Conversão', value: '4,7%', change: '+0,8pp', positive: true },
              { label: 'Lojas ativas', value: '12', change: '+2', positive: true },
              { label: 'Ticket médio', value: 'R$ 387', change: '-3%', positive: false },
            ].map(metric => (
              <div key={metric.label} className="card p-4">
                <p className="text-xs text-muted mb-1">{metric.label}</p>
                <p className="text-xl font-bold">{metric.value}</p>
                <p className={`text-xs mt-1 ${metric.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change} vs mês anterior
                </p>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Desempenho por loja</p>
                <span className="text-xs text-muted">Junho 2025</span>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Loja Centro', value: 87, rev: 'R$ 48.200' },
                  { name: 'Loja Norte', value: 72, rev: 'R$ 39.800' },
                  { name: 'Loja Sul', value: 61, rev: 'R$ 33.100' },
                ].map(store => (
                  <div key={store.name} className="flex items-center gap-3">
                    <span className="text-xs w-24 shrink-0">{store.name}</span>
                    <div className="flex-1 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${store.value}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted w-20 text-right">{store.rev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Tudo que você precisa, num só lugar</h2>
          <p className="text-muted text-lg">Pare de usar planilha. Comece a tomar decisões com dados.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card p-6 hover:border-green-500/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Planos e preços</h2>
          <p className="text-muted text-lg mb-8">14 dias grátis em qualquer plano. Sem cartão de crédito.</p>
          <div className="inline-flex items-center gap-3 p-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                !yearly ? 'bg-green-500 text-black' : 'text-muted hover:text-[var(--color-text)]'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                yearly ? 'bg-green-500 text-black' : 'text-muted hover:text-[var(--color-text)]'
              }`}
            >
              Anual
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${yearly ? 'bg-black/20' : 'bg-green-500/20 text-green-500'}`}>
                -20%
              </span>
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`card p-6 flex flex-col relative ${
                plan.highlighted
                  ? 'border-green-500 shadow-green-glow'
                  : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-green-500 text-black text-xs font-bold rounded-full">
                  Mais popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">
                    R$ {yearly ? plan.yearlyPrice : plan.price}
                  </span>
                  <span className="text-muted pb-1">/mês</span>
                </div>
                {yearly && (
                  <p className="text-xs text-green-500 mt-1">
                    Cobrado R$ {plan.yearlyPrice * 12}/ano
                  </p>
                )}
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className={plan.highlighted ? 'btn-primary w-full text-center' : 'btn-secondary w-full text-center'}
              >
                Começar grátis
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Quem já usa, não para</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-green-500 text-green-500" />
                ))}
              </div>
              <p className="text-sm text-muted mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="card p-12 text-center bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para transformar seu marketing?
          </h2>
          <p className="text-muted text-lg mb-8">
            Comece hoje mesmo. 14 dias grátis, sem compromisso.
          </p>
          <Link to="/login" className="btn-primary px-10 py-3 text-base shadow-green-glow">
            Criar minha conta grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-bold">Aure</span>
          </div>
          <p className="text-xs text-muted">© 2025 Aure. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
