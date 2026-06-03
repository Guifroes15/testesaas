import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: '#0d0d0d', padding: '24px'
        }}>
          <div style={{
            maxWidth: 600, width: '100%', border: '1px solid #ef4444',
            borderRadius: 12, padding: 24, background: '#1a0a0a'
          }}>
            <p style={{ color: '#ef4444', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
              Erro ao carregar o app
            </p>
            <pre style={{
              color: '#fca5a5', fontSize: 12, whiteSpace: 'pre-wrap',
              wordBreak: 'break-word', margin: 0
            }}>
              {this.state.error.message}
              {'\n\n'}
              {this.state.error.stack}
            </pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
