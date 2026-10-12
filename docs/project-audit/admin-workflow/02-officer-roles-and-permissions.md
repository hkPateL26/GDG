# NagrikSeva AI — Admin & Officer Side Deep Investigation
## Document 02: Officer Roles & Permissions Matrix (5-Tier RBAC)

> **Audit Date:** October 2026  
> **Target Scope:** 5-Tier Gujarat Administrative Hierarchy, Officer Profiles, Permission Flags, Jurisdictional Scoping, and Server Authorization Reality.  
> **Source Files Audited:** `src/lib/admin-hierarchy-data.ts`, `src/lib/large-datasets.ts`, `src/components/OfficerLoginShield.tsx`, `src/components/AdminHierarchyDesk.tsx`, `src/app/api/track/route.ts`.  

---

### 1. 5-Tier Administrative Hierarchy Architecture

The system models the official governance structure of the Government of Gujarat across five distinct administrative tiers. Each tier has a defined jurisdiction, office address, and operational scope:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 1: રાજ્ય સ્તર — મુખ્ય સચિવાલય (State Secretariat, Gandhinagar)          │
│ Officer: મનોજ અગ્રવાલ, IAS (ACS Revenue & General Administration)           │
│ Scope: All 33 Districts, All 248 Talukas | ID: GUJ-STATE-001               │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 2: જિલ્લા સ્તર — કલેક્ટર કચેરી (District Collectorate, Rajkot)           │
│ Officer: પ્રભવ જોષી, IAS (District Collector & DM, Rajkot)                 │
│ Scope: 11 Talukas of Rajkot District | ID: GUJ-COL-3001                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 3: સબ-ડિવિઝન સ્તર — પ્રાંત કચેરી (SDM / Prant Office, Gondal)           │
│ Officer: કે. એમ. પંડ્યા, GAS (Sub-Divisional Magistrate, Gondal)             │
│ Scope: 3 Talukas (Gondal, Kotda Sangani, Lodhika) | ID: GUJ-SDM-5002        │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 4: તાલુકા સ્તર — મામલતદાર કચેરી (Taluka Mamlatdar, Gondal)              │
│ Officer: એચ. વી. પટેલ, GAS (Taluka Mamlatdar & Executive Magistrate)         │
│ Scope: All Villages of Gondal Taluka | ID: GUJ-GOV-9012                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 5: પંચાયત સ્તર — તલાટી કમ મંત્રી (Gram Panchayat, Gomta)                 │
│ Officer: વિજયકુમાર જોષી (Talati Mantri & e-Gram In-charge)                  │
│ Scope: Gomta Village Only | ID: GUJ-TAL-7089                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Comprehensive Officer Profile Specifications

Data defined in [`src/lib/admin-hierarchy-data.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/admin-hierarchy-data.ts#L45-L158) and [`src/lib/large-datasets.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/lib/large-datasets.ts#L5308-L5407):

| Field | Tier 1 (State) | Tier 2 (District) | Tier 3 (Sub-Division) | Tier 4 (Taluka) | Tier 5 (Panchayat) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Officer ID** | `GUJ-STATE-001` | `GUJ-COL-3001` | `GUJ-SDM-5002` | `GUJ-GOV-9012` | `GUJ-TAL-7089` |
| **Officer Name** | મનોજ અગ્રવાલ, IAS | પ્રભવ જોષી, IAS | કે. એમ. પંડ્યા, GAS | એચ. વી. પટેલ, GAS | વિજયકુમાર જોષી |
| **Designation** | અધિક મુખ્ય સચિવ | જિલ્લા કલેક્ટર & DM | પ્રાંત અધિકારી & SDM | તાલુકા મામલતદાર | તલાટી કમ મંત્રી |
| **Cadre** | IAS (Apex) | IAS (District) | GAS (Division) | GAS (Taluka) | Panchayat Service |
| **Role Key** | `state_admin` | `district_collector` | `sdm_prant` | `mamlatdar` | `talati` |
| **Tier Level** | `1` | `2` | `3` | `4` | `5` |
| **Office Location** | સ્વર્ણિમ સંકુલ-૧, ગાંધીનગર | કોર્ટ કમ્પાઉન્ડ, રાજકોટ | જેલ ચોક, ગોંડલ | જન સેવા કેન્દ્ર, ગોંડલ | ગ્રામ પંચાયત ભવન, ગોમટા |
| **District Scope** | All (33 Districts) | Rajkot (જિલ્લા સ્તર) | Rajkot | Rajkot | Rajkot |
| **Taluka Scope** | All 248 Talukas | 11 Talukas | Gondal, Kotda Sangani, Lodhika | Gondal | Gondal |
| **Village Scope** | All Villages | All Villages in Dist. | All Villages in Prant | All Villages in Taluka | Gomta (ગોમટા) Only |
| **Avatar Emoji** | 🏛️ | 🏢 | ⚖️ | 🖋️ | 📋 |

---

### 3. Detailed Permissions Matrix

The functional permissions are governed by explicit flags on the `OfficerNode` interface:

| Permission / Capability | Tier 1: State Admin | Tier 2: Collector | Tier 3: SDM Prant | Tier 4: Mamlatdar | Tier 5: Talati |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **`canApproveEsign`** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ **No** |
| **`canVerifyPayment`** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **`canModifyPolicy`** | ✅ **Yes** | ✅ **Yes** | ❌ No | ❌ No | ❌ No |
| **`canViewAllDistricts`** | ✅ **Yes** | ❌ No | ❌ No | ❌ No | ❌ No |
| **Subordinate Inspection Range** | Tiers 1, 2, 3, 4, 5 | Tiers 2, 3, 4, 5 | Tiers 3, 4, 5 | Tiers 4, 5 | **Tier 5 Only** |
| **Inspect Higher Authority Desks** | Prohibited | Prohibited | Prohibited | Prohibited | Prohibited |
| **District Dropdown Editable** | ✅ Yes (All 33) | 🔒 Locked to Rajkot | 🔒 Locked to Rajkot | 🔒 Locked to Rajkot | 🔒 Locked to Rajkot |
| **Taluka Dropdown Editable** | ✅ Yes (248) | ✅ Yes (11 Talukas) | ✅ Yes (3 Talukas) | 🔒 Locked to Gondal | 🔒 Locked to Gondal |
| **Village Dropdown Editable** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | 🔒 Locked to Gomta |
| **Leave Delegation Target** | ACS Dy. Secretary | Dy. Collector Rajkot | Mamlatdar Gondal | કે. એમ. પંડ્યા, GAS (ઇન-ચાર્જ) | એચ. વી. પટેલ (નાયબ મામલતદાર) |

---

### 4. Hierarchical Clearance & Switching Rules

In [`AdminHierarchyDesk.tsx`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/components/AdminHierarchyDesk.tsx#L334-L345), authority floor checking is enforced via React state:

```typescript
// Strict Hierarchical RBAC:
// An officer can only inspect / switch down to subordinate desks within their authority hierarchy.
// Tier 1 (State Super Admin): Can inspect Tiers 1, 2, 3, 4, 5.
// Tier 2 (Collector): Can inspect Tiers 2, 3, 4, 5 (Cannot access Tier 1).
// Tier 3 (SDM / Prant): Can inspect Tiers 3, 4, 5 (Cannot access Tiers 1, 2).
// Tier 4 (Mamlatdar): Can inspect Tiers 4, 5 (Cannot access Tiers 1, 2, 3).
// Tier 5 (Talati Mantri): Can ONLY access Tier 5 (his own village desk).
const allowedOfficersToSwitch = useMemo(() => {
  const authLevel = authenticatedOfficer.tierLevel || 5;
  return HIERARCHICAL_OFFICERS.filter((o) => o.tierLevel >= authLevel);
}, [authenticatedOfficer.tierLevel]);
```

When an officer attempts to switch above their tier level in `handleRoleSwitch`:
```typescript
if (target.tierLevel < authenticatedOfficer.tierLevel) {
  alert("⚠️ અનધિકૃત પ્રવેશ: તમને ઉચ્ચ કક્ષાના અધિકારીના ડેસ્ક પર પ્રવેશવાની વહીવટી સત્તા નથી.");
  return;
}
```

---

### 5. Server-Side Authorization Reality Check

#### What the Backend Currently Checks
In [`src/app/api/track/route.ts`](file:///d:/Movies%20and%20Web%20se/atmiya/nagrik-seva/src/app/api/track/route.ts#L363-L410):
```typescript
// Payment Confirmation Authorization
const isOperatorAuthorized =
  operatorId === "JSK-OP-8921" ||
  (officerId && (String(officerId).toUpperCase().startsWith("GUJ") || pin === "GJ2026"));

// Workflow Advancement Authorization
const isOfficerAuthorized =
  (officerId && (String(officerId).toUpperCase().startsWith("GUJ") || pin === "GJ2026")) ||
  operatorId === "JSK-OP-8921" ||
  (body.officerRole && String(body.officerRole).includes("મામલતદાર")) ||
  (body.officerName && String(body.officerName).includes("મામલતદાર"));
```

#### Critical Architectural Analysis
1. **Frontend RBAC vs Server RBAC:** The frontend enforces strict hierarchical scoping (e.g., Talati is locked to Gomta village, cannot approve e-Sign, and cannot edit policies). However, the backend route handler `/api/track` does not maintain a cryptographic session token or check the specific `tierLevel` on the request.
2. **Shared Demo Credentials:** All five presets share the demo PIN `GJ2026`. Any HTTP client sending `pin: "GJ2026"` can call `advance_stage: 3` directly.
3. **Production Recommendation:** Implement stateless JWTs or server-side Redis sessions storing `{ officerId, role, tierLevel, allowedJurisdiction }` signed by an environment secret (`AUTH_SECRET`), and validate each request against the application's actual taluka and district before mutation.
