import React, { useEffect, useRef, useState, useMemo } from "react";
import RealisticSunflower from "./RealisticSunflower";

// ─── Math helpers ────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerpC = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
const hex = h => { const v = h.replace("#", ""); return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)]; };
const rgb = ([r, g, b]) => `rgb(${r | 0},${g | 0},${b | 0})`;
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

// ─── Sky / sun / filter keyframes ────────────────────────────────────────────
const FILTER_KEYS = [
  { t: 0.00, br: 0.08, sat: 0.18, hue: 220, sep: 0.60 },
  { t: 0.10, br: 0.48, sat: 0.60, hue: 18, sep: 0.40 },
  { t: 0.22, br: 0.76, sat: 1.00, hue: -4, sep: 0.18 },
  { t: 0.40, br: 1.00, sat: 1.18, hue: 0, sep: 0.00 },
  { t: 0.55, br: 1.12, sat: 1.28, hue: 0, sep: 0.00 },
  { t: 0.72, br: 0.88, sat: 1.50, hue: -10, sep: 0.20 },
  { t: 0.85, br: 0.58, sat: 1.22, hue: -20, sep: 0.28 },
  { t: 0.93, br: 0.26, sat: 0.42, hue: 200, sep: 0.44 },
  { t: 1.00, br: 0.08, sat: 0.12, hue: 230, sep: 0.62 },
];
const SKY = [
  { t: 0.00, top: hex("#06091F"), bot: hex("#1A1F3A"), label: "PRE-DAWN" },
  { t: 0.10, top: hex("#3B2664"), bot: hex("#FF7E5F"), label: "DAWN" },
  { t: 0.22, top: hex("#FFB88C"), bot: hex("#FFE49C"), label: "SUNRISE" },
  { t: 0.40, top: hex("#5BA8E0"), bot: hex("#D5ECFF"), label: "MORNING" },
  { t: 0.55, top: hex("#3F8FD5"), bot: hex("#B6DDFF"), label: "NOON" },
  { t: 0.72, top: hex("#FF9E5C"), bot: hex("#FFD89B"), label: "GOLDEN HOUR" },
  { t: 0.85, top: hex("#5A2E5F"), bot: hex("#FF5E62"), label: "SUNSET" },
  { t: 0.93, top: hex("#1A1248"), bot: hex("#3D1B5A"), label: "DUSK" },
  { t: 1.00, top: hex("#02040E"), bot: hex("#0A1530"), label: "NIGHT" },
];
const SUN_C = [
  { t: 0.10, c: hex("#FF5E3A") }, { t: 0.22, c: hex("#FFB347") },
  { t: 0.50, c: hex("#FFF4B0") }, { t: 0.72, c: hex("#FFA042") },
  { t: 0.88, c: hex("#E64A2E") },
];

function interp(keys, t) {
  if (t <= keys[0].t) return { ...keys[0], k: 0 };
  if (t >= keys[keys.length - 1].t) return { ...keys[keys.length - 1], k: 1 };
  for (let i = 0; i < keys.length - 1; i++) {
    if (t >= keys[i].t && t <= keys[i + 1].t) {
      const k = (t - keys[i].t) / (keys[i + 1].t - keys[i].t);
      return { ...keys[i], k, next: keys[i + 1] };
    }
  }
  return keys[0];
}
function getSky(t) {
  const r = interp(SKY, t);
  if (!r.next) return { top: rgb(r.top), bot: rgb(r.bot), label: r.label };
  return { top: rgb(lerpC(r.top, r.next.top, r.k)), bot: rgb(lerpC(r.bot, r.next.bot, r.k)), label: r.k > 0.5 ? r.next.label : r.label };
}
function getSunColor(t) {
  const r = interp(SUN_C, t);
  if (!r.next) return rgb(r.c);
  return rgb(lerpC(r.c, r.next.c, r.k));
}
function getPhotoFilter(t) {
  const r = interp(FILTER_KEYS, t);
  const n = r.next || r; const k = r.k || 0;
  const br = lerp(r.br, n.br, k), sat = lerp(r.sat, n.sat, k), hue = lerp(r.hue, n.hue, k), sep = lerp(r.sep, n.sep, k);
  return `brightness(${br}) saturate(${sat}) hue-rotate(${hue}deg) sepia(${sep})`;
}

// ─── Star canvas ─────────────────────────────────────────────────────────────
function StarField() {
  const cvRef = useRef(null);
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    let stars = [], raf;
    const init = () => {
      cv.width = window.innerWidth; cv.height = window.innerHeight;
      stars = Array.from({ length: 240 }).map(() => ({
        x: Math.random() * cv.width, y: Math.random() * cv.height * 0.72,
        r: Math.random() * 1.8 + 0.3, tw: Math.random() * Math.PI * 2, sp: 0.4 + Math.random() * 1.8,
      }));
    };
    init(); window.addEventListener("resize", init);
    const tick = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      const op = parseFloat(cv.style.opacity || 0);
      if (op > 0.01) {
        stars.forEach(s => {
          s.tw += 0.025 * s.sp;
          const a = (Math.sin(s.tw) * 0.5 + 0.5) * 0.9 + 0.1;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,240,${a})`; ctx.fill();
          if (s.r > 1.2) {
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 2.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,240,200,${a * 0.12})`; ctx.fill();
          }
        });
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener("resize", init); cancelAnimationFrame(raf); };
  }, []);
  return (
    <canvas ref={cvRef} id="star-canvas"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0, transition: "opacity 0.5s" }}
      aria-hidden />
  );
}

// ─── Live grass/wind canvas ───────────────────────────────────────────────────
function GrassCanvas() {
  const cvRef = useRef(null);
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    let raf, t = 0;
    const W = 1400, H = 200;
    cv.width = W; cv.height = H;

    const blades = Array.from({ length: 320 }).map((_, i) => ({
      x: (i / 320) * W + (Math.random() - 0.5) * 8,
      baseH: 55 + Math.random() * 85,
      thick: 1.1 + Math.random() * 2.0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.55 + Math.random() * 0.9,
      lean: (Math.random() - 0.5) * 0.28,
      shade: Math.floor(Math.random() * 38),
    }));

    const tick = () => {
      t += 0.017;
      ctx.clearRect(0, 0, W, H);
      blades.forEach(b => {
        const sway = Math.sin(t * b.speed + b.phase) * 11 + b.lean * 16;
        const sway2 = Math.sin(t * b.speed * 1.4 + b.phase + 1.2) * 4;
        const g = ctx.createLinearGradient(b.x, H, b.x + sway, H - b.baseH);
        const l1 = 20 + b.shade; const l2 = 46 + b.shade;
        g.addColorStop(0, `hsl(100,54%,${l1 - 8}%)`);
        g.addColorStop(0.4, `hsl(105,59%,${l1}%)`);
        g.addColorStop(0.8, `hsl(108,64%,${l2}%)`);
        g.addColorStop(1, `hsl(110,70%,${l2 + 10}%)`);
        ctx.beginPath();
        ctx.moveTo(b.x, H);
        ctx.quadraticCurveTo(b.x + sway * 0.5, H - b.baseH * 0.55, b.x + sway + sway2, H - b.baseH);
        ctx.lineWidth = b.thick;
        ctx.strokeStyle = g;
        ctx.lineCap = "round";
        ctx.stroke();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas ref={cvRef}
      style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "22vh", pointerEvents: "none", zIndex: 10 }}
      aria-hidden />
  );
}

// ─── Clouds ───────────────────────────────────────────────────────────────────
function Clouds() {
  return (
    <div id="clouds-layer"
      style={{ position: "absolute", top: "10%", left: 0, right: 0, pointerEvents: "none", opacity: 0, transition: "opacity 0.6s" }}>
      {[{ l: 3, w: 220, h: 60 }, { l: 33, w: 300, h: 70 }, { l: 63, w: 190, h: 50 }].map((c, i) => (
        <div key={i} style={{ position: "absolute", left: `${c.l}%`, width: c.w, height: c.h, borderRadius: "50%", background: "rgba(255,255,255,0.88)", filter: "blur(9px)", transform: `translateY(${i * 14}px)` }} />
      ))}
    </div>
  );
}

// ─── Birds ────────────────────────────────────────────────────────────────────
function Birds() {
  return (
    <div id="birds-layer"
      style={{ position: "absolute", top: "20%", left: "0%", opacity: 0, transition: "opacity 0.4s", pointerEvents: "none", zIndex: 4 }}>
      {[0, 1, 2].map(i => (
        <svg key={i} width="26" height="13" viewBox="0 0 26 13" style={{ marginLeft: i * 30, marginTop: i % 2 ? 10 : 0, display: "block" }}>
          <path d="M1 8 Q6.5 1 13 8 Q19.5 1 25 8" stroke="#1a1a2a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      ))}
    </div>
  );
}

// ─── Fireflies ────────────────────────────────────────────────────────────────
function Fireflies() {
  const flies = useMemo(() =>
    Array.from({ length: 22 }).map((_, i) => ({
      id: i, x: Math.random() * 95, y: 38 + Math.random() * 52,
      d: Math.random() * 5, dur: 3.5 + Math.random() * 4,
    })), []);
  return (
    <div id="firefly-layer"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0, transition: "opacity 0.7s", zIndex: 5 }}>
      {flies.map(f => (
        <div key={f.id} style={{
          position: "absolute", left: `${f.x}%`, top: `${f.y}%`,
          width: 5, height: 5, borderRadius: "50%", background: "#FFF3A0",
          boxShadow: "0 0 10px 4px rgba(255,240,120,0.9),0 0 24px 8px rgba(255,220,60,0.45)",
          animation: `ff-float ${f.dur}s ease-in-out ${f.d}s infinite alternate,ff-blink 1.8s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Pollen ────────────────────────────────────────────────────────────────
function Pollen() {
  const cvRef = useRef(null);
  useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    let raf, t = 0;
    let particles = [];
    const init = () => {
      cv.width = window.innerWidth; cv.height = window.innerHeight;
      particles = Array.from({ length: 70 }).map(() => ({
        x: Math.random() * cv.width, y: Math.random() * cv.height,
        s: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 1) * 0.4 - 0.2,
        off: Math.random() * 100
      }));
    };
    init(); window.addEventListener("resize", init);
    const tick = () => {
      t += 0.015;
      ctx.clearRect(0, 0, cv.width, cv.height);
      const op = parseFloat(cv.style.opacity || 0);
      if (op > 0.01) {
        particles.forEach(p => {
          p.x += p.vx + Math.sin(t + p.off) * 0.6;
          p.y += p.vy;
          if (p.y < 0) p.y = cv.height;
          if (p.x < 0) p.x = cv.width;
          if (p.x > cv.width) p.x = 0;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 230, 160, ${op * (0.3 + Math.sin(t*2 + p.off)*0.2)})`;
          ctx.fill();
        });
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener("resize", init); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={cvRef} id="pollen-canvas" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0, transition: "opacity 0.4s", zIndex: 6 }} aria-hidden />;
}

// ─── Hills ────────────────────────────────────────────────────────────────────
function Hills() {
  return (
    <svg id="hills-layer"
      style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "38vh", pointerEvents: "none", zIndex: 2 }}
      viewBox="0 0 1440 400" preserveAspectRatio="none">
      <defs>
        {[1, 2, 3].map(n => (
          <linearGradient key={n} id={`hill${n}b`} x1="0" y1="0" x2="0" y2="1">
            <stop className={`hill${n}-stop1`} offset="0%" stopColor={`hsl(100,${38 + n * 4}%,${32 - n * 5}%)`} />
            <stop className={`hill${n}-stop2`} offset="100%" stopColor={`hsl(100,${42 + n * 4}%,${16 - n * 4}%)`} />
          </linearGradient>
        ))}
      </defs>
      <path d="M0 200 Q360 110 720 175 T1440 155 L1440 400 L0 400Z" fill="url(#hill1b)" />
      <path d="M0 255 Q360 195 720 235 T1440 218 L1440 400 L0 400Z" fill="url(#hill2b)" />
      <path d="M0 315 Q360 275 720 298 T1440 285 L1440 400 L0 400Z" fill="url(#hill3b)" />
    </svg>
  );
}

const GARDEN = [
  { id: "f1", x: 50, scale: 1.0, depth: 0, offset: 0.00, isHero: true },
  { id: "f2", x: 22, scale: 0.85, depth: 1, offset: 0.03 },
  { id: "f3", x: 78, scale: 0.88, depth: 1, offset: 0.05 },
  { id: "f4", x: 32, scale: 0.72, depth: 2, offset: 0.07 },
  { id: "f5", x: 68, scale: 0.75, depth: 2, offset: 0.04 },
  { id: "f6", x: 10, scale: 0.55, depth: 3, offset: 0.09 },
  { id: "f7", x: 90, scale: 0.58, depth: 3, offset: 0.11 },
];

function SunflowerScene({ f }) {
  const sceneRef = useRef(null);
  const [svgState, setSvgState] = useState({ growth: 0, bloom: 0, showSorry: false });

  useEffect(() => {
    const el = sceneRef.current; if (!el) return;
    let raf, t = 0;
    let cG = 0, cB = 0;

    const tick = () => {
      t += 0.016;
      const tG = parseFloat(el.dataset.growth || 0);
      const tB = parseFloat(el.dataset.bloom || 0);
      cG += (tG - cG) * 0.055;
      cB += (tB - cB) * 0.045;

      const wind = (
        Math.sin(t * 0.85) * 0.72 +
        Math.sin(t * 2.2 + 1.1) * 0.36 +
        Math.sin(t * 5.5 + 0.5) * 0.13 +
        Math.sin(t * 11.0 + 2.3) * 0.05
      ) * Math.min(1, cG * 1.5);

      // Base scale + wind rotation
      el.style.transform = `translateX(-50%) scale(${f.scale}) rotate(${wind}deg)`;

      const sorry = (el.dataset.sorry === "1");
      setSvgState(prev => {
        if (
          Math.abs(prev.growth - cG) < 0.0008 &&
          Math.abs(prev.bloom - cB) < 0.0008 &&
          prev.showSorry === sorry
        ) return prev;
        return { growth: cG, bloom: cB, showSorry: sorry };
      });

      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [f.scale]);

  return (
    <div ref={sceneRef} className="sunflower-scene"
      data-growth="0" data-bloom="0" data-sorry="0"
      data-offset={f.offset} data-hero={f.isHero ? "1" : "0"}
      style={{
        position: "absolute", bottom: f.depth >= 2 ? "5vh" : "-2vh", left: `${f.x}%`,
        transformOrigin: "50% 100%",
        transform: `translateX(-50%) scale(${f.scale})`,
        zIndex: 6 - f.depth, pointerEvents: "none", opacity: 0,
        filter: f.depth >= 2 ? `blur(${(f.depth - 1) * 1.5}px) brightness(${0.9 - f.depth * 0.08})` : "none",
        transition: "opacity 0.4s",
      }}>
      <RealisticSunflower
        growth={svgState.growth}
        bloom={svgState.bloom}
        showSorry={svgState.showSorry}
        sway={0}
        id={f.id}
        width={280}
        height={600}
      />
    </div>
  );
}

// ─── Letter card ─────────────────────────────────────────────────────────────
function LetterCard() {
  return (
    <div style={{
      background: "rgba(10,8,30,0.88)", backdropFilter: "blur(18px)",
      border: "1.5px solid rgba(255,230,120,0.35)", borderRadius: 24,
      padding: "36px 40px", boxShadow: "0 8px 64px rgba(0,0,0,0.7)", maxWidth: 520, color: "#F5E6C0",
    }}>
      {/* ─── YOU CAN CHANGE THE MESSAGE TEXT HERE ─── */}
      <p style={{ fontFamily: "'Caveat',cursive", fontSize: 32, color: "#FFE680", marginBottom: 16 }}>Hey Aarya 🌻</p>
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 17, lineHeight: 1.75, opacity: 0.9 }}>
        These sunflowers kept reminding me of you while I was making this,the way they keep searching for light no matter how dark the sky gets felt strangely similar to you.

        And somewhere between watching them rise and fall with the sun, I kept thinking about you a little more softly.

        I know I messed up with my words, and I truly wish I had expressed myself better.
      </p>
      <p style={{ fontFamily: "'Caveat',cursive", fontSize: 26, marginTop: 20, color: "#FFD23E" }}>— with all of it 💛</p>
      {/* ────────────────────────────────────────── */}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CinematicScroll() {
  const sectionRef = useRef(null);
  const [letterT, setLetterT] = useState(0);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const section = sectionRef.current; if (!section) return;
    let rafId = 0, currentP = 0, targetP = 0;

    const update = () => {
      currentP += (targetP - currentP) * 0.055; // Smooth scrolling factor
      const p = currentP;

      if (Math.abs(targetP - currentP) < 0.0001) {
        currentP = targetP;
        rafId = 0; // IMPORTANT: reset rafId so onScroll can trigger it again
      } else {
        rafId = requestAnimationFrame(update);
      }

      // Sky
      const sky = getSky(p);
      const skyEl = document.getElementById("sky-layer");
      if (skyEl) skyEl.style.background =
        `linear-gradient(180deg, ${sky.top} 0%, ${sky.bot} 45%, transparent 75%)`;

      // Time chip
      const chip = document.getElementById("time-chip");
      if (chip) {
        chip.textContent = sky.label;
        const dark = p > 0.85;
        chip.style.color = dark ? "#FFFBEA" : "#5B3200";
        chip.style.border = `1px solid ${dark ? "rgba(255,255,255,0.3)" : "rgba(91,50,0,0.22)"}`;
      }

      // Photo filter
      const filt = getPhotoFilter(p);
      const bgImg = document.getElementById("bg-image");
      if (bgImg) bgImg.style.filter = filt;
      const bgVid = document.getElementById("bg-video");
      if (bgVid) bgVid.style.filter = filt;

      // Sun
      const sunX = lerp(6, 94, p);
      const arc = Math.sin(p * Math.PI);
      const sunY = 88 - arc * 72;
      const sunVis = p > 0.07 && p < 0.91;
      const sunOp = p < 0.12 ? (p - 0.07) / 0.05 : p > 0.84 ? Math.max(0, 1 - (p - 0.84) / 0.07) : 1;
      const sunColor = getSunColor(p);

      const sunGlow = document.getElementById("sun-glow");
      if (sunGlow) {
        sunGlow.style.display = sunVis ? "block" : "none";
        sunGlow.style.left = `${sunX}%`;
        sunGlow.style.top = `${sunY}%`;
        sunGlow.style.opacity = sunOp * 0.65;
        sunGlow.style.background = `radial-gradient(circle,${sunColor}60 0%,transparent 55%)`;
      }
      const sunDisc = document.getElementById("sun-disc");
      if (sunDisc) {
        sunDisc.style.display = sunVis ? "block" : "none";
        sunDisc.style.left = `${sunX}%`;
        sunDisc.style.top = `${sunY}%`;
        sunDisc.style.opacity = sunOp;
      }
      const sunInner = document.getElementById("sun-disc-inner");
      if (sunInner) {
        sunInner.style.background =
          `radial-gradient(circle at 35% 35%,#FFFFFF 0%,${sunColor} 45%,${sunColor}CC 100%)`;
        sunInner.style.boxShadow =
          `0 0 80px 30px ${sunColor}BB, 0 0 160px 70px ${sunColor}66, 0 0 350px 120px ${sunColor}22`;
      }

      // Moon
      const moonOp = p > 0.88 ? clamp((p - 0.88) / 0.06, 0, 1) : 0;
      const moonProg = clamp((p - 0.88) / 0.12, 0, 1);
      const moonEl = document.getElementById("moon-layer");
      if (moonEl) {
        moonEl.style.opacity = moonOp;
        moonEl.style.left = `${lerp(12, 55, moonProg)}%`;
        moonEl.style.top = `${lerp(82, 18, moonProg)}%`;
      }

      // Stars
      const starOp = p > 0.84 ? clamp((p - 0.84) / 0.09, 0, 1) : p < 0.12 ? Math.max(0, 1 - p / 0.12) : 0;
      const starCv = document.getElementById("star-canvas");
      if (starCv) starCv.style.opacity = starOp;

      // Clouds
      const cVis = p > 0.25 && p < 0.80;
      const cOp = cVis ? clamp((p - 0.25) / 0.08, 0, 1) * (1 - Math.max(0, (p - 0.72) / 0.08)) : 0;
      const drift = (p - 0.25) * 14;
      const cloudsEl = document.getElementById("clouds-layer");
      if (cloudsEl) {
        cloudsEl.style.opacity = cOp;
        const k = cloudsEl.children;
        if (k[0]) k[0].style.left = `${3 + drift}%`;
        if (k[1]) k[1].style.left = `${33 + drift * 0.7}%`;
        if (k[2]) k[2].style.left = `${63 + drift * 0.5}%`;
      }

      // Birds
      const birdsEl = document.getElementById("birds-layer");
      if (birdsEl) {
        birdsEl.style.opacity = (p > 0.28 && p < 0.55) ? 0.7 : 0;
        birdsEl.style.left = `${(p - 0.28) * 260}%`;
      }

      // Fireflies
      const ffEl = document.getElementById("firefly-layer");
      if (ffEl) ffEl.style.opacity = p > 0.86 ? clamp((p - 0.86) / 0.08, 0, 1) : 0;

      // Pollen
      const pollenCv = document.getElementById("pollen-canvas");
      if (pollenCv) {
        const pop = p > 0.20 && p < 0.85 ? clamp((p - 0.20)/0.05, 0, 1) * (1 - clamp((p - 0.80)/0.05, 0, 1)) : 0;
        pollenCv.style.opacity = pop;
      }

      // Hills darkening
      const hd = p > 0.82 ? clamp((p - 0.82) / 0.12, 0, 1) : 0;
      for (let n = 1; n <= 3; n++) {
        const s1 = document.querySelector(`.hill${n}-stop1`);
        const s2 = document.querySelector(`.hill${n}-stop2`);
        if (s1) s1.setAttribute("stop-color", `hsl(100,${38 + n * 4}%,${32 - n * 5 - hd * 20}%)`);
        if (s2) s2.setAttribute("stop-color", `hsl(100,${42 + n * 4}%,${16 - n * 4 - hd * 12}%)`);
      }

      // Vignette
      const vig = document.getElementById("vignette");
      if (vig) vig.style.opacity = p > 0.85 ? 0.85 : 0.32;

      // Heading
      const hOp = p < 0.10 ? 0 : p < 0.18 ? (p - 0.10) / 0.08 : p < 0.55 ? 1 : Math.max(0, 1 - (p - 0.55) / 0.10);
      const headEl = document.getElementById("heading-block");
      if (headEl) {
        headEl.style.opacity = hOp;
        const h1 = headEl.querySelector("h1");
        if (h1) h1.style.color = p < 0.4 ? "#5B3200" : "#3B2200";
      }

      // Sunflowers: map over all instances based on their individual offsets
      const scenes = document.querySelectorAll(".sunflower-scene");
      scenes.forEach(scene => {
        const offset = parseFloat(scene.dataset.offset || 0);
        const localP = clamp((p - offset) / (1 - offset), 0, 1);

        const rawG = clamp((localP - 0.10) / 0.50, 0, 1);
        const rawB = clamp((localP - 0.40) / 0.30, 0, 1);
        const fFade = p > 0.80 ? Math.max(0, 1 - (p - 0.80) / 0.10) : 1;

        scene.dataset.growth = easeOutCubic(rawG);
        scene.dataset.bloom = easeOutCubic(rawB) * fFade;
        scene.dataset.sorry = (p > 0.90 && scene.dataset.hero === "1") ? "1" : "0";
        scene.style.opacity = rawG > 0.02 && p < 0.90 ? 1 : 0;
      });

      // Letter card — minimal React update
      const lt = clamp((p - 0.93) / 0.05, 0, 1);
      setLetterT(prev => Math.abs(prev - lt) > 0.01 ? lt : prev);

      if (p > 0.04) setShowHint(false);
    };

    const onScroll = () => { 
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      targetP = clamp(-rect.top / total, 0, 1);
      if (!rafId) rafId = requestAnimationFrame(update); 
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={sectionRef} style={{ position: "relative", width: "100%", height: "780vh" }}>
      <style>{`
        @keyframes ff-float { 0%{transform:translate(0,0)} 50%{transform:translate(18px,-14px)} 100%{transform:translate(-14px,9px)} }
        @keyframes ff-blink { 0%,100%{opacity:1;box-shadow:0 0 10px 4px rgba(255,240,120,0.9),0 0 24px 8px rgba(255,220,60,0.45)} 50%{opacity:0.25;box-shadow:0 0 4px 1px rgba(255,240,120,0.3)} }
      `}</style>

      <div style={{ position: "sticky", top: 0, left: 0, width: "100%", height: "100vh", overflow: "hidden" }}>

        {/* Clean Sky Background & Optional Video */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#FFFFFF" }}>
          {/* Add 'background.mp4' to your 'public' folder to use a video background */}
          <video id="bg-video" autoPlay loop muted playsInline src="/background.mp4"
            onError={(e) => { e.target.style.display = "none"; }}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "filter 0.5s", transform: "scale(1.04)" }} />
          <div id="sky-layer" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#06091F 0%,#1A1F3A 45%,transparent 75%)", mixBlendMode: "multiply", transition: "background 0.2s" }} />
        </div>

        <StarField />

        <div id="sun-glow" style={{ position: "absolute", width: "65vw", height: "65vw", transform: "translate(-50%,-50%)", opacity: 0, filter: "blur(22px)", pointerEvents: "none", display: "none" }} />
        <div id="sun-disc" style={{ position: "absolute", width: 170, height: 170, transform: "translate(-50%,-50%)", opacity: 0, pointerEvents: "none", display: "none" }}>
          <div id="sun-disc-inner" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 88, height: 88, borderRadius: "50%" }} />
        </div>

        <div id="moon-layer" style={{ position: "absolute", left: "12%", top: "82%", width: 120, height: 120, transform: "translate(-50%,-50%)", opacity: 0, pointerEvents: "none" }}>
          <div style={{ width: 76, height: 76, margin: 22, borderRadius: "50%", position: "relative", background: "radial-gradient(circle at 35% 35%,#FFFBF0 0%,#E8E4D0 60%,#B0ACAA 100%)", boxShadow: "0 0 55px 14px rgba(255,250,220,0.42)" }}>
            <div style={{ position: "absolute", top: "20%", left: "30%", width: 10, height: 10, borderRadius: "50%", background: "#B8B4A0", opacity: 0.45 }} />
            <div style={{ position: "absolute", top: "55%", left: "52%", width: 14, height: 14, borderRadius: "50%", background: "#A8A492", opacity: 0.38 }} />
          </div>
        </div>

        <Clouds />
        <Birds />
        <Pollen />
        <Hills />
        <GrassCanvas />
        <Fireflies />

        {/* Render the full garden */}
        {GARDEN.map(f => <SunflowerScene key={f.id} f={f} />)}

        <div id="heading-block"
          style={{ position: "absolute", top: "8vh", left: 0, right: 0, textAlign: "center", pointerEvents: "none", padding: "0 24px", opacity: 0, transition: "opacity 0.4s" }}>
          <h1 style={{ fontFamily: "'Caveat',cursive", fontSize: "clamp(2.8rem,7vw,5rem)", color: "#5B3200", textShadow: "0 2px 14px rgba(255,255,255,0.45)", margin: 0 }}>
            Hey Aarya 🌻
          </h1>
          <p style={{ fontFamily: "'Nunito',sans-serif", color: "#5B3200", marginTop: 8, fontSize: "1rem" }}>
            Scroll gently — let the sun do the rest.
          </p>
        </div>

        <div id="time-chip"
          style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", padding: "6px 18px", borderRadius: 999, background: "rgba(255,255,255,0.16)", backdropFilter: "blur(8px)", color: "#5B3200", border: "1px solid rgba(91,50,0,0.22)", fontFamily: "'Nunito',sans-serif", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", pointerEvents: "none" }}>
          PRE-DAWN
        </div>

        {showHint && (
          <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", textAlign: "center", pointerEvents: "none" }}>
            <div style={{ color: "#FFFBEA", opacity: 0.7, fontFamily: "'Nunito',sans-serif", fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 8 }}>scroll to begin</div>
            <div style={{ width: 1, height: 48, margin: "0 auto", background: "linear-gradient(to bottom,#FFFBEA,transparent)" }} />
          </div>
        )}

        {letterT > 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, opacity: letterT, transform: `translateY(${(1 - letterT) * 55}px)`, transition: "transform 0.5s ease-out" }}>
            <LetterCard />
          </div>
        )}

        <div id="vignette" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at center,transparent 48%,rgba(0,0,0,0.28) 100%)", opacity: 0.32, transition: "opacity 0.5s" }} />
      </div>
    </section>
  );
}
