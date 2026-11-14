/* TrustLens is a client-side demonstration. Scores and findings below are simulated. */
(() => {
  "use strict";

  const STORE_KEY = "trustlens.workspace.v1";
  const views = {
    overview: ["Command center", "Your workspace at a glance"],
    media: ["Media forensics", "Review media evidence with a transparent, simulated analysis workflow."],
    threat: ["Phishing & threat analyzer", "Inspect a URL and review illustrative risk indicators. No live reputation lookup is performed."],
    osint: ["Identity intelligence", "Organize an identity research workflow. No external accounts or private data are queried."],
    graph: ["TrustGraph", "Explore the relationships attached to your investigation records."],
    score: ["Unified trust score", "A transparent summary calculated only from this demo workspace's case records."],
    reports: ["Investigations & reports", "Review case history and export your workspace records."],
    settings: ["Workspace settings", "Manage local preferences and the demo workspace."]
  };
  const seed = [
    { id: "TL-2026-014", title: "Executive voice note review", module: "Media forensics", kind: "Audio", risk: 72, status: "Review", detail: "Sample audio evidence", created: "2026-11-12T10:42:00.000Z" },
    { id: "TL-2026-013", title: "Vendor portal address", module: "Threat analyzer", kind: "URL", risk: 24, status: "Complete", detail: "https://portal.northstar.example", created: "2026-11-12T09:18:00.000Z" },
    { id: "TL-2026-012", title: "Partner identity review", module: "Identity intelligence", kind: "Identity", risk: 38, status: "Complete", detail: "Demo profile · partner onboarding", created: "2026-11-11T15:06:00.000Z" },
    { id: "TL-2026-011", title: "Quarterly evidence map", module: "TrustGraph", kind: "Evidence", risk: 16, status: "Complete", detail: "3 linked evidence records", created: "2026-11-10T12:24:00.000Z" }
  ];
  const root = document.getElementById("viewRoot");
  const sidebar = document.getElementById("sidebar");
  const filePicker = document.getElementById("filePicker");
  const state = { current: "overview", query: "", graphFilter: "all", theme: "dark", cases: seed, notificationsOpen: false };
  let toastTimer;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const dateLabel = value => new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
  const riskLabel = risk => risk >= 70 ? "Elevated" : risk >= 40 ? "Guarded" : "Low";
  const scoredCases = () => state.cases.filter(item => Number.isFinite(item.risk));
  const averageRisk = () => scoredCases().length ? Math.round(scoredCases().reduce((sum, item) => sum + item.risk, 0) / scoredCases().length) : 0;

  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ cases: state.cases, theme: state.theme }));
    } catch (error) {
      console.error("Could not save TrustLens workspace.", error);
      toast("Workspace could not be saved in this browser.");
    }
  }
  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (saved && Array.isArray(saved.cases)) state.cases = saved.cases;
      if (saved && (saved.theme === "dark" || saved.theme === "light")) state.theme = saved.theme;
    } catch (error) {
      console.error("Could not restore TrustLens workspace.", error);
      toast("Saved workspace data was unavailable; using this demo's sample data.");
    }
    document.documentElement.dataset.theme = state.theme;
  }
  function toast(message) {
    const node = document.getElementById("toast");
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("show"), 2800);
  }
  function header(title, description, action = "") {
    return `<div class="page-heading"><div><div class="eyebrow">TRUSTLENS INTELLIGENCE / ${esc(state.current.toUpperCase())}</div><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${action}</div>`;
  }
  function actionButton(label = "New investigation") {
    return `<button class="primary-button" data-action="new-case"><span>＋</span>${esc(label)}</button>`;
  }
  function riskPill(risk) {
    if (!Number.isFinite(risk)) return `<span class="risk-pill unscored">Not scored</span>`;
    const kind = risk >= 70 ? "high" : risk >= 40 ? "medium" : "low";
    return `<span class="risk-pill ${kind}"><i></i>${riskLabel(risk)} · ${risk}</span>`;
  }
  function rows(cases = state.cases) {
    if (!cases.length) return `<div class="empty-state"><span>⌕</span><b>No matching investigations</b><small>Try another search or start a new investigation.</small></div>`;
    return cases.map(item => `<tr><td><span class="case-id">${esc(item.id)}</span></td><td><b>${esc(item.title)}</b><small>${esc(item.detail)}</small></td><td><span class="module-type">${esc(item.module)}</span></td><td>${riskPill(item.risk)}</td><td><span class="status-text">${esc(item.status)}</span></td><td>${dateLabel(item.created)}</td><td><button class="row-action" data-case="${esc(item.id)}" aria-label="View ${esc(item.id)}">↗</button></td></tr>`).join("");
  }
  function table(cases = state.cases) {
    return `<div class="table-wrap"><table><thead><tr><th>CASE ID</th><th>INVESTIGATION</th><th>MODULE</th><th>RISK</th><th>STATUS</th><th>UPDATED</th><th></th></tr></thead><tbody>${rows(cases)}</tbody></table></div>`;
  }
  function metric(label, value, note, icon, color) {
    return `<article class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon ${color}">${icon}</span></div><strong>${value}</strong><small>${note}</small><div class="sparkline ${color}"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></article>`;
  }
  function overview() {
    const high = state.cases.filter(item => item.risk >= 70).length;
    return `${header("Digital trust command center", "A calm, evidence-led view of your digital risk landscape.", actionButton())}
      <section class="hero-panel"><div class="hero-copy"><div class="hero-tag"><span class="pulse"></span> TRUSTLENS INTELLIGENCE · DEMO</div><h2>See beyond the surface.<br><span>Make trust observable.</span></h2><p>Bring suspicious media, web addresses, identity research and connected evidence into one accountable workflow.</p><button class="hero-button" data-view="media">Start an analysis <span>→</span></button></div><div class="hero-orbit" aria-hidden="true"><div class="orbit-ring one"></div><div class="orbit-ring two"></div><div class="orbit-core"><span>✓</span></div><i class="orbit-dot a"></i><i class="orbit-dot b"></i><i class="orbit-dot c"></i><span class="orbit-caption">EVIDENCE<br>IN CONTEXT</span></div><div class="hero-grid"></div></section>
      <div class="section-heading"><div><h2>Workspace overview</h2><p>Activity from this local demo workspace.</p></div><span class="muted-label">SIMULATED WORKSPACE DATA</span></div>
      <section class="metric-grid">${metric("Investigations", state.cases.length, "Saved in this browser", "⌕", "blue")}${metric("Evidence records", state.cases.length, "Across analysis modules", "◈", "purple")}${metric("Elevated risk", String(high).padStart(2, "0"), "Illustrative score ≥ 70", "⚑", "amber")}${metric("Workspace trust", `${100 - averageRisk()}<small>/100</small>`, "Inverse of average demo risk", "◉", "green")}</section>
      <div class="content-grid"><section class="panel"><div class="panel-heading"><div><h2>Start an investigation</h2><p>Choose an evidence-led workflow.</p></div><span class="panel-link">MODULES</span></div><div class="module-grid">
        ${moduleCard("media","◈","Media forensics","Images, video & audio","blue")}${moduleCard("threat","⌁","Threat analyzer","URL indicators","purple")}${moduleCard("osint","◎","Identity intelligence","Research workflow","green")}${moduleCard("graph","⌘","TrustGraph","Evidence relationships","amber")}
      </div></section><section class="panel"><div class="panel-heading"><div><h2>Recent investigations</h2><p>Latest activity in this workspace.</p></div><button class="text-button" data-view="reports">View all →</button></div><div class="recent-list">${state.cases.slice(0, 4).map(item => `<button class="recent-row" data-case="${esc(item.id)}"><span class="recent-icon">${moduleGlyph(item.module)}</span><span class="recent-copy"><b>${esc(item.title)}</b><small>${esc(item.id)} · ${dateLabel(item.created)}</small></span>${riskPill(item.risk)}</button>`).join("")}</div></section></div>
      <footer class="footer-note"><span>© 2026 TrustLens Intelligence Platform</span><span>Simulated findings are not a substitute for professional security analysis.</span></footer>`;
  }
  function moduleCard(view, glyph, title, caption, color) {
    return `<button class="module-card" data-view="${view}"><span class="module-glyph ${color}">${glyph}</span><span><b>${title}</b><small>${caption}</small></span><i>↗</i></button>`;
  }
  function moduleGlyph(module) {
    return module.includes("Media") ? "◈" : module.includes("Threat") ? "⌁" : module.includes("Identity") ? "◎" : module.includes("Graph") ? "⌘" : "◉";
  }
  function mediaView() {
    return `${header(views.media[0], views.media[1], actionButton("New media review"))}<div class="notice-banner"><span>ⓘ</span><span><b>Simulation notice</b> Scores and indicators below are generated locally for demonstration and do not detect real manipulation.</span></div><div class="workspace-two-col"><section class="panel upload-panel"><div class="panel-heading"><div><h2>Submit media evidence</h2><p>Choose an image, video or audio file to create a local demo record.</p></div></div><div class="dropzone" id="dropzone"><span class="upload-mark">↑</span><b>Drop evidence here</b><small>or choose a file from your device</small><button class="secondary-button" data-action="pick-file">Browse files</button><small class="fine-print">No file is uploaded. Only the filename and simulated result are saved in this browser.</small></div><div class="supported-types"><span>IMAGE <b>JPG · PNG · WEBP</b></span><span>VIDEO <b>MP4 · MOV · WEBM</b></span><span>AUDIO <b>WAV · MP3 · M4A</b></span></div></section><section class="panel analysis-info"><div class="panel-heading"><div><h2>Demo analysis workflow</h2><p>Illustrative review signals</p></div><span class="sim-badge">SIMULATED</span></div><div class="signal-row"><span>01</span><div><b>File context</b><small>Filename, format and file size</small></div><span class="signal-tag">LOCAL</span></div><div class="signal-row"><span>02</span><div><b>Illustrative indicators</b><small>Randomized example signals</small></div><span class="signal-tag">DEMO</span></div><div class="signal-row"><span>03</span><div><b>Case record</b><small>Stored in browser LocalStorage</small></div><span class="signal-tag">PRIVATE</span></div></section></div><section class="panel below-panel"><div class="panel-heading"><div><h2>Recent media reviews</h2><p>Your locally saved evidence records.</p></div></div>${table(state.cases.filter(item => item.module === "Media forensics"))}</section>`;
  }
  function threatView() {
    return `${header(views.threat[0], views.threat[1], actionButton())}<div class="notice-banner"><span>ⓘ</span><span><b>Demo mode</b> No DNS, certificate, reputation or web requests are made. Entered text is assessed with illustrative local rules only.</span></div><div class="workspace-two-col"><section class="panel scanner-panel"><div class="panel-heading"><div><h2>Inspect a web address</h2><p>Paste a URL to create a simulated risk assessment.</p></div><span class="module-glyph purple">⌁</span></div><form id="threatForm" class="form-stack"><label for="urlInput">Website address</label><div class="input-with-button"><input id="urlInput" name="url" type="text" placeholder="https://example.com" autocomplete="url" required><button class="primary-button" type="submit">Analyze URL <span>→</span></button></div><small>Example: https://accounts.example.com/sign-in</small></form><div class="sample-tags"><span>Illustrative checks</span><b>HTTPS format</b><b>URL structure</b><b>Suspicious keywords</b></div></section><section class="panel analysis-info"><div class="panel-heading"><div><h2>Assessment scope</h2><p>What this demo can and cannot tell you</p></div></div><div class="scope-row"><span class="scope-icon green">✓</span><span><b>Local format review</b><small>Basic syntax and visible string patterns</small></span></div><div class="scope-row"><span class="scope-icon green">✓</span><span><b>Illustrative risk score</b><small>For interface demonstration only</small></span></div><div class="scope-row"><span class="scope-icon red">×</span><span><b>No live intelligence</b><small>No domain age, DNS or reputation data</small></span></div></section></div><section class="panel below-panel"><div class="panel-heading"><div><h2>Recent URL assessments</h2><p>Demo results saved in your workspace.</p></div></div>${table(state.cases.filter(item => item.module === "Threat analyzer"))}</section>`;
  }
  function osintView() {
    return `${header(views.osint[0], views.osint[1], actionButton())}<div class="notice-banner"><span>ⓘ</span><span><b>Privacy-first demonstration</b> This form does not search the internet, social networks, or private databases. Use fictional or authorized test data.</span></div><div class="workspace-two-col"><section class="panel"><div class="panel-heading"><div><h2>Create an identity review</h2><p>Record the scope and purpose of an authorized workflow.</p></div></div><form id="identityForm" class="form-stack"><label for="subjectInput">Subject label</label><input id="subjectInput" type="text" placeholder="e.g. Partner onboarding review" required maxlength="100"><label for="purposeInput">Review purpose</label><select id="purposeInput"><option>Partner due diligence</option><option>Executive impersonation review</option><option>Brand abuse triage</option><option>Other authorized review</option></select><label class="checkbox-label"><input id="authorizedInput" type="checkbox" required> I confirm this workflow is authorized and uses appropriate data.</label><button class="primary-button align-start" type="submit">Create review <span>→</span></button></form></section><section class="panel analysis-info"><div class="panel-heading"><div><h2>Responsible research</h2><p>Keep human judgment in the loop.</p></div><span class="sim-badge">GUIDANCE</span></div><div class="guidance-item"><span>01</span><div><b>Define a clear purpose</b><small>Limit research to the approved question.</small></div></div><div class="guidance-item"><span>02</span><div><b>Use public, authorized sources</b><small>Respect consent, privacy and applicable law.</small></div></div><div class="guidance-item"><span>03</span><div><b>Verify before taking action</b><small>Demo indicators are not identity findings.</small></div></div></section></div><section class="panel below-panel"><div class="panel-heading"><div><h2>Identity review records</h2><p>Locally stored workflow records.</p></div></div>${table(state.cases.filter(item => item.module === "Identity intelligence"))}</section>`;
  }
  function graphView() {
    const cases = state.cases;
    const visible = state.graphFilter === "all" ? cases : cases.filter(item => state.graphFilter === "elevated" ? item.risk >= 70 : item.module === state.graphFilter);
    const positions = visible.map((item, index) => ({ item, x: 110 + (index % 3) * 215, y: 92 + Math.floor(index / 3) * 155 }));
    const lines = positions.slice(1).map((node, i) => `<line class="graph-edge" data-from="${i}" data-to="${i + 1}" x1="${positions[i].x}" y1="${positions[i].y}" x2="${node.x}" y2="${node.y}"></line>`).join("");
    const nodes = positions.map((node, index) => `<g class="graph-node ${node.item.risk >= 70 ? "elevated" : ""}" data-index="${index}" transform="translate(${node.x} ${node.y})" tabindex="0" role="button" aria-label="${esc(node.item.title)}"><circle r="26"></circle><text class="graph-glyph" y="5">${moduleGlyph(node.item.module)}</text><text class="graph-label" y="47">${esc(node.item.title.length > 21 ? node.item.title.slice(0, 19) + "…" : node.item.title)}</text><text class="graph-sub" y="64">${esc(node.item.id)}</text></g>`).join("");
    return `${header(views.graph[0], views.graph[1], actionButton())}<div class="graph-toolbar panel"><div><b>Evidence relationship map</b><small>Drag nodes to rearrange · Select a node to open its record</small></div><div class="filter-group"><button class="${state.graphFilter === "all" ? "selected" : ""}" data-filter="all">All</button><button class="${state.graphFilter === "elevated" ? "selected" : ""}" data-filter="elevated">Elevated</button><button class="${state.graphFilter === "Media forensics" ? "selected" : ""}" data-filter="Media forensics">Media</button></div></div><section class="panel graph-panel"><svg id="trustGraph" viewBox="0 0 760 ${Math.max(300, Math.ceil(positions.length / 3) * 155 + 40)}" role="img" aria-label="Interactive relationship graph">${lines}${nodes}</svg><div class="graph-legend"><span><i class="legend-dot"></i> Evidence record</span><span><i class="legend-dot elevated-dot"></i> Elevated illustrative risk</span><span>${visible.length} record${visible.length === 1 ? "" : "s"} mapped</span></div></section><section class="panel below-panel"><div class="panel-heading"><div><h2>Connected records</h2><p>Demo links reflect co-location in this workspace, not a verified relationship.</p></div></div>${table(visible)}</section>`;
  }
  function scoreView() {
    const score = scoredCases().length ? 100 - averageRisk() : 0;
    const scored = scoredCases();
    const counts = { low: scored.filter(item => item.risk < 40).length, medium: scored.filter(item => item.risk >= 40 && item.risk < 70).length, high: scored.filter(item => item.risk >= 70).length };
    return `${header(views.score[0], views.score[1], `<button class="secondary-button" data-action="export-json">Export score data</button>`)}<div class="notice-banner"><span>ⓘ</span><span><b>Not a security rating.</b> This illustrative score is 100 minus the average simulated case risk in your local workspace.</span></div><div class="score-layout"><section class="panel score-card"><div class="score-ring" style="--score:${score * 3.6}deg"><div><strong>${scored.length ? score : "—"}</strong><small>DEMO SCORE</small></div></div><h2>${scored.length ? (score >= 70 ? "Lower observed demo risk" : score >= 45 ? "Review open indicators" : "Elevated demo indicators") : "No scored records yet"}</h2><p>Derived from ${scored.length} scored record${scored.length === 1 ? "" : "s"} · updated live</p><span class="sim-badge">SIMULATED · NOT VERIFIED</span></section><section class="panel score-breakdown"><div class="panel-heading"><div><h2>Risk distribution</h2><p>Illustrative scores across saved records</p></div></div>${distributionRow("Low", counts.low, scored.length, "green")}${distributionRow("Guarded", counts.medium, scored.length, "amber")}${distributionRow("Elevated", counts.high, scored.length, "red")}<div class="score-method"><b>Methodology</b><p>Media and URL demo analyses receive illustrative scores. Unassessed cases are excluded. Workspace score = 100 − rounded average scored risk. No real-world evidence is examined.</p></div></section></div><section class="panel below-panel"><div class="panel-heading"><div><h2>Score contributors</h2><p>Unassessed workflow records are not included in the score.</p></div></div>${table()}</section>`;
  }
  function distributionRow(label, count, total, color) {
    const percent = total ? Math.round(count / total * 100) : 0;
    return `<div class="distribution-row"><div><span>${label}</span><b>${count}</b></div><div class="distribution-track"><i class="${color}" style="width:${percent}%"></i></div></div>`;
  }
  function reportsView() {
    const filtered = state.cases.filter(item => `${item.title} ${item.id} ${item.module} ${item.detail}`.toLowerCase().includes(state.query.toLowerCase()));
    return `${header(views.reports[0], views.reports[1], `<div class="export-actions"><button class="secondary-button" data-action="export-csv">Export CSV</button><button class="secondary-button" data-action="export-json">Export JSON</button><button class="secondary-button" data-action="export-pdf">Print / PDF</button></div>`)}<section class="panel report-panel"><div class="panel-heading"><div><h2>Investigation history <span class="count-badge">${filtered.length}</span></h2><p>Search, review and export your locally saved demo records.</p></div><button class="primary-button" data-action="new-case"><span>＋</span>New investigation</button></div>${table(filtered)}</section><footer class="footer-note"><span>Data is stored locally in this browser only.</span><span>Exports contain demo records. Confirm handling requirements before sharing.</span></footer>`;
  }
  function settingsView() {
    return `${header(views.settings[0], views.settings[1])}<div class="settings-grid"><section class="panel settings-panel"><div class="panel-heading"><div><h2>Appearance</h2><p>Choose the workspace theme for this browser.</p></div></div><div class="setting-row"><div><b>Color theme</b><small>Applies to the current workspace.</small></div><select id="themeSelect"><option value="dark" ${state.theme === "dark" ? "selected" : ""}>Dark</option><option value="light" ${state.theme === "light" ? "selected" : ""}>Light</option></select></div></section><section class="panel settings-panel"><div class="panel-heading"><div><h2>Workspace data</h2><p>Records are held in browser LocalStorage.</p></div><span class="sim-badge">ON THIS DEVICE</span></div><div class="setting-row"><div><b>${state.cases.length} investigation records</b><small>Sample records and any cases you create.</small></div><button class="secondary-button" data-action="export-json">Back up JSON</button></div><div class="setting-row danger-row"><div><b>Restore sample workspace</b><small>Replaces local records with the original demo examples.</small></div><button class="secondary-button danger-button" data-action="reset-data">Restore samples</button></div></section><section class="panel settings-panel"><div class="panel-heading"><div><h2>Analysis disclaimer</h2><p>TrustLens frontend demonstration</p></div></div><p class="settings-copy">This interface does not perform real deepfake detection, malware scanning, phishing reputation checks, identity searches, or evidence verification. Scores and indicators are simulated. For real investigations, use authorized tools, validated sources and qualified human review.</p></section></div>`;
  }
  function render() {
    const page = views[state.current] || views.overview;
    document.getElementById("crumb").textContent = page[0];
    document.querySelectorAll(".nav-item[data-view]").forEach(button => button.classList.toggle("active", button.dataset.view === state.current));
    const renderers = { overview, media: mediaView, threat: threatView, osint: osintView, graph: graphView, score: scoreView, reports: reportsView, settings: settingsView };
    root.innerHTML = renderers[state.current]();
    if (state.current === "graph") bindGraph();
    if (window.innerWidth <= 760) sidebar.classList.remove("open");
  }
  function navigate(view) {
    if (!views[view]) return;
    state.current = view;
    history.replaceState(null, "", `#${view}`);
    render();
  }
  function bindGraph() {
    const svg = document.getElementById("trustGraph");
    if (!svg) return;
    let active = null;
    let startPoint = null;
    svg.querySelectorAll(".graph-node").forEach(node => {
      node.addEventListener("pointerdown", event => {
        active = node;
        startPoint = { x: event.clientX, y: event.clientY };
        node.setPointerCapture(event.pointerId);
        event.preventDefault();
      });
      node.addEventListener("pointermove", event => {
        if (!active) return;
        if (Math.hypot(event.clientX - startPoint.x, event.clientY - startPoint.y) > 4) active.dataset.dragged = "true";
        const point = svg.createSVGPoint();
        point.x = event.clientX; point.y = event.clientY;
        const local = point.matrixTransform(svg.getScreenCTM().inverse());
        active.setAttribute("transform", `translate(${local.x} ${local.y})`);
        const index = Number(active.dataset.index);
        svg.querySelectorAll(".graph-edge").forEach(edge => {
          if (Number(edge.dataset.from) === index) { edge.setAttribute("x1", local.x); edge.setAttribute("y1", local.y); }
          if (Number(edge.dataset.to) === index) { edge.setAttribute("x2", local.x); edge.setAttribute("y2", local.y); }
        });
      });
      node.addEventListener("pointerup", () => { active = null; startPoint = null; });
      node.addEventListener("click", event => {
        if (node.dataset.dragged) { delete node.dataset.dragged; return; }
        const item = state.cases[Number(node.dataset.caseIndex)] || state.cases.find(entry => entry.title === node.querySelector(".graph-label").textContent);
        if (item) showCase(item.id);
      });
      const index = Number(node.dataset.index);
      const visible = state.graphFilter === "all" ? state.cases : state.graphFilter === "elevated" ? state.cases.filter(item => item.risk >= 70) : state.cases.filter(item => item.module === state.graphFilter);
      node.dataset.caseIndex = String(state.cases.indexOf(visible[index]));
    });
  }
  function showCase(id) {
    const item = state.cases.find(entry => entry.id === id);
    if (!item) return;
    root.insertAdjacentHTML("beforeend", `<div class="modal-backdrop" id="caseModal"><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><button class="modal-close" data-action="close-modal" aria-label="Close">×</button><div class="eyebrow">${esc(item.id)} · ${esc(item.module)}</div><h2 id="modalTitle">${esc(item.title)}</h2><p>${esc(item.detail)}</p><div class="modal-details"><span>SCORE STATUS</span>${riskPill(item.risk)}<span>STATUS</span><b>${esc(item.status)}</b><span>CREATED</span><b>${dateLabel(item.created)}</b></div><div class="notice-banner compact"><span>ⓘ</span><span>This record contains illustrative demo information, not a verified finding.</span></div><button class="secondary-button" data-action="close-modal">Close</button></section></div>`);
  }
  function createCase({ title, module, kind, detail, status = "Complete", risk }) {
    const year = new Date().getFullYear();
    let suffix = Number(String(Date.now()).slice(-5));
    let id = `TL-${year}-${String(suffix).padStart(5, "0")}`;
    while (state.cases.some(item => item.id === id)) id = `TL-${year}-${String(++suffix).padStart(5, "0")}`;
    const item = { id, title, module, kind, risk: risk === null ? null : risk ?? Math.floor(12 + Math.random() * 78), status, detail, created: new Date().toISOString() };
    state.cases.unshift(item);
    persist();
    render();
    showCase(item.id);
    return item;
  }
  function newInvestigation() {
    root.insertAdjacentHTML("beforeend", `<div class="modal-backdrop" id="newCaseModal"><form class="modal-card" id="newCaseForm" role="dialog" aria-modal="true" aria-labelledby="newCaseTitle"><button type="button" class="modal-close" data-action="close-modal" aria-label="Close">×</button><div class="eyebrow">WORKSPACE / NEW CASE</div><h2 id="newCaseTitle">Start an investigation</h2><p>Create a case record for one of the five analysis modules.</p><label for="caseTitle">Investigation name</label><input id="caseTitle" maxlength="100" placeholder="e.g. Suspected executive impersonation" required><label for="caseModule">Analysis module</label><select id="caseModule"><option>Media forensics</option><option>Threat analyzer</option><option>Identity intelligence</option><option>TrustGraph</option></select><div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Cancel</button><button class="primary-button" type="submit">Create case <span>→</span></button></div></form></div>`);
    document.getElementById("caseTitle").focus();
  }
  function download(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url; link.download = name;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(`${name} exported.`);
  }
  function exportJson() {
    download("trustlens-workspace.json", JSON.stringify({ exportedAt: new Date().toISOString(), demo: true, cases: state.cases }, null, 2), "application/json");
  }
  function exportCsv() {
    const fields = ["id", "title", "module", "kind", "risk", "status", "detail", "created"];
    const quote = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [fields.join(","), ...state.cases.map(item => fields.map(field => quote(item[field])).join(","))].join("\r\n");
    download("trustlens-investigations.csv", "\uFEFF" + csv, "text/csv;charset=utf-8");
  }
  function analyzeUrl(raw) {
    const input = raw.trim();
    let parsed;
    try { parsed = new URL(input.includes("://") ? input : `https://${input}`); }
    catch { toast("Enter a valid website address, such as example.com."); return; }
    if (!["http:", "https:"].includes(parsed.protocol)) { toast("Only HTTP or HTTPS website addresses can be assessed."); return; }
    const signals = [parsed.protocol !== "https:" ? 24 : 0, parsed.hostname.split(".").length > 4 ? 18 : 0, /login|verify|secure|account|update/i.test(parsed.href) ? 22 : 0, parsed.hostname.includes("@") ? 30 : 0].reduce((a, b) => a + b, 12);
    createCase({ title: "URL assessment · " + parsed.hostname, module: "Threat analyzer", kind: "URL", detail: parsed.href, status: "Demo complete", risk: Math.min(92, signals) });
  }
  function analyzeFiles(files) {
    const list = Array.from(files || []);
    if (!list.length) return;
    list.forEach(file => {
      const extension = file.name.split(".").pop().toLowerCase();
      const kind = /^(mp4|mov|webm|mkv)$/.test(extension) ? "Video" : /^(wav|mp3|m4a|aac|ogg|flac)$/.test(extension) ? "Audio" : "Image / file";
      createCase({ title: file.name, module: "Media forensics", kind, detail: `${kind} · ${(file.size / 1024 / 1024).toFixed(2)} MB · local demo`, status: "Demo complete" });
    });
    filePicker.value = "";
  }
  function handleAction(action) {
    if (action === "new-case") newInvestigation();
    else if (action === "pick-file") {
      filePicker.accept = "image/*,video/*,audio/*";
      filePicker.click();
    } else if (action === "export-json") exportJson();
    else if (action === "export-csv") exportCsv();
    else if (action === "export-pdf") window.print();
    else if (action === "close-modal") document.querySelector(".modal-backdrop")?.remove();
    else if (action === "reset-data") {
      if (window.confirm("Restore the sample workspace? Your locally created cases will be replaced.")) {
        state.cases = seed.map(item => ({ ...item })); persist(); render(); toast("Sample workspace restored.");
      }
    }
  }
  document.addEventListener("click", event => {
    const action = event.target.closest("[data-action]");
    if (action) { handleAction(action.dataset.action); return; }
    const view = event.target.closest("[data-view]");
    if (view) { navigate(view.dataset.view); return; }
    const caseButton = event.target.closest("[data-case]");
    if (caseButton) showCase(caseButton.dataset.case);
    const filter = event.target.closest("[data-filter]");
    if (filter) { state.graphFilter = filter.dataset.filter; render(); }
    if (event.target.classList.contains("modal-backdrop")) event.target.remove();
  });
  document.addEventListener("submit", event => {
    if (event.target.id === "threatForm") {
      event.preventDefault(); analyzeUrl(new FormData(event.target).get("url"));
    } else if (event.target.id === "identityForm") {
      event.preventDefault();
      const subject = document.getElementById("subjectInput").value.trim();
      const purpose = document.getElementById("purposeInput").value;
      createCase({ title: subject, module: "Identity intelligence", kind: "Identity workflow", detail: `Authorized workflow · ${purpose}`, status: "Open · user review", risk: null });
    } else if (event.target.id === "newCaseForm") {
      event.preventDefault();
      const title = document.getElementById("caseTitle").value.trim();
      const module = document.getElementById("caseModule").value;
      createCase({ title, module, kind: "Investigation", detail: "New workspace case · analysis not yet performed", status: "Open · user review", risk: null });
    }
  });
  document.addEventListener("change", event => {
    if (event.target === filePicker) analyzeFiles(filePicker.files);
    if (event.target.id === "themeSelect") {
      window.dispatchEvent(new CustomEvent("trustlens:themechange", { detail: { theme: event.target.value } }));
      toast(`${event.target.value === "dark" ? "Dark" : "Light"} theme enabled.`);
    }
  });
  window.addEventListener("trustlens:themechange", event => {
    const theme = event.detail && event.detail.theme;
    if (theme !== "dark" && theme !== "light") return;
    state.theme = theme;
    const selector = document.getElementById("themeSelect");
    if (selector) selector.value = theme;
    persist();
  });
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); document.getElementById("globalSearch").focus(); }
    if (event.key === "Escape") document.querySelector(".modal-backdrop")?.remove();
  });
  document.getElementById("globalSearch").addEventListener("input", event => {
    state.query = event.target.value.trim();
    if (state.current !== "reports") navigate("reports");
    else render();
    const search = document.getElementById("globalSearch");
    search.focus(); search.setSelectionRange(search.value.length, search.value.length);
  });
  document.getElementById("menuBtn").addEventListener("click", () => sidebar.classList.toggle("open"));
  document.getElementById("notificationsBtn").addEventListener("click", event => {
    const existing = document.getElementById("notificationPopover");
    if (existing) { existing.remove(); return; }
    event.currentTarget.insertAdjacentHTML("afterend", `<div class="notification-popover" id="notificationPopover"><b>Workspace notices</b><p><i></i> Simulation environment active</p><p><i></i> ${state.cases.length} local investigation records</p><small>Live security feeds are not connected.</small></div>`);
  });
  root.addEventListener("dragover", event => { if (event.target.closest("#dropzone")) { event.preventDefault(); event.target.closest("#dropzone").classList.add("dragging"); } });
  root.addEventListener("dragleave", event => { if (event.target.closest("#dropzone")) event.target.closest("#dropzone").classList.remove("dragging"); });
  root.addEventListener("drop", event => {
    if (!event.target.closest("#dropzone")) return;
    event.preventDefault(); event.target.closest("#dropzone").classList.remove("dragging"); analyzeFiles(event.dataTransfer.files);
  });
  window.addEventListener("hashchange", () => navigate(location.hash.slice(1) || "overview"));
  restore();
  const initialView = location.hash.slice(1);
  if (views[initialView]) state.current = initialView;
  render();
})();
