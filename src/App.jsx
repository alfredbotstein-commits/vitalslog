import React, { useState, useEffect } from 'react';
import { getSetting } from './db';
import { ErrorBoundary } from './components/ErrorBoundary';
import OnboardingScreen from './screens/OnboardingScreen';
import DisclaimerScreen from './screens/DisclaimerScreen';
import LogScreen from './screens/LogScreen';
import HistoryScreen from './screens/HistoryScreen';
import TrendsScreen from './screens/TrendsScreen';
import SettingsScreen from './screens/SettingsScreen';

const TABS = [
  { key: 'log', label: 'Log', icon: '➕' },
  { key: 'history', label: 'History', icon: '🕐' },
  { key: 'trends', label: 'Trends', icon: '📈' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function App() {
  const [ready, setReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [needsDisclaimer, setNeedsDisclaimer] = useState(false);
  const [tab, setTab] = useState('log');

  useEffect(() => {
    (async () => {
      const onb = await getSetting('onboardingDone');
      const disc = await getSetting('disclaimerAccepted');
      const theme = await getSetting('theme');
      if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      setNeedsOnboarding(!onb);
      setNeedsDisclaimer(!disc);
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  if (needsOnboarding) return (
    <ErrorBoundary>
      <OnboardingScreen onComplete={() => setNeedsOnboarding(false)} />
    </ErrorBoundary>
  );

  if (needsDisclaimer) return (
    <ErrorBoundary>
      <DisclaimerScreen onAccept={() => setNeedsDisclaimer(false)} />
    </ErrorBoundary>
  );

  const renderScreen = () => {
    switch (tab) {
      case 'log': return <LogScreen />;
      case 'history': return <HistoryScreen />;
      case 'trends': return <TrendsScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <LogScreen />;
    }
  };

  return (
    <ErrorBoundary>
      <main>{renderScreen()}</main>
      <nav className="tab-bar" role="tablist" aria-label="Main navigation">
        {TABS.map(t => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} aria-label={t.label}
            className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>
            <span style={{ fontSize: '1.44rem' }} aria-hidden="true">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </ErrorBoundary>
  );
}
