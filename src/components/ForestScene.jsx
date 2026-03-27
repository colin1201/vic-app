export default function ForestScene() {
  return (
    <svg viewBox="0 0 400 220" className="w-full max-w-[320px]" xmlns="http://www.w3.org/2000/svg">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8D5C4" />
          <stop offset="60%" stopColor="#D4B896" />
          <stop offset="100%" stopColor="#C4A882" />
        </linearGradient>
        <linearGradient id="mountain1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B7565" />
          <stop offset="100%" stopColor="#6B5344" />
        </linearGradient>
        <linearGradient id="mountain2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A6555" />
          <stop offset="100%" stopColor="#5A4030" />
        </linearGradient>
        <linearGradient id="hills" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A7A4A" />
          <stop offset="100%" stopColor="#3B6B3B" />
        </linearGradient>
        <linearGradient id="foreground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D5F2D" />
          <stop offset="100%" stopColor="#1E4620" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="400" height="220" fill="url(#sky)" rx="16" />

      {/* Sun/moon */}
      <circle cx="310" cy="55" r="22" fill="#F5E6D0" opacity="0.9" />
      <circle cx="310" cy="55" r="18" fill="#F0DCC4" opacity="0.6" />

      {/* Clouds */}
      <ellipse cx="80" cy="40" rx="30" ry="8" fill="#F0DCC4" opacity="0.4" />
      <ellipse cx="95" cy="37" rx="20" ry="6" fill="#F0DCC4" opacity="0.3" />
      <ellipse cx="240" cy="50" rx="25" ry="7" fill="#F0DCC4" opacity="0.3" />

      {/* Far mountains */}
      <path d="M0 140 L60 75 L100 110 L150 65 L200 100 L250 70 L300 95 L350 60 L400 100 L400 220 L0 220Z" fill="url(#mountain1)" opacity="0.5" />

      {/* Near mountains */}
      <path d="M0 160 L50 100 L90 130 L140 85 L180 120 L230 90 L280 115 L340 80 L400 120 L400 220 L0 220Z" fill="url(#mountain2)" opacity="0.6" />

      {/* Rolling hills */}
      <path d="M0 170 Q50 145 100 160 Q150 175 200 155 Q250 135 300 155 Q350 175 400 160 L400 220 L0 220Z" fill="url(#hills)" opacity="0.8" />

      {/* Foreground hill */}
      <path d="M0 190 Q100 170 200 180 Q300 190 400 175 L400 220 L0 220Z" fill="url(#foreground)" />

      {/* Trees - far left cluster */}
      <g opacity="0.7">
        {/* Pine tree */}
        <rect x="28" y="140" width="3" height="20" fill="#2A4A2A" />
        <path d="M30 125 L20 150 L40 150Z" fill="#3A6A3A" />
        <path d="M30 118 L22 140 L38 140Z" fill="#3A6A3A" />
        <path d="M30 112 L24 130 L36 130Z" fill="#4A7A4A" />
      </g>

      {/* Trees - left */}
      <g>
        <rect x="58" y="135" width="4" height="25" fill="#2A4A2A" />
        <path d="M60 115 L46 148 L74 148Z" fill="#2D5F2D" />
        <path d="M60 105 L50 130 L70 130Z" fill="#3A7A3A" />
        <path d="M60 97 L52 118 L68 118Z" fill="#4A8A4A" />
      </g>

      {/* Trees - center left */}
      <g opacity="0.8">
        <rect x="108" y="145" width="3" height="18" fill="#2A4A2A" />
        <path d="M110 130 L101 152 L119 152Z" fill="#3B6B3B" />
        <path d="M110 123 L103 140 L117 140Z" fill="#4A7A4A" />
      </g>

      {/* Tall tree - center */}
      <g>
        <rect x="168" y="130" width="4" height="30" fill="#2A4A2A" />
        <path d="M170 108 L155 145 L185 145Z" fill="#2D5F2D" />
        <path d="M170 96 L159 125 L181 125Z" fill="#3A6A3A" />
        <path d="M170 86 L162 110 L178 110Z" fill="#4A7A4A" />
      </g>

      {/* Small tree */}
      <g opacity="0.6">
        <rect x="218" y="148" width="2.5" height="15" fill="#2A4A2A" />
        <path d="M219 137 L212 155 L226 155Z" fill="#3B6B3B" />
        <path d="M219 131 L214 145 L224 145Z" fill="#4A8A4A" />
      </g>

      {/* Trees - right cluster */}
      <g>
        <rect x="288" y="130" width="4" height="28" fill="#2A4A2A" />
        <path d="M290 110 L276 143 L304 143Z" fill="#2D5F2D" />
        <path d="M290 100 L280 125 L300 125Z" fill="#3A6A3A" />
        <path d="M290 92 L283 112 L297 112Z" fill="#4A7A4A" />
      </g>

      <g opacity="0.7">
        <rect x="318" y="138" width="3" height="22" fill="#2A4A2A" />
        <path d="M320 122 L311 148 L329 148Z" fill="#3B6B3B" />
        <path d="M320 115 L313 135 L327 135Z" fill="#4A8A4A" />
      </g>

      {/* Tiny distant trees */}
      <g opacity="0.4">
        <path d="M135 148 L131 158 L139 158Z" fill="#3A6A3A" />
        <path d="M250 150 L246 160 L254 160Z" fill="#3A6A3A" />
        <path d="M360 145 L356 156 L364 156Z" fill="#3A6A3A" />
        <path d="M375 148 L372 157 L378 157Z" fill="#3A6A3A" />
      </g>

      {/* Birds */}
      <g stroke="#6B5344" strokeWidth="1" fill="none" opacity="0.3">
        <path d="M120 35 Q125 30 130 35" />
        <path d="M140 30 Q144 26 148 30" />
        <path d="M270 42 Q274 38 278 42" />
      </g>
    </svg>
  );
}
