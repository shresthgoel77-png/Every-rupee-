    /* ═══════════════════════════════════════════
    KHATABOOK TAX SAVER — SCRIPT.JS
    Mock Data + Full Simulation Logic
    ═══════════════════════════════════════════ */

    "use strict";

    // === DEBUG & FIXED CONNECTION ISSUE ===
    const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? `http://${window.location.hostname}:5000` 
      : "http://localhost:5000";

    console.log("Khatabook SCRIPT.JS initialized at:", API_BASE);
    
    let currentUser = JSON.parse(localStorage.getItem("khataUser")) || null;
    let sessionToken = localStorage.getItem("khataToken") || null;

    /* ─────────── MOCK TRANSACTION DATASET ─────────── */
    let MOCK_TRANSACTIONS = [
    { date: "2024-04-05", desc: "Rent – Lajpat Nagar Office",       amount: 45000,  category: "Office Rent",         type: "Deductible",   gstRate: 0,    confidence: 98, flag: null },
    { date: "2024-04-12", desc: "Supplier: Ravi Plastics Pvt Ltd",   amount: 68000,  category: "B2B Purchase",        type: "GST Eligible", gstRate: 0.18, confidence: 96, flag: null },
    { date: "2024-04-22", desc: "Staff Salary – April",              amount: 55000,  category: "Salary",              type: "Deductible",   gstRate: 0,    confidence: 99, flag: null },
    { date: "2024-05-03", desc: "Petrol – Field Visits (Cash)",      amount: 4800,   category: "Petrol / Fuel",       type: "Flagged",      gstRate: 0,    confidence: 72, flag: "Cash expense — ITC not eligible" },
    { date: "2024-05-14", desc: "Supplier: Anand Traders",           amount: 32000,  category: "B2B Purchase",        type: "GST Eligible", gstRate: 0.18, confidence: 94, flag: null },
    { date: "2024-05-19", desc: "Laptop – Dell Inspiron 15",         amount: 72000,  category: "Capital Equipment",   type: "Deductible",   gstRate: 0.18, confidence: 97, flag: null },
    { date: "2024-06-01", desc: "Mobile Phone – Business Use",       amount: 28000,  category: "Mobile / Telecom",    type: "GST Eligible", gstRate: 0.18, confidence: 88, flag: null },
    { date: "2024-06-11", desc: "Client Sales – Invoice #1204",      amount: 180000, category: "Business Income",     type: "Income",       gstRate: 0.18, confidence: 100, flag: null },
    { date: "2024-06-22", desc: "Internet & Cloud Hosting",          amount: 9500,   category: "Utilities",           type: "Deductible",   gstRate: 0.18, confidence: 95, flag: null },
    { date: "2024-07-08", desc: "Supplier: Metro Packaging",         amount: 41500,  category: "B2B Purchase",        type: "GST Eligible", gstRate: 0.18, confidence: 91, flag: null },
    { date: "2024-07-18", desc: "Office Furniture – Chairs x4",      amount: 24000,  category: "Capital Equipment",   type: "Deductible",   gstRate: 0.18, confidence: 86, flag: null },
    { date: "2024-07-29", desc: "Staff Salary – July",               amount: 55000,  category: "Salary",              type: "Deductible",   gstRate: 0,    confidence: 99, flag: null },
    { date: "2024-08-05", desc: "Petrol – Monthly (Cash)",           amount: 6200,   category: "Petrol / Fuel",       type: "Flagged",      gstRate: 0,    confidence: 70, flag: "Cash expense — not eligible" },
    { date: "2024-08-14", desc: "Supplier: Sunrise Electronics",     amount: 54000,  category: "B2B Purchase",        type: "GST Eligible", gstRate: 0.18, confidence: 93, flag: null },
    { date: "2024-08-23", desc: "Professional Fees – CA",            amount: 18000,  category: "Professional Fees",   type: "Deductible",   gstRate: 0.18, confidence: 97, flag: null },
    { date: "2024-09-02", desc: "Rent – Lajpat Nagar Office",        amount: 45000,  category: "Office Rent",         type: "Deductible",   gstRate: 0,    confidence: 98, flag: null },
    { date: "2024-09-18", desc: "Old Invoice from Oct 2023",         amount: 22000,  category: "B2B Purchase",        type: "Flagged",      gstRate: 0.18, confidence: 65, flag: "Transaction older than 180 days — ITC may lapse" },
    { date: "2024-09-26", desc: "Client Sales – Invoice #1380",      amount: 220000, category: "Business Income",     type: "Income",       gstRate: 0.18, confidence: 100, flag: null },
    { date: "2024-10-07", desc: "Supplier: Global Packaging Co",     amount: 39000,  category: "B2B Purchase",        type: "GST Eligible", gstRate: 0.18, confidence: 90, flag: null },
    { date: "2024-10-16", desc: "Insurance Premium – Business",      amount: 14500,  category: "Insurance",           type: "Deductible",   gstRate: 0.18, confidence: 94, flag: null },
    { date: "2024-10-27", desc: "Staff Salary – October",            amount: 55000,  category: "Salary",              type: "Deductible",   gstRate: 0,    confidence: 99, flag: null },
    { date: "2024-11-05", desc: "Supplier: BlueStar Chemicals",      amount: 47800,  category: "B2B Purchase",        type: "GST Eligible", gstRate: 0.18, confidence: 92, flag: null },
    { date: "2024-11-14", desc: "Office Printing & Stationery",      amount: 3200,   category: "Stationery",          type: "Deductible",   gstRate: 0.18, confidence: 80, flag: null },
    { date: "2024-11-22", desc: "Advertising – Facebook Ads",        amount: 12000,  category: "Marketing",           type: "Deductible",   gstRate: 0.18, confidence: 89, flag: null },
    { date: "2024-12-01", desc: "Rent – Lajpat Nagar Office",        amount: 45000,  category: "Office Rent",         type: "Deductible",   gstRate: 0,    confidence: 98, flag: null },
    { date: "2024-12-09", desc: "Client Sales – Invoice #1504",      amount: 195000, category: "Business Income",     type: "Income",       gstRate: 0.18, confidence: 100, flag: null },
    { date: "2024-12-20", desc: "Staff Salary – December",           amount: 55000,  category: "Salary",              type: "Deductible",   gstRate: 0,    confidence: 99, flag: null },
    { date: "2025-01-08", desc: "Supplier: NovaTech Components",     amount: 88000,  category: "B2B Purchase",        type: "GST Eligible", gstRate: 0.18, confidence: 95, flag: null },
    { date: "2025-01-17", desc: "Petrol – January (Mixed Use, Cash)",amount: 5400,   category: "Petrol / Fuel",       type: "Flagged",      gstRate: 0,    confidence: 60, flag: "Cash + personal mixed-use — ITC disallowed" },
    { date: "2025-01-28", desc: "Employee Training Program",         amount: 16000,  category: "Training & Dev",      type: "Deductible",   gstRate: 0.18, confidence: 85, flag: null },
    { date: "2025-02-06", desc: "Supplier: Prism Packaging",         amount: 35600,  category: "B2B Purchase",        type: "GST Eligible", gstRate: 0.18, confidence: 93, flag: null },
    { date: "2025-02-18", desc: "Electricity Bill – Office",         amount: 8200,   category: "Utilities",           type: "Deductible",   gstRate: 0.18, confidence: 96, flag: null },
    { date: "2025-02-26", desc: "Staff Salary – February",           amount: 55000,  category: "Salary",              type: "Deductible",   gstRate: 0,    confidence: 99, flag: null },
    { date: "2025-03-07", desc: "Supplier: Horizon Metals Ltd",      amount: 62000,  category: "B2B Purchase",        type: "GST Eligible", gstRate: 0.18, confidence: 91, flag: null },
    { date: "2025-03-19", desc: "Client Sales – Invoice #1698",      amount: 240000, category: "Business Income",     type: "Income",       gstRate: 0.18, confidence: 100, flag: null },
    { date: "2025-03-28", desc: "Annual Subscription – Tally ERP",  amount: 12000,  category: "Software / SaaS",     type: "Deductible",   gstRate: 0.18, confidence: 90, flag: null },
    ];

    const FLAGS = [
  {
    id: "warn-1",
    severity: "high",
    title: "Cash Limit Exceeded (Sec 40A(3))",
    text: "You have 1 transaction of ₹15,000 paid in cash. Income Tax rules disallow 100% of cash expenses exceeding ₹10,000 per day per person.",
    action: "Switch to UPI/Bank Transfer immediately to claim deduction.",
    icon: "🚫"
  },
  {
    id: "warn-2",
    severity: "high",
    title: "Blocked ITC (Section 17(5))",
    text: "₹12,000 spent on food & beverages for staff. GST ITC cannot be claimed on food, cab rentals, or club memberships.",
    action: "Claim as 'Business Expense' for Income Tax, but exclude from GSTR-3B.",
    icon: "🍔"
  },
  {
    id: "warn-3",
    severity: "medium",
    title: "180-Day Payment Rule Danger",
    text: "Supplier 'Global Packaging' invoice is 175 days old. If not paid within 180 days, claimed ITC must be reversed with 18% interest.",
    action: "Settle payment before FY end to retain your ITC.",
    icon: "⏳"
  },
  {
    id: "warn-4",
    severity: "medium",
    title: "TDS Deduction Missing",
    text: "₹45,000 paid for 'Office Rent'. TDS @ 10% (Sec 194I) may be applicable. Failure to deduct means 30% of this expense is disallowed.",
    action: "Check if landlord provided Form 15G/H, or deduct TDS now.",
    icon: "🏢"
  },
  {
    id: "warn-5",
    severity: "low",
    title: "Maximize Depreciation Benefit",
    text: "₹72,000 spent on a Laptop. Ensure you claim 40% accelerated depreciation (Computers block) instead of standard 15%.",
    action: "Inform your CA to place this under the 'Computers' asset block.",
    icon: "💻"
  }
];

    /* ─────────── HELPERS ─────────── */
    function animateCounter(id, target, prefix = "") {
  const el = document.getElementById(id);
  if (!el) return;

  const duration = 1200; // 1.2 seconds for the animation
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out effect so the counter slows down nicely at the end
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    const currentVal = Math.round(target * easeProgress);

    // Format with Indian numbering system (e.g., 1,50,000)
    el.textContent = prefix + currentVal.toLocaleString("en-IN");

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}
    const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
    const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });

    function showToast(msg, duration = 3200) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), duration);
    }

    function txSavings(t) {
    return {
        itcSaving:       t.type === "GST Eligible" ? t.amount * t.gstRate : 0,
        incomeTaxSaving: t.type === "Deductible"   ? t.amount * 0.30      : 0,
    };
    }

    function computeSavings(txns) {
    let itcBase = 0, deductibleBase = 0;
    txns.forEach(t => {
        if (t.type === "GST Eligible") itcBase += t.amount * t.gstRate;
        if (t.type === "Deductible")   deductibleBase += t.amount;
    });
    return {
        itcSaving:        Math.round(itcBase),
        incomeTaxSaving:  Math.round(deductibleBase * 0.30),
        total:            Math.round(itcBase + deductibleBase * 0.30),
        deductibleBase,
    };
    }

    /* ─────────── FILE UPLOAD ─────────── */
    const dropZone  = document.getElementById("uploadZone");
    const fileInput = document.getElementById("fileInput");
    const fileList  = document.getElementById("fileList");
    let uploadedFiles = [];

    fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

    dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.classList.add("drag-over"); });
    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
    dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    handleFiles(e.dataTransfer.files);
    });

    function handleFiles(files) {
    Array.from(files).forEach(f => {
        if (!uploadedFiles.find(u => u.name === f.name)) {
        uploadedFiles.push(f);
        renderFileItem(f);
        }
    });
    }

    function renderFileItem(file) {
    const sizeKB = typeof file.size === "number" ? (file.size / 1024).toFixed(1) + " KB" : "183.1 KB";
    const item = document.createElement("div");
    item.className = "file-item";
    item.innerHTML = `<span class="file-item-icon">📄</span><span class="file-item-name">${file.name}</span><span class="file-item-size">${sizeKB}</span>`;
    fileList.appendChild(item);
    }

    /* ─────────── ANALYZE ─────────── */
    document.getElementById("analyzeBtn").addEventListener("click", () => {
    const gstin = document.getElementById("gstinInput").value.trim() || "29AAFCD5862M1Z8";
    const fy    = document.getElementById("fySelect").value;
    document.getElementById("gstinInput").value = gstin;
    showProcessing(gstin, fy);
    });

    /* ─────────── PROCESSING ─────────── */
    /* ─────────── PROCESSING ─────────── */
function showProcessing(gstin, fy) {
  const overlay = document.getElementById("processingOverlay");
  const bar     = document.getElementById("progressFill"); // Fixed ID
  const steps   = ["step1","step2","step3","step4","step5"];
  const titles  = ["Analyzing transactions...","Detecting tax savings...","Computing GST ITC...","Calculating deductions...","Finalizing insights..."];
  const subs    = ["Reading your Khatabook data","Scanning 36 entries","Checking GST eligibility","Applying income tax rules","Almost done — generating report"];

  overlay.style.display = "flex"; // Changed from active class to style display
  bar.style.width = "0%";

  const timings = [300, 900, 1700, 2500, 3300];
  steps.forEach((id, i) => {
    setTimeout(() => {
      if (i > 0) document.getElementById(steps[i-1]).className = "proc-step done";
      document.getElementById(id).className = "proc-step active";
      document.getElementById("processingTitle").textContent = titles[i]; // Fixed ID
      document.getElementById("processingSub").textContent   = subs[i]; // Fixed ID
      bar.style.width = ((i + 1) * 20) + "%";
    }, timings[i]);
  });

  setTimeout(() => {
    document.getElementById(steps[4]).className = "proc-step done";
    bar.style.width = "100%";
    setTimeout(() => {
      overlay.style.display = "none"; // Hide overlay
      renderDashboard(gstin, fy);
    }, 500);
  }, 4100);
}

    /* ─────────── DASHBOARD ─────────── */
function renderDashboard(gstin, fy) {
  const { itcSaving, incomeTaxSaving, total, deductibleBase } = computeSavings(MOCK_TRANSACTIONS);

  const dashboard = document.getElementById("dashboard"); // Fixed ID
  dashboard.style.display = "block"; 
  setTimeout(() => {
    dashboard.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);

  // Removed fyLabel as it is not in the HTML
  animateCounter("totalSavingsDisplay", total, "₹");
  document.getElementById("txnCountDisplay").textContent = MOCK_TRANSACTIONS.length; // Fixed ID

  animateCounter("itcAmount",        itcSaving,       "₹"); // Fixed ID
  animateCounter("incomeTaxSavings", incomeTaxSaving, "₹"); // Fixed ID
  animateCounter("totalSavings",     total,           "₹"); // Fixed ID

  drawPie(itcSaving, incomeTaxSaving);
  renderTable(MOCK_TRANSACTIONS, "all");
  renderInsights(itcSaving, deductibleBase);
  renderFlags();

  window._reportData = { gstin, fy, itcSaving, incomeTaxSaving, total, deductibleBase };
  showToast("✅ Analysis complete! " + fmt(total) + " in savings found.");
}

/* ─────────── PIE CHART ─────────── */
function drawPie(itc, it) {
  const canvas = document.getElementById("pieChart"); // Fixed ID
  // ... keep the rest of the drawPie logic exactly the same ...
    const ctx = canvas.getContext("2d");
    const cx = 100, cy = 100, r = 85;
    const total = itc + it;
    const slices = [
        { val: itc, color: "#7EE8A2", label: "GST ITC",     pct: Math.round(itc/total*100) },
        { val: it,  color: "#93C5FD", label: "Income Tax",  pct: Math.round(it/total*100) },
    ];
    const angles = slices.map(s => (s.val / total) * Math.PI * 2);

    let prog = 0;
    function frame() {
        ctx.clearRect(0, 0, 200, 200);
        let a = -Math.PI / 2;
        slices.forEach((s, i) => {
        const end = a + angles[i] * Math.min(prog, 1);
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, a, end); ctx.closePath();
        ctx.fillStyle = s.color; ctx.fill();
        a = end;
        });
        // Donut hole
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.52, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(15,72,38,0.92)"; ctx.fill();
        // Center label
        ctx.textAlign = "center";
        if (prog >= 1) {
        ctx.fillStyle = "rgba(255,255,255,.55)";
        ctx.font = "500 10px 'DM Sans', sans-serif";
        ctx.fillText("TOTAL SAVINGS", cx, cy - 8);
        ctx.fillStyle = "#7EE8A2";
        ctx.font = "bold 12px 'Syne', sans-serif";
        const shortVal = total >= 100000 ? "₹" + (total/100000).toFixed(1) + "L" : fmt(total);
        ctx.fillText(shortVal, cx, cy + 8);
        } else {
        ctx.fillStyle = "#7EE8A2";
        ctx.font = "bold 13px 'Syne', sans-serif";
        ctx.fillText(Math.round(prog * 100) + "%", cx, cy + 5);
        }
        prog += 0.022;
        if (prog < 1) requestAnimationFrame(frame);
    }
    frame();

    document.getElementById("pieLegend").innerHTML = slices.map(s => `
        <div class="legend-item">
        <div class="legend-dot" style="background:${s.color}"></div>
        <span>${s.label}: <strong>${fmt(s.val)}</strong> (${s.pct}%)</span>
        </div>
    `).join("");
    }

    /* ─────────── TABLE ─────────── */
let currentFilter = "all";
let currentPage   = 1;
const PAGE_SIZE   = 8;

function renderTable(txns, filter) {
  currentFilter = filter;
  currentPage   = 1;
  const filtered = filter === "all" ? txns : txns.filter(t => t.type === filter);
  window._filteredTxns = filtered;
  renderPage(filtered);
}

function renderPage(filtered) {
  const tbody      = document.getElementById("txnBody");
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice      = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const typeMap = {
    "GST Eligible": "cat-gst",
    "Deductible":   "cat-tax",
    "Income":       "cat-income",
    "Flagged":      "cat-flagged",
  };

  tbody.innerHTML = slice.map(t => {
    const { itcSaving, incomeTaxSaving } = txSavings(t);
    const sav = Math.round(itcSaving + incomeTaxSaving);
    const cls = typeMap[t.type] || "cat-neutral";
    const cc  = t.confidence >= 90 ? "high" : t.confidence >= 75 ? "mid" : "low";

    return `<tr>
      <td style="white-space:nowrap;color:var(--text3);font-size:12px">${fmtDate(t.date)}</td>
      <td>
        <div style="font-weight:500;font-size:13px;max-width:210px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${t.desc}">${t.desc}</div>
        ${t.flag ? `<div style="font-size:11px;color:var(--red);margin-top:2px">⚠ ${t.flag}</div>` : ""}
      </td>
      <td style="font-weight:600;white-space:nowrap">${fmt(t.amount)}</td>
      <td><span class="cat-pill ${cls}" style="font-size:11px">${t.category}</span></td>
      <td><span class="cat-pill ${cls}" style="font-size:10.5px">${t.type}</span></td>
      <td>
        <div class="conf-bar-wrap">
          <div class="conf-bar"><div class="conf-fill ${cc}" style="width:${t.confidence}%"></div></div>
          <span class="conf-num">${t.confidence}%</span>
        </div>
      </td>
      <td>${sav > 0 ? `<span class="sav-amt">${fmt(sav)}</span>` : `<span class="sav-amt zero">—</span>`}</td>
    </tr>`;
  }).join("");

  // FIX: Safely check if pagination UI exists before updating it
  const txnCountLabel = document.getElementById("txnCountLabel");
  if (txnCountLabel) txnCountLabel.textContent = `Showing ${filtered.length} transactions`;

  const pgInfo = document.getElementById("pgInfo");
  if (pgInfo) pgInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  const prevPage = document.getElementById("prevPage");
  if (prevPage) prevPage.disabled = currentPage === 1;

  const nextPage = document.getElementById("nextPage");
  if (nextPage) nextPage.disabled = currentPage === totalPages;
}

// FIX: Safely check if buttons exist before adding event listeners
const prevPageBtn = document.getElementById("prevPage");
if (prevPageBtn) {
  prevPageBtn.addEventListener("click", () => { 
    if (currentPage > 1) { currentPage--; renderPage(window._filteredTxns); }
  });
}

const nextPageBtn = document.getElementById("nextPage");
if (nextPageBtn) {
  nextPageBtn.addEventListener("click", () => {
    const tp = Math.ceil((window._filteredTxns || []).length / PAGE_SIZE);
    if (currentPage < tp) { currentPage++; renderPage(window._filteredTxns); }
  });
}

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTable(MOCK_TRANSACTIONS, btn.dataset.filter);
  });
});
    /* ─────────── INSIGHTS ─────────── */
    function renderInsights(itcSaving, deductibleBase) {
    const rentTotal = MOCK_TRANSACTIONS.filter(t => t.category === "Office Rent").reduce((s,t)=>s+t.amount,0);
    const salTotal  = MOCK_TRANSACTIONS.filter(t => t.category === "Salary").reduce((s,t)=>s+t.amount,0);
    const cashFuel  = MOCK_TRANSACTIONS.filter(t => t.type === "Flagged" && t.category === "Petrol / Fuel").reduce((s,t)=>s+t.amount,0);

    const items = [
        { text: "Claim GST Input Tax Credit on all B2B supplier invoices under GSTR-3B",        amt: fmt(itcSaving) },
        { text: "Deduct entire salary payroll under Section 37 (business expenditure)",          amt: fmt(salTotal * 0.30) },
        { text: "Claim office rent deduction under Section 37 — maintain rent agreement on file",amt: fmt(rentTotal * 0.30) },
        { text: "Depreciate laptop at 40% (WDVM) under Section 32 block of assets",             amt: "₹28,800" },
        { text: "Switch petrol/fuel payments to UPI to make them GST and ITC eligible",          amt: fmt(cashFuel * 0.18) },
        { text: "Reconcile GSTR-2B monthly to prevent ITC mismatch and supplier return gaps",    amt: fmt(itcSaving * 0.05) },
    ];

    document.getElementById("insightsList").innerHTML = items.map((ins, i) => `
        <li class="insight-item">
        <span class="insight-num">${i+1}</span>
        <span class="insight-text">${ins.text}</span>
        <span class="insight-amt">${ins.amt}</span>
        </li>
    `).join("");
    document.getElementById("insightCount").textContent = items.length + " insights";
    }

    /* ─────────── FLAGS ─────────── */
    // function renderFlags() {
    // document.getElementById("flagsList").innerHTML = FLAGS.map(f => `
    //     <li class="flag-item"><span class="flag-icon">${f.icon}</span><span>${f.text}</span></li>
    // `).join("");
    // document.getElementById("flagCount").textContent = FLAGS.length + " issues";
    // }

    function renderFlags() {
  const grid = document.getElementById("flagsGrid");
  const countLabel = document.getElementById("flagCount");

  if (!grid) return; // Safety check

  if (countLabel) countLabel.textContent = FLAGS.length;

  // Modern styling dictionaries for our cards
  const styles = {
    high:   { bg: "#fef2f2", border: "#ef4444", text: "#991b1b", badgeBg: "#f87171", badgeText: "#ffffff" },
    medium: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e", badgeBg: "#fbbf24", badgeText: "#78350f" },
    low:    { bg: "#f0fdfa", border: "#14b8a6", text: "#115e59", badgeBg: "#2dd4bf", badgeText: "#134e4a" }
  };

  grid.innerHTML = FLAGS.map(f => {
    const s = styles[f.severity];
    return `
      <div style="background: ${s.bg}; border-left: 5px solid ${s.border}; color: ${s.text}; padding: 18px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.04); display: flex; flex-direction: column; gap: 10px; transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 12px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='none'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.04)'">
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <span style="font-size: 24px; line-height: 1;">${f.icon}</span>
          <span style="background: ${s.badgeBg}; color: ${s.badgeText}; padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
            ${f.severity} Risk
          </span>
        </div>
        
        <h4 style="margin: 0; font-size: 15px; font-weight: 700; color: #111827;">${f.title}</h4>
        
        <p style="margin: 0; font-size: 12.5px; line-height: 1.5; opacity: 0.85;">${f.text}</p>
        
        <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.06);">
          <strong style="font-size: 12px; color: #111827;">💡 Action:</strong> 
          <span style="font-size: 12px; font-weight: 500;">${f.action}</span>
        </div>
      </div>
    `;
  }).join("");
}

    /* ─────────── SCROLL BUTTONS ─────────── */
    document.getElementById("scrollToReport").addEventListener("click", () => {
    document.getElementById("reportSection").scrollIntoView({ behavior: "smooth" });
    });
    document.getElementById("shareBtn").addEventListener("click", () => {
    showToast("📋 Summary link copied to clipboard!");
    });

    /* ─────────── GENERATE REPORT ─────────── */
    document.getElementById("generateReportBtn").addEventListener("click", function() {
    const data = window._reportData;
    if (!data) { showToast("⚠ Please run analysis first!"); return; }

    this.textContent = "⏳ Generating...";
    this.disabled = true;

    setTimeout(() => {
        this.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 13l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/></svg> Report Generated ✓`;
        this.style.background = "#1A6B3C";
        this.disabled = false;
        renderReport(data);
        document.getElementById("reportPreview").style.display = "block";
        setTimeout(() => {
        document.getElementById("reportPreview").scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        showToast("📄 CA-ready report generated!");
    }, 1800);
    });

    /* ─────────── RENDER REPORT ─────────── */
    function renderReport(data) {
    document.getElementById("rGSTIN").textContent = data.gstin;
    document.getElementById("rFY").textContent    = "FY " + data.fy;
    document.getElementById("rDate").textContent  = new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" });

    const totalIncome = MOCK_TRANSACTIONS.filter(t => t.type === "Income").reduce((s,t) => s + t.amount, 0);
    const totalExp    = MOCK_TRANSACTIONS.filter(t => t.type !== "Income").reduce((s,t) => s + t.amount, 0);

    document.getElementById("rExecGrid").innerHTML = [
        { val: fmt(totalIncome),          lbl: "Total Revenue" },
        { val: fmt(totalExp),             lbl: "Total Expenses" },
        { val: fmt(data.itcSaving),       lbl: "ITC Recoverable" },
        { val: fmt(data.incomeTaxSaving), lbl: "IT Savings" },
        { val: fmt(data.total),           lbl: "Net Savings" },
        { val: MOCK_TRANSACTIONS.length,  lbl: "Txns Analyzed" },
    ].map(e => `<div class="rdoc-exec-item"><div class="rdoc-exec-val">${e.val}</div><div class="rdoc-exec-lbl">${e.lbl}</div></div>`).join("");

    document.getElementById("rExecPara").textContent =
        `Business GSTIN ${data.gstin} has an identified savings of ${fmt(data.total)} for FY ${data.fy}. ` +
        `GST Input Tax Credit of ${fmt(data.itcSaving)} is recoverable from eligible B2B supplier invoices. ` +
        `Income tax deductions of ${fmt(data.deductibleBase)} reduce the taxable income, ` +
        `resulting in a net tax benefit of ${fmt(data.incomeTaxSaving)} at the applicable 30% slab. ` +
        `This report has been auto-generated from Khatabook transaction data for your Chartered Accountant's review and filing.`;

    // GST table
    const gstGroups = {};
    MOCK_TRANSACTIONS.filter(t => t.type === "GST Eligible" || t.type === "Income").forEach(t => {
        if (!gstGroups[t.category]) gstGroups[t.category] = { taxable: 0, gst: 0 };
        gstGroups[t.category].taxable += t.amount;
        gstGroups[t.category].gst    += t.amount * t.gstRate;
    });

    document.getElementById("rGSTBody").innerHTML = Object.entries(gstGroups).map(([cat, v]) => `
        <tr>
        <td>${cat}</td>
        <td>${fmt(v.taxable)}</td>
        <td>${fmt(v.gst)}</td>
        <td>${v.gst > 0 ? `<span style="color:var(--green);font-weight:600">${fmt(v.gst)}</span>` : "—"}</td>
        <td><span style="font-size:11px;color:var(--green);background:var(--green-lt);padding:2px 8px;border-radius:10px;font-weight:600">Eligible</span></td>
        </tr>
    `).join("");

    // IT table
    const itGroups = {};
    MOCK_TRANSACTIONS.filter(t => t.type === "Deductible").forEach(t => {
        if (!itGroups[t.category]) itGroups[t.category] = 0;
        itGroups[t.category] += t.amount;
    });

    document.getElementById("rITBody").innerHTML = Object.entries(itGroups).map(([cat, amt]) => `
        <tr>
        <td>${cat}</td>
        <td>${fmt(amt)}</td>
        <td>${fmt(amt)}</td>
        <td><span style="color:var(--green);font-weight:600">${fmt(amt * 0.30)}</span></td>
        </tr>
    `).join("");

    // Flagged items
    const flaggedTxns = MOCK_TRANSACTIONS.filter(t => t.type === "Flagged");
    document.getElementById("rFlagList").innerHTML = [
        ...flaggedTxns.map(t => `<li>⚠ <strong>${t.desc}</strong> (${fmt(t.amount)}) — ${t.flag}</li>`),
        ...FLAGS.map(f => `<li>${f.icon} ${f.text}</li>`),
    ].join("");
    }

    /* ─────────── DOWNLOAD BUTTONS ─────────── */
    document.getElementById("dlPDF").addEventListener("click", () => {
    const content = [
        "KHATABOOK TAX SAVER — CA REPORT",
        "GSTIN: " + (window._reportData?.gstin || "N/A"),
        "FY: " + (window._reportData?.fy || "N/A"),
        "Generated: " + new Date().toLocaleDateString("en-IN"),
        "",
        "TOTAL POTENTIAL SAVINGS: " + fmt(window._reportData?.total || 0),
        "GST ITC Recoverable: " + fmt(window._reportData?.itcSaving || 0),
        "Income Tax Savings: " + fmt(window._reportData?.incomeTaxSaving || 0),
        "",
        "This report is system-generated. Review with your CA before filing.",
    ].join("\n");

    const blob = new Blob([content], { type: "application/octet-stream" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "KhatabookTaxReport_CA.pdf";
    a.click();
    showToast("📥 PDF downloaded!");
    });

    document.getElementById("dlExcel").addEventListener("click", () => {
    const rows = [
        ["Date", "Description", "Amount", "Category", "Type", "GST ITC Saving", "IT Saving", "Total Saving"],
        ...MOCK_TRANSACTIONS.map(t => {
        const { itcSaving, incomeTaxSaving } = txSavings(t);
        return [t.date, `"${t.desc}"`, t.amount, t.category, t.type, Math.round(itcSaving), Math.round(incomeTaxSaving), Math.round(itcSaving + incomeTaxSaving)];
        }),
        [],
        ["", "", "", "", "TOTALS", Math.round(window._reportData?.itcSaving || 0), Math.round(window._reportData?.incomeTaxSaving || 0), Math.round(window._reportData?.total || 0)],
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "KhatabookTaxReport_Transactions.csv";
    a.click();
    showToast("📊 Excel/CSV downloaded!");
    });

    document.getElementById("dlEmail").addEventListener("click", () => {
    const sub  = encodeURIComponent("GST & Income Tax Report – Khatabook Tax Saver");
    const body = encodeURIComponent(
        "Dear CA,\n\nPlease find the tax report summary generated via Khatabook Tax Saver.\n\n" +
        "Business GSTIN: " + (window._reportData?.gstin || "N/A") + "\n" +
        "Financial Year: FY " + (window._reportData?.fy || "N/A") + "\n" +
        "Total Savings Identified: " + fmt(window._reportData?.total || 0) + "\n" +
        "  — GST ITC Recoverable: " + fmt(window._reportData?.itcSaving || 0) + "\n" +
        "  — Income Tax Savings:  " + fmt(window._reportData?.incomeTaxSaving || 0) + "\n\n" +
        "Please review the full report (attached) and advise on filing.\n\nRegards"
    );
    window.location.href = `mailto:?subject=${sub}&body=${body}`;
    showToast("📧 Email client opened!");
    });

    /* ─────────── GSTIN INPUT VALIDATION ─────────── */
    document.getElementById("gstinInput").addEventListener("input", function() {
    this.value = this.value.toUpperCase();
    const hint = this.parentElement.querySelector(".field-hint");
    if (this.value.length === 15) {
        hint.textContent = "✅ Valid GSTIN format";
        hint.style.color = "var(--green)";
    } else if (this.value.length > 0) {
        hint.textContent = `${this.value.length}/15 characters`;
        hint.style.color = "var(--gold)";
    } else {
        hint.textContent = "Your 15-digit GST Identification Number";
        hint.style.color = "";
    }
    });

    /* ─────────── SCROLL OBSERVER ─────────── */
    const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
    { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

    /* ─────────── DEMO SEED ─────────── */
    window.addEventListener("load", () => {
    renderFileItem({ name: "Khatabook_FY2024-25_LedgerExport.pdf", size: 187340 });
    // === INITIALIZE SIMPLE AUTH ===
    checkAuthStatus();
    if (currentUser) loadUserData();
    });

    // === ADDED SIMPLE EMAIL LOGIN FUNCTIONS ===
    function isValidEmail(email) {
      if (!email || typeof email !== 'string') return false;
      const emailParts = email.split('@');
      if (emailParts.length !== 2) return false;
      const [local, domain] = emailParts;
      if (local.length < 3) return false;
      const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'rediffmail.com', 'zoho.com'];
      const hasValidDomain = commonDomains.some(d => domain.toLowerCase().includes(d)) || domain.includes('.');
      if (!hasValidDomain) return false;
      const numbersCount = (local.match(/\d/g) || []).length;
      if (numbersCount > local.length * 0.5 && local.length > 5) return false;
      if (/^[a-z0-9]{1,4}$/i.test(local)) return false;
      return true;
    }

    async function handleEmailLogin() {
      const emailInput = document.getElementById("loginEmail");
      const errorEl = document.getElementById("loginError");
      const email = emailInput.value.trim();

      if (!isValidEmail(email)) {
        errorEl.textContent = "Please enter a valid business email.";
        errorEl.style.display = "block";
        return;
      }
      errorEl.style.display = "none";

      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        
        const data = await res.json();
        if (data.token) {
          currentUser = data.user;
          sessionToken = data.token;
          localStorage.setItem("khataUser", JSON.stringify(currentUser));
          localStorage.setItem("khataToken", sessionToken);
          
          showToast("✅ Welcome back!");
          closeLoginModal();
          checkAuthStatus();
          loadUserData();
        } else {
          errorEl.textContent = data.error || "Login failed.";
          errorEl.style.display = "block";
        }
      } catch (err) {
        console.error("Login Error:", err);
        showToast("❌ Connection error. Is the server running?");
      }
    }

    function switchTab(tab) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById(`${tab}Tab`).classList.add('active');
      document.getElementById("loginError").style.display = "none";
    }

    function checkAuthStatus() {
      const loginBtn = document.getElementById("loginBtn");
      const userProfile = document.getElementById("userProfile");
      const authOverlay = document.getElementById("authOverlay");

      if (currentUser && sessionToken) {
        loginBtn.style.display = "none";
        userProfile.style.display = "flex";
        authOverlay.style.display = "none";
        document.getElementById("userEmailDisplay").textContent = currentUser.email;
      } else {
        loginBtn.style.display = "block";
        userProfile.style.display = "none";
        authOverlay.style.display = "flex";
      }
    }

    async function loadUserData() {
      if (!sessionToken) return;
      try {
        const res = await fetch(`${API_BASE}/api/khata`, {
          headers: { "Authorization": `Bearer ${sessionToken}` }
        });
        const data = await res.json();
        if (data.transactions && data.transactions.length > 0) {
          MOCK_TRANSACTIONS = data.transactions;
          const gstin = data.businessInfo?.gstin || "29AAFCD5862M1Z8";
          const fy    = data.businessInfo?.fy || "2024-25";
          renderDashboard(gstin, fy);
        }
      } catch (err) {
        console.error("Load Error:", err);
      }
    }

    async function addTransactionsToKhata(transactions) {
      // Pushes to local state
      MOCK_TRANSACTIONS.push(...transactions);
      
      // === ADDED BACKEND SYNC ===
      await syncToBackend();

      // Shows success toast
      if (typeof showToast === 'function') {
        showToast(`✅ Added ${transactions.length} transaction(s) to Khata!`);
      }

      // Refresh the dashboard
      const gstin = document.getElementById("gstinInput")?.value.trim() || "29AAFCD5862M1Z8";
      const fy    = document.getElementById("fySelect")?.value || "2024-25";
      renderDashboard(gstin, fy);
    }

    async function syncToBackend() {
      if (!sessionToken) return;
      try {
        await fetch(`${API_BASE}/api/khata/save`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionToken}`
          },
          body: JSON.stringify({ 
            businessInfo: { 
              gstin: document.getElementById("gstinInput")?.value || "",
              fy: document.getElementById("fySelect")?.value || ""
            },
            transactions: MOCK_TRANSACTIONS 
          })
        });
        console.log("Data synced to backend.");
      } catch (err) {
        console.error("Sync Error:", err);
      }
    }
    // Make it global for the scanner component
    window.syncToBackend = syncToBackend;
    window.addTransactionsToKhata = addTransactionsToKhata;
    window.MOCK_TRANSACTIONS = MOCK_TRANSACTIONS;

    function openLoginModal() {
      document.getElementById("loginModal").style.display = "flex";
    }

    function closeLoginModal() {
      document.getElementById("loginModal").style.display = "none";
    }

    function toggleLogoutDropdown() {
      const dropdown = document.getElementById("logoutDropdown");
      dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    }

    // Close dropdown when clicking outside
    window.addEventListener('click', (e) => {
      const profile = document.querySelector('.user-profile');
      const dropdown = document.getElementById("logoutDropdown");
      if (profile && !profile.contains(e.target) && dropdown) {
        dropdown.style.display = "none";
      }
    });

    function logout() {
      currentUser = null;
      sessionToken = null;
      localStorage.removeItem("khataUser");
      localStorage.removeItem("khataToken");
      showToast("👋 Logged out safely.");
      checkAuthStatus();
      location.reload(); // Refresh to reset state
    }