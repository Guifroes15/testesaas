import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, ArrowLeft, Sun, Moon, FlaskConical } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/Button'
import { IS_DEMO } from '@/lib/demo'

export function Login() {
  const { signInWithGoogle } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      navigate('/app')
    } catch (err: unknown) {
      const e = err as { code?: string }
      if (e.code !== 'auth/popup-closed-by-user') {
        setError('Erro ao entrar com Google. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-1 bg-dark-900 border-r border-[var(--color-border)] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,197,94,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-xl text-white">Aure</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Marketing orientado
            <br />
            <span className="text-green-500">a dados, não a achismo</span>
          </h2>
          <p className="text-dark-100 text-lg">
            Centralize lojas, meça resultados e tome decisões
            com velocidade e confiança.
          </p>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-6">
          {[
            { value: '+340%', label: 'média de ROI reportado' },
            { value: '12min', label: 'para criar seu workspace' },
            { value: '94%', label: 'de retenção anual' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-green-500">{stat.value}</p>
              <p className="text-sm text-dark-100 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5">
          <Link to="/" className="btn-ghost text-sm gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <button onClick={toggle} className="btn-ghost p-2">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            {/* Logo mobile */}
            <div className="flex lg:hidden items-center gap-2 mb-8">
              <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-lg">Aure</span>
            </div>

            <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta</h1>
            <p className="text-muted text-sm mb-8">
              Não tem conta?{' '}
              <Link to="/login" className="text-green-500 hover:underline">
                Crie uma grátis
              </Link>
            </p>

            {IS_DEMO && (
              <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-start gap-2">
                <FlaskConical className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Modo demo ativo.</strong> Firebase não configurado.
                  Clique em "Entrar com Google" para explorar o app com dados de exemplo.
                </span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Google Button */}
            <Button
              variant="secondary"
              fullWidth
              loading={loading}
              onClick={handleGoogle}
              className="py-3 text-base"
              icon={
                !loading && (
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )
              }
            >
              Entrar com Google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border)]" />
              </div>
              <div className="relative flex justify-center text-xs text-muted bg-[var(--color-bg)] px-2">
                100% seguro — sem senha necessária
              </div>
            </div>

            <p className="text-xs text-center text-muted">
              Ao entrar, você concorda com nossos{' '}
              <a href="#" className="hover:text-green-500 underline">Termos de Uso</a>{' '}
              e{' '}
              <a href="#" className="hover:text-green-500 underline">Política de Privacidade</a>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
