import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import './styles/global.css';

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({ dsn: sentryDsn, environment: import.meta.env.MODE || 'production', tracesSampleRate: 0.1 });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={
      <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',padding:'2rem',textAlign:'center',gap:'1rem' }}>
        <h2>Something went wrong</h2>
        <p style={{ color:'#64748b' }}>An unexpected error occurred.</p>
        <button onClick={() => window.location.reload()} style={{ padding:'0.75rem 1.5rem',background:'#ef4444',color:'#fff',border:'none',borderRadius:'0.75rem',cursor:'pointer' }}>Reload App</button>
      </div>
    }>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
