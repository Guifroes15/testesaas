// ─── Auth & Users ────────────────────────────────────────────────────────────

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer'
export type PlanId   = 'starter' | 'pro' | 'enterprise'

export interface UserProfile {
  uid: string
  email: string
  name: string
  photoURL?: string
  role: 'superadmin' | 'user'
  workspaceId?: string
  createdAt: string
}

// ─── Workspace (Tenant) ───────────────────────────────────────────────────────

export type WorkspaceStatus = 'active' | 'trialing' | 'suspended' | 'cancelled'

export interface Workspace {
  id: string
  name: string
  slug: string
  ownerId: string
  planId: PlanId
  status: WorkspaceStatus
  trialEndsAt?: string
  subscriptionId?: string
  memberCount: number
  storeCount: number
  createdAt: string
  updatedAt: string
  settings: WorkspaceSettings
}

export interface WorkspaceSettings {
  theme?: 'dark' | 'light'
  currency: string
  timezone: string
  logoURL?: string
}

export interface WorkspaceMember {
  uid: string
  email: string
  name: string
  photoURL?: string
  role: UserRole
  joinedAt: string
}

// ─── Plans ────────────────────────────────────────────────────────────────────

export interface Plan {
  id: PlanId
  name: string
  description: string
  price: number
  yearlyPrice: number
  maxStores: number
  maxMembers: number
  features: string[]
  highlighted?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Para quem está começando',
    price: 97,
    yearlyPrice: 79,
    maxStores: 3,
    maxMembers: 2,
    features: [
      'Até 3 lojas',
      '2 usuários',
      'Dashboard de vendas',
      'Simulador de ROI',
      'Suporte por email',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para times em crescimento',
    price: 247,
    yearlyPrice: 197,
    maxStores: 15,
    maxMembers: 10,
    features: [
      'Até 15 lojas',
      '10 usuários',
      'Dashboard completo',
      'Simulador de ROI',
      'IA para criativos e copy',
      'Relatórios automáticos',
      'Suporte prioritário',
    ],
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para grandes operações',
    price: 597,
    yearlyPrice: 497,
    maxStores: 999,
    maxMembers: 999,
    features: [
      'Lojas ilimitadas',
      'Usuários ilimitados',
      'Dashboard completo',
      'Simulador de ROI',
      'IA avançada',
      'Relatórios customizados',
      'API de integração',
      'Onboarding dedicado',
      'SLA garantido',
    ],
  },
]

// ─── Store & Analytics ────────────────────────────────────────────────────────

export interface MetaAdsData {
  investimento: number    // R$ investido
  alcance: number         // pessoas alcançadas
  impressoes: number      // total de impressões
  cliques: number         // cliques no link
  conversoes: number      // conversões (mensagens iniciadas)
  cpc: number             // custo por clique
  cpm: number             // custo por mil impressões
  ctr: number             // taxa de clique (%)
  roas: number            // retorno sobre investimento em ads
}

export interface MonthData {
  mes: string             // label exibido: "Jun/25"
  chave: string           // chave de ordenação: "2025-06"
  vendas: number          // faturamento total
  faturamentoLoja: number // faturamento líquido da loja
  conversao: number       // taxa de conversão (%)
  mensagens: number       // leads / mensagens recebidas
  qtdVendas: number       // quantidade de vendas fechadas
  ticketMedio: number     // ticket médio (R$)
  pctAureFat: number      // % da Aure sobre o faturamento
  verba: number           // verba Meta Ads (R$)
  metaAds?: MetaAdsData   // detalhes da campanha Meta Ads
}

export type PlanStatus = 'Alta' | 'Média' | 'Baixa' | 'Sucesso' | 'Teste'

export interface PlanItem {
  id: string
  tarefa: string
  status: PlanStatus
}

export interface Store {
  id: string
  workspaceId: string
  name: string
  color: string
  fee: number             // taxa Aure (%)
  groupId?: string
  historico: MonthData[]
  planos: PlanItem[]
  createdAt: string
}

// ─── Simulador ────────────────────────────────────────────────────────────────

export interface SimuladorInput {
  verbaPlanning: number
  mensagensPlanning: number
}

export interface SimuladorResult {
  pessimista: number
  base: number
  otimista: number
  custoTotal: number
  roiPessimista: number
  roiBase: number
  roiOtimista: number
  convMediaHist: number
  ticketMedioHist: number
  mesesUsados: number
}

export function calcularSimulador(
  historico: MonthData[],
  input: SimuladorInput,
): SimuladorResult {
  const meses = historico.filter(m => m.mensagens > 0 && m.qtdVendas > 0).slice(-6)
  const n = meses.length || 1

  const convMediaHist   = meses.reduce((a, m) => a + m.conversao, 0) / n
  const ticketMedioHist = meses.reduce((a, m) => a + m.ticketMedio, 0) / n

  const vendas = (conv: number) => Math.round(input.mensagensPlanning * (conv / 100))
  const fat    = (conv: number) => vendas(conv) * ticketMedioHist

  const pessimista = fat(convMediaHist * 0.7)
  const base       = fat(convMediaHist)
  const otimista   = fat(convMediaHist * 1.3)

  const roi = (f: number) =>
    input.verbaPlanning > 0 ? ((f - input.verbaPlanning) / input.verbaPlanning) * 100 : 0

  return {
    pessimista,
    base,
    otimista,
    custoTotal: input.verbaPlanning,
    roiPessimista: roi(pessimista),
    roiBase:       roi(base),
    roiOtimista:   roi(otimista),
    convMediaHist,
    ticketMedioHist,
    mesesUsados: n,
  }
}

// ─── Ideas ────────────────────────────────────────────────────────────────────

export type IdeaStatus = 'backlog' | 'em_andamento' | 'concluida' | 'descartada'

export interface Idea {
  id: string
  workspaceId: string
  title: string
  description: string
  status: IdeaStatus
  priority: 'alta' | 'media' | 'baixa'
  tags: string[]
  createdBy: string
  createdAt: string
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  read: boolean
  createdAt: string
  link?: string
}
