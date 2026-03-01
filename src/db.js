import Dexie from 'dexie';

export const db = new Dexie('VitalsLogDB');

db.version(1).stores({
  readings: '++id, profileId, type, timestamp, category',
  profiles: '++id, isPrimary',
  medications: '++id, profileId, isActive',
  reminders: '++id, profileId',
  settings: 'key',
});

// Seed default profile
db.on('populate', () => {
  db.profiles.add({ name: 'Me', isPrimary: true, units: { weight: 'lb', sugar: 'mgdl' } });
  db.settings.add({ key: 'premium', value: false });
  db.settings.add({ key: 'theme', value: 'light' });
  db.settings.add({ key: 'onboardingDone', value: false });
  db.settings.add({ key: 'disclaimerAccepted', value: false });
  db.settings.add({ key: 'trackedVitals', value: ['bp', 'hr', 'weight', 'sugar'] });
});

export async function getSetting(key) {
  const row = await db.settings.get(key);
  return row?.value;
}

export async function setSetting(key, value) {
  await db.settings.put({ key, value });
}

export async function getPrimaryProfile() {
  return db.profiles.where('isPrimary').equals(1).first();
}
