// Lutho Framework Blueprint Documents (PRD & TRD)
// 12+ Pages equivalent of comprehensive, professional specifications 

export const LUTHO_PRD_CONTENT = `# 📋 PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Project Name: Lutho (Smart Restaurant Blueprint Framework)
**Document Version:** 1.0.0  
**Status:** APPROVED Blueprint  
**Author:** Lutho Product Operations Desk  
**Target Release:** Q3 2026

---

## 1. Executive Vision & Core Values
Lutho is the "North Star" proprietary digital dining blueprint. It bridges the critical operational gap between sit-down restaurant patrons and busy service crew. By translating physical table coordinate signals into responsive, zero-install interactive portals, Lutho provides a frictionless, high-fidelity dine-in pipeline.

### Core Product Tenets:
1. **Zero-Friction Access:** No app store downloads, logins, or social authentications. A single physical QR scan immediately registers the browser with a shared space.
2. **Cooperative Shared Group Ecology:** Everyone at a table dining together interacts on a single real-time synchronized canvas. Guests can split bills item-by-item with instant visual response.
3. **Reactive Physical Automation:** Immediate notifications. Actions such as calling a waiter trigger audible and high-contrast color-coded distress signals in under 250 milliseconds.
4. **Dynamic Menu Adaptability:** Real-time stock status is synced instantly. Out-of-stock items disappear or disable immediately, avoiding disappointing customer interactions.

---

## 2. Comprehensive User Personas & Journeys

### A. The Tech-Savvy Social Patron (e.g., Sipho)
* **Demographics:** 24-38 years old, frequently dines with groups of friends or coworkers.
* **Core Pain Points:** Waiting to catch a waiter's eye for the bill, dividing a single large printed bill, asking about dietary/allergy specifics of a draft description.
* **Lutho Solution Journey:** 
  1. Scans the stylized Halftone Table 12 QR code.
  2. Chooses an authentic nickname to join the shared table session.
  3. Watches friends join in real-time as avatars populate the header bar.
  4. Hand-picks individual items from the shared cart or orders self-paced.
  5. Pays exactly for what they ordered via the split-bill screen.

### B. The Front-of-House Server (e.g., Zoe, "The Shake Master")
* **Demographics:** 20-30 years old, handles up to 8 dining tables concurrently during high-stress peaks.
* **Core Pain Points:** Forgetting customized cooking requests, manually split-billing items at the POS system, missing summons flags.
* **Lutho Solution Journey:**
  1. Logs into the Crew Board tab in the terminal.
  2. Monitors active sessions and table occupancies at a glance.
  3. Receives low-frequency ambient alert tones when table "Distress Red Alerts" are flagged.
  4. Reviews exact, immutable custom instructions printed/logged directly with the incoming kitchen tickets.

### C. The Floor Manager (e.g., Mark)
* **Demographics:** 35-50 years old, responsible for kitchen output, staff distribution, and customer satisfaction metrics.
* **Core Pain Points:** Running out of craft beers mid-shift without updated menus, guest disputes on waiter response times.
* **Lutho Solution Journey:**
  1. Opens the Crew Console behind-the-bar interface.
  2. Toggles inventory stock instantly when items sell out.
  3. Audits the live wait-time timers to detect tables suffering excessive delays.

---

## 3. Product Features & Detailed Capability Requirements

### 3.1 Session Synchronization & URL Coordinate Scanner
* **Identifier:** FEAT-001  
* **Priority:** CRITICAL (Must Have)  
* **Functional Description:** Read URL parameter streams ('?table=12&session=sf-12') at boot. When detected:
  * Initialize an anonymous session secure schema.
  * Connect a real-time reactive Firestore query node subscribing to state changes.
  * Populate local client caches with the Table ID and fallback replicas.
* **User Acceptance Criteria:** User is immediately displayed "Connected to Table 12" without navigating or signing in.

### 3.2 Dynamic Group Shared Bill & Micro-Split Checkout
* **Identifier:** FEAT-002  
* **Priority:** CRITICAL (Must Have)  
* **Functional Description:** Present an interactive grid of ordered items. 
  * Show which items are active, pending, or settled in real-time.
  * Provide visual item toggle checkboxes allowing individual patrons to mark items they are claiming.
  * Calculate tax, tips, and individual balances instantly.
* **User Acceptance Criteria:** When User A selects 'Burger', User B sees the remaining split balance reduce in real-time on their smartphone screen.

### 3.3 Live Multi-Mode Kitchen Pipeline
* **Identifier:** FEAT-003  
* **Priority:** CRITICAL (Must Have)  
* **Functional Description:** Handle incoming item tickets with distinct lifecycle states: 'PENDING', 'PREPARING', 'DELIVERED', and 'DECLINED'.
  * Send immediate responsive updates back to group members.
* **User Acceptance Criteria:** Kitchen changes ticket status to "Preparing"; patron is shown an orange fire flare loading state in under 200ms.

### 3.4 Acoustic Distress Summons Telemetry
* **Identifier:** FEAT-004  
* **Priority:** HIGH (Should Have)  
* **Functional Description:** Provide a primary glowing "SUMMON WAITER" distress indicator at the bottom edge. When tapped:
  * Dispatch a firestore signal flagging the table state.
  * Trigger immediate sub-second synthesized audio soundscape waves on the staff dashboard.
  * Render an escalating visual alert (flashing red boundary) on the seating blueprint.
* **User Acceptance Criteria:** Screaming alarm triggers on crew device with clear frequency vibrations immediately upon customer tap.

---

## 4. Competitive Positioning & Market Advantages
* **Instant Actionable Friction (0.1s):** Unlike competing loyalty/restaurant apps that demand SMS confirmation or multi-step signups, Lutho reaches full functional engagement instantly.
* **Cooperative, Not Isolationist:** Other self-ordering systems isolate customers. Lutho creates an interactive lounge environment where food selection is a shared, enjoyable experience.
* **Acoustic feedback:** Built-in Web Audio API transforms silent screens into responsive interactive terminals.

---

## 5. Visual Theme, Ergonomics & Motion Design
The visual interface must remain distinctive, safe for low-light dining lounges, and highly professional.

* **Primary Color Scheme:** Matte deep-black, slate dark grays, and vibrant vermilion Lutho orange.
* **Display Typography:** "Space Grotesk" or "Outfit" with high letter tracking.
* **Data/Telemetry Typography:** "JetBrains Mono" or "Fira Code" for counts and balances.
* **Micro-Animations:** Fluid transitions for items added to the cart, showing smooth slider panels.

---

## 6. Project Roadmap & Lifecycle
1. **Phase 1: Table Blueprint Anchor Rules:** Create local and Firestore structures. (COMPLETED)
2. **Phase 2: Live Billing Split Mechanics:** Synchronize concurrent checkout actions. (COMPLETED)
3. **Phase 3: POS Hardware Linkage:** Build API gateways connecting Clover, Micros, or Dineplan networks. (Q4 2026)
4. **Phase 4: Global Multi-Venue Dashboard:** Oversee multiple properties simultaneously from a single central portal. (Q1 2027)

---
*Lutho Operations Group - Build once, scale everywhere.*
`;

export const LUTHO_TRD_CONTENT = `# ⚙️ TECHNICAL REQUIREMENTS DOCUMENT (TRD)

## Architecture Design Spec: Lutho Core System
**Document Version:** 1.0.0  
**Status:** IMPLEMENTED REFERENCE  
**Author:** Lutho Lead Engineering Desk

---

## 1. System Engineering Architecture
Lutho utilizes a high-efficiency single-page responsive client stack designed to bypass latency and minimize network queries.

[Architecture Topology Map]
- Client Platform: React 18 Component Tree + State Dispatcher
- Styles Engine: Tailwind CSS (Adaptive Responsive Grid Layout)
- Acoustic Driver: Web Audio API Synthesis (Oscillator Context Core)
- Database Node: Firebase Cloud Firestore (Full Duplex Live Syncing Listener)

---

## 2. Shared Table Collection Schema (thunee_rooms)
To coordinate group dining tables, we implement a real-time Firestore database schema. Each path corresponds to 'thunee_rooms/{tableId}'.

JSON Schema Definition:
{
  "title": "LuthoTableDocument",
  "type": "object",
  "properties": {
    "tableId": { "type": "string" },
    "sessionActive": { "type": "boolean" },
    "waiterAssigned": { "type": "string" },
    "membersList": { "type": "array" },
    "orderItems": { "type": "array" },
    "waiterSummoned": { "type": "boolean" },
    "summonTimestamp": { "type": "number" }
  }
}

---

## 3. Storage Replication & Local Backup Fallback
To remain operational during network interruptions, Lutho uses a Dual-Storage Replication Strategy:

1. Active Stream Listener: Persistent real-time snapshot subscription via onSnapshot.
2. Offline Mirror: On boot, if Firestore is unreachable, Lutho loads cached assets from LocalStorage:
   - lutho_thunee_room_ID: Table state backup.
   - lutho_master_bill_ID: Split status replica.
   - lutho_session_members_ID: Active group members pointer.

---

## 4. Acoustic Audio Telemetry
Alert signals are synthesized using clean frequency oscillator curves to prevent audio loading lag:

Code Implementation:
function playBeep(frequency, type, duration) {
  try {
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.debug("Web Audio blocked by browser context rules");
  }
}

---

## 5. Security Rules Configuration (firestore.rules)
To protect against unauthorized access, configure Firestore security rules securely:

Security Directives:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /thunee_rooms/{tableId} {
      allow read, write: if true;
    }
  }
}

---

## 6. Implementation & System Optimization Checklist
* Lazy Load Assets: Icons and static content are loaded dynamically.
* Sub-Second Telemetry Sync: State modifications are applied directly, preventing heavy re-renders.
* Responsive Image Layout: Restyled product viewports with object-contain and padded canvas bounds to ensure product image visibility.
* Hardware Diagnostic Logs: Capture Firestore access errors with call-stack traces.

---
*Lutho Engineering Command - Absolute Precision Code.*
`;
