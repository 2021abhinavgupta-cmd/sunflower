import React, { useState, useEffect } from "react";

// You can edit her qualities here!
const QUALITIES = [
  {
    id: 1,
    x: 18,
    y: 32,
    title: "your eyes",
    text: "your deer-like eyes hold a softness that makes me lose myself every single time i look into them"
  },
  {
    id: 2,
    x: 30,
    y: 18,
    title: "your smile",
    text: "your smile already feels like warmth, and that tiny birthmark beside it feels like the universe signed its favourite creation"
  },
  {
    id: 3,
    x: 48,
    y: 30,
    title: "your care",
    text: "you care so quietly and deeply that tenderness feels stitched into every part of your existence"
  },
  {
    id: 4,
    x: 68,
    y: 20,
    title: "your mind",
    text: "your intelligence is effortless and beautiful in the way it understands things far beyond the surface"
  },
  {
    id: 5,
    x: 82,
    y: 38,
    title: "your voice",
    text: "you are the only person i could listen to endlessly because your voice feels more like peace than conversation"
  },
  {
    id: 6,
    x: 78,
    y: 64,
    title: "your soul",
    text: "you carry kindness so naturally that your presence heals people more than your words ever could"
  },
  {
    id: 7,
    x: 62,
    y: 84,
    title: "your impact",
    text: "being with you makes me want to become softer, calmer, and a better version of myself"
  },
  {
    id: 8,
    x: 42,
    y: 78,
    title: "your talent",
    text: "there is art hidden in everything you create as if beauty naturally follows your existence"
  },
  {
    id: 9,
    x: 22,
    y: 62,
    title: "your beauty",
    text: "your beauty exists not only in your appearance but in every emotion and moment your presence touches"
  },
  {
    id: 10,
    x: 50,
    y: 52,
    title: "your love",
    text: "somehow your presence fills the empty spaces within me i never even realised existed"
  }
];

export default function Constellation() {
  const [clicked, setClicked] = useState([]); // array of clicked IDs in order
  const [hovered, setHovered] = useState(null);

  const handleClick = (q) => {
    if (!clicked.includes(q.id)) {
      setClicked([...clicked, q.id]);
    }
  };

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      background: "radial-gradient(ellipse at center, #1A1248 0%, #02040E 100%)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <style>{`
        @keyframes star-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 10px 2px rgba(255,230,150,0.4); }
          50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 20px 6px rgba(255,230,150,0.8); }
        }
        @keyframes draw-line {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fade-in-text {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header text */}
      <div style={{ position: "absolute", top: "10%", textAlign: "center", zIndex: 10, padding: "0 20px", pointerEvents: "none" }}>
        <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "#FFFBEA", margin: 0, textShadow: "0 0 24px rgba(255,230,150,0.5)" }}>
          a constellation of you
        </h2>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#C8B890", fontSize: "1.1rem", marginTop: 8 }}>
          {clicked.length === QUALITIES.length
            ? "and even the stars can't compete ✨"
            : "tap a glowing star to connect the dots..."}
        </p>
      </div>

      {/* SVG Canvas for drawing the connecting lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {clicked.map((id, index) => {
          if (index === 0) return null; // No line for the first star
          const prevId = clicked[index - 1];
          const startStar = QUALITIES.find(q => q.id === prevId);
          const endStar = QUALITIES.find(q => q.id === id);

          if (!startStar || !endStar) return null;

          return (
            <line
              key={`line-${prevId}-${id}`}
              x1={`${startStar.x}%`} y1={`${startStar.y}%`}
              x2={`${endStar.x}%`} y2={`${endStar.y}%`}
              stroke="rgba(255, 230, 150, 0.4)"
              strokeWidth="2"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              style={{ animation: "draw-line 1.5s ease-out forwards" }}
            />
          );
        })}
      </svg>

      {/* Interactive Stars */}
      {QUALITIES.map((q) => {
        const isClicked = clicked.includes(q.id);
        const isHovered = hovered === q.id;

        return (
          <div key={q.id} style={{
            position: "absolute",
            left: `${q.x}%`,
            top: `${q.y}%`,
            transform: "translate(-50%, -50%)",
            zIndex: isClicked || isHovered ? 20 : 5
          }}>
            {/* The clickable star dot */}
            <div
              onClick={() => handleClick(q)}
              onMouseEnter={() => setHovered(q.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: 14, height: 14, borderRadius: "50%",
                background: isClicked ? "#FFFBEA" : "#FFD23E",
                cursor: isClicked ? "default" : "pointer",
                animation: isClicked ? "none" : "star-pulse 2.5s infinite ease-in-out",
                boxShadow: isClicked
                  ? "0 0 30px 10px rgba(255,255,255,0.8)"
                  : "0 0 10px 2px rgba(255,230,150,0.4)",
                transition: "all 0.5s ease"
              }}
            />

            {/* The revealed text */}
            {isClicked && (
              <div style={{
                position: "absolute",
                top: "100%", left: "50%",
                transform: "translate(-50%, 15px)",
                width: "max-content", maxWidth: 220,
                background: "rgba(10,8,30,0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,210,62,0.3)",
                borderRadius: 16, padding: "16px 20px",
                textAlign: "center",
                animation: "fade-in-text 0.8s cubic-bezier(0.1, 0.9, 0.2, 1) forwards",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
              }}>
                <h4 style={{ fontFamily: "'Caveat', cursive", fontSize: 24, color: "#FFE680", margin: "0 0 8px 0" }}>
                  {q.title}
                </h4>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "rgba(255,251,234,0.85)", margin: 0, lineHeight: 1.5 }}>
                  {q.text}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Decorative tiny background stars */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            width: Math.random() * 3 + 1, height: Math.random() * 3 + 1,
            background: "#FFF", borderRadius: "50%",
            opacity: Math.random() * 0.4 + 0.1
          }} />
        ))}
      </div>
    </div>
  );
}
