import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-2xl p-12 text-center max-w-[500px] shadow-sm border border-gray-100">
            <div className="p-4 bg-red-50 rounded-full inline-block mb-6">
              <AlertTriangle size={48} className="text-red-500" />
            </div>
            <h1 className="text-gray-900 mb-4 text-2xl font-bold">Something went wrong</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              We encountered an unexpected error. This might be due to a network issue or a temporary problem.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-gray-50 p-4 rounded-lg mb-8 text-left border border-gray-200">
                <summary className="cursor-pointer font-semibold text-gray-800 text-sm">
                  Error Details (Development)
                </summary>
                <pre className="mt-3 text-xs text-red-600 overflow-auto whitespace-pre-wrap font-mono">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={this.handleReload}
                className="btn btn-primary flex items-center gap-2"
              >
                <RefreshCw size={18} /> Reload Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="btn btn-secondary flex items-center gap-2"
              >
                <ArrowLeft size={18} /> Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
