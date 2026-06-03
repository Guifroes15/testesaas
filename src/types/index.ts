// ─── Auth & Users ────────────────────────────────────────────────────────────

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer'
export type PlanId = 'starter' | 'pro' | 'enterprise'

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

export interface MonthData {
  month: string
  vendas: number
  faturamento: number
  conversao: number
  ticketMedio: number
  mensagens: number
}

export interface Store {
  id: string
  workspaceId: string
  name: string
  groupId?: string
  color?: string
  monthlyData: MonthData[]
  createdAt: string
}

export interface SimuladorInput {
  investimento: number
  mensagensBase: number
  mes: string
}

export interface SimuladorResult {
  pessimista: { vendas: number; faturamento: number; roi: number }
  base: { vendas: number; faturamento: number; roi: number }
  otimista: { vendas: number; faturamento: number; roi: number }
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
