import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Building2, Users, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createWorkspace, addWorkspaceMember, updateUser } from '@/lib/firestore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { PlanId } from '@/types'
import { PLANS } from '@/types'

type Step = 'workspace' | 'plan' | 'done'

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function Onboarding() {
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('workspace')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [workspaceName, setWorkspaceName] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro')

  async function handleCreate() {
    if (!profile) return
    if (!workspaceName.trim()) {
      setError('Dê um nome para seu workspace.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const now = new Date().toISOString()
      const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()

      const wsId = await createWorkspace({
        name: workspaceName.trim(),
        slug: slugify(workspaceName),
        ownerId: profile.uid,
        planId: selectedPlan,
        status: 'trialing',
        trialEndsAt: trialEnd,
        memberCount: 1,
        storeCount: 0,
        createdAt: now,
        updatedAt: now,
        settings: { currency: 'BRL', timezone: 'America/Sao_Paulo' },
      })

      await addWorkspaceMember(wsId, {
        uid: profile.uid,
        email: profile.email,
        name: profile.name,
        photoURL: profile.photoURL,
        role: 'owner',
        joinedAt: now,
      })

      await updateUser(profile.uid, { workspaceId: wsId })
      await refreshProfile()

      setStep('done')
      setTimeout(() => navigate('/app'), 2000)
    } catch {
      setError('Erro ao criar workspace. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 'workspace', label: 'Workspace', icon: <Building2 className="w-4 h-4" /> },
    { id: 'plan',      label: 'Plano',     icon: <Zap className="w-4 h-4" /> },
    { id: 'done',      label: 'Pronto',    icon: <Check className="w-4 h-4" /> },
  ]

  const stepIndex = steps.findIndex(s => s.id === step)

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-12">
        <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
          <Zap className="w-5 h-5 text-black" />
        </div>
        <span className="font-bold text-xl">Aure</span>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i < stepIndex
                  ? 'bg-green-500/20 text-green-500'
                  : i === stepIndex
                  ? 'bg-green-500 text-black'
                  : 'bg-[var(--color-border)] text-muted'
              }`}
            >
              {s.icon}
              {s.label}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px ${i < stepIndex ? 'bg-green-500' : 'bg-[var(--color-border)]'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {/* Step 1: Workspace */}
          {step === 'workspace' && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Crie seu workspace</h1>
              <p className="text-muted text-sm mb-6">
                Seu workspace é onde você e seu time gerenciam lojas e campanhas. Pode ser o nome da sua empresa ou agência.
              </p>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {error}
                </div>
              )}
              <Input
                label="Nome do workspace"
                placeholder="Ex: Rede Moda BR, Agência Pulse..."
                value={workspaceName}
                onChange={e => setWorkspaceName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setStep('plan')}
              />
              {workspaceName && (
                <p className="text-xs text-muted mt-2">
                  URL: <span className="text-green-500">aure.digital/{slugify(workspaceName)}</span>
                </p>
              )}
              <Button
                fullWidth
                className="mt-6 py-3"
                onClick={() => {
                  if (!workspaceName.trim()) {
                    setError('Dê um nome para seu workspace.')
                    return
                  }
                  setError('')
                  setStep('plan')
                }}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continuar
              </Button>
            </motion.div>
          )}

          {/* Step 2: Plan */}
          {step === 'plan' && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-2">
                <h1 className="text-2xl font-bold mb-1">Escolha seu plano</h1>
                <p className="text-muted text-sm">14 dias grátis em qualquer plano. Sem cartão de crédito.</p>
              </div>
              {PLANS.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full card p-5 text-left transition-all hover:border-green-500/30 ${
                    selectedPlan === plan.id ? 'border-green-500 shadow-green-glow' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{plan.name}</span>
                        {plan.highlighted && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-black font-medium">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted">{plan.description}</p>
                      <p className="text-xs text-muted mt-1">
                        Até {plan.maxStores === 999 ? '∞' : plan.maxStores} lojas · {plan.maxMembers === 999 ? '∞' : plan.maxMembers} usuários
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">R$ {plan.price}</div>
                      <div className="text-xs text-muted">/mês</div>
                    </div>
                  </div>
                  {selectedPlan === plan.id && (
                    <div className="mt-3 flex items-center gap-1.5 text-green-500 text-xs font-medium">
                      <Check className="w-3.5 h-3.5" />
                      Selecionado — 14 dias grátis
                    </div>
                  )}
                </button>
              ))}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {error}
                </div>
              )}
              <Button fullWidth loading={loading} onClick={handleCreate} className="py-3 mt-2">
                Criar workspace e começar
                <ArrowRight className="w-4 h-4" />
              </Button>
              <button
                onClick={() => setStep('workspace')}
                className="w-full text-center text-sm text-muted hover:text-[var(--color-text)] transition-colors"
              >
                ← Voltar
              </button>
            </motion.div>
          )}

          {/* Step 3: Done */}
          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Tudo pronto!</h1>
              <p className="text-muted text-sm">
                Seu workspace <strong className="text-[var(--color-text)]">{workspaceName}</strong> foi criado.
                Redirecionando para o dashboard...
              </p>
              <div className="mt-6 flex justify-center">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-green-500"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
