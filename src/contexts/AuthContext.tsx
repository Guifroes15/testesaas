import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import type { UserProfile } from '@/types'
import { IS_DEMO, DEMO_PROFILE } from '@/lib/demo'

interface AuthContextValue {
  firebaseUser: User | null
  profile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function loadFirebaseAuth() {
  const { onAuthStateChanged, signInWithPopup, signOut } = await import('firebase/auth')
  const { auth, googleProvider } = await import('@/lib/firebase')
  const { getUser, createUser } = await import('@/lib/firestore')
  return { onAuthStateChanged, signInWithPopup, signOut, auth, googleProvider, getUser, createUser }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (IS_DEMO) {
      const stored = sessionStorage.getItem('aure-demo-logged')
      if (stored) setProfile(DEMO_PROFILE)
      setLoading(false)
      return
    }

    let unsub = () => {}
    loadFirebaseAuth().then(({ onAuthStateChanged, auth, getUser, createUser }) => {
      unsub = onAuthStateChanged(auth, async user => {
        setFirebaseUser(user)
        if (user) {
          let p = await getUser(user.uid)
          if (!p) {
            p = {
              uid: user.uid,
              email: user.email ?? '',
              name: user.displayName ?? 'Usuário',
              photoURL: user.photoURL ?? undefined,
              role: 'user',
              createdAt: new Date().toISOString(),
            }
            await createUser(p)
          }
          setProfile(p)
        } else {
          setProfile(null)
        }
        setLoading(false)
      })
    })
    return () => unsub()
  }, [])

  async function signInWithGoogle() {
    if (IS_DEMO) {
      sessionStorage.setItem('aure-demo-logged', '1')
      setProfile(DEMO_PROFILE)
      return
    }
    const { signInWithPopup, auth, googleProvider, getUser, createUser } = await loadFirebaseAuth()
    const result = await signInWithPopup(auth, googleProvider)
    let p = await getUser(result.user.uid)
    if (!p) {
      p = {
        uid: result.user.uid,
        email: result.user.email ?? '',
        name: result.user.displayName ?? 'Usuário',
        photoURL: result.user.photoURL ?? undefined,
        role: 'user',
        createdAt: new Date().toISOString(),
      }
      await createUser(p)
    }
    setFirebaseUser(result.user)
    setProfile(p)
  }

  async function logout() {
    if (IS_DEMO) {
      sessionStorage.removeItem('aure-demo-logged')
      setProfile(null)
      return
    }
    const { signOut, auth } = await loadFirebaseAuth()
    await signOut(auth)
    setFirebaseUser(null)
    setProfile(null)
  }

  async function refreshProfile() {
    if (IS_DEMO) return
    if (!firebaseUser) return
    const { getUser } = await loadFirebaseAuth()
    const p = await getUser(firebaseUser.uid)
    if (p) setProfile(p)
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, loading, signInWithGoogle, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
