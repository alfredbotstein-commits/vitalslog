import React from 'react';

export default function CrisisAlert({ onDismiss }) {
  return (
    <div className="modal-overlay" role="alertdialog" aria-label="Blood Pressure Crisis Alert">
      <div className="modal-content" style={{ textAlign: 'center', border: '3px solid #7F0000' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
        <h2 style={{ fontSize: '1.33rem', fontWeight: 700, color: '#7F0000', marginBottom: 12 }}>
          Crisis-Level Reading
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: 20 }}>
          Your blood pressure reading is in the <strong>crisis range</strong> (above 180/120).
          If you are experiencing symptoms such as chest pain, shortness of breath, back pain,
          numbness, vision changes, or difficulty speaking:
        </p>
        <a href="tel:911" className="btn-primary"
          style={{ background: '#7F0000', marginBottom: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Call 911">
          📞 Call 911
        </a>
        <button className="btn-outline" onClick={onDismiss} aria-label="Dismiss alert">
          I Will Contact My Doctor
        </button>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 16 }}>
          VitalsLog is not a medical device. This alert is for informational purposes only.
        </p>
      </div>
    </div>
  );
}
