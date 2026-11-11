import { drawSim, setSimAccent } from "../blueprint/sims.js?v=3";

const ACCENT = "#ff4f00";
const YELLOW = "#ffd400";
setSimAccent(ACCENT);

/* =========================================================
   Case studies
   ========================================================= */

const CASES = {
  teletwin: { t: "TeleTwin", k: "5G digital twin · XRVision Labs", meta: "Co-founder · May 2025 – Apr 2026", vid: "../teletwin.mp4", poster: "../teletwin.jpg",
    problem: "Telecom operators have to inspect and plan tower infrastructure without being able to see every site.",
    built: "A digital-twin platform that creates realistic 3D representations of telecom towers, so operators can visualise, monitor and analyse their tower assets virtually: structural integrity, equipment placement and operational efficiency, with real-time data integration.",
    result: ["97% twin accuracy", "1,000 models generated in ~25 min (RTX 8000)", "Demoed to Fortune-500 clients and regulators"],
    flow: ["Site imagery", "YOLO detection", "3D model generation", "Unity / Unreal twin", "Live data over 5G"],
    stack: ["Unity", "Unreal", "C#", "Python", "YOLO", "Docker"], rec: "Won the iDEX defence grant" },
  wardrobe: { t: "Wardrobe AI", k: "AI agent · Jio", meta: "AI & Cloud Intern · Sep 2026 – Present", sim: "wardrobe",
    problem: "Putting an outfit together from what you already own is harder than it sounds.",
    built: "A styling agent that looks at a real wardrobe and suggests outfits from those clothes. I collected and labelled the dataset, trained the detector, and wired a LangGraph agent over a vector store and a relational store, then put it in front of internal testers.",
    result: ["YOLOv11 detection at 93.02%", "10,000+ images labelled across 35 categories", "511 internal testers; about 85% found what they were looking for"],
    flow: ["Wardrobe photos", "YOLOv11 detector", "FAISS + relational store", "LangGraph agent", "Outfit picks"],
    stack: ["Python", "LangGraph", "YOLOv11", "FAISS"], rec: "Letter of recommendation" },
  unity: { t: "Claude → Unity", k: "AI tooling · Tap4Technologies", meta: "Software Engineering Intern · Oct – Dec 2025", sim: "unity",
    problem: "Building a complex Unity scene by hand took four to five hours.",
    built: "An MCP server that connects Claude straight into Unity. It handled most Unity actions except materials and physics, spun up template scenes on run, and reached Fortnite-style environments. I benchmarked it against other assistants as baselines.",
    result: ["Scenes of 4–5 hours done in about 1–1.5 hours", "Environments of 5+ scenes", "From ~2 minutes to ~1 hour per scene, depending on complexity"],
    flow: ["Plain-language prompt", "Claude", "MCP server", "Unity editor actions", "Finished scene"],
    stack: ["MCP", "Claude", "Unity", "C#", "Python"], rec: "Showcased at a Snapchat-collab event · Letter of recommendation" },
  fleet: { t: "Fleet Control", k: "Robotics · Ottonomy.io", meta: "DevOps Intern · Jun – Aug 2026", sim: "fleet",
    problem: "Monsoon rain kept getting into the delivery robots’ own screens, so operators lost their controls.",
    built: "An Android app, built from scratch, that moved the controls to a tablet the operator holds: live map, localisation, motors, states and commands, talking to the robots over ROS.",
    result: ["Running across 2 sites with fleets of 4–7 robots", "~15 screens over 20–23 services", "Live fleet data at ~3 s latency"],
    flow: ["Operator tablet", "Kotlin Android app", "REST APIs", "ROS", "Robot fleet"],
    stack: ["Kotlin", "Android", "ROS", "REST", "Postman"], rec: "Letter of recommendation" },

  combat: { t: "CombatXR", k: "VR · defence training", vid: "../combatXR.mp4", poster: "../combatXR.jpg",
    proof: "Four terrains · multiplayer squads · real hardware",
    problem: "Live combat training is expensive and risky to repeat often enough to build reflexes.",
    built: "A training platform for the Indian Defence forces with 360° interactive simulations across urban, jungle, desert and counter-insurgency terrain. Squads train together in synchronised multiplayer missions, the weapon is wired to real hardware, and real-time analytics give adaptive feedback on each soldier’s performance.",
    result: [], flow: ["Physical weapon hardware", "Unity · XR Interaction Toolkit", "VR terrain scenarios", "Multiplayer squad", "Performance analytics"],
    stack: ["Unity", "C#", "XR Interaction Toolkit", "Hardware I/O"] },
  xrchitect: { t: "XRchitect", k: "VR / MR · interior design", vid: "../xrchitect.mp4", poster: "../xrchitect.jpg",
    proof: "Published on the Meta Store",
    problem: "2D design tools make it hard to judge a room before anything is built.",
    built: "A VR/MR application for interior design professionals, students and educators. Instead of a flat plan, you design inside a realistic 3D environment, in an actual or virtual room, trying layouts, furniture and colour schemes before committing to real changes.",
    result: [], flow: ["Meta Quest headset", "Unity scene", "Place · scale · recolour", "Room at real scale"],
    stack: ["Unity", "C#", "VR / MR"], link: ["Download on the Meta Store", "https://www.meta.com/en-gb/experiences/xrchitect/8001533676569691/"] },
  planxr: { t: "PlanXR", k: "Mixed reality · mission planning", vid: "../classic/assets/planXR.mp4", poster: "../classic/assets/planXR.jpg",
    proof: "Multi-user planning on real 3D terrain",
    problem: "Planning a mission on a flat map hides what the terrain is really like.",
    built: "A mixed-reality application for the Territorial Army. Officers explore real-world landscapes in 3D, analyse geographical challenges, and co-plan missions together in real time in a shared virtual space.",
    result: [], flow: ["Real terrain data", "3D terrain in MR", "Shared multi-user session", "Mission plan"], stack: ["Unity", "Mixed Reality", "Multi-user"] },
  threat: { t: "Threat Monitoring Twin", k: "Mixed reality · cybersecurity", vid: "../classic/assets/digitaltwin.mp4", poster: "../classic/assets/digitaltwin.jpg",
    proof: "SOC dashboards turned into an MR space",
    problem: "Security dashboards are hard for senior management to read, so decisions slow down.",
    built: "A mixed-reality digital twin that replicates an organisation’s cyber environment and turns complex SOC dashboard data into an interactive experience, so technical teams and management can monitor threats and analyse vulnerabilities together.",
    result: [], flow: ["SOC dashboard data", "Digital twin model", "MR visualisation", "Shared decisions"], stack: ["Unity", "Mixed Reality", "Data visualisation"] },
  multimodel: { t: "AR Multi-Model Designer", k: "AR · furniture & interiors", vid: "../classic/assets/multimodel.mp4", poster: "../classic/assets/multimodel.jpg",
    proof: "Several 3D models arranged in one real AR scene",
    problem: "It’s hard to picture how several pieces of furniture will look together in a real room.",
    built: "An AR app where you place and arrange multiple 3D models in the same real-world scene, so you can design a space with real furniture at real scale.",
    result: [], flow: ["Phone camera", "ARCore plane detection", "Place multiple models", "Arranged room"], stack: ["Unity", "C#", "ARCore"] },
  indoornav: { t: "Indoor Navigation", k: "WebAR · wayfinding", vid: "../indoornav.mp4", poster: "../indoornav.jpg",
    proof: "Runs in the browser: no app, no paper map",
    problem: "Finding your way inside a big building usually means a paper map or an app install.",
    built: "WebAR wayfinding in the phone’s browser: point your phone and follow AR arrows with real-time directions through large buildings and venues, with nothing to install.",
    result: [], flow: ["Phone camera", "WebAR in the browser", "Position in the building", "AR arrows"], stack: ["WebAR", "JavaScript", "Computer vision"] },
  mlagents: { t: "ML-Agents", k: "Reinforcement learning · Unity", vid: "../classic/assets/mlagents.mp4", poster: "../classic/assets/mlagents.jpg",
    proof: "Agents that learn by trial and error",
    problem: "Hand-scripted game AI can’t adapt when the situation changes.",
    built: "Agents trained with reinforcement learning using Unity ML-Agents, learning to perform tasks and make decisions inside virtual environments instead of following fixed scripts.",
    result: [], flow: ["Unity environment", "Observations + rewards", "RL training", "Trained policy", "Agent behaviour"], stack: ["Unity", "ML-Agents", "C#", "Python"] },
  pixel: { t: "Pixel Streaming", k: "Unreal Engine · cloud rendering", img: "../classic/assets/pixel-streaming.jpg",
    proof: "Photoreal 3D on any device, over WebRTC",
    problem: "Photorealistic 3D usually needs hardware most people don’t have.",
    built: "Unreal Engine Pixel Streaming: the scene renders on a cloud GPU and streams to any browser or phone over WebRTC with low latency, so heavy XR content runs anywhere.",
    result: [], flow: ["Unreal on a cloud GPU", "Pixel Streaming", "WebRTC", "Any browser or phone"], stack: ["Unreal Engine", "WebRTC", "Cloud"] }
};

/* =========================================================
   The story
   ========================================================= */

const CHAPTERS = [
  { index: "Research", year: "2024",
    kicker: "Delhi University · Research Intern · Jan 2024 – Jan 2026",
    title: "It started in a university lab.",
    body: "Two years as a research intern at Delhi University: AR and VR prototypes, real-time motion tracking driving a live avatar, and the technical reports that went with them. This is where I learned to build things that respond to people.",
    stat: { value: 5, suffix: "+", label: "AR / VR prototypes built" },
    media: { vid: "../advanced motion tracking.mp4", poster: "../motion-tracking.jpg", tag: "Real-time motion tracking" } },
  { index: "Evaluation", year: "2025",
    kicker: "SoulAI · AI Intern (AR) · Mar – May 2025",
    title: "Then I learned how models fail.",
    body: "At SoulAI I benchmarked model outputs for AR use cases, and wrote Python scripts so the review didn’t take forever. Measuring before trusting has stayed with me since.",
    stat: { value: 200, suffix: "+", label: "Model outputs benchmarked", more: "Review time cut by about a third" } },
  { index: "Founder", year: "2025", caseKey: "teletwin",
    kicker: "XRVision Labs · Co-founder · May 2025 – Apr 2026",
    title: "Halfway through college, I started a company.",
    body: "I co-founded XRVision Labs, a deep-tech XR and AI startup. I led a team of about ten, ran more than 200 user interviews, shipped 3+ MVPs, and turned prototypes into pilots shown to Fortune-500 clients and regulators. We won the iDEX defence grant. Then the startup ended.",
    stat: { value: 97, suffix: "%", label: "TeleTwin accuracy", more: "200+ user interviews · iDEX defence grant" },
    media: { vid: "../teletwin.mp4", poster: "../teletwin.jpg", tag: "TeleTwin · 5G digital twin" } },
  { index: "AI tooling", year: "2025", caseKey: "unity",
    kicker: "Tap4Technologies · Software Engineering Intern · Oct – Dec 2025",
    title: "I taught Claude to build worlds.",
    body: "I built an MCP server that connects Claude to Unity: describe a scene in plain language and it assembles it, up to Fortnite-style environments of five or more scenes. It was showcased at a Snapchat-collab event.",
    stat: { value: 70, prefix: "~", suffix: "%", label: "Faster scene builds", more: "4–5 hours by hand → 1–1.5 hours" },
    media: { sim: "unity", tag: "Simulation · prompt to scene" } },
  { index: "Robotics", year: "2026", caseKey: "fleet",
    kicker: "Ottonomy.io · DevOps Intern · Jun – Aug 2026",
    title: "When it rained, the robots lost their screens.",
    body: "Monsoon water kept getting into the delivery robots’ own displays, so the controls had to move to a tablet. I built that Android app from scratch: live map, localisation, motors, states and commands, talking to the fleet over ROS across two sites.",
    stat: { value: 15, prefix: "~", suffix: "", label: "App screens, built from scratch", more: "20–23 services · live fleet data in ~3 s" },
    media: { sim: "fleet", tag: "Simulation · live fleet map" } },
  { index: "AI agents", year: "Now", caseKey: "wardrobe",
    kicker: "Jio · AI & Cloud Intern · Sep 2026 – Present",
    title: "Now I’m building an AI that dresses you from your own wardrobe.",
    body: "At Jio I’m building an AJIO styling agent. I collected and labelled more than 10,000 images across 35 categories, trained the detector, and wired a LangGraph agent over a vector store and a relational one. 511 people have tested it so far.",
    stat: { value: 93.02, decimals: 2, suffix: "%", label: "Detection accuracy", more: "10,000+ images · 511 testers" },
    media: { sim: "wardrobe", tag: "Simulation · wardrobe detection" } }
];

/* quotes between the sideways chapters (keyed by chapter index they follow) */
const QUOTES = {
  2: "Allergic to <em>playing it safe.</em>",
  4: "Prototypes are easy. <em>Shipping</em> is the job."
};

/* the shelf: only projects that aren't already a chapter */
const SHELF = [
  { key: "combat",     h: 94, w: 112, bg: ACCENT,    fg: "#0a0a0a", band: "#0a0a0a" },
  { key: "xrchitect",  h: 84, w: 96,  bg: YELLOW,    fg: "#0a0a0a", band: "#0a0a0a" },
  { key: "planxr",     h: 98, w: 120, bg: "#ece8e1", fg: "#0a0a0a", band: ACCENT },
  { key: "threat",     h: 90, w: 132, bg: "#1d1b19", fg: "#ece8e1", band: YELLOW },
  { key: "multimodel", h: 86, w: 118, bg: "#8d877e", fg: "#0a0a0a", band: "#0a0a0a" },
  { key: "indoornav",  h: 92, w: 100, bg: ACCENT,    fg: YELLOW,    band: YELLOW },
  { key: "mlagents",   h: 80, w: 104, bg: "#ece8e1", fg: ACCENT,    band: "#0a0a0a" },
  { key: "pixel",      h: 88, w: 110, bg: YELLOW,    fg: "#0a0a0a", band: ACCENT, tilt: 9 }
];

/* =========================================================
   Helpers
   ========================================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const pad = (n) => String(n).padStart(2, "0");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

const at = (p) => new URL(p, import.meta.url).href;
function mediaHTML(m, label, controls = false) {
  m = { ...m, vid: m.vid && at(m.vid), poster: m.poster && at(m.poster), img: m.img && at(m.img) };
  if (m.vid) return `<video muted loop playsinline preload="none"${controls ? " controls" : ""} ${m.poster ? `poster="${esc(m.poster)}"` : ""} data-src="${esc(m.vid)}" aria-label="${esc(label)}"></video>`;
  if (m.sim) return `<canvas width="1024" height="692" data-sim="${m.sim}" role="img" aria-label="${esc(label)}: animated simulation"></canvas>`;
  if (m.img) return `<img src="${esc(m.img)}" alt="${esc(label)}" loading="lazy">`;
  return "";
}

function chapterInner(c, i) {
  const s = c.stat;
  return {
    head: `
      <p class="chapter-no" aria-hidden="true">${pad(i + 1)}</p>
      <p class="kicker">Chapter ${pad(i + 1)} · ${esc(c.kicker)}</p>
      <h2>${esc(c.title)}</h2>`,
    body: `<p class="chapter-body">${esc(c.body)}</p>
      ${c.caseKey ? `<button class="chapter-case" type="button" data-case="${c.caseKey}" data-cursor="Read">Read the case study →</button>` : ""}`,
    stat: `<div class="stat">
        <span class="stat-num" data-value="${s.value}" data-decimals="${s.decimals || 0}" data-prefix="${s.prefix || ""}" data-suffix="${s.suffix}">${s.prefix || ""}${s.value}${s.suffix}</span>
        <span class="stat-label">${esc(s.label)}</span>
        ${s.more ? `<span class="stat-more">${esc(s.more)}</span>` : ""}
      </div>`,
    media: c.media ? `<div class="window">${mediaHTML(c.media, c.media.tag)}<span class="window-tag">${esc(c.media.tag)}</span></div>` : ""
  };
}

/* =========================================================
   Build the page
   ========================================================= */

// all six chapters, sideways
const track = $("#track"), ruler = $("#ruler");
CHAPTERS.forEach((c, i) => {
  const p = chapterInner(c, i);
  const el = document.createElement("article");
  el.className = "panel" + (c.media ? "" : " no-media");
  el.id = `ch-${i + 1}`;
  el.innerHTML = c.media
    ? `<div>${p.head}${p.body}</div><div>${p.media}${p.stat}</div>`
    : `<div>${p.head}${p.body}</div><div>${p.stat}</div>`;
  track.append(el);
  if (QUOTES[i]) {
    const q = document.createElement("div");
    q.className = "quote";
    q.innerHTML = `<p>${QUOTES[i]}</p>`;
    track.append(q);
  }
  const li = document.createElement("li");
  li.innerHTML = `<button type="button" data-panel="ch-${i + 1}">${pad(i + 1)} ${esc(c.index)}<b>${esc(c.year)}</b></button>`;
  ruler.append(li);
});
const endCap = document.createElement("div");
endCap.className = "track-end";
endCap.textContent = "…and then, the shelf ↓";
track.append(endCap);

// the shelf
const shelf = $("#shelf"), caption = $("#shelfCaption");
SHELF.forEach((b, i) => {
  const p = CASES[b.key];
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "spine";
  btn.dataset.case = b.key;
  btn.dataset.cursor = "Open";
  btn.setAttribute("aria-label", `${p.t}: open the case study`);
  btn.style.cssText = `--h:${b.h}%;--w:${b.w}px;--bg-c:${b.bg};--fg-c:${b.fg};--band:${b.band};--tilt:${b.tilt || 0}deg;--origin:${b.tilt ? "0% 100%" : "50% 100%"}`;
  btn.innerHTML = `<span class="spine-no">${pad(i + 1)}</span><span class="spine-t">${esc(p.t)}</span><span class="spine-k">${esc(p.k.split(" · ")[0])}</span>`;
  const show = () => { caption.innerHTML = `<span>${pad(i + 1)} · ${esc(p.k)}</span><strong>${esc(p.t)}</strong><em>${esc(p.proof)}</em>`; };
  btn.addEventListener("pointerenter", show);
  btn.addEventListener("focus", show);
  shelf.append(btn);
});
const bookend = document.createElement("div");
bookend.className = "bookend";
bookend.setAttribute("aria-hidden", "true");
shelf.append(bookend);

// shrink any spine title that is too long for its book
function fitSpines() {
  $$(".spine").forEach((sp) => {
    const t = $(".spine-t", sp);
    t.style.fontSize = "";
    const avail = sp.clientHeight - 170;
    if (t.scrollHeight > avail) t.style.fontSize = `${(parseFloat(getComputedStyle(t).fontSize) * avail) / t.scrollHeight}px`;
  });
}
fitSpines();
document.fonts && document.fonts.ready.then(fitSpines);
addEventListener("resize", fitSpines);

// statement: one span per word
const st = $("#statementText");
st.innerHTML = st.textContent.split(" ").map((w, i, all) => {
  const hl = /^failed/i.test(w) || (/^and$/i.test(w) && /^failed/i.test(all[i + 1] || ""));
  return `<span class="w${hl ? " hl" : ""}">${esc(w)}</span>`;
}).join(" ");

// cover name: one span per letter (the scratch layer draws each letter in black underneath)
const nameLines = $$("#coverName .line");
nameLines.forEach((l) => { l.innerHTML = [...l.textContent.toUpperCase()].map((ch) => `<span class="ch">${esc(ch)}</span>`).join(""); });

// wide screens: both words on one line across the full width; phones: each word fills its own line
const stacked = () => innerWidth <= 900;
function fitCover() {
  const cov = $("#cover");
  const avail = cov.clientWidth - 2 * parseFloat(getComputedStyle(cov).paddingLeft);
  nameLines.forEach((l) => (l.style.fontSize = "100px"));
  if (stacked()) {
    // same size for both words: as wide as the longer one allows, and short enough that both fit on screen
    const widest = Math.max(...nameLines.map((l) => l.scrollWidth));
    const F = Math.min((100 * avail) / widest, (cov.clientHeight * 0.6) / (nameLines.length * 0.84));
    nameLines.forEach((l) => (l.style.fontSize = `${F}px`));
    $("#coverName").style.gap = "0px";
  } else {
    const total = nameLines.reduce((sum, l) => sum + l.scrollWidth, 0) + 18 * (nameLines.length - 1);
    const F = (100 * avail) / total;
    nameLines.forEach((l) => (l.style.fontSize = `${F}px`));
    $("#coverName").style.gap = `${F * 0.18}px`;
  }
}
fitCover();

/* =========================================================
   Media: play / draw only while visible
   ========================================================= */

const visible = new Set();
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  const el = e.target;
  if (e.isIntersecting) {
    visible.add(el);
    if (el.tagName === "VIDEO" && !reduce) { if (!el.src) el.src = el.dataset.src; el.play().catch(() => {}); }
  } else {
    visible.delete(el);
    if (el.tagName === "VIDEO") el.pause();
  }
}), { rootMargin: "100px" });
function watchMedia(root) {
  $$("video[data-src]", root).forEach((v) => io.observe(v));
  $$("canvas[data-sim]", root).forEach((c) => io.observe(c));
}
watchMedia(document);

const t0 = performance.now();
let lastSim = 0;
(function simLoop(now) {
  requestAnimationFrame(simLoop);
  if (now - lastSim < 33) return;
  lastSim = now;
  $$("canvas[data-sim]").forEach((c) => {
    if (!visible.has(c) && c.dataset.drawn) return;
    c.dataset.drawn = 1;
    drawSim(c.getContext("2d"), c.width, c.height, c.dataset.sim, reduce ? 6 : (now - t0) / 1000);
  });
})(t0);

/* =========================================================
   Case study
   ========================================================= */

const caseEl = $("#case");
let lenis = null;
let lastFocus = null;

function openCase(key) {
  const p = CASES[key];
  if (!p) return;
  lastFocus = document.activeElement;
  $("#caseKicker").textContent = p.k;
  $("#caseTitle").textContent = p.t;
  $("#caseMeta").textContent = p.meta || "";
  $("#caseMedia").innerHTML = mediaHTML(p, p.t, true);
  const sec = (h, inner) => `<section class="case-sec"><h3>${h}</h3>${inner}</section>`;
  $("#caseBody").innerHTML =
    sec("The problem", `<p>${esc(p.problem)}</p>`)
    + sec("What I built", `<p>${esc(p.built)}</p>`)
    + (p.result.length ? sec("The result", `<ul>${p.result.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>`) : "")
    + sec("How it works", `<div class="flow">${p.flow.map((f) => `<span>${esc(f)}</span>`).join("<i>→</i>")}</div>`)
    + sec("Built with", `<p>${p.stack.map(esc).join(" · ")}</p>`)
    + (p.rec ? sec("Recognition", `<p>${esc(p.rec)}</p>`) : "")
    + (p.link ? `<a class="case-link" href="${esc(p.link[1])}" target="_blank" rel="noopener">${esc(p.link[0])} ↗</a>` : "")
    + (p.sim ? `<p class="case-note">The preview is an animated simulation of how it works, not a screen recording.</p>` : "");
  caseEl.hidden = false;
  watchMedia(caseEl);
  if (lenis) lenis.stop();
  document.body.style.overflow = "hidden";
  if (!reduce && window.gsap) gsap.fromTo(".case-panel", { xPercent: 100 }, { xPercent: 0, duration: 0.6, ease: "expo.out" });
  $(".case-close").focus();
}
function closeCase() {
  if (caseEl.hidden) return;
  $$("video", caseEl).forEach((v) => v.pause());
  caseEl.hidden = true;
  $("#caseMedia").innerHTML = "";
  document.body.style.overflow = "";
  if (lenis) lenis.start();
  if (lastFocus) lastFocus.focus();
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-case]");
  if (b && !caseEl.contains(b)) openCase(b.dataset.case);
});
caseEl.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeCase(); });
addEventListener("keydown", (e) => { if (e.key === "Escape") closeCase(); });

/* =========================================================
   Scratch the name: the black scrapes away to yellow, with the name in black underneath
   ========================================================= */

const cursor = $("#cursor"), cursorLabel = $("#cursorLabel");
const scratch = (() => {
  const cv = $("#scratch"), ctx = cv.getContext("2d"), cover = $("#cover"), name = $("#coverName");
  const reveal = document.createElement("canvas"), rctx = reveal.getContext("2d");
  const mask = document.createElement("canvas"), mctx = mask.getContext("2d");
  const strokes = [];
  let dpr = 1, w = 0, h = 0, last = null, running = false, dirty = true;
  const HOLD = 2600, FADE = 1600;

  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = cover.clientWidth; h = cover.clientHeight;
    for (const c of [cv, reveal, mask]) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    for (const c of [ctx, rctx, mctx]) c.setTransform(dpr, 0, 0, dpr, 0, 0);
    dirty = true;
  }

  // the layer underneath: yellow, faint black hazard stripes, and the name in black, letter for letter
  function paintReveal() {
    if (name.dataset.shrunk) return;
    rctx.clearRect(0, 0, w, h);
    rctx.fillStyle = YELLOW;
    rctx.fillRect(0, 0, w, h);
    rctx.save();
    rctx.globalAlpha = 0.08;
    rctx.strokeStyle = "#0a0a0a";
    rctx.lineWidth = 16;
    for (let x = -h; x < w + h; x += 52) { rctx.beginPath(); rctx.moveTo(x, h); rctx.lineTo(x + h, 0); rctx.stroke(); }
    rctx.restore();
    const cr = cover.getBoundingClientRect();
    rctx.fillStyle = "#0a0a0a";
    rctx.textBaseline = "alphabetic";
    nameLines.forEach((line) => {
      const cs = getComputedStyle(line);
      const F = parseFloat(cs.fontSize);
      const L = parseFloat(cs.lineHeight) || F * 0.86;
      rctx.font = `400 ${F}px "Six Caps"`;
      const m = rctx.measureText("H");
      const base = (L - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
      $$(".ch", line).forEach((ch) => {
        const r = ch.getBoundingClientRect();
        rctx.fillText(ch.textContent, r.left - cr.left, r.top - cr.top + base);
      });
    });
    dirty = false;
  }

  function addStroke(x0, y0, x1, y1) {
    const nx = -(y1 - y0), ny = x1 - x0, len = Math.hypot(nx, ny) || 1;
    const scratches = Array.from({ length: 6 }, () => {
      const o = (Math.random() - 0.5) * 84;
      return [(nx / len) * o, (ny / len) * o, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, 1.5 + Math.random() * 3];
    });
    strokes.push({ x0, y0, x1, y1, t: performance.now(), scratches });
    if (strokes.length > 500) strokes.shift();
    if (!running) { running = true; requestAnimationFrame(frame); }
  }

  function frame(now) {
    if (dirty) paintReveal();
    mctx.clearRect(0, 0, w, h);
    mctx.lineCap = "round"; mctx.lineJoin = "round"; mctx.strokeStyle = "#000";
    for (let i = strokes.length - 1; i >= 0; i--) {
      const s = strokes[i], age = now - s.t;
      const a = age < HOLD ? 1 : 1 - (age - HOLD) / FADE;
      if (a <= 0) { strokes.splice(i, 1); continue; }
      // heal by narrowing (not fading), so the scrape stays crisp yellow and black until it closes
      const k = a * a * (3 - 2 * a);
      mctx.lineWidth = 60 * k;
      mctx.beginPath(); mctx.moveTo(s.x0, s.y0); mctx.lineTo(s.x1, s.y1); mctx.stroke();
      if (k > 0.35) for (const [ox, oy, jx, jy, lw] of s.scratches) {        // ragged edges, like scraped paint
        mctx.lineWidth = lw;
        mctx.beginPath(); mctx.moveTo(s.x0 + ox * k, s.y0 + oy * k); mctx.lineTo(s.x1 + ox * k + jx, s.y1 + oy * k + jy); mctx.stroke();
      }
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(mask, 0, 0, w, h);
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(reveal, 0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
    if (strokes.length) requestAnimationFrame(frame);
    else { running = false; ctx.clearRect(0, 0, w, h); }
  }

  const local = (e) => { const r = cover.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  function overName(e) {
    const r = name.getBoundingClientRect();
    return e.clientX > r.left - 30 && e.clientX < r.right + 30 && e.clientY > r.top - 30 && e.clientY < r.bottom + 30;
  }
  cover.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch" || name.dataset.shrunk || !overName(e)) { last = null; cursor.classList.remove("scratching"); return; }
    cursor.classList.add("scratching");
    const p = local(e);
    if (last && Math.hypot(p[0] - last[0], p[1] - last[1]) > 1) addStroke(last[0], last[1], p[0], p[1]);
    else if (!last) addStroke(p[0], p[1], p[0] + 0.1, p[1] + 0.1);
    last = p;
  });
  cover.addEventListener("pointerleave", () => { last = null; cursor.classList.remove("scratching"); });

  // phones: tap the name to scrape a patch where your finger lands
  cover.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "touch" || name.dataset.shrunk || !overName(e)) return;
    const [x, y] = local(e);
    let px = x - 40, py = y - 24;
    for (let i = 0; i < 7; i++) {               // a quick zig-zag, like a thumbnail scraping a card
      const nx = x - 40 + (i % 2 ? 80 : 0) + (Math.random() - 0.5) * 16, ny = y - 24 + i * 8;
      addStroke(px, py, nx, ny);
      px = nx; py = ny;
    }
  });

  size();
  addEventListener("resize", size);
  return { size, canvas: cv, refresh: () => { dirty = true; } };
})();

/* a small cursor that grows into a label over things you can open */
const pos = { x: -100, y: -100, tx: -100, ty: -100 };
if (finePointer) {
  addEventListener("pointermove", (e) => {
    pos.tx = e.clientX; pos.ty = e.clientY;
    cursor.classList.add("on");
    const t = e.target.closest && e.target.closest("[data-cursor]");
    cursor.classList.toggle("big", !!t);
    if (t) cursorLabel.textContent = t.dataset.cursor;
  }, { passive: true });
  document.addEventListener("pointerleave", () => cursor.classList.remove("on"));
  (function follow() {
    pos.x += (pos.tx - pos.x) * (reduce ? 1 : 0.25); pos.y += (pos.ty - pos.y) * (reduce ? 1 : 0.25);
    cursor.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    requestAnimationFrame(follow);
  })();
}

/* =========================================================
   Scroll motion
   ========================================================= */

const header = $("#top");
const rulerItems = $$("#ruler li");
const setRuler = (i) => rulerItems.forEach((li, j) => li.classList.toggle("on", j === i));

function countUp(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = 1;
  const v = +el.dataset.value, d = +el.dataset.decimals, pre = el.dataset.prefix, suf = el.dataset.suffix;
  const o = { n: 0 };
  gsap.to(o, { n: v, duration: 1.6, ease: "power3.out", onUpdate: () => { el.textContent = `${pre}${o.n.toFixed(d)}${suf}`; } });
}

if (window.gsap && window.ScrollTrigger && !reduce) {
  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({ lerp: 0.09 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const target = $(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0, duration: 1.4 });
  }));

  // cover: the name shrinks into the header corner
  const name = $("#coverName");
  gsap.timeline({
    scrollTrigger: {
      trigger: "#cover", start: "top top", end: "+=90%", pin: true, scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (self.progress > 0.02) { name.dataset.shrunk = 1; scratch.canvas.style.opacity = 0; }
        else { delete name.dataset.shrunk; scratch.canvas.style.opacity = 1; scratch.refresh(); }
      },
      onLeave: () => header.classList.add("on"),
      onEnterBack: () => header.classList.remove("on")
    }
  })
    .to(".cover-meta, .cover-foot", { opacity: 0, duration: 0.3 }, 0)
    .to(name, {
      scale: () => (stacked() ? 70 : 150) / name.offsetWidth,
      x: 0,
      y: () => -(name.getBoundingClientRect().top - $("#cover").getBoundingClientRect().top - 12),
      ease: "power2.inOut", duration: 1
    }, 0)
    .to(name, { opacity: 0, duration: 0.15 }, 0.88);

  // statement: words light up in order
  gsap.to("#statementText .w", {
    opacity: 1, stagger: 0.1, ease: "none",
    scrollTrigger: { trigger: "#statement", start: "top top", end: "+=130%", pin: true, scrub: 0.5 }
  });

  const mm = gsap.matchMedia();

  // wide screens: the rest of the story slides sideways
  mm.add("(min-width: 901px)", () => {
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const slide = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: "#journey", start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true,
        onUpdate: (self) => { $("#rulerFill").style.width = `${self.progress * 100}%`; },
        onLeave: () => setRuler(-1), onLeaveBack: () => setRuler(-1)
      }
    });

    $$(".panel", track).forEach((panel, i) => {
      ScrollTrigger.create({ trigger: panel, containerAnimation: slide, start: "left 60%", end: "right 60%", onToggle: (s) => { if (s.isActive) setRuler(i); } });
      const num = $(".stat-num", panel);
      ScrollTrigger.create({ trigger: num, containerAnimation: slide, start: "left 85%", once: true, onEnter: () => countUp(num) });
      const win = $(".window", panel);
      if (win) gsap.fromTo(win, { clipPath: "inset(0% 100% 0% 0%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left 85%", end: "left 25%", scrub: 0.4 }
      });
      gsap.fromTo($(".chapter-no", panel), { x: 140 }, {
        x: -60, ease: "none",
        scrollTrigger: { trigger: panel, containerAnimation: slide, start: "left right", end: "right left", scrub: true }
      });
    });
    $$(".quote p", track).forEach((q) => gsap.fromTo(q, { x: 220, opacity: 0.2 }, {
      x: 0, opacity: 1, ease: "none",
      scrollTrigger: { trigger: q, containerAnimation: slide, start: "left right", end: "left 40%", scrub: true }
    }));

    // ruler: jump straight to a chapter
    $$("#ruler button").forEach((b) => b.onclick = () => {
      const panel = document.getElementById(b.dataset.panel), st = slide.scrollTrigger;
      const frac = Math.min(1, Math.max(0, (panel.offsetLeft - innerWidth * 0.12) / dist()));
      lenis.scrollTo(st.start + frac * (st.end - st.start), { duration: 1.4 });
    });
  });

  // small screens: the same chapters, stacked
  mm.add("(max-width: 900px)", () => {
    $$(".panel, .quote", track).forEach((el) => gsap.from(el, { opacity: 0, y: 50, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%" } }));
    $$(".panel", track).forEach((panel) => {
      const num = $(".stat-num", panel);
      ScrollTrigger.create({ trigger: num, start: "top 85%", once: true, onEnter: () => countUp(num) });
    });
  });

  // the shelf: books drop into place, one after another
  gsap.from(".spine", {
    y: -120, opacity: 0, rotation: () => gsap.utils.random(-14, 14), stagger: 0.07, duration: 1.1, ease: "back.out(1.7)",
    clearProps: "transform,opacity",          // hand the transform back to CSS (tilt + hover lift)
    scrollTrigger: { trigger: ".shelf", start: "top 80%" }
  });
  gsap.from(".bookend", { x: 80, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".shelf", start: "top 80%" } });
  $$(".work-head h2, .next").forEach((h) => gsap.from(h, { yPercent: 30, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%" } }));

  addEventListener("resize", () => { fitCover(); scratch.size(); ScrollTrigger.refresh(); });
  document.fonts.ready.then(() => { fitCover(); scratch.size(); ScrollTrigger.refresh(); });
} else {
  // reduced motion or no GSAP: everything visible, header always on
  header.classList.add("on");
  $$("#statementText .w").forEach((w) => (w.style.opacity = 1));
  addEventListener("resize", () => { fitCover(); scratch.size(); });
  document.fonts && document.fonts.ready.then(() => { fitCover(); scratch.size(); });
}

window.__chapters = { lenis: () => lenis, openCase };
