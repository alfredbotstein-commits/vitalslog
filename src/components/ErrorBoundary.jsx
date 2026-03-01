import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }} role="alert">
          <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Please restart the app.</p>
          <button className="btn-primary" style={{ maxWidth: 200, margin: '0 auto' }}
            onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
