import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-gray p-4">
          <div className="bg-white rounded-2xl p-8 text-center max-w-[500px] shadow-lg">
            <div className="text-6xl mb-5">⚠️</div>
            <h1 className="text-gray-800 mb-4 text-3xl font-bold">Something went wrong</h1>
            <p className="text-secondary mb-6 leading-relaxed">
              We encountered an unexpected error. This might be due to a network issue or a temporary problem.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <summary className="cursor-pointer font-semibold text-gray-800">
                  Error Details (Development)
                </summary>
                <pre className="mt-3 text-xs text-red-600 overflow-auto whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={this.handleReload}
                className="btn btn-primary"
              >
                🔄 Reload Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="btn btn-secondary"
              >
                ← Go Back
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
