/**
 * ErrorBoundary Component
 * Graceful error handling for React components
 */

'use client'

import { Component } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="bg-card rounded-2xl border border-border shadow-lg max-w-lg w-full p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground mb-2">Oops! Something went wrong</h2>

            {/* Message */}
            <p className="text-muted-foreground mb-6">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>

            {/* Error details (development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-500/10 rounded-lg text-left overflow-auto max-h-40">
                <div className="flex items-center gap-2 text-red-500 font-semibold text-sm mb-2">
                  <Bug className="w-4 h-4" />
                  Error Details
                </div>
                <pre className="text-xs text-red-400 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleReset}
                className="flex-1 bg-secondary text-foreground hover:bg-secondary/80"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                className="flex-1 bg-teal-500 text-white hover:bg-teal-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
              <Button
                onClick={this.handleGoHome}
                className="flex-1 bg-secondary text-foreground hover:bg-secondary/80"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Wrapper for async component boundaries
 */
export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-[200px] flex items-center justify-center p-4">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <Button onClick={resetErrorBoundary} className="bg-teal-500 text-white hover:bg-teal-600">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  )
}
