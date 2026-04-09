// src/components/game/Battle/ErrorBoundary.tsx
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Battle Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              color: 'white',
              fontFamily: 'Baloo 2, cursive',
              textAlign: 'center',
              padding: '2rem',
            }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Something went wrong in battle!
            </h2>
            <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
              Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.2rem',
                border: 'none',
                borderRadius: '12px',
                background: 'linear-gradient(45deg, #00d9ff, #00ff88)',
                color: '#1a1a2e',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Reload
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}