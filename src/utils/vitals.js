// AHA Blood Pressure Categories
export function getBPCategory(systolic, diastolic) {
  if (systolic > 180 || diastolic > 120) return { label: 'Crisis', color: '#7F0000', key: 'crisis' };
  if (systolic >= 140 || diastolic >= 90) return { label: 'High Stage 2', color: '#C62828', key: 'high2' };
  if (systolic >= 130 || diastolic >= 80) return { label: 'High Stage 1', color: '#E65100', key: 'high1' };
  if (systolic >= 120 && diastolic < 80) return { label: 'Elevated', color: '#F9A825', key: 'elevated' };
  return { label: 'Normal', color: '#2E7D32', key: 'normal' };
}

export function getHRCategory(bpm) {
  if (bpm < 60) return { label: 'Low', color: '#1565C0', key: 'low' };
  if (bpm <= 100) return { label: 'Normal', color: '#2E7D32', key: 'normal' };
  return { label: 'High', color: '#E65100', key: 'high' };
}

export function getSugarCategory(value, context) {
  const fastingThresholds = { low: 70, high: 100 };
  const mealThresholds = { low: 70, high: 140 };
  const t = context === 'fasting' || context === 'bedtime' ? fastingThresholds : mealThresholds;
  if (value < t.low) return { label: 'Low', color: '#1565C0', key: 'low' };
  if (value <= t.high) return { label: 'Normal', color: '#2E7D32', key: 'normal' };
  return { label: 'High', color: '#E65100', key: 'high' };
}

export function getCategory(type, values) {
  switch (type) {
    case 'bp': return getBPCategory(values.systolic, values.diastolic);
    case 'hr': return getHRCategory(values.bpm);
    case 'sugar': return getSugarCategory(values.value, values.context);
    default: return { label: '', color: '#2E7D32', key: 'normal' };
  }
}

export function formatReading(type, values) {
  switch (type) {
    case 'bp': return `${values.systolic}/${values.diastolic}`;
    case 'hr': return `${values.bpm} bpm`;
    case 'weight': return `${values.value} ${values.unit}`;
    case 'sugar': return `${values.value} ${values.unit === 'mmol' ? 'mmol/L' : 'mg/dL'}`;
    default: return '';
  }
}

export const VITAL_TYPES = [
  { key: 'bp', label: 'Blood Pressure', icon: '🩸' },
  { key: 'hr', label: 'Heart Rate', icon: '❤️' },
  { key: 'weight', label: 'Weight', icon: '⚖️' },
  { key: 'sugar', label: 'Blood Sugar', icon: '🩹' },
];

export function getTrendArrow(current, previous) {
  if (!previous) return '';
  const diff = current - previous;
  if (Math.abs(diff) < 1) return '→';
  return diff > 0 ? '↑' : '↓';
}
