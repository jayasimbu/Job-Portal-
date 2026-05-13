import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-slate-50 min-h-screen">
          <h1 className="text-3xl font-black text-rose-600 mb-4 uppercase">Something went wrong.</h1>
          <div className="p-6 bg-slate-100 border border-slate-300 rounded-2xl overflow-auto max-h-[70vh]">
            <p className="font-bold text-slate-800 mb-2">{this.state.error && this.state.error.toString()}</p>
            <pre className="text-[10px] text-slate-500 font-mono">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 h-12 px-8 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg"
          >
            Reload Platform
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;



