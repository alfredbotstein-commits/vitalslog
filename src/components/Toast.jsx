import React, { useEffect } from 'react';

export default function Toast({ message, color = '#2E7D32', onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="toast" style={{ background: color }} role="status" aria-live="polite">
      {message}
    </div>
  );
}
