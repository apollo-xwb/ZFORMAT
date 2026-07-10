# Roco Guest OS × Pilot POS — Owner Action Guide

**Purpose:** This document explains what you (the restaurant owner or franchisee) need to do so guest phone ordering can connect to your Pilot POS — including kitchen printing, table tracking, and menu sync.

**Audience:** Restaurant owner / manager (no technical background required)

**Status today:** The guest ordering app is built and working as a demo. Guests can scan a table QR code, browse the menu, and place orders — but those orders **do not yet reach Pilot**. Nothing prints in the kitchen until the steps below are completed.

---

## 1. What we are building (in plain terms)

```
Guest scans QR on table  →  Orders on phone  →  Order sent to Pilot  →  Kitchen / bar prints ticket
                                                      ↓
                                              Staff see order on tablet
```

Your Pilot POS remains the **source of truth** for tables, menu items, prices, and printing. The guest app is a new way for customers to order — Pilot still handles the ticket, the bill, and the printers you already use.

---

## 2. What you already have

| Item | Notes |
|------|-------|
| **Store / Merchant ID** | You have this — it identifies your venue in Pilot |
| **Guest ordering app** | Menu, 13 tables, QR codes, cart, staff dashboard (demo mode) |
| **Pilot POS** | Already running in-store for normal service |

---

## 3. What to request from Pilot Support

Contact Pilot and ask to set up a **third-party / @Table guest ordering integration** for your store.

| Contact | Details |
|---------|---------|
| **Email** | support@pilot.co.za |
| **Phone** | 011 602 8300 |
| **WhatsApp** | +27 82 299 3242 |

### 3.1 Credentials (Pilot must generate these for you)

Ask Pilot to provide or help you create:

| What to ask for | Where it usually lives in Pilot | Why we need it |
|-----------------|--------------------------------|----------------|
| **API Secret Key** | Pilot Cloud Portal → Tenant Settings → Developers → Third-party Apps → API tokens | Lets the app securely submit orders to your store |
| **Order Channel ID** | Pilot Office → Integration Partners Hub | Tells Pilot that orders are coming from the guest app (not the till) |
| **Confirmed API Gateway URL** | Pilot Web Services config, or cloud endpoint | The address the app sends orders to (often `https://api.pilotpos.co.za/v1` — confirm for your setup) |
| **Integration contact / case reference** | Support ticket number | So follow-ups are tracked |

**Say this to Pilot (copy/paste):**

> We are connecting a guest @Table ordering web app to our Pilot POS. Please provide integration credentials for our store [YOUR STORE ID]: API secret key, order channel ID, confirmed API gateway URL, and technical documentation for submitting table orders via API. We need orders to route to our existing kitchen display and printers.

### 3.2 Technical documentation (Pilot must supply)

Ask for written documentation covering:

- How to **submit a new table order** (HTTP method, URL, JSON example)
- Required fields: store ID, table number, line items, quantities, notes
- How line items are identified (**PLU / product codes**)
- Authentication method (API key header, bearer token, etc.)
- Success and error responses
- Whether orders go via **cloud API** or **on-site Pilot Web Services** (local server at the restaurant)
- Test / sandbox environment if available

> **Important:** Without this documentation, the development team cannot complete the connection — even with the store ID.

### 3.3 Things Pilot may need to enable on their side

Confirm with Pilot that they will:

- [ ] Enable the **integration partner / channel** for your store
- [ ] Route submitted orders to your **existing KDS and kitchen printers**
- [ ] Confirm which **table numbers** in Pilot match your floor plan
- [ ] Confirm whether **prices** come from Pilot (recommended) or must be sent with each item
- [ ] Assign a technical contact for integration questions during go-live

---

## 4. What you can export yourself from Pilot

Before or while waiting on Pilot support, log into **Pilot Office** (back office) and export / write down the following. These are usually available without special API access.

### 4.1 Table layout

| Export / record | What to capture |
|-----------------|-----------------|
| **Table list** | Every table number and name as it appears in Pilot (e.g. Table 1, Booth 4, Patio 3) |
| **Table count** | How many dine-in tables you actually use |
| **Floor zones** | Bar vs main dining vs patio — if orders route to different printers |

**Why:** The guest app currently uses tables numbered **1 to 13**. We must confirm these match Pilot’s table numbers. If they differ, we build a mapping (e.g. “App Table 5 = Pilot Table 105”).

**How:** Pilot Office → table / floor plan setup, or ask your Pilot trainer where table numbers are managed. A simple spreadsheet is fine:

| App table # | Physical location | Pilot table # | Notes |
|-------------|-------------------|---------------|-------|
| 1 | Booth 1 (front) | ? | |
| 2 | Booth 2 | ? | |
| … | … | … | |

### 4.2 Menu / product list

| Export / record | What to capture |
|-----------------|-----------------|
| **PLU / product code** | The numeric or short code Pilot uses per item (critical) |
| **Item name** | As shown on the till |
| **Price** | Current selling price (incl. VAT if applicable) |
| **Category** | Food / drinks / starters / etc. |
| **Active / inactive** | Items no longer sold should be marked |

**Why:** When a guest orders “Classic Cheese Burger” on the phone, Pilot needs the **PLU code** — not the English name — to print the correct kitchen ticket and price the order.

**How:** Pilot Office → menu / product maintenance. Look for **Export**, **Reports**, or **Product list** reports. If no export button exists, ask Pilot support for a **menu export with PLU codes** (CSV or Excel).

### 4.3 Printer / KDS routing (for your own reference)

| Record | What to capture |
|--------|-----------------|
| Kitchen printer(s) | Which station prints food |
| Bar printer | Drinks routing |
| KDS screens | Which display shows which order types |

**Why:** You do not configure printers in the guest app — Pilot does this when it receives the order. Knowing your setup helps troubleshoot on go-live day (“order hit Pilot but didn’t print” → Pilot routing issue).

### 4.4 Store details checklist

Fill in and keep on file:

- [ ] Store / Merchant ID: _______________________
- [ ] Store trading name: _______________________
- [ ] Pilot Office login contact: _______________________
- [ ] On-site Pilot Web Services installed? Yes / No
- [ ] Internet / firewall constraints at venue? _______________________

---

## 5. What the development team needs from you

Once you have the above, send the following in one email or shared folder:

| # | Deliverable | From |
|---|-------------|------|
| 1 | Store ID | You (have) |
| 2 | API secret key | Pilot |
| 3 | Order channel ID | Pilot |
| 4 | API documentation PDF / link | Pilot |
| 5 | Table mapping spreadsheet | You (from Pilot Office) |
| 6 | Menu export with PLU codes | You (from Pilot Office) |
| 7 | Public website URL for the app | Dev team (after hosting) |

**Do not** share the API secret key in WhatsApp groups or unsecured chat. Use email or a password manager share link.

---

## 6. Next steps — timeline overview

### Phase A — Your actions (now)

**Week 1**

1. Email or call Pilot support with the request in Section 3.
2. Export table list and menu with PLU codes from Pilot Office (Section 4).
3. Walk the floor and confirm table numbers on QR cards will match Pilot.
4. Share Store ID + exports with the development team.

### Phase B — Development (after Pilot responds)

**Week 2–3** (estimate; depends on Pilot turnaround)

1. **Host the app** on a real website (HTTPS) so guests can scan QR codes on their phones — not localhost.
2. **Map menu items** — each app menu item linked to a Pilot PLU code.
3. **Map tables** — app table numbers aligned with Pilot.
4. **Build secure connection** — API key stored on server, not on guest phones.
5. **Wire “Send Order”** — guest tap submits to Pilot; Pilot prints to kitchen.

### Phase C — Testing at the restaurant

**Week 4** (pilot / soft launch)

1. **Test order** from one table — confirm ticket prints in kitchen.
2. **Test drinks vs food** — confirm bar and kitchen routing.
3. **Test wrong table** — order from Table 3 appears on Table 3 in Pilot, not another table.
4. **Test staff tablet** — waiter sees incoming order (may require a second sync step).
5. **Train staff** — what to do if an order fails (guest shows screen, manual re-entry on till).

### Phase D — Go live

1. Print and place **QR table cards** (from the app’s print sheet).
2. Brief floor staff on the new flow.
3. Monitor first service — dev team on standby for first weekend.
4. Collect feedback; adjust menu mapping for missing items.

---

## 7. What guests and staff will experience (after go-live)

**Guests**

1. Scan QR on table → open menu on phone  
2. Add items → tap **Send Order to Kitchen**  
3. See order status (Sent → Preparing → Served)  
4. Pay / split bill as today (payment integration may be a later phase)

**Staff**

1. Order appears in Pilot / KDS / printers (same as a waiter keying it in)  
2. Guest app staff dashboard shows live queue (once multi-device sync is enabled)  
3. Table status on seating blueprint updates

**Kitchen**

1. Receives printed or KDS ticket from Pilot — **no change to how they work today**, as long as Pilot routing is correct

---

## 8. Common questions

**Q: Will this replace our tills?**  
No. Pilot remains your POS. The app is an extra ordering channel for guests at the table.

**Q: Do we need new hardware?**  
Usually no — same printers and KDS Pilot already uses. You need reliable Wi‑Fi for guests and a hosted web address for the app.

**Q: The app says “POS LIVE” but nothing prints — why?**  
The green status in the demo app is not a real Pilot connection yet. Printing only starts after Phase B is complete and Pilot credentials are live.

**Q: Can we use our own menu prices on the phone?**  
Pilot typically enforces its own prices. The menu export from Pilot should be the price source to avoid mismatches.

**Q: What if Pilot is slow to respond?**  
You can still export tables and menu PLUs yourself and share with the dev team. Development of mapping and hosting can proceed; only the final “send order” step is blocked on Pilot’s API pack.

**Q: Who pays for Pilot integration?**  
Confirm with Pilot whether third-party / API integration has licensing or setup fees for your franchise agreement.

---

## 9. Owner sign-off checklist

Use this before go-live:

- [ ] Pilot support case opened and credentials received  
- [ ] API secret key received and stored securely  
- [ ] Order channel ID created in Pilot Office  
- [ ] Table mapping spreadsheet completed and verified on floor  
- [ ] Menu PLU export received and shared with dev team  
- [ ] Test order printed correctly in kitchen  
- [ ] Test order appeared on correct table in Pilot  
- [ ] Staff briefed on backup procedure if app is down  
- [ ] QR cards printed and placed on all active tables  
- [ ] Public app URL live and tested on a guest phone  

---

## 10. Summary — your three jobs

1. **Ask Pilot** for API credentials, channel ID, and integration documentation (Section 3).  
2. **Export from Pilot Office** your table list and menu with PLU codes (Section 4).  
3. **Verify on the floor** that table numbers match before QR cards go on tables.

Everything else — hosting, menu mapping, secure API connection, and wiring the Send Order button — is handled by the development team once items 1–3 are in progress.

---

*Document prepared for Roco Guest OS (Lutho) × Pilot POS integration.*  
*For technical implementation details, see the development plan in the project repository.*
