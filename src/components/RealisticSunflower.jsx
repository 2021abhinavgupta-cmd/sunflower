import React from "react";

/**
 * Hyper-realistic sunflower SVG with:
 * - 26-petal layered structure (back + front), each with multi-stop gradients + veins
 * - Fibonacci-spiral seed disc with 3 seed types
 * - Detailed stem with creases, leaves with veins
 * - Soft drop shadows, ambient glow at bloom
 */
export default function RealisticSunflower({
  bloom = 1,
  growth = 1,
  sway = 0,
  tilt = 0,
  id = "main",
  width = 280,
  height = 600,
  showSorry = false,
}) {
  const PETALS_BACK = 16;
  const PETALS_FRONT = 14;

  const stemH = 390 * growth;
  const headY = 545 - stemH;
  const headVisible = growth > 0.5 ? Math.min(1, (growth - 0.5) / 0.28) : 0;
  const petalScale = bloom * headVisible;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 600"
      style={{
        overflow: "visible",
        filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.45))",
      }}
    >
      <defs>
        {/* ─── Petal gradients ─── */}
        <linearGradient id={`pg-front-${id}`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFFDE0" />
          <stop offset="20%" stopColor="#FFE135" />
          <stop offset="55%" stopColor="#F5A800" />
          <stop offset="82%" stopColor="#C97A00" />
          <stop offset="100%" stopColor="#7A4500" />
        </linearGradient>
        <linearGradient id={`pg-back-${id}`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFD96B" />
          <stop offset="40%" stopColor="#E89800" />
          <stop offset="75%" stopColor="#A05800" />
          <stop offset="100%" stopColor="#4A2600" />
        </linearGradient>
        <linearGradient id={`pg-mid-${id}`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFEEA0" />
          <stop offset="30%" stopColor="#F9C800" />
          <stop offset="65%" stopColor="#D48500" />
          <stop offset="100%" stopColor="#7A4200" />
        </linearGradient>

        {/* ─── Center disc gradient ─── */}
        <radialGradient id={`disc-${id}`} cx="0.38" cy="0.32" r="0.72">
          <stop offset="0%" stopColor="#8B5520" />
          <stop offset="30%" stopColor="#5A3010" />
          <stop offset="65%" stopColor="#2E1608" />
          <stop offset="100%" stopColor="#0F0800" />
        </radialGradient>
        <radialGradient id={`disc-hi-${id}`} cx="0.3" cy="0.25" r="0.5">
          <stop offset="0%" stopColor="rgba(255,220,100,0.18)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* ─── Stem gradient ─── */}
        <linearGradient id={`stem-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1A3508" />
          <stop offset="25%" stopColor="#2E5C10" />
          <stop offset="50%" stopColor="#5A9C28" />
          <stop offset="75%" stopColor="#3B6D14" />
          <stop offset="100%" stopColor="#1A3508" />
        </linearGradient>

        {/* ─── Leaf gradient ─── */}
        <linearGradient id={`leaf-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8FD040" />
          <stop offset="35%" stopColor="#5A9820" />
          <stop offset="70%" stopColor="#2E5C0A" />
          <stop offset="100%" stopColor="#162E04" />
        </linearGradient>
        <linearGradient id={`leaf2-${id}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7AC030" />
          <stop offset="40%" stopColor="#4A8018" />
          <stop offset="100%" stopColor="#1A3805" />
        </linearGradient>

        {/* ─── Glow filter ─── */}
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`softglow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`shadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.35" />
        </filter>

        {/* ─── Petal texture with living micro-tremor ─── */}
        <filter id={`ptex-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise">
            <animate attributeName="baseFrequency" values="0.63;0.67;0.65;0.62;0.66;0.63" dur="4.5s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* ════════ STEM ════════ */}
      <g style={{ transformOrigin: "140px 555px", transform: `scaleY(${growth})` }}>
        {/* Main stem body */}
        <path
          d={`M 135 555 Q 126 ${555 - stemH * 0.5} 133 ${headY + 22}
              L 147 ${headY + 22} Q 154 ${555 - stemH * 0.5} 145 555 Z`}
          fill={`url(#stem-${id})`}
        />
        {/* Stem highlight ridge */}
        <path
          d={`M 138 555 Q 131 ${555 - stemH * 0.5} 136 ${headY + 25}`}
          stroke="#8FD040" strokeWidth="1.5" fill="none" opacity="0.55"
          strokeLinecap="round"
        />
        {/* Stem crease shadow */}
        <path
          d={`M 142 555 Q 148 ${555 - stemH * 0.5} 144 ${headY + 25}`}
          stroke="#0F2A04" strokeWidth="1" fill="none" opacity="0.4"
          strokeLinecap="round"
        />
        {/* Small surface bumps */}
        {[0.3, 0.55, 0.75].map((frac, i) => {
          const y = 555 - stemH * frac;
          return (
            <ellipse
              key={i}
              cx={137 + (i % 2) * 6}
              cy={y}
              rx="3" ry="1.5"
              fill="#2E5C10" opacity="0.5"
            />
          );
        })}
      </g>

      {/* ════════ LEAVES ════════ */}
      {/* Left leaf at ~38% stem height */}
      {growth > 0.35 && (() => {
        const sc = Math.min(1, (growth - 0.35) / 0.28);
        const oy = 555 - 390 * 0.38;
        return (
          <g
            key="leaf-left"
            style={{
              transformOrigin: `138px ${oy}px`,
              transform: `scale(${sc})`,
              opacity: sc,
            }}
            filter={`url(#shadow-${id})`}
          >
            {/* Main leaf shape */}
            <path
              d={`M 138 ${oy} Q 78 ${oy - 45} 22 ${oy + 12}
                  Q 55 ${oy + 35} 138 ${oy + 14} Z`}
              fill={`url(#leaf-${id})`}
            />
            {/* Leaf tip highlight */}
            <path
              d={`M 138 ${oy + 2} Q 95 ${oy - 12} 40 ${oy + 6}`}
              stroke="#A8E060" strokeWidth="1.2" fill="none" opacity="0.5"
            />
            {/* Main vein */}
            <path
              d={`M 138 ${oy + 6} Q 96 ${oy + 12} 26 ${oy + 14}`}
              stroke="#1A3805" strokeWidth="1.8" fill="none" opacity="0.7"
              strokeLinecap="round"
            />
            {/* Secondary veins */}
            {[0.25, 0.45, 0.65].map((t, i) => {
              const lx = 138 - t * 110;
              const ly = oy + 8 + t * 6;
              return (
                <path
                  key={i}
                  d={`M ${lx} ${ly} Q ${lx - 12} ${ly - 16} ${lx - 20} ${ly - 22}`}
                  stroke="#1A3805" strokeWidth="0.9" fill="none" opacity="0.5"
                />
              );
            })}
          </g>
        );
      })()}

      {/* Right leaf at ~52% stem height */}
      {growth > 0.42 && (() => {
        const sc = Math.min(1, (growth - 0.42) / 0.28);
        const oy = 555 - 390 * 0.52;
        return (
          <g
            key="leaf-right"
            style={{
              transformOrigin: `142px ${oy}px`,
              transform: `scale(${sc})`,
              opacity: sc,
            }}
            filter={`url(#shadow-${id})`}
          >
            <path
              d={`M 142 ${oy} Q 202 ${oy - 45} 258 ${oy + 12}
                  Q 225 ${oy + 35} 142 ${oy + 14} Z`}
              fill={`url(#leaf2-${id})`}
            />
            <path
              d={`M 142 ${oy + 6} Q 184 ${oy + 12} 254 ${oy + 14}`}
              stroke="#1A3805" strokeWidth="1.8" fill="none" opacity="0.7"
              strokeLinecap="round"
            />
            {[0.25, 0.45, 0.65].map((t, i) => {
              const lx = 142 + t * 110;
              const ly = oy + 8 + t * 6;
              return (
                <path
                  key={i}
                  d={`M ${lx} ${ly} Q ${lx + 12} ${ly - 16} ${lx + 20} ${ly - 22}`}
                  stroke="#1A3805" strokeWidth="0.9" fill="none" opacity="0.5"
                />
              );
            })}
          </g>
        );
      })()}

      {/* Small upper-right leaf */}
      {growth > 0.62 && (() => {
        const sc = Math.min(1, (growth - 0.62) / 0.2);
        const oy = 555 - 390 * 0.72;
        return (
          <g
            style={{
              transformOrigin: `142px ${oy}px`,
              transform: `scale(${sc})`,
              opacity: sc * 0.85,
            }}
          >
            <path
              d={`M 142 ${oy} Q 185 ${oy - 30} 215 ${oy + 5}
                  Q 190 ${oy + 22} 142 ${oy + 10} Z`}
              fill={`url(#leaf2-${id})`}
            />
            <path
              d={`M 142 ${oy + 4} Q 175 ${oy + 9} 210 ${oy + 7}`}
              stroke="#1A3805" strokeWidth="1.4" fill="none" opacity="0.6"
            />
          </g>
        );
      })()}

      {/* ════════ FLOWER HEAD ════════ */}
      {headVisible > 0 && (
        <g
          transform={`translate(140 ${headY})`}
          filter={`url(#shadow-${id})`}
        >
          {/* Inner rotate group for tilt */}
          <g
            style={{
              transformOrigin: "0 0",
              transform: `rotate(${tilt}deg)`,
            }}
          >
            {/* Ambient bloom glow (behind everything) */}
            {bloom > 0.5 && (
              <ellipse
                cx="0" cy="0" rx="130" ry="120"
                fill="#FFD23E"
                opacity={bloom * headVisible * 0.18}
                style={{ filter: "blur(22px)" }}
              />
            )}

            {/* ── Back petals (darker, offset by half step) ── */}
            {Array.from({ length: PETALS_BACK }).map((_, i) => {
              const angle = (360 / PETALS_BACK) * i + 360 / (PETALS_BACK * 2);
              return (
                <g
                  key={`bp-${i}`}
                  transform={`rotate(${angle}) scale(${petalScale})`}
                >
                  {/* Main petal shape */}
                  <path
                    d="M 0 -46 C -11 -70 -14 -95 -7 -115 Q 0 -126 7 -115 C 14 -95 11 -70 0 -46 Z"
                    fill={`url(#pg-back-${id})`}
                    opacity="0.95"
                  />
                  {/* Petal crease */}
                  <path
                    d="M 0 -54 Q -3 -85 0 -112"
                    stroke="#7A4500" strokeWidth="0.8" fill="none" opacity="0.4"
                  />
                </g>
              );
            })}

            {/* ── Front petals (vivid, main layer) ── */}
            {Array.from({ length: PETALS_FRONT }).map((_, i) => {
              const angle = (360 / PETALS_FRONT) * i;
              // slight random-ish width variation for realism
              const w = 12 + (i % 3) * 2;
              return (
                <g
                  key={`fp-${i}`}
                  transform={`rotate(${angle}) scale(${petalScale})`}
                >
                  <path
                    d={`M 0 -44 C -${w} -68 -${w + 2} -96 -5 -112 Q 0 -122 5 -112 C ${w + 2} -96 ${w} -68 0 -44 Z`}
                    fill={`url(#pg-front-${id})`}
                  />
                  {/* Highlight vein */}
                  <path
                    d={`M -2 -56 Q -5 -82 -3 -108`}
                    stroke="#FFFCE0" strokeWidth="1.1" fill="none" opacity="0.65"
                    strokeLinecap="round"
                  />
                  {/* Sub-vein */}
                  <path
                    d={`M 2 -62 Q 5 -85 3 -106`}
                    stroke="#FFFCE0" strokeWidth="0.6" fill="none" opacity="0.35"
                  />
                  {/* Petal shadow edge */}
                  <path
                    d={`M 0 -44 C ${w} -68 ${w + 2} -96 5 -112`}
                    stroke="#A05800" strokeWidth="0.8" fill="none" opacity="0.3"
                  />
                </g>
              );
            })}

            {/* ── Mid inner petals (tiny, partially hidden by disc) ── */}
            {Array.from({ length: 10 }).map((_, i) => {
              const angle = (36 * i) + 18;
              return (
                <g
                  key={`mp-${i}`}
                  transform={`rotate(${angle}) scale(${petalScale * 0.6})`}
                >
                  <path
                    d="M 0 -40 C -6 -55 -6 -68 0 -78 C 6 -68 6 -55 0 -40 Z"
                    fill={`url(#pg-mid-${id})`}
                    opacity="0.85"
                  />
                </g>
              );
            })}

            {/* ── Seed disc ── */}
            <g style={{ transform: `scale(${headVisible})`, transformOrigin: "0 0" }}>
              {/* Outer ring (textured ring around disc) */}
              <circle r="48" fill="#3D2008" />
              <circle r="45" fill={`url(#disc-${id})`} />

              {/* Fibonacci-spiral seeds — 3 types for realism */}
              {Array.from({ length: 130 }).map((_, i) => {
                const phi = (i * 137.508 * Math.PI) / 180;
                const r = 2.0 * Math.sqrt(i);
                if (r > 43) return null;
                const cx = Math.cos(phi) * r;
                const cy = Math.sin(phi) * r;
                // outer seeds larger, inner smaller
                const sr = r > 30 ? 1.8 : r > 18 ? 1.5 : 1.15;
                const fill = r > 35
                  ? "#1A0A00"
                  : r > 20
                  ? "#3D2008"
                  : "#5A3510";
                return (
                  <ellipse
                    key={`seed-${i}`}
                    cx={cx} cy={cy}
                    rx={sr} ry={sr * 0.85}
                    fill={fill}
                    transform={`rotate(${(phi * 180) / Math.PI})`}
                    opacity="0.92"
                  />
                );
              })}

              {/* Specular highlight on disc */}
              <ellipse cx="-13" cy="-15" rx="16" ry="11"
                fill="url(#disc-hi-id)" opacity="0.22" />
              <ellipse cx="-13" cy="-15" rx="9" ry="6"
                fill="#FFD96B" opacity="0.14" />

              {/* Outer texture ring detail */}
              {Array.from({ length: 24 }).map((_, i) => {
                const a = (15 * i * Math.PI) / 180;
                return (
                  <ellipse
                    key={`rt-${i}`}
                    cx={Math.cos(a) * 46}
                    cy={Math.sin(a) * 46}
                    rx="2" ry="1.5"
                    fill="#2A1004"
                    transform={`rotate(${15 * i}, ${Math.cos(a) * 46}, ${Math.sin(a) * 46})`}
                    opacity="0.7"
                  />
                );
              })}

              {/* Sorry text at night */}
              {showSorry && (
                <text
                  x="0" y="7"
                  textAnchor="middle"
                  fontFamily="'Caveat', cursive"
                  fontSize="19"
                  fontWeight="700"
                  fill="#FFE680"
                  filter={`url(#glow-${id})`}
                >
                  sorry
                </text>
              )}
            </g>
          </g>
        </g>
      )}
    </svg>
  );
}
