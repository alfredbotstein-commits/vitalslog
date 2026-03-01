import { getSetting, setSetting } from '../db';

let _premium = null;

export async function isPremium() {
  if (_premium === null) _premium = await getSetting('premium');
  return !!_premium;
}

export async function activatePremium() {
  await setSetting('premium', true);
  _premium = true;
}

export function resetPremiumCache() { _premium = null; }

// RevenueCat stub — will be replaced with real SDK
export async function purchasePremium() {
  // In production: await Purchases.purchaseProduct('vitalslog_premium');
  await activatePremium();
  return true;
}

export async function restorePurchases() {
  // In production: await Purchases.restorePurchases();
  return false;
}
