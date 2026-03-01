import React, { useState, useEffect } from 'react';
import { db, getSetting, setSetting } from '../db';
import { usePremium } from '../hooks/usePremium';
import PremiumGate from '../components/PremiumGate';

export default function SettingsScreen() {
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('light');
  const [showGate, setShowGate] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { premium, refresh } = usePremium();

  useEffect(() => {
    db.profiles.where('isPrimary').equals(1).first().then(p => { if (p) setName(p.name || ''); });
    getSetting('theme').then(t => setTheme(t || 'light'));
  }, []);

  const handleNameChange = async (val) => {
    setName(val);
    const p = await db.profiles.where('isPrimary').equals(1).first();
    if (p) await db.profiles.update(p.id, { name: val });
  };

  const toggleTheme = async () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    await setSetting('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleExportCSV = async () => {
    const readings = await db.readings.toArray();
    if (!readings.length) return alert('No data to export.');
    const header = 'Date,Type,Value,Category,Note\n';
    const rows = readings.map(r => {
      const val = r.type === 'bp' ? `${r.values.systolic}/${r.values.diastolic}` :
        r.type === 'hr' ? r.values.bpm : r.type === 'weight' ? r.values.value : r.values.value;
      return `${r.timestamp},${r.type},"${val}",${r.category},"${r.note || ''}"`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vitalslog-export-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const handleDeleteAll = async () => {
    await db.readings.clear();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Settings</h1>

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Profile</h3>
        <label style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }} htmlFor="profile-name">Name (for reports)</label>
        <input id="profile-name" type="text" value={name} onChange={e => handleNameChange(e.target.value)}
          placeholder="Your name" aria-label="Profile name"
          style={{
            width: '100%', height: 56, padding: '0 16px', marginTop: 4,
            background: 'var(--bg-light)', borderRadius: 12, fontSize: '1rem',
          }}
        />
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Appearance</h3>
        <button onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '8px 0' }}>
          <span>{theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Tap to switch</span>
        </button>
      </div>

      {!premium && (
        <div className="card" style={{ background: 'var(--brand-red)', color: '#fff', cursor: 'pointer' }}
          onClick={() => setShowGate(true)} role="button" aria-label="Upgrade to Premium">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>⭐ Unlock Premium — $2.99</h3>
          <p style={{ fontSize: '0.89rem', opacity: 0.9, marginTop: 4 }}>
            Unlimited history, PDF reports, medication tracking & more
          </p>
        </div>
      )}

      {premium && (
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>🩊 Medications</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.89rem' }}>
            Medication tracking coming soon. Log medications alongside your vitals.
          </p>
        </div>
      )}

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Data</h3>
        <button onClick={handleExportCSV} className="btn-outline" style={{ marginBottom: 12 }} aria-label="Export data as CSV">
          📄 Export CSV
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} aria-label="Delete all data"
          style={{ width: '100%', height: 56, color: '#C62828', fontWeight: 600, borderRadius: 12, border: '2px solid #C62828' }}>
          🗑️ Delete All Data
        </button>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>About</h3>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>VitalsLog v1.0.0</p>
        <button onClick={() => setShowDisclaimer(true)} style={{ marginTop: 8, color: 'var(--brand-red)', fontWeight: 600, minHeight: 44 }}
          aria-label="View legal disclaimer">
          View Legal Disclaimer
        </button>
      </div>

      {showDisclaimer && (
        <div className="modal-overlay" onClick={() => setShowDisclaimer(false)} role="dialog" aria-label="Legal disclaimer">
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.22rem', fontWeight: 700, marginBottom: 12 }}>Legal Disclaimer</h2>
            <p style={{ fontSize: '0.89rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              VitalsLog is a personal health logging tool. It is NOT a medical device and does NOT provide
              medical advice, diagnosis, or treatment. The color-coded categories are based on American Heart
              Association guidelines and are for informational purposes only. Always consult your healthcare
              provider for medical decisions. If you are experiencing a medical emergency, call 911.
            </p>
            <button className="btn-primary" onClick={() => setShowDisclaimer(false)} style={{ marginTop: 16 }}>
              I Understand
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" role="alertdialog" aria-label="Confirm delete all data">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.22rem', fontWeight: 700, marginBottom: 12 }}>Delete All Data?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>This cannot be undone.</p>
            <button className="btn-primary" style={{ background: '#C62828', marginBottom: 12 }} onClick={handleDeleteAll}>
              Delete Everything
            </button>
            <button className="btn-outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showGate && <PremiumGate onUnlock={() => { refresh(); setShowGate(false); }} />}
    </div>
  );
}
