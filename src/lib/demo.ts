import type { UserProfile, Workspace } from '@/types'

export const IS_DEMO = !import.meta.env.VITE_FIREBASE_API_KEY

export const DEMO_PROFILE: UserProfile = {
  uid: 'demo-user',
  email: 'demo@aure.digital',
  name: 'Guilherme (Demo)',
  photoURL: undefined,
  role: 'superadmin',
  workspaceId: 'demo-workspace',
  createdAt: new Date().toISOString(),
}

export const DEMO_WORKSPACE: Workspace = {
  id: 'demo-workspace',
  name: 'Minha Empresa',
  slug: 'minha-empresa',
  ownerId: 'demo-user',
  planId: 'pro',
  status: 'trialing',
  trialEndsAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  memberCount: 3,
  storeCount: 5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  settings: { currency: 'BRL', timezone: 'America/Sao_Paulo' },
}
