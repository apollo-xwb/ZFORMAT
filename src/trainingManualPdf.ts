import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ROCO_STAMP_LOGO_LOCAL_URL } from "./qrConfig";

const PAGE_W = 595.28;
const PAGE_H = 841.89;

type ManualSection = {
  title: string;
  html: string;
};

function section(title: string, bodyHtml: string): ManualSection {
  return { title, html: bodyHtml };
}

function buildSections(): ManualSection[] {
  const scenarios: Array<{ s: string; a: string }> = [
    { s: "Couple at Table 6 stares at the QR.", a: "Coach them to scan the placard; use the Table PIN under the code if asked." },
    { s: "Guest says the PIN does not work.", a: "Check placard vs rotated credentials. After 5 fails they lock out about 30s." },
    { s: "Phone shows Table 2 while they are at Table 6.", a: "Re-scan THIS table's card. Do not move orders across tables." },
    { s: "Guest wants to order before seating.", a: "Send them to REMOTE ORDERING. Explain claim pass at collection." },
    { s: "Two friends open Remote on different phones.", a: "Normal. Solo unless they start a Group order + split session." },
    { s: "Guest refuses a nickname.", a: "Optional but helpful. Suggest a first name or Guest." },
    { s: "Is this connected to the kitchen?", a: "Yes — Send Order creates a live staff ticket. Food still via Pilot." },
    { s: "Guest sends, then adds more items.", a: "New send = new ticket. Open Your Order again." },
    { s: "Allergy only in chat.", a: "Reply + tell kitchen verbally. Chat alone is not enough." },
    { s: "Allergy in Kitchen notes.", a: "Call it out when punching Pilot from the ticket." },
    { s: "Ticket stuck on Sent while cooking.", a: "Move to Preparing so guest status matches reality." },
    { s: "Food plated and waiting.", a: "Ready → run food → Served." },
    { s: "Whole table's food is out.", a: "Table inspector → Mark all served." },
    { s: "Need lines for Pilot POS.", a: "Pilot summary → copy/download → enter in Pilot → update ROCO status." },
    { s: "Guest asks how long.", a: "Use the live timer; be honest if the board is slammed." },
    { s: "Wrong item cooked.", a: "Fix in kitchen/Pilot. Do not invent payment status. Manager decides comps." },
    { s: "Remote guest: I ordered on my phone.", a: "Ask for claim code or pass QR → Scan claim." },
    { s: "Camera will not focus on the pass.", a: "Type the 4-digit code manually." },
    { s: "Code not found / expired.", a: "Confirm venue link; check open Remote tickets. Completed will not verify." },
    { s: "Guest lost the PDF.", a: "Active Kitchen Orders → Pass re-download, or read code on screen." },
    { s: "Two people claim the same burger verbally.", a: "Trust claim code/QR, not the story." },
    { s: "Four remote friends want one kitchen drop.", a: "Group order: host/join → each locks in → last lock sends tickets." },
    { s: "Group member locked too early.", a: "Follow unlock/round rules — do not sneak a solo ticket into their bill." },
    { s: "Solo remote cannot see a friend's kitchen ticket.", a: "By design. Privacy. Group mode shares session tickets only." },
    { s: "Remote guest then sits at Table 9.", a: "Collect via claim first. Table 9 QR does not inherit the remote ticket." },
    { s: "Floor tile pulsing red on Table 4.", a: "Guest hit Call. Go over. Resolve in inspector when sorted." },
    { s: "You resolved; another iPad still pulses.", a: "Cloud-synced — wait a beat. Clear table also clears alerts everywhere." },
    { s: "Chat: napkins please.", a: "Reply from inspector chat; treat like a soft call." },
    { s: "Guest spam-calls Waiter.", a: "Go once, reset expectations, Resolve so the board calms." },
    { s: "You are slammed and Table 11 calls.", a: "Acknowledge fast even if delivery takes 2 minutes." },
    { s: "Bill requested — need the detail.", a: "Open request: amount, tip, split method, items. Settle then Done/Mark Paid." },
    { s: "Equal split 4 ways.", a: "Charge each share (+ tip). Mark Paid when sorted." },
    { s: "Pay by item — only their burgers.", a: "Use the item list on the request. Do not force equal." },
    { s: "Custom amount: I will put R200.", a: "Take R200 toward remaining; leave rest for next share." },
    { s: "Guest app still awaiting staff after card.", a: "Mark the bill request Done — their app settles live." },
    { s: "Two bill requests from same table.", a: "Handle each share. Do not clear the whole table after the first pay." },
    { s: "Google review R50 voucher ask.", a: "They use in-app review path. Do not invent discounts unless management says so." },
    { s: "New guests, old orders still showing.", a: "Previous shift did not Clear table. Clear now, then new scan." },
    { s: "Where is table history?", a: "Inspector → Table history, or Team → Waiter service history." },
    { s: "One waiter has a 50-top; you have three 2-tops.", a: "Use judgment — table count is not load. Ask lead to reassign if needed." },
    { s: "You are going on break.", a: "Clock Out. Hand over open tickets verbally." },
    { s: "End of night, floor empty.", a: "Clear leftovers. Assignments can wipe when floor is free." },
    { s: "Available but kitchen still has tickets.", a: "Finish statuses, then Clear table." },
    { s: "New hire tomorrow.", a: "Admin creates profile (blank PIN = 1234). They change PIN after login." },
    { s: "Staff forgot PIN.", a: "Admin helps; Settings → Update PIN when logged in. Avoid weak PINs." },
    { s: "Ex-staff still has access.", a: "Admin deletes profile (archives). Confirm they cannot clock in." },
    { s: "Need master fallback.", a: "General profile PIN 8034 — managers only. Never on the whiteboard." },
    { s: "Printing cards after PIN rotation.", a: "Rotate if needed → Print QR cards. Remote placard says REMOTE ORDERING." },
    { s: "Marketing sent fancy QR art.", a: "Customize table QRs → upload finished QR images → reprint." },
    { s: "Guest wants Staff mode to tip digitally.", a: "No. Staff mode is crew-only." },
  ];

  const scenarioChunks: string[] = [];
  for (let i = 0; i < scenarios.length; i += 10) {
    const slice = scenarios.slice(i, i + 10);
    scenarioChunks.push(
      slice
        .map(
          (item, idx) => `
        <div class="card">
          <div class="card-n">${i + idx + 1}</div>
          <div>
            <p class="sit">${escapeHtml(item.s)}</p>
            <p class="act"><strong>Do:</strong> ${escapeHtml(item.a)}</p>
          </div>
        </div>`
        )
        .join("")
    );
  }

  return [
    section(
      "How to use this manual",
      `
      <ol class="steps">
        <li>Read Part A — guest journey from walk-in to pay.</li>
        <li>Read Part B — your role (Staff or Admin).</li>
        <li>Drill Part C — 50 scenarios. Say the answer before you peek.</li>
        <li>Keep Part D quick reference near the staff kiosk.</li>
      </ol>`
    ),
    section(
      "Part A — From the door to the bill",
      `
      <p class="lead">What the guest experiences. If you know this, you can coach them in 10 seconds.</p>
      <h3>A1. Walk-in (dine-in tables 1–13)</h3>
      <ol class="steps">
        <li>Guest is seated and scans the table QR placard.</li>
        <li>ROCO opens in Customer mode. Enter Table PIN if asked.</li>
        <li>Pick a nickname → browse EAT/DRINK → Your Order → Send Order to Kitchen.</li>
        <li>Watch Live Kitchen Feed / Active Kitchen Orders.</li>
        <li>Need help → Call (waiter) or Chat.</li>
        <li>Pay → bill split (equal / by item / custom) → Request Bill.</li>
        <li>You settle → mark bill request Done / Mark Paid → their app settles.</li>
      </ol>
      <h3>A2. Remote Ordering</h3>
      <ol class="steps">
        <li>Scan REMOTE ORDERING placard — no table PIN; many guests at once.</li>
        <li>Choose Just me (solo) or Group order (friends lock in together).</li>
        <li>After send: 4-digit claim code + PDF/PNG pass.</li>
        <li>Collect at counter — you Scan claim or type the code.</li>
      </ol>
      <h3>A3. Guests should never see</h3>
      <ul>
        <li>Other strangers' remote kitchen tickets (only theirs — or group mates).</li>
        <li>Staff console, floor layout, or other tables' chats.</li>
        <li>A blank what-do-I-do moment — point them to How to.</li>
      </ul>`
    ),
    section(
      "Part B — Your role in the portal",
      `
      <h3>B1. Opening Staff mode</h3>
      <ol class="steps">
        <li>Tap the ROCO brand logo 5 times (or use /admin kiosk).</li>
        <li>Enter your staff PIN → Staff Console.</li>
        <li>Big Clock In at the top when your shift starts.</li>
        <li>Nav: Overview · Orders · Floor · Requests · Team · Settings · Scan claim (+ Menu for admins).</li>
      </ol>
      <p>Sign out / Customer View when you leave a shared kiosk.</p>
      <h3>B2. Regular staff daily loop</h3>
      <ul>
        <li>Start → Clock In</li>
        <li>New order → Floor/Orders → Pilot summary → punch Pilot</li>
        <li>Statuses: Preparing → Ready → Served</li>
        <li>Remote collection → Scan claim</li>
        <li>Bill request → read split details → settle → Mark Paid</li>
        <li>Party leaves → Clear table (archives sitting)</li>
        <li>End → Clock Out · Sign Out</li>
      </ul>
      <h3>B3. Admin extras</h3>
      <ul>
        <li>Team → create/delete staff (default PIN 1234 if blank).</li>
        <li>Menu workspace + Customize/Print QR placards.</li>
        <li>General root profile PIN 8034 — managers only.</li>
      </ul>
      <h3>B4. Floor pulses</h3>
      <ul>
        <li><strong>Red / waiter</strong> — guest hit Call → go + Resolve</li>
        <li><strong>Purple / bill</strong> — open request, settle, Done</li>
        <li><strong>Orange / orders</strong> — open kitchen tickets</li>
      </ul>
      <h3>B5. Status ladder</h3>
      <p class="ladder">Sent → Preparing → Ready → Served → Paid → Completed</p>
      <p>Paid/Completed look greyed. Confirm before re-editing.</p>
      <h3>B6. Clear table</h3>
      <p>Use when the party is gone. Archives sitting, completes tickets, resets bill, closes requests, stops pulses on every staff device, frees assignment.</p>`
    ),
    ...scenarioChunks.map((html, i) =>
      section(
        i === 0 ? "Part C — 50 scenarios" : `Part C — scenarios (continued)`,
        `${i === 0 ? `<p class="lead">First training session drill. Read the situation. Do the action.</p>` : ""}${html}`
      )
    ),
    section(
      "Part D — Quick reference",
      `
      <h3>Guest verbs</h3>
      <p>Scan → Nickname → Order → Send → Call / Chat → Request Bill → (Remote) show Claim Pass</p>
      <h3>Staff verbs</h3>
      <p>Clock In → Floor / Orders → Pilot → Status → Scan claim → Mark Paid → Clear table → Clock Out</p>
      <h3>Remote collection script</h3>
      <p>“Got your claim code or pass QR?” → Scan / type → Hand over food → Mark served if needed</p>
      <h3>Bill script</h3>
      <p>“I see you’re requesting R___ on an ___ split.” → Settle → Done/Mark Paid → “You’re sorted on the app.”</p>
      <h3>Clear table script</h3>
      <p>“Party gone?” → Clear table → Confirm → Next guests can scan clean</p>`
    ),
    section(
      "Part E & F — Checklists and drill",
      `
      <h3>Opening (lead / admin)</h3>
      <ul>
        <li>Kiosk on /admin or known staff unlock</li>
        <li>On-shift people Clock In</li>
        <li>Remote placard visible and scannable</li>
        <li>Smoke test: one remote claim + one dine-in order</li>
      </ul>
      <h3>Mid-shift</h3>
      <ul>
        <li>No red pulses older than a few minutes</li>
        <li>No bill requests stuck on Acknowledge forever</li>
        <li>Pilot backlog not stuck on Sent</li>
        <li>Cleared tables after turnovers</li>
      </ul>
      <h3>Closing</h3>
      <ul>
        <li>All parties cleared · requests Done · Clock Out · Sign out shared devices</li>
      </ul>
      <h3>30-minute new waiter drill</h3>
      <ul>
        <li>0–5 min: Guest journey on a dine-in QR</li>
        <li>5–10: Send test order; find on Orders; Pilot summary</li>
        <li>10–15: Move statuses; Mark served</li>
        <li>15–20: Remote order on second phone; Scan claim</li>
        <li>20–25: Request Bill as guest; Mark Paid as staff</li>
        <li>25–30: Clear table; find history; Clock Out</li>
      </ul>
      <p class="closing">Remember: ROCO OS is the shared brain between guests and crew. Pilot still cooks the food; you still deliver the hospitality. The portal wins when the board matches the floor — every time.</p>`
    ),
  ];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function manualStyles(): string {
  return `
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: #0a0a0b;
      background: #ffffff;
      letter-spacing: normal;
      word-spacing: normal;
      -webkit-font-smoothing: antialiased;
    }
    .page {
      width: 794px;
      min-height: 1123px;
      padding: 56px 52px 72px;
      background: #ffffff;
      position: relative;
      overflow: hidden;
    }
    .page::before {
      content: "";
      position: absolute;
      left: 0; top: 0; right: 0;
      height: 10px;
      background: #E78A3E;
    }
    .page-foot {
      position: absolute;
      left: 0; right: 0; bottom: 0;
      height: 36px;
      background: #0a0a0b;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 52px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .page-foot::before {
      content: "";
      position: absolute;
      left: 0; right: 0; top: 0;
      height: 3px;
      background: #E78A3E;
    }
    .kicker {
      color: #71717a;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 8px;
    }
    .stamp {
      position: absolute;
      top: 28px;
      right: 48px;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      border: 2px solid #E78A3E;
      background: #fff;
      object-fit: cover;
    }
    h1 {
      margin: 0 0 18px;
      background: #0a0a0b;
      color: #fff;
      font-size: 18px;
      line-height: 1.2;
      padding: 12px 14px 12px 18px;
      border-left: 6px solid #E78A3E;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    h3 {
      margin: 18px 0 8px;
      color: #E78A3E;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1px solid #E78A3E;
      padding-bottom: 4px;
    }
    p, li { font-size: 13px; line-height: 1.45; margin: 0 0 8px; }
    .lead { color: #3f3f46; font-size: 13px; margin-bottom: 14px; }
    .ladder {
      background: #fff7ed;
      border: 1px solid #E78A3E;
      border-radius: 10px;
      padding: 10px 12px;
      font-weight: 800;
      color: #0a0a0b;
    }
    ol.steps { padding-left: 0; list-style: none; counter-reset: step; }
    ol.steps li {
      counter-increment: step;
      position: relative;
      padding-left: 36px;
      margin-bottom: 10px;
    }
    ol.steps li::before {
      content: counter(step);
      position: absolute;
      left: 0; top: -1px;
      width: 24px; height: 24px;
      border-radius: 6px;
      background: #E78A3E;
      color: #0a0a0b;
      font-weight: 800;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    ul { padding-left: 18px; }
    ul li { margin-bottom: 8px; }
    .card {
      display: flex;
      gap: 12px;
      border: 1.5px solid #E78A3E;
      background: #fafafa;
      border-radius: 12px;
      padding: 10px 12px;
      margin-bottom: 10px;
    }
    .card-n {
      flex: 0 0 28px;
      width: 28px; height: 28px;
      border-radius: 8px;
      background: #E78A3E;
      color: #0a0a0b;
      font-weight: 900;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sit { font-weight: 800; margin-bottom: 4px; }
    .act { color: #27272a; margin: 0; }
    .closing {
      margin-top: 18px;
      padding: 12px;
      border-radius: 12px;
      background: #0a0a0b;
      color: #fff;
      font-weight: 600;
    }
    .cover {
      width: 794px;
      height: 1123px;
      background: #0a0a0b;
      color: #fff;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 48px;
      font-family: Arial, Helvetica, sans-serif;
    }
    .cover::before, .cover::after {
      content: "";
      position: absolute;
      left: 0; right: 0;
      height: 12px;
      background: #E78A3E;
    }
    .cover::before { top: 0; }
    .cover::after { bottom: 0; }
    .cover-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(231,138,62,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(231,138,62,0.08) 1px, transparent 1px);
      background-size: 28px 28px;
      pointer-events: none;
    }
    .cover-stamp {
      width: 120px; height: 120px;
      border-radius: 999px;
      border: 4px solid #E78A3E;
      background: #fff;
      object-fit: cover;
      margin-bottom: 28px;
      position: relative;
      z-index: 1;
    }
    .cover-brand {
      color: #E78A3E;
      font-weight: 900;
      letter-spacing: 0.2em;
      font-size: 14px;
      margin-bottom: 14px;
      position: relative;
      z-index: 1;
    }
    .cover h1 {
      background: transparent;
      border: 0;
      padding: 0;
      color: #fff;
      font-size: 42px;
      line-height: 1.05;
      margin: 0 0 8px;
      position: relative;
      z-index: 1;
    }
    .cover-badge {
      margin-top: 22px;
      background: #E78A3E;
      color: #0a0a0b;
      font-weight: 900;
      font-size: 13px;
      padding: 10px 22px;
      border-radius: 999px;
      position: relative;
      z-index: 1;
    }
    .cover-sub {
      margin-top: 28px;
      color: #a1a1aa;
      font-size: 14px;
      line-height: 1.5;
      position: relative;
      z-index: 1;
    }
    .cover-meta {
      margin-top: 64px;
      color: #E78A3E;
      font-weight: 800;
      font-size: 12px;
      letter-spacing: 0.12em;
      position: relative;
      z-index: 1;
    }
  `;
}

function buildCoverHtml(stampSrc: string): string {
  return `
    <div class="cover">
      <div class="cover-grid"></div>
      <img class="cover-stamp" src="${stampSrc}" alt="ROCO stamp" />
      <div class="cover-brand">ROCO OS</div>
      <h1>STAFF &amp; ADMIN<br/>TRAINING MANUAL</h1>
      <div class="cover-badge">FIRST TRAINING SESSION</div>
      <div class="cover-sub">
        Guest journey · Floor ops · Remote claims<br/>
        Bills &amp; splits · 50 live scenarios · Checklists
      </div>
      <div class="cover-meta">TABLES 1–13 + REMOTE ORDERING</div>
    </div>
  `;
}

function buildPageHtml(sectionData: ManualSection, pageNum: number, total: number, stampSrc: string): string {
  return `
    <div class="page">
      <p class="kicker">ROCO OS Training · Keep near the staff kiosk</p>
      <img class="stamp" src="${stampSrc}" alt="" />
      <h1>${escapeHtml(sectionData.title)}</h1>
      ${sectionData.html}
      <div class="page-foot">
        <span>ROCO OS · STAFF TRAINING MANUAL</span>
        <span>${pageNum} / ${total}</span>
      </div>
    </div>
  `;
}

async function renderNodeToCanvas(node: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(node, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
    logging: false,
  });
}

/**
 * Builds and downloads a branded multi-page ROCO OS training PDF.
 * Uses HTML + html2canvas so browser fonts render cleanly (no jsPDF text spacing bugs).
 */
export async function downloadTrainingManualPdf(): Promise<void> {
  const stampSrc = ROCO_STAMP_LOGO_LOCAL_URL;
  const sections = buildSections();
  const totalPages = sections.length + 1;

  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText =
    "position:fixed;left:-10000px;top:0;width:794px;opacity:0;pointer-events:none;z-index:-1;";
  const style = document.createElement("style");
  style.textContent = manualStyles();
  host.appendChild(style);
  document.body.appendChild(host);

  try {
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4", compress: true });

    // Cover
    const coverWrap = document.createElement("div");
    coverWrap.innerHTML = buildCoverHtml(stampSrc);
    host.appendChild(coverWrap);
    const coverCanvas = await renderNodeToCanvas(coverWrap.firstElementChild as HTMLElement);
    pdf.addImage(coverCanvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, PAGE_W, PAGE_H);
    host.removeChild(coverWrap);

    // Content pages
    for (let i = 0; i < sections.length; i++) {
      const wrap = document.createElement("div");
      wrap.innerHTML = buildPageHtml(sections[i], i + 2, totalPages, stampSrc);
      host.appendChild(wrap);
      const canvas = await renderNodeToCanvas(wrap.firstElementChild as HTMLElement);
      pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, PAGE_W, PAGE_H);
      host.removeChild(wrap);
    }

    pdf.save(`ROCO-OS-Training-Manual-${new Date().toISOString().slice(0, 10)}.pdf`);
  } finally {
    host.remove();
  }
}
