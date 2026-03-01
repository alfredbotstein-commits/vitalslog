import React, { useState } from 'react';
import { purchasePremium, restorePurchases } from '../utils/premium';

export default function PremiumGate({ onUnlock }) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await purchasePremium();
      onUnlock?.();
    } finally { setLoading(false); }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const restored = await restorePurchases();
      if (restored) onUnlock?.();
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-label="Upgrade to Premium">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <button onClick={onUnlock} aria-label="Close" style={{
          position: 'absolute', top: 12, right: 16, fontSize: '1.5rem', minHeight: 44, minWidth: 44
        }}>✕</button>
        <h2 style={{ fontSize: '1.56rem', fontWeight: 700, marginBottom: 20 }}>VitalsLog Premium</h2>
        <ul style={{ listStyle: 'none', textAlign: 'left', fontSize: '1rem', lineHeight: 2.2 }}>
          {['Unlimited history', 'PDF doctor reports', 'Medication tracking', 'Family profiles', 'Apple Health sync', 'Extended chart ranges'].map(f =>
            <li key={f}>✅ {f}</li>
          )}
        </ul>
        <p style={{ fontSize: '1.22rem', fontWeight: 700, color: 'var(--brand-red)', margin: '20px 0 16px' }}>
          $2.99 — one-time purchase
        </p>
        <button className="btn-primary" onClick={handlePurchase} disabled={loading} aria-label="Unlock Premium for $2.99">
          {loading ? 'Processing...' : 'Unlock Premium'}
        </button>
        <button onClick={handleRestore} style={{
          marginTop: 12, color: 'var(--text-secondary)', textDecoration: 'underline', fontSize: '0.89rem', minHeight: 44
        }}>Restore Purchases</button>
      </div>
    </div>
  );
}
