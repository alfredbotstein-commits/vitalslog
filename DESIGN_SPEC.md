# VitalsLog — Design Specification
**Version:** 1.0 | **Date:** 2026-03-01 | **Author:** Raphael, Design Director

> "Log it. See it. Share it with your doctor."

---

## 1. Brand Identity

### Positioning
VitalsLog is an honest vitals logger. No fake phone-based measurements. No pseudoscience. Manual entry only — because that's what's accurate and what doctors trust.

### Tagline
"We don't pretend your phone can measure blood pressure. We just help you log it honestly."

### App Icon
- Red heart silhouette with a subtle upward pulse/ECG line running through it
- White pulse line on deep red (#C62828) heart
- Rounded-square iOS container, white background
- Simple, medical, trustworthy — no gimmicks

---

## 2. Color Palette

### Primary
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-red` | `#C62828` | Primary accent, heart icon, CTAs |
| `brand-red-light` | `#EF5350` | Hover/press states |
| `brand-white` | `#FFFFFF` | Card backgrounds |
| `bg-light` | `#F5F5F5` | Screen background |
| `text-primary` | `#1A1A1A` | Body text (high contrast) |
| `text-secondary` | `#555555` | Labels, hints |

### AHA Blood Pressure Color Coding (Critical UX)
| Category | Systolic | Diastolic | Color | Hex |
|----------|----------|-----------|-------|-----|
| Normal | <120 | <80 | Green | `#2E7D32` |
| Elevated | 120–129 | <80 | Yellow | `#F9A825` |
| High Stage 1 | 130–139 | 80–89 | Orange | `#E65100` |
| High Stage 2 | ≥140 | ≥90 | Red | `#C62828` |
| Crisis | >180 | >120 | Deep Red | `#7F0000` + pulse animation |

### Other Vital Ranges
| Vital | Low | Normal | High | Color Scheme |
|-------|-----|--------|------|-------------|
| Heart Rate | <60 | 60–100 | >100 | Blue / Green / Orange |
| Blood Sugar (fasting) | <70 | 70–100 | >100 | Blue / Green / Orange |
| Weight | — | User-set goal range | — | Green in range, neutral outside |

### Dark Mode
| Token | Hex |
|-------|-----|
| `bg-dark` | `#121212` |
| `surface-dark` | `#1E1E1E` |
| `card-dark` | `#2A2A2A` |
| `text-dark-primary` | `#F5F5F5` |
| `text-dark-secondary` | `#AAAAAA` |

AHA colors remain identical in dark mode (already high-contrast on dark surfaces).

---

## 3. Typography

**Accessibility-first: all default sizes are 2pt larger than typical apps.**

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| Screen title | SF Pro Display | 28pt | Bold | 34pt |
| Section header | SF Pro Display | 22pt | Semibold | 28pt |
| Body / labels | SF Pro Text | 18pt | Regular | 26pt |
| Number input display | SF Pro Rounded | 48pt | Bold | 56pt |
| Small caption | SF Pro Text | 15pt | Regular | 20pt |
| Button text | SF Pro Text | 18pt | Semibold | 24pt |
| Tab bar label | SF Pro Text | 12pt | Medium | 16pt |

- Supports Dynamic Type (up to AX5)
- Minimum rendered text: 15pt (no text smaller than this anywhere in the app)

---

## 4. Layout & Spacing

- **Minimum tap target:** 56×56pt (exceeds Apple's 44pt guideline — critical for elderly users)
- **Grid:** 16pt base unit
- **Screen margins:** 20pt horizontal
- **Card padding:** 20pt
- **Card corner radius:** 16pt
- **Card shadow:** 0 2pt 8pt rgba(0,0,0,0.08)
- **Spacing between cards:** 16pt
- **Button height:** 56pt minimum
- **Input field height:** 56pt minimum

---

## 5. Screen Specifications

### 5.1 Tab Bar (Bottom Navigation)
4 tabs, 56pt tall, icon + label:
1. **Log** (plus-circle icon) — Quick Log screen
2. **History** (clock icon) — Timeline
3. **Trends** (chart-line icon) — Charts
4. **Settings** (gear icon) — Settings

Active tab: `brand-red`. Inactive: `text-secondary`.

---

### 5.2 Quick Log Screen (Main / Default Tab)

The most important screen. Must be usable in under 10 seconds.

**Layout (top to bottom):**

1. **Header:** "Log Your Vitals" (28pt bold) + date/time display (auto-set to now, tappable to change)

2. **Vital Type Selector:** Horizontal scrollable row of large pill buttons (56pt height, 120pt+ width):
   - 🩸 Blood Pressure (default selected)
   - ❤️ Heart Rate
   - ⚖️ Weight
   - 🩹 Blood Sugar
   
   Selected pill: `brand-red` fill, white text. Unselected: white fill, gray border.

3. **Input Area** (changes per vital type):

   **Blood Pressure:**
   - Two large number displays side by side: Systolic / Diastolic
   - Each shows current value in 48pt bold
   - **Scroll wheels** (picker-style) for input — large, easy to flick
   - Systolic range: 70–250, default 120
   - Diastolic range: 40–150, default 80
   - Divider: large "/" between the two numbers
   - Below values: AHA category badge (colored pill showing "Normal", "Elevated", "High Stage 1", etc.) — updates live as user scrolls
   - Optional pulse rate field below (40pt, can skip)

   **Heart Rate:**
   - Single large scroll wheel, range 30–220, default 72
   - BPM label below
   - Color badge: Low/Normal/High

   **Weight:**
   - Scroll wheel for whole number + decimal
   - Toggle: lb / kg (remembers preference)
   - Shows delta from last entry: "↓2.3 lb from last"

   **Blood Sugar:**
   - Single scroll wheel, range 20–600 mg/dL
   - Toggle: mg/dL / mmol/L
   - Context selector: Fasting / Before Meal / After Meal / Bedtime (horizontal pills, 56pt)
   - Color badge per range

4. **Notes Field:** "Add a note..." text input (56pt height). Optional. Examples: "felt dizzy", "after walking", "took medication"

5. **Save Button:** Full-width, 56pt height, `brand-red`, white text "Save Reading" (18pt semibold). Haptic feedback on tap.

**Post-Save:**
- Brief success animation (checkmark pulse)
- Screen resets for next entry
- Toast: "Saved! Systolic 138 — High Stage 1" (color-coded)

---

### 5.3 History / Timeline Screen

**Layout:**

1. **Header:** "History" (28pt bold)

2. **Filter Bar:** Horizontal pills to filter by vital type: All | BP | HR | Weight | Sugar. 48pt height pills.

3. **Date Grouping:** Entries grouped by date, most recent first.
   - Date header: "Today", "Yesterday", "Mon, Feb 23" (18pt semibold)

4. **Entry Cards** (per reading):
   - Left: Colored dot (AHA color) + vital type icon
   - Center: Primary value in 22pt bold (e.g., "138/88") + category label ("High Stage 1") in matching color
   - Right: Time ("2:30 PM") + trend arrow (↑↓→ comparing to previous)
   - If note exists: truncated note text below (15pt, gray)
   - Tap → detail view (edit/delete)
   - Swipe left → delete (with confirmation)

5. **Free tier:** Shows 30-day history. Entries older than 30 days show blurred with lock icon + "Unlock unlimited history — $2.99" upgrade prompt.

**Empty State:** Friendly illustration of a blood pressure cuff + "No readings yet. Tap Log to get started!"

---

### 5.4 Entry Detail / Edit Screen

- Full display of the reading with all fields editable
- Date/time picker (in case user is logging a past reading)
- Note field (expandable)
- "Delete Reading" button at bottom (red outline, requires confirmation)
- Navigation: back arrow to History

---

### 5.5 Charts / Trends Screen

**Layout:**

1. **Header:** "Trends" (28pt bold)

2. **Vital Selector:** Same horizontal pills as History filter

3. **Time Range:** 7D | 30D | 90D | 1Y | All — pill selector row (default: 30D)

4. **Chart Area:**

   **Blood Pressure Chart:**
   - Line chart with TWO lines: systolic (red) + diastolic (blue)
   - Background color bands showing AHA zones (subtle, 10% opacity)
   - X-axis: dates. Y-axis: mmHg
   - Tap any point → tooltip with exact value + date/time
   - Average line (dashed) for selected period

   **Heart Rate Chart:**
   - Single line chart, same interaction pattern
   - Resting zone highlighted in green band

   **Weight Chart:**
   - Line chart with goal range band (if set)
   - Shows net change for period: "+2.3 lb this month"

   **Blood Sugar Chart:**
   - Line chart, color-coded dots per context (fasting/before/after meal)
   - Filter by context type

5. **Summary Card** below chart:
   - Average, Min, Max for period
   - Number of readings
   - Trend arrow + text: "Your systolic average is trending ↓ down 5 mmHg this month"

6. **Premium gate:** 90D, 1Y, All ranges locked on free tier. 7D and 30D free.

---

### 5.6 PDF Doctor Report (Premium)

Triggered from: Trends screen → "Generate Report" button OR Settings → "Create Report"

**Report Contents:**
- Patient name + date range
- All vitals summary (averages, min, max, reading count)
- BP chart (systolic/diastolic over time)
- Heart rate chart
- Weight chart
- Blood sugar chart (if entries exist)
- Color-coded reading table (most recent 30 readings or selected range)
- Medication list (if entered)
- Notes summary

**UX:**
- Date range picker (default: last 30 days)
- "Generate PDF" → loading spinner → share sheet (email, print, save to Files, AirDrop)
- Clean, medical-looking PDF — black and white friendly for fax/print
- Doctor's name field (optional, appears on report header)

**Gate:** Free users see "Generate Report" button but get upgrade prompt on tap.

---

### 5.7 Settings Screen

**Sections:**

1. **Profile**
   - Name (appears on PDF reports)
   - Date of birth (optional, for context)
   - Preferred units: lb/kg, mg/dL/mmol/L

2. **Medications** (Premium)
   - Add medications with name + dosage + time
   - Shows correlation dot on charts ("started Lisinopril" marker)

3. **Family Profiles** (Premium)
   - Add family members (name + photo)
   - Switch between profiles — each has independent data
   - Use case: spouse tracking together, parent logging for elderly parent

4. **Reminders**
   - "Remind me to log" — daily time picker
   - Push notification: "Time to log your vitals 🩸"

5. **Data**
   - Apple Health Sync (Premium) — read/write BP, HR, weight
   - Export CSV (free)
   - Export PDF Report (Premium)
   - Delete All Data (double confirmation)

6. **Premium**
   - Upgrade prompt if free user
   - Manage subscription if premium
   - Restore purchases

7. **About**
   - Version, privacy policy, terms
   - "VitalsLog is not a medical device" disclaimer
   - Support email

---

### 5.8 Onboarding (First Launch)

3 screens, swipeable, skip button top-right:

1. **"Honest Logging"** — Illustration of hand writing in a journal. "No fake phone measurements. Just honest, accurate tracking you can trust."

2. **"See Your Trends"** — Chart illustration. "Beautiful charts that show your progress over time. Spot patterns your doctor needs to see."

3. **"Share With Your Doctor"** — PDF/share illustration. "One tap to create a professional report. Email it, print it, or AirDrop it right in the office."

**After onboarding:**
- "What would you like to track?" — multi-select: Blood Pressure, Heart Rate, Weight, Blood Sugar (pre-selects BP)
- "Set a daily reminder?" — time picker + skip
- → Lands on Quick Log screen

---

### 5.9 Premium Upgrade Screen

Triggered from any premium gate tap.

- **Header:** "VitalsLog Premium" (28pt bold)
- Feature list with checkmarks (large, 18pt):
  - ✅ Unlimited history (free = 30 days)
  - ✅ PDF doctor reports
  - ✅ Medication tracking & correlation
  - ✅ Family member profiles
  - ✅ Apple Health sync
  - ✅ Extended chart ranges (90D, 1Y, All)
- **Price:** "$2.99 — one-time purchase" (22pt bold, `brand-red`)
- **CTA:** "Unlock Premium" button (full width, 56pt, `brand-red`)
- Restore purchases link below
- Close/X button top-right

---

## 6. Data Model

### Reading
```
{
  id: UUID,
  profileId: UUID,        // for family profiles
  type: "bp" | "hr" | "weight" | "sugar",
  timestamp: ISO8601,
  values: {
    // BP: { systolic: Int, diastolic: Int, pulse: Int? }
    // HR: { bpm: Int }
    // Weight: { value: Float, unit: "lb" | "kg" }
    // Sugar: { value: Int, unit: "mgdl" | "mmol", context: "fasting" | "before" | "after" | "bedtime" }
  },
  note: String?,
  category: String,       // computed: "normal", "elevated", "high1", "high2", "crisis"
  categoryColor: String,  // computed hex
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

### Profile
```
{
  id: UUID,
  name: String,
  dob: Date?,
  units: { weight: "lb" | "kg", sugar: "mgdl" | "mmol" },
  isPrimary: Bool
}
```

### Medication (Premium)
```
{
  id: UUID,
  profileId: UUID,
  name: String,
  dosage: String,
  timeOfDay: String?,
  startDate: Date,
  endDate: Date?,
  isActive: Bool
}
```

### Reminder
```
{
  id: UUID,
  profileId: UUID,
  time: TimeOfDay,
  enabled: Bool,
  daysOfWeek: [Int]     // 0=Sun...6=Sat, empty=daily
}
```

### Storage
- Core Data (local) with CloudKit sync
- Free tier: readings auto-purge after 30 days (warn user at 25 days)
- Premium: unlimited retention

---

## 7. Premium Gates

| Feature | Free | Premium ($2.99) |
|---------|------|-----------------|
| Log vitals | ✅ | ✅ |
| History (30 days) | ✅ | ✅ |
| History (unlimited) | ❌ | ✅ |
| Charts (7D, 30D) | ✅ | ✅ |
| Charts (90D, 1Y, All) | ❌ | ✅ |
| AHA color coding | ✅ | ✅ |
| Trend arrows | ✅ | ✅ |
| Daily reminders | ✅ | ✅ |
| CSV export | ✅ | ✅ |
| PDF doctor report | ❌ | ✅ |
| Medication tracking | ❌ | ✅ |
| Family profiles | ❌ | ✅ |
| Apple Health sync | ❌ | ✅ |

**One-time purchase. No subscription.** This is a key differentiator — competitors charge $5-10/month.

---

## 8. Accessibility

**This app's primary audience includes elderly users. Accessibility is not optional — it IS the product.**

### Visual
- Minimum text size: 15pt (app-wide floor)
- Default body text: 18pt (2pt above standard)
- Full Dynamic Type support up to AX5
- Color is NEVER the only indicator — always paired with text label and/or icon
- AHA categories always show text label ("High Stage 1") alongside color
- Contrast ratios: minimum 4.5:1 for all text (WCAG AA), targeting 7:1 (AAA) for critical values
- Dark mode with equally high contrast

### Motor
- **All tap targets: 56pt minimum** (28% larger than Apple's 44pt guideline)
- Scroll wheel pickers instead of tiny +/- buttons
- Large swipe gestures for navigation
- No precision-dependent interactions
- Generous touch slop areas around interactive elements

### Cognitive
- One action per screen focus
- Clear, simple language (no medical jargon in UI — "High Blood Pressure" not "Hypertension Stage 2")
- Consistent layout patterns across all vital types
- Undo available after delete (5-second toast)
- Confirmation dialogs for destructive actions

### VoiceOver
- All elements labeled with clear, descriptive accessibility labels
- Reading values announced with context: "Blood pressure 138 over 88, High Stage 1"
- Chart data accessible as table via rotor
- Custom actions for entry cards (edit, delete)

### Reduce Motion
- Respect `UIAccessibility.isReduceMotionEnabled`
- Replace animations with crossfades

---

## 9. Animations & Micro-interactions

- **Save confirmation:** Checkmark scales up from center with subtle bounce (0.3s)
- **Category badge:** Smooth color transition when scroll wheel crosses threshold
- **Trend arrows:** Gentle fade-in on History cards
- **Chart drawing:** Lines draw left-to-right on appear (0.5s)
- **Tab switch:** Crossfade (0.2s)
- **Crisis reading:** Subtle pulse animation on the category badge (red glow) — draws attention without alarming

All animations respect Reduce Motion preference.

---

## 10. Notifications

| Notification | Trigger | Copy |
|-------------|---------|------|
| Daily reminder | User-set time | "Time to log your vitals 🩸" |
| Streak | 7 consecutive days | "7-day streak! Consistent tracking helps your doctor help you. 📊" |
| History expiring (free) | Day 25 of 30 | "Your oldest readings expire in 5 days. Upgrade to keep them forever." |
| Crisis reading | After saving BP >180/>120 | "Your reading is in the crisis range. If you're experiencing symptoms, call 911 or your doctor immediately." |

**Crisis notification:** This is a safety feature. Not a diagnosis. Always includes disclaimer.

---

## 11. Legal & Disclaimers

**Required on first launch AND in Settings > About:**

"VitalsLog is a personal health logging tool. It is NOT a medical device and does NOT provide medical advice, diagnosis, or treatment. The color-coded categories are based on American Heart Association guidelines and are for informational purposes only. Always consult your healthcare provider for medical decisions. If you are experiencing a medical emergency, call 911."

- This disclaimer appears as a dismissible sheet on first app launch (after onboarding)
- Persistent in Settings > About
- Abbreviated version in PDF report footer

---

## 12. Technical Notes for Ezra

- **Framework:** SwiftUI + Swift Charts (iOS 16+)
- **Storage:** Core Data with CloudKit
- **PDF generation:** PDFKit
- **Monetization:** StoreKit 2, one-time IAP ($2.99)
- **Target:** iOS 16+ (covers 95%+ of devices)
- **No network required** for core functionality (offline-first)
- **No account creation** — data is device-local + iCloud
- **Bundle ID suggestion:** `com.loopspur.vitalslog`
- **App category:** Health & Fitness
- **Content rating:** 4+ (no objectionable content)

---

## 13. Competitive Positioning

| Competitor Problem | VitalsLog Answer |
|-------------------|-----------------|
| Fake phone BP measurement (scam apps) | Manual entry ONLY — honest, accurate, doctor-trusted |
| $5-10/month subscriptions | $2.99 one-time purchase |
| Cluttered UI with tiny buttons | Large inputs, 56pt targets, elderly-friendly |
| No easy doctor sharing | One-tap PDF report |
| Complex onboarding requiring account creation | No account needed, 3-screen onboarding, logging in <10 seconds |

---

*End of VitalsLog Design Specification v1.0*
