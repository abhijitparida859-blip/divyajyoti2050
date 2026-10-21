// scripts/build_vedic_wallpapers.cjs
const fs = require('fs');
const path = require('path');

function generateTicks(rIn, rOut) {
  let s = '';
  for (let i = 0; i < 60; i++) {
    const rad = (i * 6 * Math.PI) / 180;
    const isMajor = i % 5 === 0;
    const r1 = isMajor ? rIn - 8 : rIn;
    const r2 = rOut;
    const x1 = (200 + r1 * Math.sin(rad)).toFixed(1);
    const y1 = (200 - r1 * Math.cos(rad)).toFixed(1);
    const x2 = (200 + r2 * Math.sin(rad)).toFixed(1);
    const y2 = (200 - r2 * Math.cos(rad)).toFixed(1);
    const col = isMajor ? '#FDE047' : 'rgba(253, 224, 71, 0.4)';
    const w = isMajor ? '2.5' : '1';
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" />`;
  }
  return s;
}

const COMMON_TICKS = generateTicks(170, 182);

const COMMON_HANDS = `
  <!-- Luxury Watch Hands (10:10 Classic Showcase) -->
  <g filter="url(#handsShadow)">
    <!-- Hour Hand -->
    <g transform="rotate(-54 200 200)">
      <polygon points="196,200 197,105 200,90 203,105 204,200 200,214" fill="#F1F5F9" stroke="#0F172A" stroke-width="1.2" />
      <line x1="200" y1="185" x2="200" y2="108" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" />
    </g>
    <!-- Minute Hand -->
    <g transform="rotate(58 200 200)">
      <polygon points="197,200 198,62 200,48 202,62 203,200 200,218" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.2" />
      <line x1="200" y1="185" x2="200" y2="65" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" />
    </g>
    <!-- Second Hand -->
    <g transform="rotate(205 200 200)">
      <line x1="200" y1="240" x2="200" y2="40" stroke="#EF4444" stroke-width="1.8" stroke-linecap="round" />
      <circle cx="200" cy="72" r="3.5" fill="#EF4444" />
      <circle cx="200" cy="225" r="4.5" fill="#EF4444" />
    </g>
    <!-- Center Cap -->
    <circle cx="200" cy="200" r="7" fill="#F59E0B" stroke="#0F172A" stroke-width="1.5" />
    <circle cx="200" cy="200" r="2.5" fill="#0F172A" />
  </g>
`;

const SMART_WATCH_BEZEL = `
  <!-- Outer Metallic Smart Watch Case -->
  <circle cx="200" cy="200" r="198" fill="none" stroke="url(#metalCaseGrad)" stroke-width="4" />
  <circle cx="200" cy="200" r="194" fill="none" stroke="#F59E0B" stroke-width="2" opacity="0.6" />
  <!-- Sapphire Glare Reflection -->
  <path d="M 60,60 Q 200,10 340,60 Q 200,100 60,60 Z" fill="url(#sapphireGlare)" opacity="0.4" pointer-events="none" />
`;

const SVG_DEFS_BASE = `
  <defs>
    <filter id="handsShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
    <filter id="glowGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <linearGradient id="metalCaseGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="30%" stop-color="#CA8A04"/>
      <stop offset="70%" stop-color="#EAB308"/>
      <stop offset="100%" stop-color="#713F12"/>
    </linearGradient>
    <linearGradient id="sapphireGlare" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
`;

// Build 20 Wallpapers data
const WALLPAPERS = [
  // 1. Nilachakra
  {
    id: 'nilachakra',
    nameOr: 'ଜଗନ୍ନାଥ ନୀଳଚକ୍ର ରୟାଲ୍',
    nameHi: 'जगन्नाथ नीलचक्र रॉयल',
    nameEn: 'Nilachakra Imperial Navy',
    category: 'sacred_symbol',
    categoryLabelOr: 'ପବିତ୍ର ପ୍ରତୀକ',
    categoryLabelHi: 'पवित्र प्रतीक',
    categoryLabelEn: 'Sacred Symbol',
    taglineOr: 'ଶ୍ରୀମନ୍ଦିର ଚୂଡ଼ାର ପବିତ୍ର ଅଷ୍ଟଧାତୁ ଚକ୍ର, ପତିତପାବନ ବାନା ଓ ନୀଳାଦ୍ରି କାନ୍ତି',
    taglineHi: 'श्रीक्षेत्र जगन्नाथ मंदिर का पावन नीलचक्र व पताका',
    taglineEn: 'Sacred 8-spoke Nilachakra with fluttering Patitapabana banner',
    primaryColor: '#F59E0B',
    glowColor: '#0284C7',
    accentColor: '#FDE047',
    badgeGradient: 'from-amber-500 via-sky-500 to-blue-700',
    centerpieceSvg: `
      <!-- Deep Imperial Navy Dial -->
      <radialGradient id="nilaBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#14366A"/>
        <stop offset="70%" stop-color="#071733"/>
        <stop offset="100%" stop-color="#020814"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#nilaBg)"/>
      ${COMMON_TICKS}
      
      <!-- Hour numerals (Odia / Roman style) -->
      <g fill="#FDE047" font-family="serif" font-size="14" font-weight="bold" text-anchor="middle">
        <text x="200" y="48">୧୨</text>
        <text x="358" y="205">୩</text>
        <text x="200" y="362">୬</text>
        <text x="42" y="205">୯</text>
      </g>

      <!-- Sacred Mandala Geometry -->
      <circle cx="200" cy="200" r="120" stroke="rgba(245, 158, 11, 0.25)" stroke-width="1.5" stroke-dasharray="4,4" fill="none"/>
      <circle cx="200" cy="200" r="85" stroke="#F59E0B" stroke-width="2" fill="none"/>

      <!-- 8 Golden Spokes with Trident Blades -->
      <g stroke="#FDE047" stroke-width="3" stroke-linecap="round">
        <line x1="200" y1="200" x2="200" y2="115" />
        <line x1="200" y1="200" x2="260" y2="140" />
        <line x1="200" y1="200" x2="285" y2="200" />
        <line x1="200" y1="200" x2="260" y2="260" />
        <line x1="200" y1="200" x2="200" y2="285" />
        <line x1="200" y1="200" x2="140" y2="260" />
        <line x1="200" y1="200" x2="115" y2="200" />
        <line x1="200" y1="200" x2="140" y2="140" />
      </g>
      <!-- Trident Spearheads on Spokes -->
      <g fill="#F59E0B">
        <polygon points="200,105 194,118 206,118" />
        <polygon points="200,295 194,282 206,282" />
        <polygon points="295,200 282,194 282,206" />
        <polygon points="105,200 118,194 118,206" />
        <circle cx="260" cy="140" r="5" fill="#FDE047"/>
        <circle cx="260" cy="260" r="5" fill="#FDE047"/>
        <circle cx="140" cy="260" r="5" fill="#FDE047"/>
        <circle cx="140" cy="140" r="5" fill="#FDE047"/>
      </g>

      <!-- Center Deep Celestial Sapphire Gem -->
      <circle cx="200" cy="200" r="32" fill="#0284C7" stroke="#FDE047" stroke-width="3" filter="url(#glowGlow)"/>
      <circle cx="200" cy="200" r="20" fill="#0369A1"/>
      <polygon points="200,185 204,196 215,200 204,204 200,215 196,204 185,200 196,196" fill="#BAE6FD"/>

      <!-- Red Patitapabana Flag with wave -->
      <path d="M 200,105 Q 215,90 235,98 Q 255,106 245,80 L 200,75 Z" fill="#EF4444" stroke="#B91C1C" stroke-width="1.5" />
      <line x1="200" y1="70" x2="200" y2="110" stroke="#FDE047" stroke-width="2.5" />

      <!-- Complication: Date Window at 3 o'clock -->
      <rect x="290" y="190" width="36" height="20" rx="4" fill="#0F172A" stroke="#F59E0B" stroke-width="1.5"/>
      <text x="308" y="205" fill="#FDE047" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">18 OCT</text>

      <!-- Brand Typography -->
      <text x="200" y="258" fill="#FDE047" font-family="serif" font-size="12" font-weight="bold" letter-spacing="2" text-anchor="middle">ŚRĪ JAGANNĀTHA</text>
      <text x="200" y="274" fill="#93C5FD" font-family="sans-serif" font-size="9" letter-spacing="3" text-anchor="middle">PURI • CHRONO</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#14366A', '#020814');
      drawTrack(ctx, size, '#FDE047', 'rgba(253, 224, 71, 0.4)');
      const c = size / 2;
      ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = size * 0.008;
      ctx.beginPath(); ctx.arc(c, c, size * 0.22, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath(); ctx.moveTo(c, c); ctx.lineTo(c + Math.cos(a) * size * 0.22, c + Math.sin(a) * size * 0.22); ctx.stroke();
      }
      ctx.fillStyle = '#0284C7'; ctx.beginPath(); ctx.arc(c, c, size * 0.08, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#FDE047'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#EF4444'; ctx.beginPath(); ctx.moveTo(c, c - size * 0.22); ctx.lineTo(c + size * 0.1, c - size * 0.27); ctx.lineTo(c, c - size * 0.32); ctx.fill();
      ctx.fillStyle = '#FDE047'; ctx.font = \`bold \${Math.round(size * 0.034)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('ŚRĪ JAGANNĀTHA', c, size * 0.68);
      ctx.fillStyle = '#93C5FD'; ctx.font = \`500 \${Math.round(size * 0.024)}px sans-serif\`;
      ctx.fillText('PURI • CHRONO', c, size * 0.74);
    `
  },

  // 2. Sudarshana Cosmic Discus
  {
    id: 'sudarshana',
    nameOr: 'ସୁଦର୍ଶନ ମହାଚକ୍ର ସୁପରନୋଭା',
    nameHi: 'सुदर्शन महाचक्र सुपरनोवा',
    nameEn: 'Sudarshana Solar Supernova',
    category: 'divine_weapon',
    categoryLabelOr: 'ଦିବ୍ୟ ଆୟୁଧ',
    categoryLabelHi: 'दिव्य आयुध',
    categoryLabelEn: 'Divine Weapon',
    taglineOr: 'ଭଗବାନ ବିଷ୍ଣୁଙ୍କ ଜ୍ୱଳନ୍ତ ୧୬-ଅର ବିଶିଷ୍ଟ କାଳଚକ୍ର ଓ ଅଗ୍ନି ବଳୟ',
    taglineHi: 'भगवान विष्णु का प्रज्वलित १६-अरीय सुदर्शन चक्र',
    taglineEn: 'Blazing 16-serrated blade solar disc of Vishnu',
    primaryColor: '#EF4444',
    glowColor: '#F59E0B',
    accentColor: '#FDE047',
    badgeGradient: 'from-amber-600 via-orange-500 to-red-700',
    centerpieceSvg: `
      <!-- Magma Solar Flare Background -->
      <radialGradient id="sudarshBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#7F1D1D"/>
        <stop offset="50%" stop-color="#450A0A"/>
        <stop offset="100%" stop-color="#180303"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#sudarshBg)"/>
      ${COMMON_TICKS}

      <!-- Outer Plasma Corona -->
      <circle cx="200" cy="200" r="140" stroke="#F97316" stroke-width="2" stroke-dasharray="3,6" fill="none" opacity="0.6"/>
      <circle cx="200" cy="200" r="110" stroke="#FDE047" stroke-width="2" fill="none"/>

      <!-- 16 Serrated Spinning Blades -->
      <g fill="#F59E0B" stroke="#B45309" stroke-width="1.2">
        ${Array.from({ length: 16 }).map((_, i) => {
          const deg = i * 22.5;
          return `<path d="M 200,90 Q 215,100 210,130 L 190,130 Q 185,100 200,90 Z" transform="rotate(${deg} 200 200)" />`;
        }).join('')}
      </g>

      <!-- Center Blazing Solar Core -->
      <circle cx="200" cy="200" r="50" fill="#DC2626" stroke="#FDE047" stroke-width="3" filter="url(#glowGlow)"/>
      <circle cx="200" cy="200" r="30" fill="#EA580C"/>
      <circle cx="200" cy="200" r="15" fill="#FEF08A"/>

      <!-- Flame Sparks -->
      <circle cx="240" cy="160" r="3" fill="#FEF08A" filter="url(#glowGlow)"/>
      <circle cx="160" cy="240" r="3" fill="#FEF08A" filter="url(#glowGlow)"/>
      <circle cx="240" cy="240" r="2.5" fill="#FEF08A" filter="url(#glowGlow)"/>

      <!-- Brand text -->
      <text x="200" y="278" fill="#FDE047" font-family="serif" font-size="12" font-weight="bold" letter-spacing="2" text-anchor="middle">SUDARSHANA</text>
      <text x="200" y="294" fill="#FCA5A5" font-family="sans-serif" font-size="9" letter-spacing="3" text-anchor="middle">SOLAR CORONA</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#7F1D1D', '#180303');
      drawTrack(ctx, size, '#FDE047', 'rgba(239, 68, 68, 0.4)');
      const c = size / 2;
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI) / 8;
        ctx.fillStyle = i % 2 === 0 ? '#F59E0B' : '#EF4444';
        ctx.beginPath(); ctx.moveTo(c, c);
        ctx.lineTo(c + Math.cos(a) * size * 0.28, c + Math.sin(a) * size * 0.28);
        ctx.lineTo(c + Math.cos(a + 0.15) * size * 0.22, c + Math.sin(a + 0.15) * size * 0.22);
        ctx.fill();
      }
      ctx.fillStyle = '#DC2626'; ctx.beginPath(); ctx.arc(c, c, size * 0.1, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#FDE047'; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = '#FEF08A'; ctx.beginPath(); ctx.arc(c, c, size * 0.04, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FDE047'; ctx.font = \`bold \${Math.round(size * 0.034)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('SUDARSHANA', c, size * 0.72);
    `
  },

  // 3. Mahakala Cyber Obsidian
  {
    id: 'trishula',
    nameOr: 'ମହାକାଳ ସାଇବର ତ୍ରିଶୂଳ',
    nameHi: 'महाकाल साइबर त्रिशूल',
    nameEn: 'Mahakala Cyber Obsidian',
    category: 'divine_weapon',
    categoryLabelOr: 'ଦିବ୍ୟ ଆୟୁଧ',
    categoryLabelHi: 'दिव्य आयुध',
    categoryLabelEn: 'Divine Weapon',
    taglineOr: 'ଦେବାଧିଦେବ ମହାଦେବଙ୍କ ସ୍ଲୀକ୍ ସାଇବର ତ୍ରିଶୂଳ, ଡମରୁ ଓ ଚନ୍ଦ୍ରକଳା',
    taglineHi: 'भगवान शिव का स्लीक साइबर त्रिशूल व डमरू',
    taglineEn: 'Cyber obsidian titanium with neon cyan laser grid & crescent',
    primaryColor: '#06B6D4',
    glowColor: '#38BDF8',
    accentColor: '#E0F2FE',
    badgeGradient: 'from-slate-700 via-cyan-600 to-sky-900',
    centerpieceSvg: `
      <!-- Damascus Brushed Titanium Background -->
      <radialGradient id="trishBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1E293B"/>
        <stop offset="60%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#trishBg)"/>
      ${COMMON_TICKS}

      <!-- Cyber Neon Radial Grid -->
      <circle cx="200" cy="200" r="130" stroke="#06B6D4" stroke-width="1" stroke-dasharray="2,8" fill="none" opacity="0.4"/>
      <circle cx="200" cy="200" r="90" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="6,4" fill="none" opacity="0.5"/>

      <!-- Glowing Cyan Trishula Prongs -->
      <g stroke="#38BDF8" stroke-width="3.5" fill="none" stroke-linecap="round" filter="url(#glowGlow)">
        <!-- Center prong -->
        <line x1="200" y1="180" x2="200" y2="85" />
        <polygon points="200,75 194,88 206,88" fill="#38BDF8" stroke="none" />
        <!-- Left prong -->
        <path d="M 190,140 Q 155,140 160,95" />
        <polygon points="160,90 154,102 166,102" fill="#38BDF8" stroke="none" />
        <!-- Right prong -->
        <path d="M 210,140 Q 245,140 240,95" />
        <polygon points="240,90 234,102 246,102" fill="#38BDF8" stroke="none" />
        <!-- Staff -->
        <line x1="200" y1="180" x2="200" y2="290" stroke="#0284C7" stroke-width="3" />
      </g>

      <!-- Center Golden Damaru -->
      <polygon points="188,170 212,170 192,190 212,190 188,170" fill="#F59E0B" stroke="#FDE047" stroke-width="1.5"/>

      <!-- Silver Crescent Moon on Left -->
      <path d="M 148,125 A 18 18 0 0 0 165,110 A 14 14 0 0 1 148,125 Z" fill="#E2E8F0" filter="url(#glowGlow)"/>

      <!-- Third Eye Bindu -->
      <circle cx="200" cy="115" r="4.5" fill="#F59E0B" filter="url(#glowGlow)"/>

      <!-- Brand -->
      <text x="200" y="325" fill="#38BDF8" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="3" text-anchor="middle">MAHAKALA CYBER</text>
      <text x="200" y="340" fill="#94A3B8" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">TITANIUM • 2050</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#1E293B', '#020617');
      drawTrack(ctx, size, '#38BDF8', 'rgba(56, 189, 248, 0.4)');
      const c = size / 2;
      ctx.strokeStyle = '#38BDF8'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(c, c + size * 0.2); ctx.lineTo(c, c - size * 0.28); ctx.stroke();
      ctx.beginPath(); ctx.arc(c, c - size * 0.1, size * 0.12, 0, Math.PI); ctx.stroke();
      ctx.fillStyle = '#F59E0B'; ctx.beginPath(); ctx.arc(c, c - size * 0.15, size * 0.025, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#38BDF8'; ctx.font = \`bold \${Math.round(size * 0.032)}px sans-serif\`; ctx.textAlign = 'center';
      ctx.fillText('MAHAKALA CYBER', c, size * 0.78);
    `
  },

  // 4. Royal 24K Gold Tapisserie
  {
    id: 'om_royal',
    nameOr: 'ପ୍ରଣବ ଓଁକାର ଗିଲୋଶେ',
    nameHi: 'प्रणव ओंकार गिलौशे',
    nameEn: 'Royal 24K Gold Tapisserie',
    category: 'sacred_symbol',
    categoryLabelOr: 'ପବିତ୍ର ପ୍ରତୀକ',
    categoryLabelHi: 'पवित्र प्रतीक',
    categoryLabelEn: 'Sacred Symbol',
    taglineOr: '୨୪ କ୍ୟାରେଟ୍ ସୁବର୍ଣ୍ଣ ଓଁକାର ଓ ସ୍ୱିସ୍ ରୟାଲ୍ ଗିଲୋଶେ ୱାଫଲ୍ ପ୍ୟାଟର୍ଣ୍ଣ',
    taglineHi: '२४ कैरेट स्वर्ण ओंकार व रॉयल गिलौशे पैटर्न',
    taglineEn: '24K pure gold Audemars Piguet style guilloché tapestry',
    primaryColor: '#F59E0B',
    glowColor: '#FEF08A',
    accentColor: '#FDE047',
    badgeGradient: 'from-amber-400 via-yellow-500 to-amber-700',
    centerpieceSvg: `
      <!-- Royal Gold Guilloche Background -->
      <radialGradient id="omGoldBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#78350F"/>
        <stop offset="60%" stop-color="#451A03"/>
        <stop offset="100%" stop-color="#1A0700"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#omGoldBg)"/>
      ${COMMON_TICKS}

      <!-- Guilloche Grid Simulation -->
      <g stroke="#F59E0B" stroke-width="0.8" opacity="0.25">
        ${Array.from({ length: 18 }).map((_, i) => `<line x1="${40 + i * 18}" y1="40" x2="${40 + i * 18}" y2="360" />`).join('')}
        ${Array.from({ length: 18 }).map((_, i) => `<line x1="40" y1="${40 + i * 18}" x2="360" y2="${40 + i * 18}" />`).join('')}
      </g>

      <!-- 12 Faceted Gold Baguette Indices -->
      <g fill="#FDE047" stroke="#78350F" stroke-width="1">
        ${Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const x = 200 + 155 * Math.sin(a);
          const y = 200 - 155 * Math.cos(a);
          return `<rect x="${x - 4}" y="${y - 8}" width="8" height="16" rx="2" transform="rotate(${i * 30} ${x} ${y})" />`;
        }).join('')}
      </g>

      <!-- Ornate 3D Gold Sanskrit/Vedic OM (ॐ) -->
      <g filter="url(#glowGlow)">
        <text x="200" y="215" font-family="'Noto Serif', serif" font-size="80" font-weight="900" fill="#FEF08A" stroke="#B45309" stroke-width="2" text-anchor="middle">ॐ</text>
      </g>

      <!-- Sub-dial at 6 o'clock -->
      <circle cx="200" cy="285" r="28" fill="#2E1005" stroke="#F59E0B" stroke-width="1.5"/>
      <circle cx="200" cy="285" r="2" fill="#FDE047"/>
      <line x1="200" y1="285" x2="216" y2="280" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round"/>
      <text x="200" y="325" fill="#FDE047" font-family="serif" font-size="10" font-weight="bold" letter-spacing="2" text-anchor="middle">CHRONOMÈTRE</text>
      <text x="200" y="338" fill="#FCA5A5" font-family="sans-serif" font-size="7" letter-spacing="1.5" text-anchor="middle">24K SOLID GOLD</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#78350F', '#1A0700');
      drawTrack(ctx, size, '#FDE047', 'rgba(245, 158, 11, 0.4)');
      const c = size / 2;
      ctx.fillStyle = '#FEF08A'; ctx.font = \`900 \${Math.round(size * 0.22)}px serif\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('ॐ', c, c - size * 0.03);
      ctx.fillStyle = '#FDE047'; ctx.font = \`bold \${Math.round(size * 0.032)}px serif\`;
      ctx.fillText('CHRONOMÈTRE • 24K', c, size * 0.74);
    `
  },

  // 5. Konark Sunburst Bronze
  {
    id: 'surya_disc',
    nameOr: 'କୋଣାର୍କ ସୂର୍ଯ୍ୟ ରଥ ଚକ୍ର',
    nameHi: 'कोणार्क सूर्य रथ चक्र',
    nameEn: 'Konark Sunburst Bronze',
    category: 'celestial_astro',
    categoryLabelOr: 'ଜ୍ୟୋତିଷ ଓ ମଣ୍ଡଳ',
    categoryLabelHi: 'ज्योतिष व मंडल',
    categoryLabelEn: 'Celestial & Astro',
    taglineOr: 'କୋଣାର୍କ ସୂର୍ଯ୍ୟ ରଥର ୧୨-ଅର କାଳ ଚକ୍ର, ପ୍ରଭାତ ଆଭା ଓ କଳାକୃତି',
    taglineHi: 'कोणार्क सूर्य मंदिर का ऐतिहासिक रथ चक्र',
    taglineEn: 'Historic Konark Sun Chariot wheel with carved spokes',
    primaryColor: '#D97706',
    glowColor: '#F59E0B',
    accentColor: '#FDE047',
    badgeGradient: 'from-amber-700 via-orange-600 to-yellow-600',
    centerpieceSvg: `
      <!-- Antique Bronze Patina Background -->
      <radialGradient id="konarkBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#543110"/>
        <stop offset="70%" stop-color="#2E1805"/>
        <stop offset="100%" stop-color="#140801"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#konarkBg)"/>
      ${COMMON_TICKS}

      <!-- Beaded Outer Rim -->
      <circle cx="200" cy="200" r="150" stroke="#D97706" stroke-width="4" fill="none"/>
      <circle cx="200" cy="200" r="142" stroke="#FDE047" stroke-width="1.5" stroke-dasharray="2,6" fill="none"/>

      <!-- 8 Major Carved Floral Spokes -->
      <g stroke="#F59E0B" stroke-width="4" stroke-linecap="round">
        ${Array.from({ length: 8 }).map((_, i) => {
          const a = (i * 45 * Math.PI) / 180;
          const x2 = (200 + 138 * Math.sin(a)).toFixed(1);
          const y2 = (200 - 138 * Math.cos(a)).toFixed(1);
          return `<line x1="200" y1="200" x2="${x2}" y2="${y2}" />`;
        }).join('')}
      </g>
      <!-- 8 Minor Slender Spokes -->
      <g stroke="#CA8A04" stroke-width="2" stroke-linecap="round">
        ${Array.from({ length: 8 }).map((_, i) => {
          const a = ((i * 45 + 22.5) * Math.PI) / 180;
          const x2 = (200 + 130 * Math.sin(a)).toFixed(1);
          const y2 = (200 - 130 * Math.cos(a)).toFixed(1);
          return `<line x1="200" y1="200" x2="${x2}" y2="${y2}" />`;
        }).join('')}
      </g>

      <!-- Spoke Medallions -->
      ${Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        const x = (200 + 85 * Math.sin(a)).toFixed(1);
        const y = (200 - 85 * Math.cos(a)).toFixed(1);
        return `<circle cx="${x}" cy="${y}" r="8" fill="#B45309" stroke="#FDE047" stroke-width="1.5" />`;
      }).join('')}

      <!-- Central Hub with Surya 7 Horses Motif -->
      <circle cx="200" cy="200" r="38" fill="#78350F" stroke="#FDE047" stroke-width="3" filter="url(#glowGlow)"/>
      <circle cx="200" cy="200" r="22" fill="#D97706"/>
      <circle cx="200" cy="200" r="10" fill="#FEF08A"/>

      <text x="200" y="275" fill="#FDE047" font-family="serif" font-size="11" font-weight="bold" letter-spacing="2" text-anchor="middle">KONARK SUN CHRONO</text>
      <text x="200" y="290" fill="#FDBA74" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">12 SOLAR SPOKES</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#543110', '#140801');
      drawTrack(ctx, size, '#FDE047', 'rgba(217, 119, 6, 0.4)');
      const c = size / 2;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = size * 0.015;
        ctx.beginPath(); ctx.moveTo(c, c); ctx.lineTo(c + Math.cos(a) * size * 0.32, c + Math.sin(a) * size * 0.32); ctx.stroke();
      }
      ctx.fillStyle = '#78350F'; ctx.beginPath(); ctx.arc(c, c, size * 0.1, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#FDE047'; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = '#FDE047'; ctx.font = \`bold \${Math.round(size * 0.032)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('KONARK SUN', c, size * 0.72);
    `
  },

  // 6. Soma Midnight Starfield
  {
    id: 'chandra_soma',
    nameOr: 'ଚନ୍ଦ୍ରଶେଖର ନକ୍ଷତ୍ରଲୋକ',
    nameHi: 'चंद्रशेखर नक्षत्रलोक',
    nameEn: 'Soma Midnight Starfield',
    category: 'celestial_astro',
    categoryLabelOr: 'ଜ୍ୟୋତିଷ ଓ ମଣ୍ଡଳ',
    categoryLabelHi: 'ज्योतिष व मंडल',
    categoryLabelEn: 'Celestial & Astro',
    taglineOr: 'ଅମୃତମୟ ଚନ୍ଦ୍ର କଳା, ଉଜ୍ଜ୍ୱଳ ଧ୍ରୁବତାରା ଓ ମହାଜାଗତିକ ନକ୍ଷତ୍ରମାଳା',
    taglineHi: 'अमृतमय चंद्रकला व दिव्य ध्रुवतारा नक्षत्रलोक',
    taglineEn: 'Midnight galaxy starfield with crescent & polestar',
    primaryColor: '#38BDF8',
    glowColor: '#818CF8',
    accentColor: '#E0F2FE',
    badgeGradient: 'from-indigo-600 via-sky-600 to-purple-800',
    centerpieceSvg: `
      <!-- Deep Cosmic Nebula Background -->
      <radialGradient id="somaBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#311042"/>
        <stop offset="50%" stop-color="#1E1B4B"/>
        <stop offset="100%" stop-color="#050515"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#somaBg)"/>
      ${COMMON_TICKS}

      <!-- Distant Starfield -->
      <g fill="#FFFFFF" opacity="0.8">
        <circle cx="80" cy="90" r="1.5" /><circle cx="120" cy="70" r="2" />
        <circle cx="320" cy="110" r="1.5" /><circle cx="280" cy="80" r="2.5" />
        <circle cx="90" cy="290" r="2" /><circle cx="310" cy="280" r="1.5" />
        <circle cx="240" cy="320" r="1.8" /><circle cx="150" cy="330" r="2" />
      </g>

      <!-- 3D Silver-Pearl Crescent Moon -->
      <g filter="url(#glowGlow)">
        <path d="M 180,110 A 70 70 0 1 0 230,265 A 60 60 0 1 1 180,110 Z" fill="#E2E8F0" stroke="#38BDF8" stroke-width="2"/>
        <!-- Moon Craters -->
        <circle cx="160" cy="190" r="6" fill="#CBD5E1" opacity="0.6"/>
        <circle cx="150" cy="220" r="4.5" fill="#CBD5E1" opacity="0.6"/>
        <circle cx="175" cy="235" r="5" fill="#CBD5E1" opacity="0.6"/>
      </g>

      <!-- Brilliant 8-Pointed North Star (Dhruva Tara) cradled in crescent -->
      <g transform="translate(235, 175)" filter="url(#glowGlow)">
        <polygon points="0,-22 4,-6 20,0 4,6 0,22 -4,6 -20,0 -4,-6" fill="#FDE047"/>
        <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#FFFFFF"/>
        <circle cx="0" cy="0" r="3" fill="#38BDF8"/>
      </g>

      <!-- Planetary Orbit Rings -->
      <ellipse cx="200" cy="200" rx="140" ry="50" stroke="#818CF8" stroke-width="1.2" stroke-dasharray="3,6" fill="none" transform="rotate(-25 200 200)" opacity="0.5"/>

      <text x="200" y="318" fill="#E0F2FE" font-family="serif" font-size="11" font-weight="bold" letter-spacing="3" text-anchor="middle">SOMA CELESTIAL</text>
      <text x="200" y="332" fill="#A5B4FC" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">DHRUVA STELLAR MESH</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#311042', '#050515');
      drawTrack(ctx, size, '#38BDF8', 'rgba(129, 140, 248, 0.4)');
      const c = size / 2;
      ctx.fillStyle = '#E2E8F0'; ctx.beginPath();
      ctx.arc(c - size * 0.05, c, size * 0.22, 0.5 * Math.PI, 1.5 * Math.PI);
      ctx.arc(c + size * 0.02, c, size * 0.18, 1.5 * Math.PI, 0.5 * Math.PI, true);
      ctx.fill();
      ctx.fillStyle = '#FDE047'; ctx.beginPath(); ctx.arc(c + size * 0.14, c - size * 0.06, size * 0.04, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#E0F2FE'; ctx.font = \`bold \${Math.round(size * 0.032)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('SOMA CELESTIAL', c, size * 0.74);
    `
  },

  // 7. Krishna Peacock Velvet
  {
    id: 'mayura_feather',
    nameOr: 'ମୟୂର ପିଞ୍ଚ ମନୋହର',
    nameHi: 'मयूर पिच्छ मनोहर',
    nameEn: 'Krishna Peacock Velvet',
    category: 'sacred_symbol',
    categoryLabelOr: 'ପବିତ୍ର ପ୍ରତୀକ',
    categoryLabelHi: 'पवित्र प्रतीक',
    categoryLabelEn: 'Sacred Symbol',
    taglineOr: 'ଶ୍ରୀକୃଷ୍ଣଙ୍କ ମୁକୁଟର ମୟୂର ଚନ୍ଦ୍ରିକା ଓ ମରକତ ତଥା ଇନ୍ଦ୍ରନୀଳ ଆଭା',
    taglineHi: 'श्रीकृष्ण के मुकुट की पावन मयूर चंद्रिका',
    taglineEn: 'Peacock velvet emerald & indigo plumage with golden flute',
    primaryColor: '#10B981',
    glowColor: '#06B6D4',
    accentColor: '#FDE047',
    badgeGradient: 'from-emerald-600 via-teal-500 to-indigo-700',
    centerpieceSvg: `
      <!-- Deep Velvet Teal-Black Background -->
      <radialGradient id="mayuraBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#064E3B"/>
        <stop offset="60%" stop-color="#022C22"/>
        <stop offset="100%" stop-color="#01140E"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#mayuraBg)"/>
      ${COMMON_TICKS}

      <!-- Peacock Plume Outer Hair Fringe -->
      <g stroke="#F59E0B" stroke-width="1.2" opacity="0.6">
        ${Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 15 * Math.PI) / 180;
          const x1 = (200 + 100 * Math.sin(a)).toFixed(1);
          const y1 = (170 - 100 * Math.cos(a)).toFixed(1);
          const x2 = (200 + 125 * Math.sin(a)).toFixed(1);
          const y2 = (170 - 125 * Math.cos(a)).toFixed(1);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
        }).join('')}
      </g>

      <!-- Concentric Iridescent Peacock Feather Eye -->
      <ellipse cx="200" cy="170" rx="60" ry="75" fill="#10B981" stroke="#FDE047" stroke-width="2.5"/>
      <ellipse cx="200" cy="170" rx="45" ry="55" fill="#06B6D4" stroke="#047857" stroke-width="2"/>
      <ellipse cx="200" cy="170" rx="30" ry="38" fill="#1E3A8A" stroke="#FDE047" stroke-width="2" filter="url(#glowGlow)"/>
      <!-- Inner Heart Pupil -->
      <circle cx="200" cy="170" r="16" fill="#0284C7"/>
      <circle cx="195" cy="165" r="5" fill="#BAE6FD"/>

      <!-- Golden Divine Flute (Bamsi) across bottom -->
      <g stroke="#FDE047" stroke-width="3" stroke-linecap="round">
        <line x1="120" y1="260" x2="280" y2="245" />
        <circle cx="160" cy="256" r="2.5" fill="#78350F" />
        <circle cx="180" cy="254" r="2.5" fill="#78350F" />
        <circle cx="200" cy="252" r="2.5" fill="#78350F" />
        <circle cx="220" cy="250" r="2.5" fill="#78350F" />
      </g>

      <text x="200" y="295" fill="#FDE047" font-family="serif" font-size="11" font-weight="bold" letter-spacing="2" text-anchor="middle">MAYURA CHRONO</text>
      <text x="200" y="310" fill="#6EE7B7" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">EMERALD & SAPPHIRE</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#064E3B', '#01140E');
      drawTrack(ctx, size, '#FDE047', 'rgba(16, 185, 129, 0.4)');
      const c = size / 2;
      ctx.fillStyle = '#10B981'; ctx.beginPath(); ctx.ellipse(c, c - size * 0.08, size * 0.16, size * 0.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#06B6D4'; ctx.beginPath(); ctx.ellipse(c, c - size * 0.08, size * 0.11, size * 0.14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1E3A8A'; ctx.beginPath(); ctx.ellipse(c, c - size * 0.08, size * 0.07, size * 0.09, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FDE047'; ctx.font = \`bold \${Math.round(size * 0.032)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('MAYURA CHRONO', c, size * 0.74);
    `
  },

  // 8. Panchajanya Pearl Symphony
  {
    id: 'shankha_conch',
    nameOr: 'ପାଞ୍ଚଜନ୍ୟ ଶଙ୍ଖ ମୁଦ୍ରା',
    nameHi: 'पाञ्चजन्य शंख मुद्रा',
    nameEn: 'Panchajanya Pearl Symphony',
    category: 'sacred_symbol',
    categoryLabelOr: 'ପବିତ୍ର ପ୍ରତୀକ',
    categoryLabelHi: 'पवित्र प्रतीक',
    categoryLabelEn: 'Sacred Symbol',
    taglineOr: 'ବିଜୟର ଅମର ନାଦ, ମହାପ୍ରଭୁ ଶ୍ରୀକୃଷ୍ଣଙ୍କ ପବିତ୍ର ଶଙ୍ଖ ଧ୍ୱନି ତରଙ୍ଗ',
    taglineHi: 'भगवान श्रीकृष्ण का विजय घोष शंख पाञ्चजन्य',
    taglineEn: 'Mother-of-pearl symphony with spiral acoustic rings',
    primaryColor: '#FDE047',
    glowColor: '#E2E8F0',
    accentColor: '#93C5FD',
    badgeGradient: 'from-slate-600 via-sky-500 to-slate-800',
    centerpieceSvg: `
      <!-- Pearl Opalescent Dial -->
      <radialGradient id="shankhaBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="60%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#0A0F1D"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#shankhaBg)"/>
      ${COMMON_TICKS}

      <!-- Concentric Acoustic Soundwave Rings (Nada Brahma) -->
      <circle cx="200" cy="180" r="130" stroke="#93C5FD" stroke-width="1" stroke-dasharray="4,8" fill="none" opacity="0.4"/>
      <circle cx="200" cy="180" r="100" stroke="#FDE047" stroke-width="1.2" stroke-dasharray="6,6" fill="none" opacity="0.5"/>
      <circle cx="200" cy="180" r="70" stroke="#E2E8F0" stroke-width="1.5" fill="none" opacity="0.6"/>

      <!-- Spiral Conch (Shankha) Geometry -->
      <g filter="url(#glowGlow)">
        <path d="M 200,120 Q 235,135 225,185 Q 215,225 200,240 Q 185,225 175,185 Q 165,135 200,120 Z" fill="#F8FAFC" stroke="#FDE047" stroke-width="3"/>
        <!-- Inner spiral grooves -->
        <path d="M 190,145 Q 200,165 210,145" stroke="#94A3B8" stroke-width="2" fill="none"/>
        <path d="M 185,175 Q 200,200 215,175" stroke="#94A3B8" stroke-width="2" fill="none"/>
        <path d="M 190,205 Q 200,225 210,205" stroke="#94A3B8" stroke-width="2" fill="none"/>
      </g>

      <text x="200" y="275" fill="#FDE047" font-family="serif" font-size="11" font-weight="bold" letter-spacing="2" text-anchor="middle">PANCHAJANYA</text>
      <text x="200" y="290" fill="#CBD5E1" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">PEARL SYMPHONY</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#334155', '#0A0F1D');
      drawTrack(ctx, size, '#FDE047', 'rgba(148, 163, 184, 0.4)');
      const c = size / 2;
      ctx.fillStyle = '#F8FAFC'; ctx.strokeStyle = '#FDE047'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(c, c - size * 0.05, size * 0.1, size * 0.18, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#FDE047'; ctx.font = \`bold \${Math.round(size * 0.032)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('PANCHAJANYA', c, size * 0.72);
    `
  },

  // 9. Kaustubha Celestial Diamond
  {
    id: 'kaustubha_gem',
    nameOr: 'କୌସ୍ତୁଭ ମଣି ପ୍ରିଜ୍ମ',
    nameHi: 'कौस्तुभ मणि प्रिज्म',
    nameEn: 'Kaustubha Celestial Diamond',
    category: 'sacred_symbol',
    categoryLabelOr: 'ପବିତ୍ର ପ୍ରତୀକ',
    categoryLabelHi: 'पवित्र प्रतीक',
    categoryLabelEn: 'Sacred Symbol',
    taglineOr: 'କ୍ଷୀରସମୁଦ୍ର ମନ୍ଥନରୁ ପ୍ରକଟିତ ଭଗବାନ ବିଷ୍ଣୁଙ୍କ ବକ୍ଷସ୍ଥଳର ଦିବ୍ୟ ରତ୍ନ',
    taglineHi: 'क्षीरसागर मंथन से प्रकट भगवान विष्णु की कौस्तुभ मणि',
    taglineEn: 'Octagonal brilliant crystal diamond prism with light rays',
    primaryColor: '#38BDF8',
    glowColor: '#EC4899',
    accentColor: '#F472B6',
    badgeGradient: 'from-pink-500 via-purple-600 to-sky-700',
    centerpieceSvg: `
      <!-- Deep Obsidian Black Background -->
      <radialGradient id="kaustBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1E1B4B"/>
        <stop offset="60%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#kaustBg)"/>
      ${COMMON_TICKS}

      <!-- Octagonal Brilliant Diamond Geometry -->
      <g filter="url(#glowGlow)">
        <!-- Outer facet polygon -->
        <polygon points="170,140 230,140 260,170 260,230 230,260 170,260 140,230 140,170" fill="#0284C7" stroke="#38BDF8" stroke-width="3"/>
        <!-- Inner table facet -->
        <polygon points="180,160 220,160 240,180 240,220 220,240 180,240 160,220 160,180" fill="#38BDF8" stroke="#FDE047" stroke-width="2"/>
        <!-- Center sparkle -->
        <polygon points="190,175 210,175 225,190 225,210 210,225 190,225 175,210 175,190" fill="#E0F2FE"/>
      </g>

      <!-- Sparkle Light Flares -->
      <line x1="200" y1="120" x2="200" y2="280" stroke="#F472B6" stroke-width="1.5" stroke-dasharray="4,6" opacity="0.7"/>
      <line x1="120" y1="200" x2="280" y2="200" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="4,6" opacity="0.7"/>
      <circle cx="170" cy="140" r="4" fill="#FFFFFF" filter="url(#glowGlow)"/>
      <circle cx="230" cy="260" r="4" fill="#FFFFFF" filter="url(#glowGlow)"/>

      <text x="200" y="295" fill="#38BDF8" font-family="serif" font-size="11" font-weight="bold" letter-spacing="2" text-anchor="middle">KAUSTUBHA GEM</text>
      <text x="200" y="310" fill="#F472B6" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">OCTAGONAL BRILLIANT</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#1E1B4B', '#020617');
      drawTrack(ctx, size, '#38BDF8', 'rgba(236, 72, 153, 0.4)');
      const c = size / 2;
      ctx.fillStyle = '#0284C7'; ctx.strokeStyle = '#38BDF8'; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 + Math.PI / 8;
        const x = c + Math.cos(a) * size * 0.18;
        const y = c + Math.sin(a) * size * 0.18;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#38BDF8'; ctx.font = \`bold \${Math.round(size * 0.032)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('KAUSTUBHA', c, size * 0.74);
    `
  },

  // 10. Gajapati Imperial Lion
  {
    id: 'gajapati_lion',
    nameOr: 'ଗଜପତି ରାଜକୀୟ କେଶରୀ',
    nameHi: 'गजपति राजकीय केसरी',
    nameEn: 'Gajapati Imperial Lion',
    category: 'royal_regalia',
    categoryLabelOr: 'ରାଜକୀୟ ଐତିହ୍ୟ',
    categoryLabelHi: 'राजकीय धरोहर',
    categoryLabelEn: 'Royal Regalia',
    taglineOr: 'କଳିଙ୍ଗ ସାମ୍ରାଜ୍ୟର ଐତିହାସିକ ଗଜପତି ରାଜାଙ୍କ ରୟାଲ୍ ସିଂହ ମୁଦ୍ରା',
    taglineHi: 'कलिंग साम्राज्य के गजपति महाराज का ऐतिहासिक सिंह',
    taglineEn: 'Historic Kalinga royal crimson velvet with lion crest',
    primaryColor: '#DC2626',
    glowColor: '#F59E0B',
    accentColor: '#FDE047',
    badgeGradient: 'from-red-700 via-amber-600 to-yellow-600',
    centerpieceSvg: `
      <!-- Royal Crimson Velvet Background -->
      <radialGradient id="lionBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#7F1D1D"/>
        <stop offset="60%" stop-color="#450A0A"/>
        <stop offset="100%" stop-color="#1F0404"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#lionBg)"/>
      ${COMMON_TICKS}

      <!-- Ornate Odishan Temple Stone Carved Border -->
      <circle cx="200" cy="200" r="145" stroke="#F59E0B" stroke-width="2.5" fill="none"/>
      <circle cx="200" cy="200" r="138" stroke="#FDE047" stroke-width="1.2" stroke-dasharray="4,4" fill="none"/>

      <!-- Rampant Roaring Golden Lion Crest -->
      <g filter="url(#glowGlow)" fill="#FDE047" stroke="#78350F" stroke-width="1.5">
        <!-- Lion Head & Mane -->
        <circle cx="200" cy="155" r="28" fill="#F59E0B"/>
        <!-- Mane rays -->
        ${Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const x = (200 + 38 * Math.sin(a)).toFixed(1);
          const y = (155 - 38 * Math.cos(a)).toFixed(1);
          return `<circle cx="${x}" cy="${y}" r="6" fill="#FDE047" />`;
        }).join('')}
        <!-- Snout & Eyes -->
        <circle cx="190" cy="150" r="3.5" fill="#000000"/>
        <circle cx="210" cy="150" r="3.5" fill="#000000"/>
        <polygon points="200,160 193,168 207,168" fill="#DC2626"/>
      </g>

      <!-- Royal Kalinga Sun & Moon Flanking Emblems -->
      <circle cx="140" cy="200" r="12" fill="#FDE047" stroke="#78350F" stroke-width="1"/>
      <path d="M 255,190 A 14 14 0 0 0 268,212 A 10 10 0 0 1 255,190 Z" fill="#E2E8F0"/>

      <text x="200" y="270" fill="#FDE047" font-family="serif" font-size="12" font-weight="bold" letter-spacing="2" text-anchor="middle">GAJAPATI IMPERIAL</text>
      <text x="200" y="286" fill="#FCA5A5" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">KALINGA ROYAL SEAL</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#7F1D1D', '#1F0404');
      drawTrack(ctx, size, '#FDE047', 'rgba(220, 38, 38, 0.4)');
      const c = size / 2;
      ctx.fillStyle = '#F59E0B'; ctx.beginPath(); ctx.arc(c, c - size * 0.08, size * 0.12, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#FDE047'; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = '#FDE047'; ctx.font = \`bold \${Math.round(size * 0.032)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('GAJAPATI IMPERIAL', c, size * 0.72);
    `
  },

  // 11. Garuda Aero Titanium
  {
    id: 'garuda_wings',
    nameOr: 'ଗରୁଡ଼ ବିହଙ୍ଗରାଜ',
    nameHi: 'गरुड़ विहंगराज',
    nameEn: 'Garuda Aero Titanium',
    category: 'royal_regalia',
    categoryLabelOr: 'ରାଜକୀୟ ଐତିହ୍ୟ',
    categoryLabelHi: 'राजकीय धरोहर',
    categoryLabelEn: 'Royal Regalia',
    taglineOr: 'ପକ୍ଷୀରାଜ ଗରୁଡ଼ଙ୍କ ବେଗବାନ ସ୍ୱର୍ଣ୍ଣିମ ଡେଣା ଓ ଦିବ୍ୟ ଶକ୍ତି',
    taglineHi: 'पक्षीराज गरुड़ के वेगवान स्वर्णिम पंख',
    taglineEn: 'Carbon-fiber aero titanium with golden swept wings',
    primaryColor: '#F59E0B',
    glowColor: '#38BDF8',
    accentColor: '#FDE047',
    badgeGradient: 'from-zinc-700 via-amber-600 to-slate-900',
    centerpieceSvg: `
      <!-- Carbon-fiber Weave Background -->
      <radialGradient id="garudaBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#27272A"/>
        <stop offset="70%" stop-color="#18181B"/>
        <stop offset="100%" stop-color="#09090B"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#garudaBg)"/>
      ${COMMON_TICKS}

      <!-- Swept Aerodynamic Wings of Garuda -->
      <g filter="url(#glowGlow)">
        <!-- Left Wing -->
        <path d="M 195,190 Q 150,150 110,130 Q 140,165 150,195 Q 175,200 195,190 Z" fill="#F59E0B" stroke="#FDE047" stroke-width="2"/>
        <path d="M 185,195 Q 145,170 120,155 Q 140,185 155,205 Z" fill="#D97706"/>
        <!-- Right Wing -->
        <path d="M 205,190 Q 250,150 290,130 Q 260,165 250,195 Q 225,200 205,190 Z" fill="#F59E0B" stroke="#FDE047" stroke-width="2"/>
        <path d="M 215,195 Q 255,170 280,155 Q 260,185 245,205 Z" fill="#D97706"/>
      </g>

      <!-- Center Solar Crest & Ruby Cabochon -->
      <circle cx="200" cy="190" r="22" fill="#DC2626" stroke="#FDE047" stroke-width="3" filter="url(#glowGlow)"/>
      <circle cx="200" cy="190" r="12" fill="#EF4444"/>
      <circle cx="197" cy="187" r="4" fill="#FEF08A"/>

      <text x="200" y="275" fill="#FDE047" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="3" text-anchor="middle">GARUDA AERO</text>
      <text x="200" y="290" fill="#A1A1AA" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">TITANIUM CHRONO</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#27272A', '#09090B');
      drawTrack(ctx, size, '#FDE047', 'rgba(245, 158, 11, 0.4)');
      const c = size / 2;
      ctx.fillStyle = '#F59E0B'; ctx.beginPath();
      ctx.moveTo(c - size * 0.25, c - size * 0.1); ctx.lineTo(c, c); ctx.lineTo(c + size * 0.25, c - size * 0.1);
      ctx.lineTo(c, c + size * 0.05); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#DC2626'; ctx.beginPath(); ctx.arc(c, c, size * 0.06, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FDE047'; ctx.font = \`bold \${Math.round(size * 0.032)}px sans-serif\`; ctx.textAlign = 'center';
      ctx.fillText('GARUDA AERO', c, size * 0.72);
    `
  },

  // 12. Gandiva Tactical HUD
  {
    id: 'gandiva_bow',
    nameOr: 'ଗାଣ୍ଡୀବ ଦିବ୍ୟ ଧନୁଃ',
    nameHi: 'गाण्डीव दिव्य धनुष',
    nameEn: 'Gandiva Tactical HUD',
    category: 'divine_weapon',
    categoryLabelOr: 'ଦିବ୍ୟ ଆୟୁଧ',
    categoryLabelHi: 'दिव्य आयुध',
    categoryLabelEn: 'Divine Weapon',
    taglineOr: 'ମହାବୀର ଅର୍ଜୁନଙ୍କ ଅପରାଜେୟ ଗାଣ୍ଡୀବ ଧନୁ ଓ ଅମୋଘ ଆଲୋକ ତୀର',
    taglineHi: 'महाबली अर्जुन का अजेय गाण्डीव धनुष',
    taglineEn: 'Tactical HUD chronometer with electric light arrow',
    primaryColor: '#06B6D4',
    glowColor: '#38BDF8',
    accentColor: '#FDE047',
    badgeGradient: 'from-cyan-700 via-teal-600 to-slate-900',
    centerpieceSvg: `
      <!-- Tactical Dark Slate Background -->
      <radialGradient id="gandivaBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#0F172A"/>
        <stop offset="70%" stop-color="#020617"/>
        <stop offset="100%" stop-color="#000000"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#gandivaBg)"/>
      ${COMMON_TICKS}

      <!-- Concentric HUD Targeting Reticle -->
      <circle cx="200" cy="180" r="110" stroke="#06B6D4" stroke-width="1.2" stroke-dasharray="4,8" fill="none" opacity="0.4"/>
      <circle cx="200" cy="180" r="70" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="8,4" fill="none" opacity="0.6"/>
      <circle cx="200" cy="180" r="30" stroke="#FDE047" stroke-width="1.5" fill="none"/>

      <!-- Crosshairs -->
      <line x1="200" y1="60" x2="200" y2="300" stroke="#06B6D4" stroke-width="1" stroke-dasharray="2,6" opacity="0.5"/>
      <line x1="80" y1="180" x2="320" y2="180" stroke="#06B6D4" stroke-width="1" stroke-dasharray="2,6" opacity="0.5"/>

      <!-- Gandiva Recurve Bow -->
      <path d="M 140,240 Q 130,180 160,130 Q 180,100 200,90 Q 220,100 240,130 Q 270,180 260,240" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" filter="url(#glowGlow)"/>
      <!-- Plasma Bowstring -->
      <line x1="140" y1="240" x2="260" y2="240" stroke="#38BDF8" stroke-width="2" stroke-dasharray="2,2"/>

      <!-- Light Arrow -->
      <line x1="200" y1="260" x2="200" y2="75" stroke="#FDE047" stroke-width="3" stroke-linecap="round" filter="url(#glowGlow)"/>
      <polygon points="200,65 192,80 208,80" fill="#38BDF8"/>

      <text x="200" y="325" fill="#38BDF8" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="3" text-anchor="middle">GANDIVA HUD</text>
      <text x="200" y="340" fill="#94A3B8" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">PHOTON TARGETING</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#0F172A', '#000000');
      drawTrack(ctx, size, '#38BDF8', 'rgba(6, 182, 212, 0.4)');
      const c = size / 2;
      ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(c, c - size * 0.08, size * 0.22, 0.2 * Math.PI, 0.8 * Math.PI, true); ctx.stroke();
      ctx.strokeStyle = '#FDE047'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(c, c + size * 0.18); ctx.lineTo(c, c - size * 0.28); ctx.stroke();
      ctx.fillStyle = '#38BDF8'; ctx.font = \`bold \${Math.round(size * 0.032)}px sans-serif\`; ctx.textAlign = 'center';
      ctx.fillText('GANDIVA HUD', c, size * 0.76);
    `
  },

  // 13. Akhanda Sacred Flame
  {
    id: 'akhanda_jyoti',
    nameOr: 'ଅଖଣ୍ଡ ଦୀପ ଶିଖା',
    nameHi: 'अखण्ड दीप शिखा',
    nameEn: 'Akhanda Sacred Flame',
    category: 'sacred_symbol',
    categoryLabelOr: 'ପବିତ୍ର ପ୍ରତୀକ',
    categoryLabelHi: 'पवित्र प्रतीक',
    categoryLabelEn: 'Sacred Symbol',
    taglineOr: 'ଶ୍ରୀକ୍ଷେତ୍ରର ଅନିର୍ବାଣ ଅଖଣ୍ଡ ଦୀପ, ଆଲୋକ ଓ ସମର୍ପଣର ପ୍ରତୀକ',
    taglineHi: 'श्रीक्षेत्र का अनिवार्ण अखण्ड दीपक व पावन ज्योति',
    taglineEn: 'Sacred eternal flame with glowing embers and ruby core',
    primaryColor: '#F59E0B',
    glowColor: '#EF4444',
    accentColor: '#FDE047',
    badgeGradient: 'from-amber-600 via-orange-600 to-red-800',
    centerpieceSvg: `
      <!-- Warm Mahogany Background -->
      <radialGradient id="jyotiBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#451A03"/>
        <stop offset="60%" stop-color="#1C0A00"/>
        <stop offset="100%" stop-color="#0A0300"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#jyotiBg)"/>
      ${COMMON_TICKS}

      <!-- Brass Diya Lamp Base -->
      <g fill="#D97706" stroke="#FDE047" stroke-width="2">
        <ellipse cx="200" cy="245" rx="50" ry="16" />
        <path d="M 150,245 Q 200,285 250,245 Z" fill="#B45309" />
        <rect x="194" y="275" width="12" height="15" rx="2" fill="#78350F" />
      </g>

      <!-- Layered Sacred Flame -->
      <g filter="url(#glowGlow)">
        <!-- Outer Golden Flame Body -->
        <path d="M 200,105 Q 235,165 220,225 Q 200,245 180,225 Q 165,165 200,105 Z" fill="#F59E0B" />
        <!-- Inner Amber Flame -->
        <path d="M 200,130 Q 225,175 212,220 Q 200,235 188,220 Q 175,175 200,130 Z" fill="#EF4444" />
        <!-- White-hot Core -->
        <path d="M 200,165 Q 212,195 206,220 Q 200,228 194,220 Q 188,195 200,165 Z" fill="#FEF08A" />
      </g>

      <!-- Floating Embers -->
      <circle cx="170" cy="130" r="2.5" fill="#FEF08A" filter="url(#glowGlow)"/>
      <circle cx="230" cy="120" r="3" fill="#FEF08A" filter="url(#glowGlow)"/>
      <circle cx="215" cy="90" r="2" fill="#FEF08A" filter="url(#glowGlow)"/>

      <text x="200" y="325" fill="#FDE047" font-family="serif" font-size="11" font-weight="bold" letter-spacing="2" text-anchor="middle">AKHANDA JYOTI</text>
      <text x="200" y="340" fill="#FDBA74" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">ETERNAL SACRED FLAME</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#451A03', '#0A0300');
      drawTrack(ctx, size, '#FDE047', 'rgba(245, 158, 11, 0.4)');
      const c = size / 2;
      ctx.fillStyle = '#F59E0B'; ctx.beginPath();
      ctx.ellipse(c, c + size * 0.12, size * 0.14, size * 0.05, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#EF4444'; ctx.beginPath();
      ctx.moveTo(c, c - size * 0.2); ctx.quadraticCurveTo(c + size * 0.1, c, c, c + size * 0.1);
      ctx.quadraticCurveTo(c - size * 0.1, c, c, c - size * 0.2); ctx.fill();
      ctx.fillStyle = '#FDE047'; ctx.font = \`bold \${Math.round(size * 0.032)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('AKHANDA JYOTI', c, size * 0.74);
    `
  },

  // 14. Sahasrara Lotus Mandala
  {
    id: 'sahasrara_lotus',
    nameOr: 'ସହସ୍ରାର ପଦ୍ମ ମଣ୍ଡଳ',
    nameHi: 'सहस्रार पद्म मण्डल',
    nameEn: 'Sahasrara Lotus Mandala',
    category: 'sacred_symbol',
    categoryLabelOr: 'ପବିତ୍ର ପ୍ରତୀକ',
    categoryLabelHi: 'पवित्र प्रतीक',
    categoryLabelEn: 'Sacred Symbol',
    taglineOr: 'ଚେତନାର ଶୀର୍ଷ ସହସ୍ରାର ଚକ୍ର, ୧୬-ପାଖୁଡ଼ା ପବିତ୍ର ପଦ୍ମ ଜ୍ୟାମିତି',
    taglineHi: 'चेतना का सहस्रार चक्र व दिव्य कमल पंखुड़ी',
    taglineEn: '16-petal sacred geometry rose-gold lotus mandala',
    primaryColor: '#F472B6',
    glowColor: '#C084FC',
    accentColor: '#FDE047',
    badgeGradient: 'from-pink-600 via-purple-600 to-indigo-800',
    centerpieceSvg: `
      <!-- Rose Gold & Amethyst Background -->
      <radialGradient id="lotusBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#4A044E"/>
        <stop offset="60%" stop-color="#2E0854"/>
        <stop offset="100%" stop-color="#0D001A"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#lotusBg)"/>
      ${COMMON_TICKS}

      <!-- 16-Petal Sacred Geometry Lotus Mandala -->
      <g filter="url(#glowGlow)" stroke="#F472B6" stroke-width="1.5" fill="none">
        ${Array.from({ length: 16 }).map((_, i) => {
          const a = (i * 22.5 * Math.PI) / 180;
          return `<ellipse cx="200" cy="200" rx="35" ry="95" transform="rotate(${i * 22.5} 200 200)" fill="rgba(244, 114, 182, 0.12)" />`;
        }).join('')}
      </g>

      <!-- Inner Lotus Heart -->
      <circle cx="200" cy="200" r="45" fill="#831843" stroke="#FDE047" stroke-width="2"/>
      <circle cx="200" cy="200" r="28" fill="#BE185D" stroke="#FEF08A" stroke-width="1.5"/>
      <circle cx="200" cy="200" r="10" fill="#FEF08A" filter="url(#glowGlow)"/>

      <text x="200" y="325" fill="#F472B6" font-family="serif" font-size="11" font-weight="bold" letter-spacing="2" text-anchor="middle">SAHASRARA MANDALA</text>
      <text x="200" y="340" fill="#E879F9" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">ROSE GOLD LOTUS</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#4A044E', '#0D001A');
      drawTrack(ctx, size, '#F472B6', 'rgba(192, 132, 252, 0.4)');
      const c = size / 2;
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI) / 8;
        ctx.fillStyle = 'rgba(244, 114, 182, 0.2)'; ctx.strokeStyle = '#F472B6'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(c, c, size * 0.08, size * 0.22, a, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = '#FEF08A'; ctx.beginPath(); ctx.arc(c, c, size * 0.04, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F472B6'; ctx.font = \`bold \${Math.round(size * 0.032)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('SAHASRARA', c, size * 0.74);
    `
  },

  // 15. Chrono Astrolabe Compass
  {
    id: 'kalachakra_astrolabe',
    nameOr: 'କାଳ ଚକ୍ର ଆଷ୍ଟ୍ରୋଲେବ୍',
    nameHi: 'काल चक्र एस्ट्रोलेब',
    nameEn: 'Chrono Astrolabe Compass',
    category: 'celestial_astro',
    categoryLabelOr: 'ଜ୍ୟୋତିଷ ଓ ମଣ୍ଡଳ',
    categoryLabelHi: 'ज्योतिष व मंडल',
    categoryLabelEn: 'Celestial & Astro',
    taglineOr: 'ପ୍ରାଚୀନ ନୌବାଣିଜ୍ୟର ବ୍ରାସ୍ ଆଷ୍ଟ୍ରୋଲେବ୍ ଓ ଦିଗ୍‌ଦର୍ଶନ କମ୍ପାସ୍',
    taglineHi: 'प्राचीन समुद्री नाविकों का ब्रास एस्ट्रोलेब व कंपास',
    taglineEn: 'Maritime brass nautical compass chronometer with astrolabe',
    primaryColor: '#F59E0B',
    glowColor: '#D97706',
    accentColor: '#FDE047',
    badgeGradient: 'from-amber-700 via-yellow-600 to-amber-900',
    centerpieceSvg: `
      <!-- Aged Maritime Brass Background -->
      <radialGradient id="astroBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#451A03"/>
        <stop offset="70%" stop-color="#271101"/>
        <stop offset="100%" stop-color="#0E0500"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#astroBg)"/>
      ${COMMON_TICKS}

      <!-- 32-Point Compass Rose -->
      <g filter="url(#glowGlow)">
        <!-- 4 Primary Points -->
        <polygon points="200,60 206,190 200,200 194,190" fill="#FDE047"/>
        <polygon points="200,340 206,210 200,200 194,210" fill="#F59E0B"/>
        <polygon points="340,200 210,206 200,200 210,194" fill="#FDE047"/>
        <polygon points="60,200 190,206 200,200 190,194" fill="#F59E0B"/>
      </g>

      <!-- Astrolabe Stereographic Coordinate Arcs -->
      <ellipse cx="200" cy="160" rx="110" ry="60" stroke="#F59E0B" stroke-width="1" stroke-dasharray="3,3" fill="none" opacity="0.4"/>
      <ellipse cx="200" cy="240" rx="110" ry="60" stroke="#F59E0B" stroke-width="1" stroke-dasharray="3,3" fill="none" opacity="0.4"/>

      <!-- Cardinal Letters -->
      <text x="200" y="52" fill="#FDE047" font-family="serif" font-size="14" font-weight="bold" text-anchor="middle">N</text>
      <text x="350" y="205" fill="#FDE047" font-family="serif" font-size="14" font-weight="bold" text-anchor="middle">E</text>
      <text x="200" y="358" fill="#FDE047" font-family="serif" font-size="14" font-weight="bold" text-anchor="middle">S</text>
      <text x="50" y="205" fill="#FDE047" font-family="serif" font-size="14" font-weight="bold" text-anchor="middle">W</text>

      <text x="200" y="280" fill="#FDE047" font-family="serif" font-size="11" font-weight="bold" letter-spacing="2" text-anchor="middle">KALACHAKRA ASTRO</text>
      <text x="200" y="295" fill="#FDBA74" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">MARITIME CHRONOMETER</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#451A03', '#0E0500');
      drawTrack(ctx, size, '#FDE047', 'rgba(217, 119, 6, 0.4)');
      const c = size / 2;
      ctx.fillStyle = '#FDE047'; ctx.beginPath();
      ctx.moveTo(c, c - size * 0.32); ctx.lineTo(c + size * 0.03, c); ctx.lineTo(c, c + size * 0.05); ctx.lineTo(c - size * 0.03, c); ctx.fill();
      ctx.fillStyle = '#FDE047'; ctx.font = \`bold \${Math.round(size * 0.032)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('KALACHAKRA ASTRO', c, size * 0.72);
    `
  },

  // 16. 27 Nakshatras Stellar Mesh
  {
    id: 'nakshatra_constellation',
    nameOr: 'ନକ୍ଷତ୍ର ମଣ୍ଡଳ କସମିକ୍',
    nameHi: 'नक्षत्र मण्डल कॉस्मिक',
    nameEn: '27 Nakshatras Stellar Mesh',
    category: 'celestial_astro',
    categoryLabelOr: 'ଜ୍ୟୋତିଷ ଓ ମଣ୍ଡଳ',
    categoryLabelHi: 'ज्योतिष व मंडल',
    categoryLabelEn: 'Celestial & Astro',
    taglineOr: 'ଅଶ୍ୱିନୀରୁ ରେବତୀ ପର୍ଯ୍ୟନ୍ତ ୨୭ଟି ପବିତ୍ର ବୈଦିକ ନକ୍ଷତ୍ର ସଂଯୋଜକ ଜାଲ',
    taglineHi: 'अश्विनी से रेवती तक २७ नक्षत्रों का आकाशीय जाल',
    taglineEn: '27 lunar mansions connected stellar constellation mesh',
    primaryColor: '#818CF8',
    glowColor: '#38BDF8',
    accentColor: '#C7D2FE',
    badgeGradient: 'from-blue-700 via-indigo-600 to-purple-900',
    centerpieceSvg: `
      <!-- Midnight Deep Space Celestial Sphere -->
      <radialGradient id="nakshBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1E1B4B"/>
        <stop offset="60%" stop-color="#0F0C2E"/>
        <stop offset="100%" stop-color="#030212"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#nakshBg)"/>
      ${COMMON_TICKS}

      <!-- 27 Nakshatra Outer Ring & Constellation Lattice -->
      <g stroke="#818CF8" stroke-width="1" stroke-dasharray="2,4" opacity="0.6">
        <circle cx="200" cy="200" r="140" fill="none"/>
        <circle cx="200" cy="200" r="95" fill="none"/>
      </g>

      <!-- 27 Stars on Celestial Ring -->
      <g filter="url(#glowGlow)">
        ${Array.from({ length: 27 }).map((_, i) => {
          const a = (i * (360 / 27) * Math.PI) / 180;
          const r = i % 2 === 0 ? 140 : 120;
          const x = (200 + r * Math.sin(a)).toFixed(1);
          const y = (200 - r * Math.cos(a)).toFixed(1);
          const starR = i % 3 === 0 ? '3.5' : '2';
          const fill = i % 3 === 0 ? '#FDE047' : '#38BDF8';
          return `<circle cx="${x}" cy="${y}" r="${starR}" fill="${fill}" />`;
        }).join('')}
      </g>

      <!-- Center Astrological Octagram -->
      <polygon points="200,165 208,192 235,200 208,208 200,235 192,208 165,200 192,192" fill="#C7D2FE" filter="url(#glowGlow)"/>

      <text x="200" y="325" fill="#C7D2FE" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="2" text-anchor="middle">27 NAKSHATRAS</text>
      <text x="200" y="340" fill="#818CF8" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">STELLAR MANSIONS</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#1E1B4B', '#030212');
      drawTrack(ctx, size, '#818CF8', 'rgba(129, 140, 248, 0.4)');
      const c = size / 2;
      for (let i = 0; i < 27; i++) {
        const a = (i * Math.PI * 2) / 27;
        const x = c + Math.cos(a) * size * 0.28;
        const y = c + Math.sin(a) * size * 0.28;
        ctx.fillStyle = i % 3 === 0 ? '#FDE047' : '#38BDF8';
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#C7D2FE'; ctx.font = \`bold \${Math.round(size * 0.032)}px sans-serif\`; ctx.textAlign = 'center';
      ctx.fillText('27 NAKSHATRAS', c, size * 0.74);
    `
  },

  // 17. Indra Vajra Plasma
  {
    id: 'vajra_thunder',
    nameOr: 'ଇନ୍ଦ୍ର ବଜ୍ରାୟୁଧ ଶକ୍ତି',
    nameHi: 'इन्द्र वज्रायुध शक्ति',
    nameEn: 'Indra Vajra Plasma',
    category: 'divine_weapon',
    categoryLabelOr: 'ଦିବ୍ୟ ଆୟୁଧ',
    categoryLabelHi: 'दिव्य आयुध',
    categoryLabelEn: 'Divine Weapon',
    taglineOr: 'ଦେବରାଜ ଇନ୍ଦ୍ରଙ୍କ ଦଧୀଚି ଅସ୍ଥି ନିର୍ମିତ ଦିବ୍ୟ ବିଦ୍ୟୁତ ବଜ୍ର',
    taglineHi: 'देवराज इन्द्र का दिव्य वज्रायुध व विद्युत तरंगें',
    taglineEn: 'Diamond faceted scepter with electric plasma arcs',
    primaryColor: '#38BDF8',
    glowColor: '#A855F7',
    accentColor: '#E0F2FE',
    badgeGradient: 'from-blue-600 via-cyan-500 to-indigo-900',
    centerpieceSvg: `
      <!-- Stormy Indigo Background -->
      <radialGradient id="vajraBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1E1B4B"/>
        <stop offset="70%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#vajraBg)"/>
      ${COMMON_TICKS}

      <!-- Double-Headed Vajra Scepter -->
      <g filter="url(#glowGlow)" stroke="#38BDF8" stroke-width="2.5" fill="none">
        <!-- Top Prongs -->
        <path d="M 200,100 L 200,165" stroke="#FDE047" stroke-width="3.5" />
        <path d="M 175,120 Q 200,90 225,120 L 210,165 L 190,165 Z" fill="#0284C7" />
        <!-- Bottom Prongs -->
        <path d="M 200,300 L 200,235" stroke="#FDE047" stroke-width="3.5" />
        <path d="M 175,280 Q 200,310 225,280 L 210,235 L 190,235 Z" fill="#0284C7" />
        <!-- Center Lotus Spheres -->
        <circle cx="200" cy="200" r="18" fill="#FDE047" stroke="#0F172A" stroke-width="2"/>
        <circle cx="200" cy="200" r="8" fill="#0284C7"/>
      </g>

      <!-- Lightning Plasma Arcs -->
      <path d="M 160,180 L 175,190 L 165,200 L 180,210" stroke="#FEF08A" stroke-width="2" fill="none" filter="url(#glowGlow)"/>
      <path d="M 240,180 L 225,190 L 235,200 L 220,210" stroke="#FEF08A" stroke-width="2" fill="none" filter="url(#glowGlow)"/>

      <text x="200" y="335" fill="#38BDF8" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="3" text-anchor="middle">INDRA VAJRA</text>
      <text x="200" y="350" fill="#A855F7" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">ELECTRIC PLASMA</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#1E1B4B', '#020617');
      drawTrack(ctx, size, '#38BDF8', 'rgba(56, 189, 248, 0.4)');
      const c = size / 2;
      ctx.strokeStyle = '#FDE047'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(c, c - size * 0.28); ctx.lineTo(c, c + size * 0.28); ctx.stroke();
      ctx.fillStyle = '#0284C7'; ctx.beginPath(); ctx.arc(c, c, size * 0.06, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#38BDF8'; ctx.font = \`bold \${Math.round(size * 0.032)}px sans-serif\`; ctx.textAlign = 'center';
      ctx.fillText('INDRA VAJRA', c, size * 0.74);
    `
  },

  // 18. Surya Aegis Shield
  {
    id: 'surya_kavach',
    nameOr: 'ସୂର୍ଯ୍ୟ ରଥ କବଚ',
    nameHi: 'सूर्य रथ कवच',
    nameEn: 'Surya Aegis Shield',
    category: 'divine_weapon',
    categoryLabelOr: 'ଦିବ୍ୟ ଆୟୁଧ',
    categoryLabelHi: 'दिव्य आयुध',
    categoryLabelEn: 'Divine Weapon',
    taglineOr: 'ଅଜେୟ ଯୋଦ୍ଧା କର୍ଣ୍ଣଙ୍କ ସୂର୍ଯ୍ୟ ଦତ୍ତ କୁଣ୍ଡଳ ଓ ସ୍ୱର୍ଣ୍ଣିମ କବଚ',
    taglineHi: 'दानवीर कर्ण का सूर्य प्रदत्त दिव्य कवच व कुंडल',
    taglineEn: 'Hexagonal antique bronze warrior armor shield',
    primaryColor: '#D97706',
    glowColor: '#F59E0B',
    accentColor: '#FDE047',
    badgeGradient: 'from-amber-600 via-orange-600 to-amber-950',
    centerpieceSvg: `
      <!-- Antique Hammered Bronze Background -->
      <radialGradient id="kavachBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#451A03"/>
        <stop offset="70%" stop-color="#220D02"/>
        <stop offset="100%" stop-color="#0D0400"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#kavachBg)"/>
      ${COMMON_TICKS}

      <!-- Hexagonal Shield Contour with Rivets -->
      <polygon points="200,70 300,125 300,245 200,300 100,245 100,125" fill="#78350F" stroke="#FDE047" stroke-width="3" filter="url(#glowGlow)"/>
      <!-- Inner Shield Plate -->
      <polygon points="200,90 280,135 280,235 200,280 120,235 120,135" fill="#92400E" stroke="#B45309" stroke-width="2"/>

      <!-- Embossed Solar Face -->
      <circle cx="200" cy="185" r="32" fill="#F59E0B" stroke="#FDE047" stroke-width="2"/>
      <!-- Sun Rays on Shield -->
      ${Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        const x = (200 + 44 * Math.sin(a)).toFixed(1);
        const y = (185 - 44 * Math.cos(a)).toFixed(1);
        return `<circle cx="${x}" cy="${y}" r="4" fill="#FDE047" />`;
      }).join('')}

      <text x="200" y="325" fill="#FDE047" font-family="serif" font-size="11" font-weight="bold" letter-spacing="2" text-anchor="middle">SURYA AEGIS</text>
      <text x="200" y="340" fill="#FDBA74" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">WARRIOR SHIELD</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#451A03', '#0D0400');
      drawTrack(ctx, size, '#FDE047', 'rgba(217, 119, 6, 0.4)');
      const c = size / 2;
      ctx.fillStyle = '#78350F'; ctx.strokeStyle = '#FDE047'; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const x = c + Math.cos(a) * size * 0.28;
        const y = c + Math.sin(a) * size * 0.28;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#FDE047'; ctx.font = \`bold \${Math.round(size * 0.032)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('SURYA AEGIS', c, size * 0.74);
    `
  },

  // 19. Navagraha Celestial Orbit
  {
    id: 'navagraha_orbit',
    nameOr: 'ନବଗ୍ରହ କକ୍ଷ ମଣ୍ଡଳ',
    nameHi: 'नवग्रह कक्ष मण्डल',
    nameEn: 'Navagraha Celestial Orbit',
    category: 'celestial_astro',
    categoryLabelOr: 'ଜ୍ୟୋତିଷ ଓ ମଣ୍ଡଳ',
    categoryLabelHi: 'ज्योतिष व मंडल',
    categoryLabelEn: 'Celestial & Astro',
    taglineOr: 'ସୂର୍ଯ୍ୟ, ଚନ୍ଦ୍ର, ମଙ୍ଗଳ ଆଦି ୯ଟି ଗ୍ରହର ରତ୍ନମୟ ଜ୍ୟୋତିଷୀୟ କକ୍ଷପଥ',
    taglineHi: 'सूर्य, चंद्र, मंगल आदि नवग्रहों की पावन कक्षा',
    taglineEn: '3 orbital ellipses with 9 gemstone planetary spheres',
    primaryColor: '#F59E0B',
    glowColor: '#38BDF8',
    accentColor: '#FEF08A',
    badgeGradient: 'from-amber-600 via-sky-600 to-indigo-900',
    centerpieceSvg: `
      <!-- Void Space Background -->
      <radialGradient id="navaBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1E1B4B"/>
        <stop offset="70%" stop-color="#0A0A1F"/>
        <stop offset="100%" stop-color="#020208"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#navaBg)"/>
      ${COMMON_TICKS}

      <!-- 3 Concentric Planetary Orbital Ellipses -->
      <g stroke="#818CF8" stroke-width="1.2" stroke-dasharray="3,6" fill="none" opacity="0.6">
        <ellipse cx="200" cy="200" rx="140" ry="70" transform="rotate(-30 200 200)" />
        <ellipse cx="200" cy="200" rx="110" ry="55" transform="rotate(25 200 200)" />
        <ellipse cx="200" cy="200" rx="75" ry="40" transform="rotate(-60 200 200)" />
      </g>

      <!-- Center Golden Sun (Surya) -->
      <circle cx="200" cy="200" r="24" fill="#F59E0B" stroke="#FEF08A" stroke-width="3" filter="url(#glowGlow)"/>
      <circle cx="200" cy="200" r="14" fill="#EF4444"/>

      <!-- 9 Gemstone Planetary Orbs on Orbits -->
      <g filter="url(#glowGlow)">
        <circle cx="100" cy="140" r="7" fill="#E2E8F0" /> <!-- Moon / Pearl -->
        <circle cx="290" cy="160" r="8" fill="#EF4444" /> <!-- Mars / Coral -->
        <circle cx="160" cy="120" r="6" fill="#10B981" /> <!-- Mercury / Emerald -->
        <circle cx="260" cy="250" r="9" fill="#FDE047" /> <!-- Jupiter / Topaz -->
        <circle cx="130" cy="260" r="7.5" fill="#38BDF8" /> <!-- Venus / Diamond -->
        <circle cx="310" cy="230" r="8.5" fill="#1E3A8A" /> <!-- Saturn / Sapphire -->
        <circle cx="85" cy="210" r="6" fill="#78350F" /> <!-- Rahu / Gomed -->
        <circle cx="215" cy="85" r="6" fill="#A855F7" /> <!-- Ketu / Cat's Eye -->
      </g>

      <text x="200" y="325" fill="#FEF08A" font-family="serif" font-size="11" font-weight="bold" letter-spacing="2" text-anchor="middle">NAVAGRAHA ORBIT</text>
      <text x="200" y="340" fill="#93C5FD" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">9 CELESTIAL SPHERES</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#1E1B4B', '#020208');
      drawTrack(ctx, size, '#FEF08A', 'rgba(129, 140, 248, 0.4)');
      const c = size / 2;
      ctx.fillStyle = '#F59E0B'; ctx.beginPath(); ctx.arc(c, c, size * 0.08, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#FEF08A'; ctx.lineWidth = 2.5; ctx.stroke();
      const planets = ['#E2E8F0', '#EF4444', '#10B981', '#FDE047', '#38BDF8', '#1E3A8A'];
      for (let i = 0; i < planets.length; i++) {
        const a = (i * Math.PI * 2) / planets.length;
        ctx.fillStyle = planets[i]; ctx.beginPath();
        ctx.arc(c + Math.cos(a) * size * 0.25, c + Math.sin(a) * size * 0.18, 5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#FEF08A'; ctx.font = \`bold \${Math.round(size * 0.032)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('NAVAGRAHA', c, size * 0.74);
    `
  },

  // 20. Simhadwara Temple Portal
  {
    id: 'simhadwara_seal',
    nameOr: 'ଶ୍ରୀମନ୍ଦିର ସିଂହଦ୍ୱାର ମୁଦ୍ରା',
    nameHi: 'श्रीमंदिर सिंहद्वार मुद्रा',
    nameEn: 'Simhadwara Temple Portal',
    category: 'royal_regalia',
    categoryLabelOr: 'ରାଜକୀୟ ଐତିହ୍ୟ',
    categoryLabelHi: 'राजकीय धरोहर',
    categoryLabelEn: 'Royal Regalia',
    taglineOr: 'ବଡ଼ଦାଣ୍ଡରୁ ଶ୍ରୀମନ୍ଦିର ସିଂହଦ୍ୱାର ପ୍ରବେଶ, ଗୋଧୂଳି ସୂର୍ଯ୍ୟାସ୍ତ ଓ ମନ୍ଦିର ଚୂଳ',
    taglineHi: 'बड़ादाण्ड से श्रीमन्दिर सिंहद्वार व गोधूलि संध्या',
    taglineEn: 'Srimandir Badadanda twilight sunset archway & sanctum spire',
    primaryColor: '#F59E0B',
    glowColor: '#EC4899',
    accentColor: '#FDE047',
    badgeGradient: 'from-amber-600 via-rose-600 to-purple-900',
    centerpieceSvg: `
      <!-- Twilight Sunset Sky Background -->
      <radialGradient id="simhaBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#831843"/>
        <stop offset="60%" stop-color="#4C0519"/>
        <stop offset="100%" stop-color="#140206"/>
      </radialGradient>
      <circle cx="200" cy="200" r="190" fill="url(#simhaBg)"/>
      ${COMMON_TICKS}

      <!-- Grand Temple Spire (Bada Deula Vimana) Silhouette -->
      <path d="M 200,60 L 210,120 L 220,180 L 180,180 L 190,120 Z" fill="#F59E0B" stroke="#FDE047" stroke-width="1.5" filter="url(#glowGlow)"/>
      <!-- Temple Spire Kalasha & Flag -->
      <circle cx="200" cy="55" r="5" fill="#FDE047" />
      <polygon points="200,52 215,48 200,44" fill="#EF4444" />

      <!-- Simhadwara Archway Portal -->
      <path d="M 150,260 L 150,190 Q 200,165 250,190 L 250,260 Z" fill="#1C1917" stroke="#FDE047" stroke-width="2"/>
      <path d="M 170,260 L 170,210 Q 200,190 230,210 L 230,260 Z" fill="#0C0A09"/>

      <!-- Twin Guardian Lion Silhouettes -->
      <circle cx="140" cy="250" r="10" fill="#F59E0B"/>
      <circle cx="260" cy="250" r="10" fill="#F59E0B"/>

      <!-- Sunset Rays on Horizon -->
      <line x1="80" y1="180" x2="320" y2="180" stroke="#F43F5E" stroke-width="2" stroke-dasharray="3,6" opacity="0.6"/>

      <text x="200" y="300" fill="#FDE047" font-family="serif" font-size="11" font-weight="bold" letter-spacing="2" text-anchor="middle">SIMHADWARA</text>
      <text x="200" y="315" fill="#FDA4AF" font-family="sans-serif" font-size="8" letter-spacing="2" text-anchor="middle">SRIMANDIR SANCTUM</text>
    `,
    renderCode: `
      drawFaceBackground(ctx, size, '#831843', '#140206');
      drawTrack(ctx, size, '#FDE047', 'rgba(236, 72, 153, 0.4)');
      const c = size / 2;
      ctx.fillStyle = '#F59E0B'; ctx.beginPath();
      ctx.moveTo(c, c - size * 0.28); ctx.lineTo(c + size * 0.08, c); ctx.lineTo(c - size * 0.08, c); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#1C1917'; ctx.fillRect(c - size * 0.12, c, size * 0.24, size * 0.16);
      ctx.fillStyle = '#FDE047'; ctx.font = \`bold \${Math.round(size * 0.032)}px serif\`; ctx.textAlign = 'center';
      ctx.fillText('SIMHADWARA', c, size * 0.74);
    `
  }
];

// Generate Full TypeScript File
let tsCode = `// src/core/todo/vedicWatchLogos.ts
// 20 World-Class Smart Watch Faces & Wallpapers (୨୦ଟି ଆଧୁନିକ ସ୍ମାର୍ଟ ୱାଚ୍ ଫେସ୍ ଓ ୱାଲପେପର୍)

export type WatchLogoCategory = 'sacred_symbol' | 'divine_weapon' | 'celestial_astro' | 'royal_regalia';

export interface VedicWatchLogo {
  id: string;
  nameOr: string;
  nameHi: string;
  nameEn: string;
  category: WatchLogoCategory;
  categoryLabelOr: string;
  categoryLabelHi: string;
  categoryLabelEn: string;
  taglineOr: string;
  taglineHi: string;
  taglineEn: string;
  primaryColor: string;
  glowColor: string;
  accentColor: string;
  badgeGradient: string;
  renderCanvas: (ctx: CanvasRenderingContext2D, size: number) => void;
  svgString: string;
  dialSvgString: string;
}

function drawFaceBackground(
  ctx: CanvasRenderingContext2D,
  size: number,
  innerColor: string,
  outerColor: string
) {
  const c = size / 2;
  const grad = ctx.createRadialGradient(c, c, size * 0.05, c, c, size * 0.49);
  grad.addColorStop(0, innerColor);
  grad.addColorStop(1, outerColor);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(c, c, size * 0.49, 0, Math.PI * 2);
  ctx.fill();
}

function drawTrack(
  ctx: CanvasRenderingContext2D,
  size: number,
  colorMajor: string,
  colorMinor: string
) {
  const c = size / 2;
  const r = size * 0.46;
  ctx.save();
  for (let i = 0; i < 60; i++) {
    const a = (i * Math.PI) / 30;
    const isMajor = i % 5 === 0;
    const len = isMajor ? size * 0.045 : size * 0.02;
    ctx.strokeStyle = isMajor ? colorMajor : colorMinor;
    ctx.lineWidth = isMajor ? size * 0.015 : size * 0.007;
    ctx.beginPath();
    ctx.moveTo(c + Math.cos(a) * (r - len), c + Math.sin(a) * (r - len));
    ctx.lineTo(c + Math.cos(a) * r, c + Math.sin(a) * r);
    ctx.stroke();
  }
  ctx.restore();
}

export const VEDIC_WATCH_LOGOS: VedicWatchLogo[] = [
`;

for (const w of WALLPAPERS) {
  const fullSvg = `<svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS_BASE}
  </defs>
  ${w.centerpieceSvg.trim()}
  ${COMMON_HANDS.trim()}
  ${SMART_WATCH_BEZEL.trim()}
</svg>`.replace(/\s+/g, ' ');

  const dialSvg = `<svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${SVG_DEFS_BASE}
  </defs>
  ${w.centerpieceSvg.trim()}
</svg>`.replace(/\s+/g, ' ');

  tsCode += `  {
    id: '${w.id}',
    nameOr: '${w.nameOr}',
    nameHi: '${w.nameHi}',
    nameEn: '${w.nameEn}',
    category: '${w.category}',
    categoryLabelOr: '${w.categoryLabelOr}',
    categoryLabelHi: '${w.categoryLabelHi}',
    categoryLabelEn: '${w.categoryLabelEn}',
    taglineOr: '${w.taglineOr}',
    taglineHi: '${w.taglineHi}',
    taglineEn: '${w.taglineEn}',
    primaryColor: '${w.primaryColor}',
    glowColor: '${w.glowColor}',
    accentColor: '${w.accentColor}',
    badgeGradient: '${w.badgeGradient}',
    renderCanvas: (ctx, size) => {
      ${w.renderCode.trim()}
    },
    svgString: \`${fullSvg}\`,
    dialSvgString: \`${dialSvg}\`,
  },
`;
}

tsCode += `];

export const DEFAULT_WATCH_LOGO_ID = 'nilachakra';

export function getWatchLogoById(id: string): VedicWatchLogo {
  return VEDIC_WATCH_LOGOS.find(l => l.id === id) || VEDIC_WATCH_LOGOS[0];
}
`;

const destPath = path.resolve(__dirname, '../src/core/todo/vedicWatchLogos.ts');
fs.writeFileSync(destPath, tsCode, 'utf8');
console.log('Successfully generated 20 ultra-modern smart watch wallpapers in', destPath);
