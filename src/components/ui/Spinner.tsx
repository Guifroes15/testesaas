import { Loader2 } from 'lucide-react'

export function Spinner({ className = 'w-5 h-5' }: { className?: string }) {
  return <Loader2 className={`animate-spin text-green-500 ${className}`} />
}

export function PageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="w-8 h-8" />
    </div>
  )
}
