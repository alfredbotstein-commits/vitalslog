import { useState, useEffect } from 'react';
import { isPremium, resetPremiumCache } from '../utils/premium';

export function usePremium() {
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resetPremiumCache();
    isPremium().then(v => { setPremium(v); setLoading(false); });
  }, []);

  const refresh = () => {
    resetPremiumCache();
    isPremium().then(setPremium);
  };

  return { premium, loading, refresh };
}
