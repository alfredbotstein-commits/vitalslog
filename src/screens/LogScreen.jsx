import React, { useState, useCallback } from 'react';
import { db } from '../db';
import { getCategory, formatReading, VITAL_TYPES } from '../utils/vitals';
import ScrollPicker from '../components/ScrollPicker';
import CrisisAlert from '../components/CrisisAlert';
import Toast from '../components/Toast';
import { format } from 'date-fns';

const SUGAR_CONTEXTS = [
  { key: 'fasting', label: 'Fasting' },
  { key: 'before', label: 'Before Meal' },
  { key: 'after', label: 'After Meal' },
  { key: 'bedtime', label: 'Bedtime' },
];

export default function LogScreen() {
  const [type, setType] = useState('bp');
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [pulse, setPulse] = useState(72);
  const [bpm, setBpm] = useState(72);
  const [weightVal, setWeightVal] = useState(150);
  const [weightUnit, setWeightUnit] = useState('lb');
  const [sugarVal, setSugarVal] = useState(90);
  const [sugarUnit, setSugarUnit] = useState('mgdl');
  const [sugarContext, setSugarContext] = useState('fasting');
  const [note, setNote] = useState('');
  const [toast, setToast] = useState(null);
  const [crisisAlert, setCrisisAlert] = useState(false);

  const buildValues = () => {
    switch (type) {
      case 'bp': return { systolic, diastolic, pulse };
      case 'hr': return { bpm };
      case 'weight': return { value: weightVal, unit: weightUnit };
      case 'sugar': return { value: sugarVal, unit: sugarUnit, context: sugarContext };
      default: return {};
    }
  };

  const handleSave = useCallback(async () => {
    const values = buildValues();
    const cat = getCategory(type, values);
    const reading = {
      profileId: 1,
      type,
      timestamp: new Date().toISOString(),
      values,
      note: note.trim() || null,
      category: cat.key,
      categoryColor: cat.color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.readings.add(reading);

    if (type === 'bp' && (systolic > 180 || diastolic > 120)) {
      setCrisisAlert(true);
    }

    setToast({ message: `Saved! ${formatReading(type, values)} — ${cat.label}`, color: cat.color });
    setNote('');

    try { const { Haptics } = await import('@capacitor/haptics'); Haptics.impact({ style: 'medium' }); } catch {}
  }, [type, systolic, diastolic, pulse, bpm, weightVal, weightUnit, sugarVal, sugarUnit, sugarContext, note]);

  const currentCat = type === 'bp' ? getCategory('bp', { systolic, diastolic }) :
    type === 'hr' ? getCategory('hr', { bpm }) :
    type === 'sugar' ? getCategory('sugar', { value: sugarVal, context: sugarContext }) : null;

  return (
    <div className="screen">
      <h1 className="screen-title">Log Your Vitals</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.89rem', marginBottom: 16 }}>
        {format(new Date(), 'EEEE, MMMM d, yyyy · h:mm a')}
      </p>

      <div className="pill-row" style={{ marginBottom: 20 }}>
        {VITAL_TYPES.map(v => (
          <button key={v.key} className={`pill ${type === v.key ? 'active' : ''}`}
            onClick={() => setType(v.key)} aria-label={`Log ${v.label}`} aria-pressed={type === v.key}>
            {v.icon} {v.label}
          </button>
        ))}
      </div>

      <div className="card">
        {type === 'bp' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Systolic</p>
                <ScrollPicker min={70} max={250} value={systolic} onChange={setSystolic} label="Systolic blood pressure" />
              </div>
              <span style={{ fontSize: '2.67rem', fontWeight: 700, opacity: 0.3, paddingTop: 20 }}>/</span>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Diastolic</p>
                <ScrollPicker min={40} max={150} value={diastolic} onChange={setDiastolic} label="Diastolic blood pressure" />
              </div>
            </div>
          </>
        )}
        {type === 'hr' && (
          <div style={{ textAlign: 'center' }}>
            <ScrollPicker min={30} max={220} value={bpm} onChange={setBpm} label="Heart rate in BPM" />
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>BPM</p>
          </div>
        )}
        {type === 'weight' && (
          <div style={{ textAlign: 'center' }}>
            <ScrollPicker min={50} max={500} value={weightVal} onChange={setWeightVal} label={`Weight in ${weightUnit}`} />
            <div className="pill-row" style={{ justifyContent: 'center', marginTop: 12 }}>
              {['lb', 'kg'].map(u => (
                <button key={u} className={`pill ${weightUnit === u ? 'active' : ''}`}
                  onClick={() => setWeightUnit(u)} aria-label={`Unit: ${u}`}>{u}</button>
              ))}
            </div>
          </div>
        )}
        {type === 'sugar' && (
          <div style={{ textAlign: 'center' }}>
            <ScrollPicker min={20} max={600} value={sugarVal} onChange={setSugarVal} label="Blood sugar" />
            <div className="pill-row" style={{ justifyContent: 'center', marginTop: 8 }}>
              {['mgdl', 'mmol'].map(u => (
                <button key={u} className={`pill ${sugarUnit === u ? 'active' : ''}`}
                  onClick={() => setSugarUnit(u)} aria-label={`Unit: ${u === 'mgdl' ? 'mg/dL' : 'mmol/L'}`}>
                  {u === 'mgdl' ? 'mg/dL' : 'mmol/L'}
                </button>
              ))}
            </div>
            <div className="pill-row" style={{ justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
              {SUGAR_CONTEXTS.map(c => (
                <button key={c.key} className={`pill ${sugarContext === c.key ? 'active' : ''}`}
                  onClick={() => setSugarContext(c.key)} aria-label={`Context: ${c.label}`}>{c.label}</button>
              ))}
            </div>
          </div>
        )}

        {currentCat && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span className={`category-badge ${currentCat.key === 'crisis' ? 'crisis-pulse' : ''}`}
              style={{ background: currentCat.color }} aria-label={`Category: ${currentCat.label}`}>
              {currentCat.label}
            </span>
          </div>
        )}
      </div>

      <input type="text" value={note} onChange={e => setNote(e.target.value)}
        placeholder="Add a note... (optional)" aria-label="Note for this reading"
        style={{
          width: '100%', height: 56, padding: '0 20px', marginBottom: 16,
          background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)',
          fontSize: '1rem',
        }}
      />

      <button className="btn-primary" onClick={handleSave} aria-label="Save reading">
        Save Reading
      </button>

      {crisisAlert && <CrisisAlert onDismiss={() => setCrisisAlert(false)} />}
      {toast && <Toast message={toast.message} color={toast.color} onDismiss={() => setToast(null)} />}
    </div>
  );
}
