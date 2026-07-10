# 🍔 RocoMamas OS — Powered by Lutho™ Smart Restaurant Platform

Welcome to **RocoMamas OS**, the ultimate, high-fidelity sit-down restaurant platform designed specifically for the fast-paced, high-energy environment of **RocoMamas**! By framing patrons and crew behind a beautifully unified, real-time responsive interface, RocoMamas OS bridges the physical gap of dine-in hospitality.

---

## ✅ Z-Format (Manual Ops / No POS / No Payments)

**Z-Format** is the “go-live fast” version of RocoMamas OS:

- **No POS integration required**
- **No payment processing in-app**
- Guests can **order**, **summon a waiter**, and **request the bill**
- Staff uses a **single shared kiosk** to manage orders + requests and to mark items as **Paid** in real time

This repo can support multiple formats. **Z-Format does not replace the full POS/payment format** — it’s an additional version you can offer.

### Quick links / URL slugs

- **Remote ordering (default)**: root URL auto-routes to **Table 14** (remote ordering)
- **Staff/Admin gateway**: add `?admin=1` to the URL to open the staff sign-in gate
  - Example: `/?admin=1`
  - You can also unlock via the **5-tap logo** easter-egg in-app

---

## 🚀 1. The Executive Core Vision

RocoMamas OS is a lightweight, zero-friction, sit-down dining portal. Standard restaurant apps require heavy downloads, password registrations, or sms authentications that slow down patrons when they are hungry. RocoMamas OS utilizes **zero-install URL coordinate streams** (`?table=X`) to bring diners immediately into a synchronized table ecology.

Whether ordering custom-smashed burgers, splitting bills, chatting with other guests at the table, or triggering emergency service calls, everything in RocoMamas OS is custom-crafted to deliver interactive feedback in **under 200 milliseconds**.

---

## 🎯 2. Detailed Audience Persona Lifecycle

### 👨‍💻 Sipho (The Social Patron)
* **Demographics:** 28 years old, tech-savvy, loves dining out in large friend circles.
* **Core Pain Point:** Waiting forever to grab the waiter’s attention, manual split-billing arguments, and deciphering confusing ingredient menus.
* **Lutho-Enriched Journey:**
  1. Scans the stylized **Halftone QR Code** on physical Table 12.
  2. Enters an anonymous nickname, immediately joining the cooperative table canvas.
  3. Seamlessly submits his own customized items to the cook queue from his phone.
  4. Hand-claims and settles *only* his items on the split-bill overlay before walking out.

### 👩‍🍳 Zoe (The "Flight Captain" Air Crew / Waiter)
* **Demographics:** 22 years old, manages 8+ tables on chaotic Friday evening shifts.
* **Core Pain Point:** Missing call distress flags, confusing customized tickets, and manually sorting group cards at the POS terminal.
* **Lutho-Enriched Journey:**
  1. Logs into the **Floor Console Dashboard** on her terminal.
  2. Receives low-frequency acoustic pings when Table 12 flags an SOS alert.
  3. Views exactly which table requested split card payouts, keeping table-turns fast and organized.

---

## 🛠️ 3. High-Fidelity Technology Stack

The under-the-hood engine driving RocoMamas OS consists of the following components:

* **Engine Core:** React 19 SPA bundled via Vite 6 and written with strict type-safety in **TypeScript 5**.
* **Visual Frame:** **Tailwind CSS V4** utility sheets using high-density layouts, custom responsive breakpoints, and custom theme presets.
* **Interactive Motion:** Fluid animations powered by **motion** (Framer Motion v12) for layout transitions, drawer slides, and fade-in entrances.
* **Acoustic feedback:** **Web Audio API Soundscape Synthesizer** generating lag-free, synthesized oscillator beeps to replace bulky audio assets.
* **duplex Synchronization:** Built-in **Firebase Firestore** full-duplex listeners synchronized with **Dual-Storage Replication** (LocalStorage mirrors) to remain operational even during transient network degradation.

---

## 🔒 4. "Lutho-Shield" Airtight Table Security

Dine-in security is paramount. To prevent security compromises and table hopping, RocoMamas OS features an advanced multi-layered security suite:

### 🛡️ Single-Table Session Lockdown (Anti-Table-Hopping)
To prevent customers from sniffing table IDs and table hopping (e.g. typing `?table=7` from table 12 to mess with other carts or order unauthorized beers), the app enforces a strict **Single Active Table Rule**:
1. When a user scans a table QR code or successfully enters a physical PIN, the device registers the single active table: `localStorage.setItem("roco_active_customer_table", tableId)`.
2. Even if a user manually changes their browser search parameter to `?table=7`, if they don't have the explicit secure QR token or table 7's physical PIN, they are **immediately locked out** and forced to input Table 7's PIN before viewing or ordering.

### 🔑 Physical Table Sticker PINs
Every table features a randomized, rotatable 4-digit physical PIN listed at the bottom of the table sticker. On boot, the user must enter this PIN to gain table access:
* **Table 1 PIN:** `1394`  |  **Table 2 PIN:** `2485`  |  **Table 3 PIN:** `3571`  |  **Table 4 PIN:** `4619`
* **Table 5 PIN:** `5728`  |  **Table 6 PIN:** `6837`  |  **Table 7 PIN:** `7942`  |  **Table 8 PIN:** `8051`
* **Table 9 PIN:** `9163`  |  **Table 10 PIN:** `5084` |  **Table 11 PIN:** `2195` |  **Table 12 PIN:** `1294`
* **Table 13 PIN:** `3141` | **Table 14 PIN (Remote):** `4529` (remote ordering allows concurrent sessions; no table-lock)

### 🛸 Seamless Secure Token Bypasses
For authentic QR scans, the generated link embeds a secure cryptographic session token: `&token=roco-sec-t[table]-[pin]f8c2b5`. Scanning this token instantly authenticates the device as sitting at that physical coordinate, bypassing the pin keyboard completely!

### ⚙️ Brute-Force Rate Limiting & Audit Logs
If a rogue user guesses table PINs incorrectly more than **5 times**, the system triggers a **30-second security block**, locking the virtual keypad and logging a security violation entry in the Crew's Audit Logs.

---

## 👾 5. Every Nook & Cranny: Feature Breakdown

RocoMamas OS is partitioned into two major modes of activation: The **Customer Operations Panel** and the **Staff Operations Dashboard**.

### 🍔 A. Customer Operations Panel

#### 1. Real-Time Menu Catalog
* Divided into two distinct headers: **EAT** and **DRINK**.
* Items feature high-contrast pictures inside padded layouts (`object-contain`), description overlays, real-time stock toggles (In Stock / Sold Out), and special badge highlights (e.g., *Smashed*, *Spicy*, *Popular*).

#### 2. Group Cart & Shared Table Session
* Patrons on the same table can enter custom nicknames. Avatars populate the header bar in real-time.
* Cooperative cart listing where users can add items, view other people's pending cards, and enter custom cooking instructions (e.g., *"Double smash, extra cheese please!"*).

#### 3. Real-Time Order Fire Queue
* Once ordered, items are dispatched into a live status layout tracking states: **Sent 📨** -> **Preparing 🔥 (Vibrant Flame Pulsing)** -> **Served 🍔**.
* Live timers show exactly how long preparation has been running.

#### 4. Shared Table Chat Lounge
* A micro-chat drawer allows patrons sitting together at the same table to chat, sending direct textual messages, visual emojis, or pre-configured fast cues (e.g. *"Claiming the next milkshake!"*).

#### 5. "Signal Flight Deck" Distress Telemetry
* Patrons can trigger distress summon buttons (`🔔 Call Waiter`, `💳 Request Bill`, `🧽 Clear Table`). This immediately sounds alert chimes on the Waiter console, signaling Zoe to speed to Table X.

#### 6. Thunee Card Game Integration
* To occupy guests while waiting for their custom patties, RocoMamas OS embeds a fully playable **Thunee** module! Thunee is a beloved South African trick-taking game using 24 cards (9, 10, J, Q, K, A). 
* Patrons can deal hands, play cards, win tricks, request "Double" or "Khanapyt", and register live scores with custom auditory sound chimes and retro card overlays!

---

### 🍻 B. Custom Error 404 Panel: "Lost in the Smash!"

RocoMamas OS replaces default, sterile browser errors with a beautiful, fully on-brand **Custom 404 Screen**:
* **Activation:** Triggered when a guest attempts to access an invalid table ID beyond our configured boundaries (valid IDs: Table 1 to Table 14).
* **Atmosphere:** Deep matte charcoal backdrop with warm radial glows, featuring a large spinning consolidated logo, pulsing warning indicators, and a red-gradient error banner.
* **Actions:** Guests are greeted with helpful instructions explaining valid table boundaries, a diagnostic error log code (`ROCO-404-COORDINATES-VOID`), an interactive **Return to Table Board** button, and an emergency **Signal Flight Captain (SOS)** distress button to request immediate human floor support.

---

### 📋 C. Waiter Board & Staff Operations Panel

Logged in via the Staff PIN (default profile **General**), servers gain access to the floor manager dashboard:

#### 1. Table Seating Blueprint
* Interactive grid blueprint detailing all 13 tables, showing their current live status color codes: **Available (White Outline)**, **Occupied (Orange)**, **Booked (Purple)**, or **Pending Cleanup (Amber)**.
* Shows active distress signals flashing in full crimson red.

#### 2. Soundboard Control Desk
* Central terminal playing low-latency ambient chimes when distress logs arrive, letting crew react in milliseconds.

#### 3. Master Bill split Ledger
* Real-time split-bill items claim processor showing what items are unpaid, who claimed them, the split calculation values, and card terminals payout claims.

#### 4. Active Tables Management & Code Rotations
* Floor managers can view active table occupancy percentages and manually **rotate PIN combinations** at any table, instantaneously invalidating old tokens/cookies of previous occupants.

---

## 📁 6. Full Directory Overview

RocoMamas OS is designed with extreme modularity to guarantee lightweight bundles and prevent token overflow:

* `/src/App.tsx` - The primary state manager, router, layouts, and view layers (Customer view, Staff dashboard, PIN input, and 404 screens).
* `/src/types.ts` - Shared contract specifications detailing interfaces for menus, cart items, historic orders, splits, and security logs.
* `/src/data.ts` - Central repository hosting the entire RocoMamas catalog, pricing details, emojis, and daily specials rules.
* `/src/luthoDocs.ts` - Proprietary PRD and TRD system blueprints serving the floor manager’s onboarding assistant.
* `/src/firebase.ts` - Standard server-side full duplex SDK connector targeting Cloud Firestore collections.
* `/src/components/ThuneeFullscreenApp.tsx` - Fully self-contained South African trick game core, scoring mechanics, and visual cards deck.
* `/src/components/HalftoneQRCode.tsx` - Stylized halftone vector matrix rendering instant table scan URLs for stickers.

---

## 💻 7. Building, Packaging & Booting

### 1. Dev Mode
Spins up the Vite development server locally on host `0.0.0.0` at port `3000`:
```bash
npm run dev
```

### 2. Live Linting
Performs strict static Type Checks to guarantee clean parameters:
```bash
npm run lint
```

### 3. Production Compilation
Prepares optimized, minified, statically-compiled files cached under `dist/` ready for containerized deployment:
```bash
npm run build
```

---
*RocoMamas OS — Smash, Order, Repent. Built to Rock your Hunger.*
