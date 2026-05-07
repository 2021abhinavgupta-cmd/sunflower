import React, { useState } from "react";
import CinematicScroll from "./components/CinematicScroll";
import ReactionButtons from "./components/ReactionButtons";
import Constellation from "./components/Constellation";
import MusicToggle from "./components/MusicToggle";


export default function App() {
  return (
    <div style={{position:"relative",width:"100%",background:"#02040E"}}>
      <style>{`
        @keyframes footer-glow { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes heart-beat { 0%,100%{transform:scale(1)} 30%{transform:scale(1.35)} 60%{transform:scale(0.9)} }
        @keyframes ff-float { 0%{transform:translate(0,0)} 50%{transform:translate(18px,-14px)} 100%{transform:translate(-14px,9px)} }
        @keyframes ff-blink { 0%,100%{opacity:1;box-shadow:0 0 10px 4px rgba(255,240,120,0.9),0 0 24px 8px rgba(255,220,60,0.45)} 50%{opacity:0.25;box-shadow:0 0 4px 1px rgba(255,240,120,0.3)} }
      `}</style>

      <MusicToggle />

      {/* Cinematic hero */}
      <CinematicScroll />

      {/* Reaction section */}
      <div style={{width:"100%",padding:"80px 24px",background:"linear-gradient(180deg,#02040E 0%,#0A1530 50%,#1A1F3A 100%)",textAlign:"center"}}>
        <h2 style={{fontFamily:"'Caveat',cursive",fontSize:"clamp(2.2rem,5vw,3.4rem)",color:"#FFE680",marginBottom:8}}>
          a quiet little favour?
        </h2>
        <p style={{fontFamily:"'Nunito',sans-serif",color:"#C8B890",fontSize:"1rem"}}>
          tap one — it sends a tiny signal back to me
        </p>
        <ReactionButtons />
      </div>

      {/* Constellation Section */}
      <div style={{width:"100%"}}>
        <Constellation />
      </div>

      {/* Footer */}
      <footer style={{width:"100%",padding:"80px 24px 64px",textAlign:"center",background:"linear-gradient(180deg,#3D2B60 0%,#5A2E5F 25%,#FF5E62 70%,#FFB88C 100%)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",bottom:-40,left:"50%",transform:"translateX(-50%)",width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,180,80,0.55) 0%,transparent 70%)",filter:"blur(30px)",pointerEvents:"none",animation:"footer-glow 3s ease-in-out infinite"}}/>
        <p style={{fontFamily:"'Caveat',cursive",fontSize:"clamp(2rem,5vw,3.2rem)",color:"#FFFBEA",margin:"0 0 14px",position:"relative"}}>
          and the sun rises again 🌅
        </p>
        <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,251,234,0.85)",fontSize:"1rem",marginBottom:28,position:"relative"}}>
          every morning, I'll grow a sunflower for you.
        </p>
      </footer>
    </div>
  );
}
