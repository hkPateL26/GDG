# NagrikSeva AI — Admin & Officer Side Deep Investigation
## Document 07: SLA Monitoring, Notifications & Audit Logging

> **Audit Date:** October 2026  
> **Target Scope:** 1-Hour SLA Bottleneck Engine, AI Bottleneck Monitor, SMS/Email Dispatch System, and Administrative Audit Trail Logging.  
> **Source Files Audited:** `src/lib/admin-hierarchy-data.ts`, `src/components/AiBottleneckMonitor.tsx`, `src/app/api/track/route.ts`, `src/lib/large-datasets.ts`.  

---

### 1. 1-Hour AI SLA Bottleneck Engine

The Gujarat Right to Services Act (GRTSA) mandates strict timeframes for public services (typically 3 to 15 days). For hackathon and demonstration purposes, NagrikSeva AI incorporates a high-velocity **1-Hour (60-Minute) Demo SLA Engine** implemented in [`src/lib/admin-hierarchy-data.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/admin-hierarchy-data.ts#L181-L267):

```typescript
export interface SlaBottleneckAnalysis {
  isBreached: boolean;
  elapsedMinutes: number;
  remainingMinutes: number;
  slaLimitMinutes: number;
  currentDeskGu: string;
  currentOfficerName: string;
  currentOfficerDesignation: string;
  stuckReasonGu: string;
  aiDiagnosisGu: string;
  recommendedActionGu: string;
  urgencyLevel: "normal" | "warning" | "critical";
  canAutoEscalate: boolean;
  escalationTargetOfficer: string;
}
```

#### Urgency Classification Rules
1. **Normal (`elapsed < 45 min`):** Application within normal handling window.
2. **Warning (`45 <= elapsed < 60 min`):** Nearing breach threshold; yellow warning badge.
3. **Critical / Breached (`elapsed >= 60 min`):** Red pulsing alert; `canAutoEscalate: true`.

#### Dynamic Diagnosis per Workflow Stage
- **Stage 1 (Talati / Nayab Mamlatdar):**
  - Desk: `તલાટી કમ મંત્રી સ્ક્રુટિની કાઉન્ટર, ગોમટા ગ્રામ પંચાયત`
  - Diagnosis: `અરજી આવ્યાને ૧ કલાક (૬૦ મિનિટ) કરતા વધુ સમય થઈ ગયો છે. તલાટી ડેસ્ક પર દસ્તાવેજ ચકાસણી પેન્ડિંગ હોવાથી આગળનું મામલતદાર e-Sign અટકેલું છે.`
  - Escalation Target: `એચ. વી. પટેલ, GAS (તાલુકા મામલતદાર)`
- **Stage 2 (Mamlatdar Forwarded):**
  - Desk: `નાયબ મામલતદાર (મહેસૂલ શાખા), ગોંડલ`
  - Diagnosis: `નાયબ મામલતદાર ડેસ્ક પર ૪૫+ મિનિટથી ફાઈલ રજૂ થઈ નથી.`
  - Escalation Target: `એચ. વી. પટેલ, GAS (મામલતદાર)`
- **Stage 3 (Approved):**
  - Desk: `તાલુકા મામલતદાર ચેમ્બર (ડિજિટલ e-Sign ડેસ્ક)`
  - Diagnosis: `પ્રમાણપત્ર તૈયાર છે. નાગરિક પ્રોફાઇલમાં ડાઉનલોડ માટે ઉપલબ્ધ.`

---

### 2. AI Bottleneck Monitor Dashboard (`AiBottleneckMonitor.tsx`)

Rendered under **Tab 2** of the administrative desk:
1. **Top Metric Strip:**
   - Total Active Applications (`activeApps.length`).
   - 1-Hour SLA Breached Count (`breachedCount` with red alert badge).
   - Warning Zone Count (`warningCount` with amber clock).
   - Within Normal SLA Count.
2. **Auto-Escalation Bot Action:**
   - Clicking **"એસ્કેલેટ કરો"** dispatches the application to the higher authority desk (e.g. Talati $\rightarrow$ Mamlatdar $\rightarrow$ Collector), reassigns the target desk in React state, and displays an official confirmation banner.

---

### 3. Notification Dispatch Mechanism

When an application is registered via `POST /api/track` (Lines 317–344), simulated SMS and email notification payloads are generated:

```typescript
const smsMessage = `Govt of Gujarat: નમસ્તે ${resolvedCitizenNameGu || resolvedCitizenName}, તમારી ${schemeNameGu} માટેની અરજી (${id}) સફળતાપૂર્વક સ્વીકારાઈ છે. સ્ટેટસ ટ્રેક કરવા: ${origin}/track?id=${id}`;
const emailSubject = `સરકારી પહોંચ સ્વીકૃતિ: ${schemeNameGu} (અરજી ક્રમાંક: ${id})`;

return NextResponse.json({
  success: true,
  application: newApp,
  notifications: {
    sms: {
      sentTo: mobile,
      message: smsMessage,
      status: "delivered",
      timestamp: new Date().toLocaleTimeString(),
    },
    email: {
      sentTo: email,
      subject: emailSubject,
      status: "delivered",
      timestamp: new Date().toLocaleTimeString(),
    },
  },
});
```

#### Production Notification Gap
The SMS and Email payloads are returned within the API response for client-side logging and inspection. **No live SMS gateway** (e.g. CDAC Mobile Seva MSDG, NIC SMS Gateway, or Twilio) or SMTP server is currently connected.

---

### 4. Administrative Audit Logging

#### How Mutations are Logged Currently
NagrikSeva AI updates the application document in-place:
- `lastUpdated`: Date string of last change (`YYYY-MM-DD`).
- `officerDesignation`: Title and name of the officer who performed the action.
- `remarksGu` and `remarksEn`: Contextual explanation of the change.
- `operatorConfirmed`: Boolean flag indicating manual cashier confirmation.

#### Production Recommendation: Immutable Audit Ledger
For legal accountability under the Gujarat Public Records Act:
1. Create a dedicated `application_audit_logs` table.
2. Record `{ timestamp, applicationId, officerId, officerRole, actionType, previousState, newState, ipAddress, userAgent }`.
3. Seal each log entry with a cryptographically verifiable SHA-256 hash chaining to the previous entry (tamper-evident audit chain).
