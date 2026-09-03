import React from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-xl border border-slate-200">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">⚠️</div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">出现了一些问题</h2>
            <p className="text-slate-500 mb-5 text-sm leading-relaxed">
              {this.state.error?.message || '发生了未知错误'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all shadow-md shadow-primary-500/20 text-sm font-medium cursor-pointer btn-shine"
              >
                重试
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all border border-slate-200 text-sm font-medium cursor-pointer"
              >
                刷新页面
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
