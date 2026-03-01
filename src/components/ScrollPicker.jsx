import React, { useRef, useEffect, useCallback } from 'react';

const ITEM_HEIGHT = 52;
const VISIBLE = 5;

export default function ScrollPicker({ min, max, value, onChange, step = 1, suffix = '', label }) {
  const containerRef = useRef(null);
  const scrollingRef = useRef(false);
  const timerRef = useRef(null);

  const items = [];
  for (let i = min; i <= max; i += step) items.push(i);
  const idx = items.indexOf(value);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || scrollingRef.current) return;
    const top = idx * ITEM_HEIGHT;
    el.scrollTop = top;
  }, [idx]);

  const handleScroll = useCallback(() => {
    scrollingRef.current = true;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      const snapIdx = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(snapIdx, items.length - 1));
      el.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' });
      if (items[clamped] !== value) onChange(items[clamped]);
      scrollingRef.current = false;
    }, 80);
  }, [items, value, onChange]);

  return (
    <div style={{ position: 'relative', height: ITEM_HEIGHT * VISIBLE, overflow: 'hidden' }}
      role="spinbutton" aria-label={label} aria-valuenow={value} aria-valuemin={min} aria-valuemax={max}>
      <div style={{
        position: 'absolute', top: ITEM_HEIGHT * 2, left: 0, right: 0, height: ITEM_HEIGHT,
        background: 'var(--brand-red)', opacity: 0.1, borderRadius: 8, zIndex: 1, pointerEvents: 'none'
      }} />
      <div ref={containerRef} onScroll={handleScroll}
        style={{ height: '100%', overflowY: 'scroll', scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ height: ITEM_HEIGHT * 2 }} />
        {items.map(v => (
          <div key={v} style={{
            height: ITEM_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: v === value ? '2.67rem' : '1.33rem', fontWeight: v === value ? 700 : 400,
            opacity: v === value ? 1 : 0.4, scrollSnapAlign: 'start',
            fontFamily: "'SF Pro Rounded', -apple-system, sans-serif",
            transition: 'all 0.1s',
          }}>
            {v}{suffix}
          </div>
        ))}
        <div style={{ height: ITEM_HEIGHT * 2 }} />
      </div>
    </div>
  );
}
