import React from 'react';
import { setSetting } from '../db';

export default function DisclaimerScreen({ onAccept }) {
  const handleAccept = async () => {
    await setSetting('disclaimerAccepted', true);
    onAccept();
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: 20, justifyContent: 'center' }}>
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚕️</div>
        <h1 style={{ fontSize: '1.33rem', fontWeight: 700, marginBottom: 16 }}>Important Notice</h1>
        <p style={{ fontSize: '0.94rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 24 }}>
          VitalsLog is a personal health logging tool. It is <strong>NOT a medical device</strong> and does
          NOT provide medical advice, diagnosis, or treatment. The color-coded categories are based on
          American Heart Association guidelines and are for informational purposes only. Always consult
          your healthcare provider for medical decisions. If you are experiencing a medical emergency,
          call 911.
        </p>
        <button className="btn-primary" onClick={handleAccept} aria-label="Accept disclaimer and continue">
          I Understand — Continue
        </button>
      </div>
    </div>
  );
}
