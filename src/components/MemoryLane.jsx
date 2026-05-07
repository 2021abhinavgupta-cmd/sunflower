import React, { useRef, useState } from "react";

const MEMORIES = [
  {
    emoji: "🏓",
    title: "pickle ball",
    text: "you laughed so hard the chai almost came out of your nose. I remember thinking the world doesn't deserve someone this radiant.",
    bg: "linear-gradient(135deg, #FFF8E7 0%, #FFE9A0 100%)",
    border: "#F5CC00",
    accent: "#C47A3A",
    tiltDir: 1,
  },
  {
    emoji: "🌧️",
    title: "rainy walk, no umbrella",
    text: "we got drenched and you kept twirling. I still play that moment in my head when I need a little sun.",
    bg: "linear-gradient(135deg, #F0E8FF 0%, #D8C8FF 100%)",
    border: "#9B72CF",
    accent: "#5A3080",
    tiltDir: -1,
  },
  {
    emoji: "🌙",
    title: "3 a.m. nonsense calls",
    text: "you'd ramble about stars and I'd pretend to be sleepy. truth is, I never wanted to hang up.",
    bg: "linear-gradient(135deg, #E8F5E0 0%, #C8EAB0 100%)",
    border: "#5A9820",
    accent: "#2E5C0A",
    tiltDir: 1,
  },
  {
    emoji: "🌻",
    title: "you, just being you",
    text: "the way you defend strays, the way you say 'arrey'. every tiny thing — gold.",
    bg: "linear-gradient(135deg, #FFF0E8 0%, #FFD0A8 100%)",
    border: "#F5A800",
    accent: "#A05800",
    tiltDir: -1,
  },
];

function MemoryCard({ memory, index }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -10, y: dx * 10 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      style={{
        background: memory.bg,
        border: `2px solid ${memory.border}`,
        borderRadius: 20,
        padding: "28px 24px",
        cursor: "default",
        transition: "box-shadow 0.3s, transform 0.15s",
        transform: hovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.04)`
          : `perspective(800px) rotateX(0) rotateY(0) scale(1)`,
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,0.22), 0 0 0 1px ${memory.border}66, inset 0 1px 0 rgba(255,255,255,0.6)`
          : `0 4px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.5)`,
        willChange: "transform",
        animation: `card-float-in 0.6s ${index * 0.12}s both ease-out`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Sheen overlay on hover */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(135deg, rgba(255,255,255,${hovered ? 0.18 : 0}) 0%, rgba(255,255,255,0) 60%)`,
        borderRadius: 20,
        pointerEvents: "none",
        transition: "background 0.3s",
      }} />

      <div style={{ fontSize: 36, marginBottom: 10 }}>{memory.emoji}</div>
      <h3 style={{
        fontFamily: "'Caveat', cursive",
        fontSize: 26,
        color: memory.accent,
        marginBottom: 10,
        lineHeight: 1.2,
      }}>
        {memory.title}
      </h3>
      <p style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 14.5,
        color: "#3A2800",
        lineHeight: 1.7,
        opacity: 0.88,
      }}>
        {memory.text}
      </p>

      {/* Decorative corner sunflower petal */}
      <div style={{
        position: "absolute", bottom: 12, right: 14,
        fontSize: 22, opacity: 0.25,
        transform: `rotate(${memory.tiltDir * 25}deg)`,
        pointerEvents: "none",
      }}>
        🌻
      </div>
    </div>
  );
}

export default function MemoryLane() {
  return (
    <>
      <style>{`
        @keyframes card-float-in {
          0% { opacity:0; transform: perspective(800px) translateY(40px) scale(0.95); }
          100% { opacity:1; transform: perspective(800px) translateY(0) scale(1); }
        }
        @keyframes title-shimmer {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      <div style={{ padding: "80px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
        {/* Section heading */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
            background: "linear-gradient(90deg, #FFD23E, #FFB347, #FF7E5F, #FFD23E)",
            backgroundSize: "300% 300%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "title-shimmer 4s ease infinite",
            marginBottom: 10,
          }}>
            our little garden of moments
          </h2>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            color: "#E8DBC0",
            fontSize: "1rem",
            opacity: 0.8,
          }}>
            a few sunny memories I keep folded in my pocket
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}>
          {MEMORIES.map((m, i) => (
            <MemoryCard key={i} memory={m} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}
