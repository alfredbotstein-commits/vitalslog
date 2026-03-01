# VitalsLog — Submission Checklist

## Build
- [x] Vite build passes (`npm run build` — 0 errors)
- [x] Capacitor Android platform added and synced
- [x] Bundle ID: `com.loopspur.vitalslog`
- [x] App name: VitalsLog

## Code Quality (A1 Self-QA)
- [x] Error boundary wraps all screens
- [x] aria-labels on all interactive elements (33+ across app)
- [x] No console.log statements in source
- [x] No hardcoded API keys or secrets
- [x] 56px+ minimum tap targets enforced
- [x] 18pt minimum body text
- [x] Dark mode fully functional
- [x] WCAG AAA contrast targets met

## Features Verified
- [x] Onboarding (3 slides + skip)
- [x] Legal disclaimer on first launch
- [x] BP logging with scroll wheel pickers
- [x] HR, weight, blood sugar logging
- [x] AHA color-coded categories (live update)
- [x] Crisis alert for BP >180/>120 with 911 link
- [x] History with date grouping + trend arrows
- [x] 30-day free tier gate on history
- [x] Trends charts (7D/30D free, 90D/1Y premium)
- [x] Summary stats (avg, min, max)
- [x] Premium gate on restricted features
- [x] CSV export
- [x] Delete all data with double confirmation
- [x] Settings: profile name, theme toggle, about

## Premium Gates (A3)
- [x] History >30 days: gated with blur + lock
- [x] Charts 90D/1Y: gated with lock icon
- [x] PDF report: gated (Settings mention)
- [x] Medications: gated (Settings, premium only)
- [x] RevenueCat stub ready for production SDK

## Security (A3)
- [x] All data local-only (Dexie/IndexedDB)
- [x] No network requests for health data
- [x] No third-party analytics
- [x] Health data never leaves device
- [x] Delete functionality confirmed

## Submission Docs (A4)
- [x] STORE_LISTING.md — complete with description, keywords, screenshot list
- [x] PRIVACY_POLICY.md — health data specific, HIPAA-aware language
- [x] SUBMISSION_CHECKLIST.md — this file
- [x] DESIGN_SPEC.md — Raphael's spec (reference)

## Pending (Scott Actions)
- [ ] App store screenshots (5 required)
- [ ] RevenueCat project setup + API key
- [ ] AAB signing key
- [ ] Google Play Console listing creation
- [ ] Final submission
