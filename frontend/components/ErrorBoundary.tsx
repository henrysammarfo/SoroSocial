"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // Report to error monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // reportError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined
    })
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
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-6">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-4xl">⚠️</div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  We encountered an unexpected error. Don't worry, this has been reported to our team.
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono overflow-auto">
                    <div className="text-red-600 dark:text-red-400 mb-2">
                      {this.state.error.name}: {this.state.error.message}
                    </div>
                    <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <>
                        <div className="text-gray-600 dark:text-gray-400 mt-2 mb-1">
                          Component Stack:
                        </div>
                        <pre className="whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-2 justify-center">
                <Button onClick={this.handleRetry} variant="outline">
                  Try Again
                </Button>
                <Button onClick={this.handleReload}>
                  Reload Page
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Hook for error reporting
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error("Manual error report:", error, errorInfo)
    
    // In production, this would send to error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // reportError(error, errorInfo)
    }
  }
}

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    // Prevent the default behavior (logging to console)
    // event.preventDefault()
  })

  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
  })
}