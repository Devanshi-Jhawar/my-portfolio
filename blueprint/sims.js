// Live "simulations" for projects that have no video.
// Each draws one frame of a looping canvas animation at time t (seconds).

let ACCENT = "#ff8a3d";
// pages can recolour the simulations to match their own accent
export function setSimAccent(c) { ACCENT = c; }
const acc = (a) => { const n = parseInt(ACCENT.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const range = (p, a, b) => clamp((p - a) / (b - a));
const ease = (t) => 1 - Math.pow(1 - t, 3);

export function drawSim(ctx, w, h, kind, t) {
  ctx.save();
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  if (kind === "wardrobe") wardrobe(ctx, w, h, t);
  else if (kind === "unity") unity(ctx, w, h, t);
  else if (kind === "fleet") fleet(ctx, w, h, t);
  ctx.restore();
}

function header(ctx, w, left, right, bg = "#16130f") {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, 64);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(0, 63, w, 1);
  ctx.font = '700 22px "JetBrains Mono"';
  ctx.fillStyle = ACCENT;
  ctx.fillText(left, 32, 41);
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(240,232,220,0.6)";
  ctx.font = '500 20px "JetBrains Mono"';
  ctx.fillText(right, w - 32, 41);
  ctx.textAlign = "left";
  // live dot
  const blink = 0.5 + 0.5 * Math.sin(Date.now() / 300);
  ctx.fillStyle = acc(0.4 + blink * 0.6);
  ctx.beginPath(); ctx.arc(w - 32 - ctx.measureText(right).width - 22, 34, 6, 0, Math.PI * 2); ctx.fill();
}

/* ---------------- Wardrobe AI: YOLO boxes over a clothes rack ---------------- */

const GARMENTS = [
  { x: 120, label: "t-shirt", conf: 0.94, c: "#3d7ea6", pts: [[-30, 0], [30, 0], [70, 20], [85, 70], [55, 80], [48, 55], [48, 190], [-48, 190], [-48, 55], [-55, 80], [-85, 70], [-70, 20]] },
  { x: 228, label: "dress", conf: 0.91, c: "#c4673f", pts: [[-25, 0], [25, 0], [35, 60], [30, 90], [78, 300], [-78, 300], [-30, 90], [-35, 60]] },
  { x: 336, label: "shirt", conf: 0.96, c: "#ece4d4", pts: [[-30, 0], [30, 0], [65, 15], [75, 180], [55, 182], [48, 60], [48, 205], [-48, 205], [-48, 60], [-55, 182], [-75, 180], [-65, 15]] },
  { x: 446, label: "jacket", conf: 0.89, c: "#2f6f73", pts: [[-32, 0], [32, 0], [72, 18], [82, 215], [60, 217], [52, 70], [52, 235], [-52, 235], [-52, 70], [-60, 217], [-82, 215], [-72, 18]] },
  { x: 556, label: "trousers", conf: 0.93, c: "#3a3f55", pts: [[-45, 0], [45, 0], [50, 285], [12, 285], [0, 70], [-12, 285], [-50, 285]] }
];

function wardrobe(ctx, w, h, t) {
  ctx.fillStyle = "#1b1713";
  ctx.fillRect(0, 0, w, h);
  header(ctx, w, "WARDROBE AI · YOLOv11", "detecting");

  const cycle = 9, ph = (t % cycle) / cycle;
  const rackY = 140, top = rackY + 22;

  // rack
  ctx.strokeStyle = "#8a8070"; ctx.lineWidth = 6; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(50, rackY); ctx.lineTo(630, rackY); ctx.stroke();

  const scanX = 50 + range(ph, 0.05, 0.62) * 600;
  GARMENTS.forEach((g, i) => {
    const sway = Math.sin(t * 1.3 + i * 1.7) * 0.025;
    ctx.save();
    ctx.translate(g.x, rackY);
    ctx.rotate(sway);
    // hanger
    ctx.strokeStyle = "#b9ae9b"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -8, 8, Math.PI, Math.PI * 2.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-42, 24); ctx.lineTo(0, 4); ctx.lineTo(42, 24); ctx.stroke();
    // garment
    ctx.fillStyle = g.c;
    ctx.beginPath();
    g.pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y + 22) : ctx.moveTo(x, y + 22)));
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(-4, 30, 8, 60);
    ctx.restore();

    // detection box once the scan passes
    if (scanX > g.x + 40) {
      const xs = g.pts.map((p) => p[0]), ys = g.pts.map((p) => p[1]);
      const bx = g.x + Math.min(...xs) - 10, by = top + Math.min(...ys) - 10;
      const bw = Math.max(...xs) - Math.min(...xs) + 20, bh = Math.max(...ys) - Math.min(...ys) + 20;
      const k = ease(clamp((scanX - g.x - 40) / 60));
      ctx.globalAlpha = k;
      ctx.strokeStyle = ACCENT; ctx.lineWidth = 3;
      ctx.strokeRect(bx, by, bw, bh);
      const tag = `${g.label} ${g.conf.toFixed(2)}`;
      ctx.font = '700 17px "JetBrains Mono"';
      const tw = ctx.measureText(tag).width + 14;
      ctx.fillStyle = ACCENT;
      ctx.fillRect(bx, by + bh, tw, 26);
      ctx.fillStyle = "#1b1713";
      ctx.fillText(tag, bx + 7, by + bh + 19);
      ctx.globalAlpha = 1;
    }
  });

  // scan line
  if (ph < 0.66) {
    const g = ctx.createLinearGradient(scanX - 60, 0, scanX, 0);
    g.addColorStop(0, acc(0));
    g.addColorStop(1, acc(0.22));
    ctx.fillStyle = g;
    ctx.fillRect(scanX - 60, 80, 60, 560);
    ctx.fillStyle = ACCENT;
    ctx.fillRect(scanX, 80, 2, 560);
  }

  // outfit panel
  const px = 680, pw = w - px - 32;
  ctx.fillStyle = "#231e19";
  ctx.fillRect(px, 96, pw, 540);
  ctx.font = '700 18px "JetBrains Mono"';
  ctx.fillStyle = ACCENT;
  ctx.fillText("TODAY'S OUTFIT", px + 24, 136);
  const found = GARMENTS.filter((g) => scanX > g.x + 40).length;
  if (ph < 0.66) {
    ctx.font = '500 24px "Inter"';
    ctx.fillStyle = "#efe7da";
    ctx.fillText("Scanning your closet…", px + 24, 186);
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(px + 24, 210, pw - 48, 8);
    ctx.fillStyle = ACCENT;
    ctx.fillRect(px + 24, 210, (pw - 48) * (found / GARMENTS.length), 8);
    ctx.font = '500 18px "JetBrains Mono"';
    ctx.fillStyle = "rgba(239,231,218,0.6)";
    ctx.fillText(`${found} / ${GARMENTS.length} items found`, px + 24, 252);
  } else {
    const picks = [GARMENTS[2], GARMENTS[4], GARMENTS[3]];
    const names = ["White shirt", "Navy trousers", "Teal jacket"];
    picks.forEach((g, i) => {
      const k = ease(range(ph, 0.68 + i * 0.05, 0.76 + i * 0.05));
      ctx.globalAlpha = k;
      const y = 172 + i * 92 + (1 - k) * 14;
      ctx.fillStyle = g.c;
      ctx.fillRect(px + 24, y, 60, 60);
      ctx.font = '600 24px "Inter"';
      ctx.fillStyle = "#efe7da";
      ctx.fillText(names[i], px + 104, y + 28);
      ctx.font = '500 16px "JetBrains Mono"';
      ctx.fillStyle = "rgba(239,231,218,0.55)";
      ctx.fillText("already in your closet", px + 104, y + 52);
      ctx.globalAlpha = 1;
    });
    ctx.globalAlpha = ease(range(ph, 0.86, 0.92));
    ctx.font = '500 18px "JetBrains Mono"';
    ctx.fillStyle = ACCENT;
    ctx.fillText("✓ outfit ready", px + 24, 500);
    ctx.globalAlpha = 1;
  }

  ctx.font = '500 17px "JetBrains Mono"';
  ctx.fillStyle = "rgba(239,231,218,0.45)";
  ctx.fillText("10,000+ IMAGES · 35 CATEGORIES · LANGGRAPH AGENT", 32, h - 26);
}

/* ---------------- Claude → Unity: a prompt builds an isometric scene ---------------- */

const PROMPT = "Build a small desert town: a well in the square, four houses and some palm trees.";
// [gx, gy, height, top colour, side colour]
const BLOCKS = [
  [2, 2, 0.5, "#9aa3ad", "#6f7780"],                                      // well
  [0, 0, 1.6, "#e6c79a", "#b8956a"], [0, 1, 1.6, "#e6c79a", "#b8956a"],
  [4, 0, 2.2, "#d98a5f", "#a9633f"],
  [0, 4, 1.4, "#efe0c4", "#c2ad8a"], [1, 4, 1.4, "#efe0c4", "#c2ad8a"],
  [4, 4, 1.8, "#e6c79a", "#b8956a"], [4, 3, 1.8, "#e6c79a", "#b8956a"],
  [1, 2, 2.4, "#7b5a3a", "#5a4029"], [3, 1, 2.6, "#7b5a3a", "#5a4029"], [2, 4, 2.2, "#7b5a3a", "#5a4029"]
];
const PALMS = new Set([8, 9, 10]);

function isoCube(ctx, ox, oy, gx, gy, hgt, top, side, k) {
  const tw = 46, th = 23, z = hgt * 34 * k;
  const x = ox + (gx - gy) * tw, y = oy + (gx + gy) * th;
  ctx.fillStyle = side;
  ctx.beginPath(); ctx.moveTo(x - tw, y); ctx.lineTo(x, y + th); ctx.lineTo(x, y + th - z); ctx.lineTo(x - tw, y - z); ctx.closePath(); ctx.fill();
  ctx.fillStyle = shade(side, -18);
  ctx.beginPath(); ctx.moveTo(x + tw, y); ctx.lineTo(x, y + th); ctx.lineTo(x, y + th - z); ctx.lineTo(x + tw, y - z); ctx.closePath(); ctx.fill();
  ctx.fillStyle = top;
  ctx.beginPath(); ctx.moveTo(x, y - th - z); ctx.lineTo(x + tw, y - z); ctx.lineTo(x, y + th - z); ctx.lineTo(x - tw, y - z); ctx.closePath(); ctx.fill();
}
function palm(ctx, ox, oy, gx, gy, k) {
  const tw = 46, th = 23;
  const x = ox + (gx - gy) * tw, y = oy + (gx + gy) * th;
  const z = 80 * k;
  ctx.strokeStyle = "#7b5a3a"; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 8, y - z / 2, x + 4, y - z); ctx.stroke();
  if (k > 0.6) {
    ctx.fillStyle = "#4f8a4a";
    for (let a = 0; a < 5; a++) {
      const ang = (a / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(x + 4 + Math.cos(ang) * 20, y - z + Math.sin(ang) * 8, 24, 8, ang, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = clamp(((n >> 16) & 255) + amt, 0, 255), g = clamp(((n >> 8) & 255) + amt, 0, 255), b = clamp((n & 255) + amt, 0, 255);
  return `rgb(${r},${g},${b})`;
}

function unity(ctx, w, h, t) {
  ctx.fillStyle = "#1c1e22";
  ctx.fillRect(0, 0, w, h);
  header(ctx, w, "CLAUDE → UNITY · MCP", "scene build", "#15171a");

  const cycle = 11, ph = (t % cycle) / cycle;

  // chat panel
  const cx = 28, cw = 360;
  ctx.fillStyle = "#24272c";
  ctx.fillRect(cx, 88, cw, h - 116);
  ctx.font = '700 16px "JetBrains Mono"';
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fillText("PROMPT", cx + 20, 120);
  const typed = PROMPT.slice(0, Math.floor(range(ph, 0.02, 0.3) * PROMPT.length));
  ctx.fillStyle = "#efe7da";
  ctx.fillRect(cx + 20, 138, cw - 40, 176);
  ctx.fillStyle = "#1c1e22";
  ctx.font = '500 21px "Inter"';
  wrap(ctx, typed + (ph < 0.3 && Math.floor(t * 2) % 2 ? "|" : ""), cx + 36, 174, cw - 72, 30);

  const n = Math.floor(range(ph, 0.34, 0.82) * BLOCKS.length);
  if (ph > 0.32) {
    ctx.font = '700 16px "JetBrains Mono"';
    ctx.fillStyle = ACCENT;
    ctx.fillText("CLAUDE", cx + 20, 360);
    const lines = ["→ create_ground(6×6, sand)", "→ place_object(well)", "→ place_object(house) ×4", "→ place_object(palm) ×3", "→ set_lighting(sunset)"];
    ctx.font = '500 17px "JetBrains Mono"';
    lines.forEach((l, i) => {
      if (n >= i * 2 || ph > 0.8) {
        ctx.fillStyle = "rgba(239,231,218,0.8)";
        ctx.fillText(l, cx + 20, 396 + i * 32);
      }
    });
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillText(ph > 0.84 ? "✓ scene ready" : `placing ${n} / ${BLOCKS.length}`, cx + 20, h - 52);
  }

  // viewport
  const vx = 410, vw = w - vx - 28;
  const sky = ctx.createLinearGradient(0, 88, 0, h - 28);
  const sunset = ph > 0.8 ? range(ph, 0.8, 0.9) : 0;
  sky.addColorStop(0, sunset ? `rgba(${Math.round(60 + 140 * sunset)},${Math.round(70 + 40 * sunset)},90,1)` : "#3a4250");
  sky.addColorStop(1, "#2a2e35");
  ctx.fillStyle = sky;
  ctx.fillRect(vx, 88, vw, h - 116);
  ctx.font = '500 15px "JetBrains Mono"';
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillText("Scene  ·  Game", vx + 16, 112);

  const ox = vx + vw / 2, oy = 270;
  const ground = range(ph, 0.3, 0.36);
  for (let gx = 0; gx < 5; gx++) for (let gy = 0; gy < 5; gy++) {
    const tw = 46, th = 23;
    const x = ox + (gx - gy) * tw, y = oy + (gx + gy) * th;
    ctx.fillStyle = ground ? `rgba(226,196,148,${0.25 + 0.75 * ground})` : "rgba(255,255,255,0.05)";
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath(); ctx.moveTo(x, y - th); ctx.lineTo(x + tw, y); ctx.lineTo(x, y + th); ctx.lineTo(x - tw, y); ctx.closePath();
    ctx.fill(); ctx.stroke();
  }
  const order = BLOCKS.map((b, i) => ({ b, i })).filter(({ i }) => i < n || (i === n && ph < 0.82))
    .sort((a, b) => (a.b[0] + a.b[1]) - (b.b[0] + b.b[1]));
  for (const { b, i } of order) {
    const appear = i < n ? 1 : ease(clamp(((range(ph, 0.34, 0.82) * BLOCKS.length) - i)));
    if (appear <= 0) continue;
    if (PALMS.has(i)) palm(ctx, ox, oy, b[0], b[1], appear);
    else isoCube(ctx, ox, oy, b[0], b[1], b[2], b[3], b[4], appear);
  }
}

function wrap(ctx, text, x, y, maxW, lh) {
  const words = text.split(" ");
  let line = "", n = 0;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y + n * lh); line = word; n++; }
    else line = test;
  }
  ctx.fillText(line, x, y + n * lh);
}

/* ---------------- Fleet Control: robots moving on a live site map ---------------- */

const ROUTES = [
  { name: "R1", speed: 0.05, off: 0.0, pts: [[80, 140], [380, 140], [380, 400], [80, 400]] },
  { name: "R2", speed: 0.035, off: 0.3, pts: [[230, 270], [640, 270], [640, 600], [230, 600]] },
  { name: "R3", speed: 0.045, off: 0.6, pts: [[380, 140], [640, 140], [640, 400], [380, 400]] },
  { name: "R4", speed: 0.04, off: 0.15, pts: [[80, 400], [380, 400], [380, 600], [80, 600]] }
];
ROUTES.forEach((r) => {
  const pts = [...r.pts, r.pts[0]];
  r.lens = [0];
  for (let i = 1; i < pts.length; i++) r.lens.push(r.lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  r.closed = pts;
});
function onRoute(r, u) {
  const total = r.lens[r.lens.length - 1], d = (((u % 1) + 1) % 1) * total;
  for (let i = 1; i < r.lens.length; i++) {
    if (d <= r.lens[i]) {
      const k = (d - r.lens[i - 1]) / (r.lens[i] - r.lens[i - 1]);
      const a = r.closed[i - 1], b = r.closed[i];
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    }
  }
  return r.closed[0];
}

function fleet(ctx, w, h, t) {
  ctx.fillStyle = "#11161c";
  ctx.fillRect(0, 0, w, h);
  header(ctx, w, "FLEET CONTROL · SITE A", "live · ~3 s", "#0d1116");

  // map
  ctx.fillStyle = "#18202a";
  ctx.fillRect(28, 88, 650, h - 116);
  ctx.fillStyle = "#1f2935";
  for (const [x, y, bw, bh] of [[100, 160, 260, 220], [400, 160, 220, 90], [400, 290, 220, 90], [100, 420, 120, 160], [250, 420, 110, 160], [400, 420, 220, 160]]) ctx.fillRect(x, y, bw, bh);
  ctx.strokeStyle = "rgba(160,190,220,0.18)"; ctx.lineWidth = 14; ctx.lineCap = "square";
  for (const x of [80, 230, 380, 640]) { ctx.beginPath(); ctx.moveTo(x, 120); ctx.lineTo(x, 620); ctx.stroke(); }
  for (const y of [140, 270, 400, 600]) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(660, y); ctx.stroke(); }

  // drop points
  [[380, 140], [640, 600], [80, 600], [640, 140]].forEach(([x, y], i) => {
    const k = (t * 0.6 + i * 0.25) % 1;
    ctx.strokeStyle = acc(1 - k); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 8 + k * 22, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = ACCENT;
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
  });

  // robots + trails
  const states = [];
  ROUTES.forEach((r, i) => {
    const u = t * r.speed + r.off;
    for (let k = 14; k > 0; k--) {
      const [x, y] = onRoute(r, u - k * 0.006);
      ctx.fillStyle = `rgba(120,200,255,${0.25 * (1 - k / 14)})`;
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
    }
    const [x, y] = onRoute(r, u);
    ctx.fillStyle = "#e8f4ff";
    ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#78c8ff"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.stroke();
    ctx.font = '700 15px "JetBrains Mono"';
    ctx.fillStyle = "#e8f4ff";
    ctx.fillText(r.name, x + 20, y - 12);
    const lap = ((u % 1) + 1) % 1;
    states.push({ name: r.name, state: lap < 0.5 ? "Delivering" : lap < 0.9 ? "Returning" : "Docking", batt: 0.92 - ((t * 0.004 + i * 0.17) % 0.6), eta: Math.max(1, Math.round((1 - lap) * 9)) });
  });

  // side panel
  const px = 700, pw = w - px - 28;
  ctx.fillStyle = "#18202a";
  ctx.fillRect(px, 88, pw, h - 116);
  ctx.font = '700 16px "JetBrains Mono"';
  ctx.fillStyle = "rgba(232,244,255,0.5)";
  ctx.fillText("ROBOTS", px + 20, 120);
  states.forEach((s, i) => {
    const y = 150 + i * 106;
    ctx.fillStyle = "#1f2935";
    ctx.fillRect(px + 14, y, pw - 28, 92);
    ctx.font = '700 22px "JetBrains Mono"';
    ctx.fillStyle = "#e8f4ff";
    ctx.fillText(s.name, px + 30, y + 34);
    ctx.font = '500 18px "Inter"';
    ctx.fillStyle = s.state === "Delivering" ? ACCENT : "#78c8ff";
    ctx.fillText(s.state, px + 86, y + 34);
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(px + 30, y + 56, pw - 120, 10);
    ctx.fillStyle = s.batt < 0.45 ? "#e5b84b" : "#6fcf8a";
    ctx.fillRect(px + 30, y + 56, (pw - 120) * s.batt, 10);
    ctx.font = '500 15px "JetBrains Mono"';
    ctx.fillStyle = "rgba(232,244,255,0.55)";
    ctx.textAlign = "right";
    ctx.fillText(`${s.eta} min`, px + pw - 30, y + 66);
    ctx.textAlign = "left";
  });
}
