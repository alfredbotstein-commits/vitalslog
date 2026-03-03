import { useState, useEffect, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';

let Purchases = null;

const RC_KEY_ANDROID = import.meta.env.VITE_REVENUECAT_KEY_ANDROID || '';
const RC_KEY_IOS = import.meta.env.VITE_REVENUECAT_KEY_IOS || '';
const ENTITLEMENT_ID = 'vitalslog_premium';

export function usePurchase() {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [offerings, setOfferings] = useState([]);
  const [isStoreAvailable, setIsStoreAvailable] = useState(false);
  const initRef = useRef(false);

  const checkEntitlement = useCallback(async () => {
    if (!Purchases) return false;
    try {
      const { customerInfo } = await Purchases.getCustomerInfo();
      return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
    } catch (err) {
      console.error('[RevenueCat] entitlement check failed:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    (async () => {
      const platform = Capacitor.getPlatform();
      if (platform === 'web') { setStatus('idle'); return; }
      try {
        const mod = await import('@revenuecat/purchases-capacitor');
        Purchases = mod.Purchases;
        const apiKey = platform === 'ios' ? RC_KEY_IOS : RC_KEY_ANDROID;
        if (!apiKey) { setStatus('idle'); return; }
        await Purchases.configure({ apiKey });
        setIsStoreAvailable(true);
        if (await checkEntitlement()) { setIsPremium(true); setStatus('idle'); return; }
        try {
          const { offerings: off } = await Purchases.getOfferings();
          if (off.current) setOfferings([off.current]);
        } catch (_) {}
        setStatus('idle');
      } catch (err) {
        console.error('[RevenueCat] init error:', err);
        setStatus('idle');
      }
    })();
  }, [checkEntitlement]);

  const purchase = useCallback(async (pkg) => {
    if (!Purchases) { setError('Store not available'); setStatus('error'); return; }
    setStatus('purchasing'); setError(null);
    try {
      let result;
      if (pkg) {
        result = await Purchases.purchasePackage({ aPackage: pkg });
      } else {
        const { offerings: off } = await Purchases.getOfferings();
        const defaultPkg = off.current?.availablePackages?.[0];
        if (!defaultPkg) { setError('No products available'); setStatus('error'); return; }
        result = await Purchases.purchasePackage({ aPackage: defaultPkg });
      }
      if (result.customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        setIsPremium(true); setStatus('success');
      } else { setStatus('idle'); }
    } catch (err) {
      if (err.code === 1 || err.message?.includes('cancel')) { setStatus('idle'); }
      else { setError('Purchase failed. Please try again.'); setStatus('error'); }
    }
  }, []);

  const restore = useCallback(async () => {
    if (!Purchases) { setError('Store not available'); setStatus('error'); return; }
    setStatus('restoring'); setError(null);
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        setIsPremium(true); setStatus('success');
      } else { setError('No previous purchase found.'); setStatus('idle'); }
    } catch (err) { setError('Restore failed.'); setStatus('error'); }
  }, []);

  return { status, error, isPremium, offerings, purchase, restore, isStoreAvailable };
}
