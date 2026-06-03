import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, CreditCard, Shield, Bell, User } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PLANS } from '@/types'

export function Settings() {
  const { theme, setTheme } = useTheme()
  const { profile, logout } = useAuth()
  const { workspace } = useWorkspace()
  const [activeTab, setActiveTab] = useState<'profile' | 'workspace' | 'billing' | 'notifications'>('profile')

  const currentPlan = PLANS.find(p => p.id === workspace?.planId)

  const tabs = [
    { id: 'profile',       label: 'Perfil',       icon: <User className="w-4 h-4" /> },
    { id: 'workspace',     label: 'Workspace',    icon: <Shield className="w-4 h-4" /> },
    { id: 'billing',       label: 'Assinatura',   icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notificações', icon: <Bell className="w-4 h-4" /> },
  ] as const

  return (
    <div>
      <Header title="Ajustes" subtitle="Personalize sua conta e workspace" />
      <div className="p-6 max-w-4xl">
        <div className="flex gap-6">
          {/* Tab list */}
          <nav className="w-44 shrink-0 space-y-0.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`sidebar-link w-full ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Tab content */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Profile */}
              {activeTab === 'profile' && (
                <div className="card p-6 space-y-6">
                  <h2 className="font-semibold">Informações do perfil</h2>
                  <div className="flex items-center gap-4">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt="" className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-2xl font-bold">
                        {profile?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{profile?.name}</p>
                      <p className="text-sm text-muted">{profile?.email}</p>
                      <p className="text-xs text-muted mt-1">
                        Conta Google · Entrou em {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('pt-BR') : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-border)]">
                    <h3 className="text-sm font-medium mb-3">Aparência</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex-1 flex items-center gap-2 p-3 rounded-lg border text-sm transition-all ${
                          theme === 'dark'
                            ? 'border-green-500 bg-green-500/10 text-green-500'
                            : 'border-[var(--color-border)] hover:border-green-500/30'
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        Escuro
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex-1 flex items-center gap-2 p-3 rounded-lg border text-sm transition-all ${
                          theme === 'light'
                            ? 'border-green-500 bg-green-500/10 text-green-500'
                            : 'border-[var(--color-border)] hover:border-green-500/30'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        Claro
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-border)]">
                    <Button variant="danger" onClick={logout}>Sair da conta</Button>
                  </div>
                </div>
              )}

              {/* Workspace */}
              {activeTab === 'workspace' && (
                <div className="card p-6 space-y-6">
                  <h2 className="font-semibold">Workspace</h2>
                  {workspace ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 text-xl font-bold">
                          {workspace.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{workspace.name}</p>
                          <p className="text-sm text-muted">/{workspace.slug}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {[
                          { label: 'Plano', value: workspace.planId },
                          { label: 'Status', value: workspace.status },
                          { label: 'Membros', value: workspace.memberCount },
                          { label: 'Lojas', value: workspace.storeCount },
                        ].map(item => (
                          <div key={item.label} className="p-4 rounded-lg bg-[var(--color-border)]/40">
                            <p className="text-xs text-muted mb-1">{item.label}</p>
                            <p className="font-semibold text-sm capitalize">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-muted text-sm">Nenhum workspace encontrado.</p>
                  )}
                </div>
              )}

              {/* Billing */}
              {activeTab === 'billing' && (
                <div className="card p-6 space-y-6">
                  <h2 className="font-semibold">Assinatura</h2>
                  {currentPlan && (
                    <div className={`p-5 rounded-xl border ${
                      workspace?.planId === 'pro' ? 'border-green-500 bg-green-500/5' : 'border-[var(--color-border)]'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{currentPlan.name}</h3>
                            {workspace?.status === 'trialing' && (
                              <Badge variant="blue" dot>Trial</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted">{currentPlan.description}</p>
                        </div>
                        <p className="text-2xl font-bold">
                          R$ {currentPlan.price}<span className="text-sm text-muted font-normal">/mês</span>
                        </p>
                      </div>
                      {workspace?.status === 'trialing' && workspace.trialEndsAt && (
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm mb-4">
                          Seu trial termina em {new Date(workspace.trialEndsAt).toLocaleDateString('pt-BR')}.
                          Adicione um método de pagamento para continuar.
                        </div>
                      )}
                      <Button icon={<CreditCard className="w-4 h-4" />}>
                        {workspace?.status === 'trialing' ? 'Adicionar pagamento' : 'Gerenciar assinatura'}
                      </Button>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium mb-3">Outros planos</h3>
                    <div className="space-y-3">
                      {PLANS.filter(p => p.id !== workspace?.planId).map(plan => (
                        <div key={plan.id} className="flex items-center justify-between p-4 card hover:border-green-500/30 transition-colors">
                          <div>
                            <p className="font-medium text-sm">{plan.name}</p>
                            <p className="text-xs text-muted">{plan.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-semibold">R$ {plan.price}/mês</p>
                            <Button variant="secondary" size="sm">Mudar</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="card p-6 space-y-4">
                  <h2 className="font-semibold">Preferências de notificação</h2>
                  {[
                    { label: 'Relatório semanal', desc: 'Receba um resumo todo domingo' },
                    { label: 'Alerta de performance', desc: 'Quando uma loja cair abaixo da meta' },
                    { label: 'Novas ideias da equipe', desc: 'Quando um membro adicionar uma ideia' },
                    { label: 'Atualizações do produto', desc: 'Novas funcionalidades e melhorias' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-border)]/40">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-[var(--color-border)] rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
