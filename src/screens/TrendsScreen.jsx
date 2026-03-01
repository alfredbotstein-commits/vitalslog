import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { getCategory, VITAL_TYPES } from '../utils/vitals';
import { subDays, format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { usePremium } from '../hooks/usePremium';
import PremiumGate from '../components/PremiumGate';

const RANGES = [
  { key: '7d', label: '7D', days: 7, free: true },
  { key: '30d', label: '30D', days: 30, free: true },
  { key: '90d', label: '90D', days: 90, free: false },
  { key: '1y', label: '1Y', days: 365, free: false },
];

export default function TrendsScreen() {
  const [vitalType, setVitalType] = useState('bp');
  const [range, setRange] = useState('30d');
  const [showGate, setShowGate] = useState(false);
  const { premium, refresh } = usePremium();

  const rangeObj = RANGES.find(r => r.key === range);
  const cutoff = subDays(new Date(), rangeObj.days).toISOString();

  const readings = useLiveQuery(async () => {
    return db.readings
      .where('type').equals(vitalType)
      .filter(r => r.timestamp >= cutoff)
      .sortBy('timestamp');
  }, [vitalType, cutoff]);

  const chartData = (readings || []).map(r => ({
    date: format(new Date(r.timestamp), 'M/d'),
    ...(vitalType === 'bp' ? { systolic: r.values.systolic, diastolic: r.values.diastolic } :
      vitalType === 'hr' ? { bpm: r.values.bpm } :
      vitalType === 'weight' ? { weight: r.values.value } :
      { sugar: r.values.value }),
  }));

  const stats = (readings || []).reduce((acc, r) => {
    const val = vitalType === 'bp' ? r.values.systolic : vitalType === 'hr' ? r.values.bpm :
      vitalType === 'weight' ? r.values.value : r.values.value;
    return { sum: acc.sum + val, min: Math.min(acc.min, val), max: Math.max(acc.max, val), count: acc.count + 1 };
  }, { sum: 0, min: Infinity, max: -Infinity, count: 0 });
  const avg = stats.count ? Math.round(stats.sum / stats.count) : 0;

  const handleRangeChange = (r) => {
    if (!r.free && !premium) { setShowGate(true); return; }
    setRange(r.key);
  };

  return (
    <div className="screen">
      <h1 className="screen-title">Trends</h1>

      <div className="pill-row" style={{ marginBottom: 12 }}>
        {VITAL_TYPES.map(v => (
          <button key={v.key} className={`pill ${vitalType === v.key ? 'active' : ''}`}
            onClick={() => setVitalType(v.key)} aria-label={`Show ${v.label} trends`}>{v.icon} {v.label}</button>
        ))}
      </div>

      <div className="pill-row" style={{ marginBottom: 20 }}>
        {RANGES.map(r => (
          <button key={r.key} className={`pill ${range === r.key ? 'active' : ''}`}
            onClick={() => handleRangeChange(r)} aria-label={`${r.label} range${!r.free && !premium ? ' (premium)' : ''}`}>
            {r.label}{!r.free && !premium ? ' 🔒' : ''}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 12 }}>
        {chartData.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
            No data for this period. Start logging!
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--text-secondary)" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              {vitalType === 'bp' && <>
                <Line type="monotone" dataKey="systolic" stroke="#C62828" strokeWidth={2} dot={{ r: 4 }} name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="#1565C0" strokeWidth={2} dot={{ r: 4 }} name="Diastolic" />
                <ReferenceLine y={120} stroke="#2E7D32" strokeDasharray="5 5" opacity={0.5} />
                <ReferenceLine y={140} stroke="#C62828" strokeDasharray="5 5" opacity={0.5} />
              </>}
              {vitalType === 'hr' && <Line type="monotone" dataKey="bpm" stroke="#C62828" strokeWidth={2} dot={{ r: 4 }} />}
              {vitalType === 'weight' && <Line type="monotone" dataKey="weight" stroke="#C62828" strokeWidth={2} dot={{ r: 4 }} />}
              {vitalType === 'sugar' && <Line type="monotone" dataKey="sugar" stroke="#C62828" strokeWidth={2} dot={{ r: 4 }} />}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {stats.count > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
            <div><p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Average</p><p style={{ fontSize: '1.33rem', fontWeight: 700 }}>{avg}</p></div>
            <div><p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Min</p><p style={{ fontSize: '1.33rem', fontWeight: 700 }}>{stats.min}</p></div>
            <div><p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Max</p><p style={{ fontSize: '1.33rem', fontWeight: 700 }}>{stats.max}</p></div>
          </div>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 8 }}>
            {stats.count} reading{stats.count !== 1 ? 's' : ''} in this period
          </p>
        </div>
      )}

      {showGate && <PremiumGate onUnlock={() => { refresh(); setShowGate(false); }} />}
    </div>
  );
}
