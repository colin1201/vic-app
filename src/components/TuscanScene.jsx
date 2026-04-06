export default function TuscanScene() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Sky gradient */}
        <linearGradient id="tuscan-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="40%" stopColor="#B0D4E8" />
          <stop offset="100%" stopColor="#D4E8F0" />
        </linearGradient>

        {/* Far mountain gradient */}
        <linearGradient id="far-mountain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7BA3B8" />
          <stop offset="100%" stopColor="#94B8C8" />
        </linearGradient>

        {/* Near mountain gradient */}
        <linearGradient id="near-mountain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6A9A6A" />
          <stop offset="100%" stopColor="#5A8A5A" />
        </linearGradient>

        {/* Golden wheat field gradients */}
        <linearGradient id="wheat-far" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#D4A843" />
          <stop offset="100%" stopColor="#C49A38" />
        </linearGradient>
        <linearGradient id="wheat-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DAB44E" />
          <stop offset="100%" stopColor="#C8A040" />
        </linearGradient>
        <linearGradient id="wheat-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0BE55" />
          <stop offset="100%" stopColor="#D0A840" />
        </linearGradient>

        {/* Green hill gradient */}
        <linearGradient id="green-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A9A3A" />
          <stop offset="100%" stopColor="#4A8A2A" />
        </linearGradient>

        {/* Foreground meadow */}
        <linearGradient id="meadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6AAA4A" />
          <stop offset="100%" stopColor="#4A8A30" />
        </linearGradient>

        {/* Tree canopy gradient */}
        <linearGradient id="tree-canopy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A8A3A" />
          <stop offset="100%" stopColor="#2A6A2A" />
        </linearGradient>

        {/* Cypress gradient */}
        <linearGradient id="cypress" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A5A2A" />
          <stop offset="100%" stopColor="#1A4A1A" />
        </linearGradient>

        {/* Cloud filter */}
        <filter id="cloud-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Sky */}
      <rect width="800" height="500" fill="url(#tuscan-sky)" />

      {/* Clouds */}
      <g opacity="0.6">
        <ellipse cx="150" cy="60" rx="60" ry="18" fill="white" filter="url(#cloud-blur)" />
        <ellipse cx="180" cy="55" rx="45" ry="15" fill="white" filter="url(#cloud-blur)" />
        <ellipse cx="120" cy="58" rx="35" ry="12" fill="white" filter="url(#cloud-blur)" />

        <ellipse cx="500" cy="80" rx="50" ry="16" fill="white" filter="url(#cloud-blur)" />
        <ellipse cx="530" cy="75" rx="40" ry="14" fill="white" filter="url(#cloud-blur)" />

        <ellipse cx="680" cy="45" rx="40" ry="12" fill="white" filter="url(#cloud-blur)" />
        <ellipse cx="710" cy="42" rx="30" ry="10" fill="white" filter="url(#cloud-blur)" />
      </g>

      {/* Far blue mountains */}
      <path d="M0 250 L50 190 L120 220 L180 170 L250 210 L320 160 L400 200 L460 175 L530 210 L600 165 L680 195 L750 180 L800 200 L800 280 L0 280Z"
        fill="url(#far-mountain)" opacity="0.5" />

      {/* Nearer green-blue mountains */}
      <path d="M0 270 L80 220 L140 250 L220 200 L300 240 L380 210 L450 235 L540 205 L620 230 L700 210 L800 240 L800 300 L0 300Z"
        fill="url(#near-mountain)" opacity="0.6" />

      {/* Distant green hills with trees */}
      <path d="M0 290 Q100 260 200 275 Q300 290 400 265 Q500 240 600 260 Q700 280 800 268 L800 320 L0 320Z"
        fill="#6A9A5A" opacity="0.7" />

      {/* Wheat field - far */}
      <path d="M0 310 Q150 285 300 295 Q450 305 550 290 Q650 275 800 290 L800 370 L0 370Z"
        fill="url(#wheat-far)" />

      {/* Field texture lines - far */}
      <g stroke="#B89030" strokeWidth="0.8" opacity="0.3">
        <path d="M0 315 Q200 295 400 305 Q600 315 800 300" fill="none" />
        <path d="M0 325 Q200 305 400 315 Q600 325 800 310" fill="none" />
        <path d="M0 340 Q200 320 400 330 Q600 340 800 325" fill="none" />
        <path d="M0 355 Q200 335 400 345 Q600 355 800 340" fill="none" />
      </g>

      {/* Farmhouse cluster */}
      <g transform="translate(340, 255)">
        {/* Main house */}
        <rect x="0" y="10" width="35" height="25" fill="#E8D0B0" />
        <rect x="0" y="10" width="35" height="25" fill="#D4B896" opacity="0.5" />
        {/* Roof */}
        <path d="M-3 10 L17.5 -5 L38 10Z" fill="#B85C3A" />
        {/* Door */}
        <rect x="13" y="22" width="8" height="13" fill="#6B4530" />
        {/* Windows */}
        <rect x="4" y="16" width="5" height="5" fill="#87AACC" />
        <rect x="25" y="16" width="5" height="5" fill="#87AACC" />

        {/* Side building */}
        <rect x="38" y="15" width="22" height="20" fill="#E0C8A8" />
        <path d="M36 15 L49 5 L62 15Z" fill="#A85030" />
        <rect x="45" y="22" width="5" height="5" fill="#87AACC" />
      </g>

      {/* Cypress trees - left group */}
      <g>
        <ellipse cx="180" cy="270" rx="6" ry="30" fill="url(#cypress)" />
        <ellipse cx="195" cy="275" rx="5" ry="25" fill="#2A5A2A" />
        <ellipse cx="168" cy="278" rx="5" ry="22" fill="#1A5A1A" opacity="0.8" />
      </g>

      {/* Cypress trees - near house */}
      <g>
        <ellipse cx="325" cy="268" rx="5" ry="26" fill="url(#cypress)" />
        <ellipse cx="405" cy="265" rx="5.5" ry="28" fill="#2A5A2A" />
        <ellipse cx="418" cy="270" rx="4.5" ry="22" fill="#1A5A1A" opacity="0.8" />
      </g>

      {/* Cypress trees - right */}
      <g>
        <ellipse cx="580" cy="272" rx="5" ry="24" fill="url(#cypress)" />
        <ellipse cx="595" cy="268" rx="5.5" ry="27" fill="#2A5A2A" />
      </g>

      {/* Round tree near house */}
      <g>
        <rect x="295" y="265" width="4" height="15" fill="#4A3020" />
        <circle cx="297" cy="258" r="12" fill="url(#tree-canopy)" />
        <circle cx="293" cy="255" r="8" fill="#5A9A4A" opacity="0.6" />
      </g>

      {/* Another round tree - right */}
      <g>
        <rect x="468" y="268" width="3.5" height="14" fill="#4A3020" />
        <circle cx="470" cy="260" r="11" fill="url(#tree-canopy)" />
        <circle cx="466" cy="258" r="7" fill="#5A9A4A" opacity="0.5" />
      </g>

      {/* Wheat field - mid with path/track */}
      <path d="M0 355 Q150 340 300 348 Q500 360 650 345 Q730 338 800 345 L800 410 L0 410Z"
        fill="url(#wheat-mid)" />

      {/* Dirt path through fields */}
      <path d="M350 295 Q360 330 355 360 Q348 390 340 420 Q335 450 330 500"
        stroke="#C4A060" strokeWidth="8" fill="none" opacity="0.4" />
      <path d="M350 295 Q360 330 355 360 Q348 390 340 420 Q335 450 330 500"
        stroke="#D4B070" strokeWidth="4" fill="none" opacity="0.3" />

      {/* Field texture lines - mid */}
      <g stroke="#B08828" strokeWidth="0.8" opacity="0.25">
        <path d="M0 365 Q200 348 400 358 Q600 368 800 355" fill="none" />
        <path d="M0 378 Q200 360 400 370 Q600 380 800 368" fill="none" />
        <path d="M0 392 Q200 375 400 385 Q600 395 800 382" fill="none" />
      </g>

      {/* Green meadow foreground - left */}
      <path d="M0 400 Q80 385 160 395 Q240 405 300 410 L300 500 L0 500Z"
        fill="url(#meadow)" />

      {/* Green meadow foreground - right */}
      <path d="M550 405 Q650 395 720 400 Q770 405 800 398 L800 500 L550 500Z"
        fill="#5A9A3A" />

      {/* Wheat foreground - center */}
      <path d="M280 408 Q400 395 520 402 Q560 405 570 410 L570 500 L280 500Z"
        fill="url(#wheat-near)" />

      {/* Foreground meadow bottom */}
      <path d="M0 450 Q200 435 400 445 Q600 455 800 440 L800 500 L0 500Z"
        fill="#4A8A2A" />

      {/* Red poppies - left foreground */}
      <g>
        {/* Stems */}
        <line x1="30" y1="480" x2="28" y2="455" stroke="#3A7A2A" strokeWidth="1.5" />
        <line x1="55" y1="485" x2="52" y2="458" stroke="#3A7A2A" strokeWidth="1.5" />
        <line x1="75" y1="478" x2="78" y2="450" stroke="#3A7A2A" strokeWidth="1.5" />
        <line x1="95" y1="482" x2="92" y2="460" stroke="#3A7A2A" strokeWidth="1.5" />
        <line x1="42" y1="475" x2="44" y2="448" stroke="#3A7A2A" strokeWidth="1.5" />
        <line x1="110" y1="480" x2="108" y2="455" stroke="#3A7A2A" strokeWidth="1.5" />
        <line x1="130" y1="484" x2="132" y2="462" stroke="#3A7A2A" strokeWidth="1.5" />
        <line x1="15" y1="483" x2="18" y2="462" stroke="#3A7A2A" strokeWidth="1.5" />
        <line x1="65" y1="488" x2="62" y2="465" stroke="#3A7A2A" strokeWidth="1.2" />
        <line x1="148" y1="480" x2="145" y2="458" stroke="#3A7A2A" strokeWidth="1.5" />

        {/* Poppy flowers */}
        <circle cx="28" cy="453" r="5" fill="#E03030" />
        <circle cx="28" cy="453" r="2.5" fill="#C02020" />
        <circle cx="28" cy="453" r="1.2" fill="#2A2A2A" />

        <circle cx="52" cy="456" r="5.5" fill="#D82828" />
        <circle cx="52" cy="456" r="2.8" fill="#B82020" />
        <circle cx="52" cy="456" r="1.3" fill="#2A2A2A" />

        <circle cx="78" cy="448" r="5" fill="#E83838" />
        <circle cx="78" cy="448" r="2.5" fill="#C82828" />
        <circle cx="78" cy="448" r="1.2" fill="#2A2A2A" />

        <circle cx="92" cy="458" r="4.5" fill="#D52525" />
        <circle cx="92" cy="458" r="2.3" fill="#B52020" />
        <circle cx="92" cy="458" r="1.1" fill="#2A2A2A" />

        <circle cx="44" cy="446" r="4" fill="#E03030" />
        <circle cx="44" cy="446" r="2" fill="#C02020" />
        <circle cx="44" cy="446" r="1" fill="#2A2A2A" />

        <circle cx="108" cy="453" r="5" fill="#E23232" />
        <circle cx="108" cy="453" r="2.5" fill="#C22222" />
        <circle cx="108" cy="453" r="1.2" fill="#2A2A2A" />

        <circle cx="132" cy="460" r="4.5" fill="#D82828" />
        <circle cx="132" cy="460" r="2.3" fill="#B82020" />
        <circle cx="132" cy="460" r="1.1" fill="#2A2A2A" />

        <circle cx="18" cy="460" r="4" fill="#E53535" />
        <circle cx="18" cy="460" r="2" fill="#C52525" />
        <circle cx="18" cy="460" r="1" fill="#2A2A2A" />

        <circle cx="62" cy="463" r="3.5" fill="#DA2A2A" />
        <circle cx="62" cy="463" r="1.8" fill="#BA2020" />
        <circle cx="62" cy="463" r="0.9" fill="#2A2A2A" />

        <circle cx="145" cy="456" r="5" fill="#E03030" />
        <circle cx="145" cy="456" r="2.5" fill="#C02020" />
        <circle cx="145" cy="456" r="1.2" fill="#2A2A2A" />
      </g>

      {/* White wildflowers in meadow */}
      <g opacity="0.7">
        <circle cx="35" cy="442" r="1.5" fill="white" />
        <circle cx="60" cy="438" r="1.2" fill="white" />
        <circle cx="88" cy="445" r="1.5" fill="white" />
        <circle cx="120" cy="440" r="1.3" fill="white" />
        <circle cx="160" cy="438" r="1.5" fill="white" />
        <circle cx="680" cy="430" r="1.5" fill="white" />
        <circle cx="710" cy="435" r="1.2" fill="white" />
        <circle cx="740" cy="428" r="1.5" fill="white" />
        <circle cx="760" cy="434" r="1.3" fill="white" />
      </g>

      {/* Yellow wildflowers */}
      <g opacity="0.6">
        <circle cx="48" cy="440" r="1.3" fill="#F0D040" />
        <circle cx="100" cy="436" r="1.1" fill="#F0D040" />
        <circle cx="140" cy="442" r="1.3" fill="#F0D040" />
        <circle cx="690" cy="432" r="1.2" fill="#F0D040" />
        <circle cx="730" cy="430" r="1.1" fill="#F0D040" />
      </g>

      {/* Foreground right tree */}
      <g>
        <rect x="720" y="380" width="8" height="40" fill="#5A3A20" />
        <circle cx="724" cy="365" r="25" fill="#3A7A2A" />
        <circle cx="714" cy="358" r="18" fill="#4A8A3A" opacity="0.7" />
        <circle cx="735" cy="362" r="15" fill="#3A7A2A" opacity="0.8" />
      </g>

      {/* Birds in the distance */}
      <g stroke="#4A6A7A" strokeWidth="1.2" fill="none" opacity="0.4">
        <path d="M450 120 Q455 115 460 120" />
        <path d="M470 112 Q474 108 478 112" />
        <path d="M440 128 Q443 125 446 128" />
        <path d="M620 105 Q625 100 630 105" />
        <path d="M635 98 Q639 94 643 98" />
      </g>
    </svg>
  );
}
