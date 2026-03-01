import React, { useState } from 'react';
import { setSetting } from '../db';

const SLIDES = [
  { emoji: '📝', title: 'Honest Logging', text: "No fake phone measurements. Just honest, accurate tracking you can trust." },
  { emoji: '📊', title: 'See Your Trends', text: 'Beautiful charts that show your progress over time. Spot patterns your doctor needs to see.' },
  { emoji: '📋', title: 'Share With Your Doctor', text: 'One tap to create a professional report. Email it, print it, or share it right in the office.' },
];

export default function OnboardingScreen({ onComplete }) {
  const [page, setPage] = useState(0);

  const handleFinish = async () => {
    await setSetting('onboardingDone', true);
    onComplete();
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: 20 }}>
      <div style={{ textAlign: 'right' }}>
        <button onClick={handleFinish} style={{ color: 'var(--text-secondary)', fontWeight: 600, minHeight: 44, minWidth: 44 }}
          aria-label="Skip onboarding">Skip</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: 24 }}>{SLIDES[page].emoji}</div>
        <h1 style={{ fontSize: '1.56rem', fontWeight: 700, marginBottom: 12 }}>{SLIDES[page].title}</h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 320, lineHeight: 1.6 }}>
          {SLIDES[page].text}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: 5,
            background: i === page ? 'var(--brand-red)' : '#ccc',
          }} aria-hidden="true" />
        ))}
      </div>

      <button className="btn-primary" onClick={() => page < SLIDES.length - 1 ? setPage(page + 1) : handleFinish()}
        aria-label={page < SLIDES.length - 1 ? 'Next slide' : 'Get started'}>
        {page < SLIDES.length - 1 ? 'Next' : 'Get Started'}
      </button>
    </div>
  );
}
