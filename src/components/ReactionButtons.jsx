import React, { useState, useRef } from "react";

const REACTIONS = [
  { emoji: "🤗", label: "hugs", color: "#FFD23E", glow: "#FFD23E88" },
  { emoji: "💛", label: "forgive", color: "#FFB347", glow: "#FFB34788" },
  { emoji: "🌯", label: "shwarma", color: "#C47A3A", glow: "#C47A3A88" },
  { emoji: "🥟", label: "momos", color: "#F5CC00", glow: "#F5CC0088" },
];

function Particle({ x, y, color, id }) {
  return (
    <div
      key={id}
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: color,
        pointerEvents: "none",
        zIndex: 9999,
        animation: `particle-burst-${id % 8} 0.8s ease-out forwards`,
      }}
    />
  );
}

export default function ReactionButtons({ onReact }) {
  const [active, setActive] = useState(null);
  const [particles, setParticles] = useState([]);
  const [counts, setCounts] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });
  const nextId = useRef(0);

  const handleClick = (idx, e) => {
    setActive(idx);
    setCounts(c => ({ ...c, [idx]: c[idx] + 1 }));
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const burst = Array.from({ length: 14 }).map((_, i) => ({
      id: nextId.current++,
      x: cx, y: cy,
      color: REACTIONS[idx].color,
      angle: (i / 14) * 360,
    }));
    setParticles(p => [...p, ...burst]);
    setTimeout(() => setParticles(p => p.slice(14)), 900);
    if (onReact) onReact({ label: REACTIONS[idx].label, origin: { x: cx, y: cy } });
  };

  return (
    <>
      <style>{`
        @keyframes rbtn-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        @keyframes rbtn-pop { 0%{transform:scale(1)} 30%{transform:scale(1.22)} 60%{transform:scale(0.93)} 100%{transform:scale(1)} }
        @keyframes float-up { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-60px) scale(0.4)} }
        ${Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const dx = Math.cos(a) * 90; const dy = Math.sin(a) * 90;
        return `@keyframes particle-burst-${i}{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(${dx}px,${dy}px) scale(0)}}`;
      }).join("\n")}
      `}</style>

      <div style={{
        display: "flex", flexWrap: "wrap", gap: 16,
        justifyContent: "center", marginTop: 32,
      }}>
        {REACTIONS.map((r, i) => (
          <button
            key={i}
            onClick={e => handleClick(i, e)}
            style={{
              position: "relative",
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 28px",
              borderRadius: 999,
              border: `2px solid ${active === i ? r.color : "rgba(255,210,62,0.3)"}`,
              background: active === i
                ? `radial-gradient(circle at 40% 40%, ${r.color}55, ${r.color}22)`
                : "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              color: "#FFFBEA",
              fontFamily: "'Caveat', cursive",
              fontSize: 22,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: active === i
                ? `0 0 24px 6px ${r.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`
                : "0 2px 16px rgba(0,0,0,0.3)",
              animation: active === i ? "rbtn-pop 0.4s ease" : "none",
              transform: "translateZ(0)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.06) translateZ(0)";
              e.currentTarget.style.boxShadow = `0 0 30px 8px ${r.glow}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1) translateZ(0)";
              e.currentTarget.style.boxShadow = active === i
                ? `0 0 24px 6px ${r.glow}`
                : "0 2px 16px rgba(0,0,0,0.3)";
            }}
          >
            <span style={{ fontSize: 26, animation: active === i ? "rbtn-pulse 1.2s infinite" : "none" }}>
              {r.emoji}
            </span>
            <span>{r.label}</span>
            {counts[i] > 0 && (
              <span style={{
                position: "absolute", top: -10, right: -6,
                background: r.color, color: "#1A0A00",
                borderRadius: 999, fontSize: 13, fontWeight: 700,
                padding: "1px 7px", fontFamily: "'Nunito', sans-serif",
                animation: "float-up 0.7s ease-out",
                pointerEvents: "none",
              }}>
                +{counts[i]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: "fixed", left: p.x, top: p.y,
          width: 10, height: 10, borderRadius: "50%",
          background: p.color, pointerEvents: "none", zIndex: 9999,
          animation: `particle-burst-${p.id % 8} 0.8s ease-out forwards`,
        }} />
      ))}
    </>
  );
}
