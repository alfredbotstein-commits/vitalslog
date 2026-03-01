import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { formatReading, getCategory, getTrendArrow, VITAL_TYPES } from '../utils/vitals';
import { format, isToday, isYesterday, subDays } from 'date-fns';
import { usePremium } from '../hooks/usePremium';
import PremiumGate from '../components/PremiumGate';

export default function HistoryScreen() {
  const [filter, setFilter] = useState('all');
  const [showGate, setShowGate] = useState(false);
  const { premium, refresh } = usePremium();

  const readings = useLiveQuery(async () => {
    let q = db.readings.orderBy('timestamp').reverse();
    if (filter !== 'all') q = db.readings.where('type').equals(filter).reverse();
    return q.toArray();
  }, [filter]);

  const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

  const grouped = useMemo(() => {
    if (!readings) return {};
    const g = {};
    readings.forEach(r => {
      const d = format(new Date(r.timestamp), 'yyyy-MM-dd');
      (g[d] = g[d] || []).push(r);
    });
    return g;
  }, [readings]);

  const formatDateHeader = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00');
    if (isToday(d)) return 'Today';
    if (isYesterday(d)) return 'Yesterday';
    return format(d, 'EEE, MMM d');
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this reading?')) await db.readings.delete(id);
  };

  const allFilters = [{ key: 'all', label: 'All' }, ...VITAL_TYPES.map(v => ({ key: v.key, label: v.icon }))];

  return (
    <div className="screen">
      <h1 className="screen-title">History</h1>

      <div className="pill-row" style={{ marginBottom: 16 }}>
        {allFilters.map(f => (
          <button key={f.key} className={`pill ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)} aria-label={`Filter: ${f.label}`}>{f.label}</button>
        ))}
      </div>

      {readings?.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ fontSize: '3rem', marginBottom: 12 }}>🩺</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No readings yet</p>
          <p style={{ color: 'var(--text-secondary)' }}>Tap Log to get started!</p>
        </div>
      )}

      {Object.entries(grouped).map(([dateStr, entries]) => {
        const isOld = !premium && dateStr < thirtyDaysAgo.slice(0, 10);
        return (
          <div key={dateStr} style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>{formatDateHeader(dateStr)}</h3>
            {entries.map((r, i) => {
              const cat = getCategory(r.type, r.values);
              const prev = readings.find((p, j) => j > readings.indexOf(r) && p.type === r.type);
              const primaryVal = r.type === 'bp' ? r.values.systolic : r.type === 'hr' ? r.values.bpm :
                r.type === 'weight' ? r.values.value : r.values.value;
              const prevVal = prev ? (prev.type === 'bp' ? prev.values.systolic : prev.type === 'hr' ? prev.values.bpm :
                prev.type === 'weight' ? prev.values.value : prev.values.value) : null;
              const arrow = getTrendArrow(primaryVal, prevVal);

              if (isOld) return (
                <div key={r.id} className="card" style={{ opacity: 0.4, filter: 'blur(2px)', position: 'relative' }}
                  onClick={() => setShowGate(true)} role="button" aria-label="Locked reading, upgrade to view">
                  <p style={{ textAlign: 'center' }}>🔒 Upgrade to view</p>
                </div>
              );

              return (
                <div key={r.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: cat.color, flexShrink: 0 }}
                    aria-hidden="true" />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '1.22rem', fontWeight: 700 }} aria-label={`Reading: ${formatReading(r.type, r.values)}`}>
                      {formatReading(r.type, r.values)}
                    </p>
                    <p style={{ fontSize: '0.83rem', color: cat.color, fontWeight: 600 }}>{cat.label}</p>
                    {r.note && <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>{r.note}</p>}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                      {format(new Date(r.timestamp), 'h:mm a')}
                    </p>
                    {arrow && <p style={{ fontSize: '1.1rem' }}>{arrow}</p>}
                  </div>
                  <button onClick={() => handleDelete(r.id)} aria-label="Delete reading"
                    style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', minWidth: 44, minHeight: 44 }}>✕</button>
                </div>
              );
            })}
          </div>
        );
      })}

      {showGate && <PremiumGate onUnlock={() => { refresh(); setShowGate(false); }} />}
    </div>
  );
}
