import React, { useState, useEffect, useRef } from "react";

// Simple music toggle — no external deps, uses Web Audio API for ambient drone if wanted
export default function MusicToggle() {
  const [on, setOn] = useState(false);
  const [hovered, setHovered] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize the audio element pointing to your custom song in the public folder
    const audio = new Audio("/song.mp3");
    audio.loop = true;
    audio.volume = 0.4; // Soft background volume
    audioRef.current = audio;

    // Handle when the song ends (though it's looping) or component unmounts
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (!on) {
      audio.play().catch(e => console.error("Audio playback failed. Please ensure the file exists:", e));
    } else {
      audio.pause();
    }
    setOn(v => !v);
  };

  return (
    <>
      <style>{`
        @keyframes music-wave {
          0%,100%{height:6px} 25%{height:14px} 50%{height:20px} 75%{height:10px}
        }
        @keyframes music-wave2 {
          0%,100%{height:14px} 25%{height:6px} 50%{height:10px} 75%{height:20px}
        }
        @keyframes music-wave3 {
          0%,100%{height:10px} 25%{height:20px} 50%{height:6px} 75%{height:14px}
        }
      `}</style>
      <button
        onClick={toggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={on ? "music off" : "music on"}
        style={{
          position: "fixed", top: 20, left: 20, zIndex: 100,
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 18px", borderRadius: 999,
          border: "1.5px solid rgba(255,210,62,0.4)",
          background: hovered
            ? "rgba(255,210,62,0.18)"
            : "rgba(10,8,30,0.65)",
          backdropFilter: "blur(14px)",
          color: "#FFE680",
          fontFamily: "'Nunito', sans-serif",
          fontSize: 13, fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.3s",
          boxShadow: hovered
            ? "0 0 20px rgba(255,210,62,0.3)"
            : "0 4px 20px rgba(0,0,0,0.35)",
        }}
      >
        {/* Animated bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 20 }}>
          {[
            { anim: "music-wave",  delay: "0s" },
            { anim: "music-wave2", delay: "0.15s" },
            { anim: "music-wave3", delay: "0.3s" },
            { anim: "music-wave",  delay: "0.45s" },
          ].map((b, i) => (
            <div key={i} style={{
              width: 3, borderRadius: 2,
              background: "#FFD23E",
              height: on ? 8 : 6,
              animation: on ? `${b.anim} 0.8s ${b.delay} ease-in-out infinite` : "none",
              transition: "height 0.3s",
            }} />
          ))}
        </div>
        {on ? "music off" : "music on"}
      </button>
    </>
  );
}
