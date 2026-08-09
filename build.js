const fs = require('fs');
const si = require('simple-icons');

const OUT = 'assets';
fs.mkdirSync(OUT, { recursive: true });

// GitHub's own canvas colours, so the graphics sit inside the page
// rather than on top of it.
const THEMES = {
  light: {
    panel: '#F6F8FA', border: '#D1D9E0', ink: '#1F2328',
    muted: '#59636E', accent: '#0969DA', dot: '#AFB8C1', tile: '#FFFFFF',
  },
  dark: {
    panel: '#0D1117', border: '#30363D', ink: '#E6EDF3',
    muted: '#9198A1', accent: '#58A6FF', dot: '#3D444D', tile: '#161B22',
  },
};

const FONT = "ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

const REDUCED = `@media (prefers-reduced-motion:reduce){*{animation:none!important}}`;

/* ---------------------------------------------------------------- banner */
function banner(t) {
  // Dot matrix on the right, fading diagonally away from the text.
  let dots = '';
  const cols = 9, rows = 6, gap = 26, x0 = 790, y0 = 62;
  const accents = new Set(['2-1', '4-3', '6-0', '7-4', '3-5']);
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const key = `${c}-${r}`;
      const isAccent = accents.has(key);
      // fade toward the top-left so the dots recede behind the text
      const op = Math.min(1, 0.18 + (c / cols) * 0.75 + (r / rows) * 0.18);
      const cx = x0 + c * gap, cy = y0 + r * gap;
      if (isAccent) {
        const delay = ((c + r) % 5) * 0.9;
        dots += `<circle cx="${cx}" cy="${cy}" r="3.4" fill="${t.accent}" class="pulse" style="animation-delay:${delay}s"/>`;
      } else {
        dots += `<circle cx="${cx}" cy="${cy}" r="2.6" fill="${t.dot}" opacity="${op.toFixed(2)}"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="280" viewBox="0 0 1200 280" role="img" aria-label="Tony Phan — secondary school student in Ho Chi Minh City building iOS apps and Arduino things">
<defs>
  <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${t.accent}" stop-opacity="0"/>
    <stop offset="50%" stop-color="${t.accent}" stop-opacity="1"/>
    <stop offset="100%" stop-color="${t.accent}" stop-opacity="0"/>
  </linearGradient>
  <clipPath id="card"><rect x="1" y="1" width="1198" height="278" rx="16"/></clipPath>
</defs>
<style>
  .pulse{animation:p 4.5s ease-in-out infinite}
  @keyframes p{0%,100%{opacity:.25}50%{opacity:1}}
  .sweep{animation:s 7s ease-in-out infinite}
  @keyframes s{0%{transform:translateX(-45%)}50%{transform:translateX(45%)}100%{transform:translateX(-45%)}}
  ${REDUCED}
</style>

<rect x="1" y="1" width="1198" height="278" rx="16" fill="${t.panel}" stroke="${t.border}" stroke-width="1.5"/>
<g clip-path="url(#card)">
  ${dots}

  <text x="72" y="118" font-family="${FONT}" font-size="54" font-weight="700" fill="${t.ink}" letter-spacing="-1.2">Tony Phan</text>
  <rect x="74" y="140" width="46" height="3" rx="1.5" fill="${t.accent}"/>
  <text x="72" y="180" font-family="${FONT}" font-size="21" fill="${t.muted}">Secondary school student in Ho Chi Minh City.</text>
  <text x="72" y="212" font-family="${FONT}" font-size="21" fill="${t.muted}">I build iOS apps and Arduino things.</text>

  <g font-family="${FONT}" font-size="13" font-weight="600" letter-spacing="1.4" fill="${t.accent}">
    <text x="72" y="60">SWIFT &#183; SWIFTUI &#183; ARDUINO</text>
  </g>

  <g clip-path="url(#card)">
    <rect class="sweep" x="0" y="276.5" width="1200" height="3" fill="url(#sweep)"/>
  </g>
</g>
</svg>`;
}

/* -------------------------------------------------------------- divider */
function divider(t) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="26" viewBox="0 0 1200 26" role="presentation">
<defs>
  <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${t.border}" stop-opacity="0"/>
    <stop offset="25%" stop-color="${t.border}" stop-opacity="1"/>
    <stop offset="75%" stop-color="${t.border}" stop-opacity="1"/>
    <stop offset="100%" stop-color="${t.border}" stop-opacity="0"/>
  </linearGradient>
</defs>
<rect x="0" y="12.5" width="1200" height="1" fill="url(#fade)"/>
<rect x="592" y="5" width="16" height="16" rx="4" transform="rotate(45 600 13)" fill="${t.panel}" stroke="${t.border}"/>
<circle cx="600" cy="13" r="3" fill="${t.accent}"/>
</svg>`;
}

/* ------------------------------------------------------------ tech tiles */
// One tile per distinct logo — repeating the Swift mark for SwiftUI read as
// a mistake. SwiftUI is called out in the banner instead.
const STACK = [
  ['siSwift', 'Swift'],
  ['siXcode', 'Xcode'],
  ['siPython', 'Python'],
  ['siCplusplus', 'C++'],
  ['siArduino', 'Arduino'],
  ['siGit', 'Git'],
];

function tiles(t, themeName) {
  const W = 168, H = 154, GAP = 18;
  const total = STACK.length * W + (STACK.length - 1) * GAP;
  const startX = (1200 - total) / 2;
  let g = '';
  STACK.forEach(([key, label], i) => {
    const icon = si[key];
    if (!icon) throw new Error('missing icon ' + key);
    const x = startX + i * (W + GAP);
    // Dark-on-dark logos need lifting; light theme keeps brand colour.
    let hex = '#' + icon.hex;
    if (themeName === 'dark' && key === 'siCplusplus') hex = '#7BA7D9';
    const s = 46 / 24; // simple-icons paths are on a 24×24 grid
    g += `
  <g class="tile" style="animation-delay:${(i * 0.35).toFixed(2)}s">
    <rect x="${x}" y="10" width="${W}" height="${H}" rx="18" fill="${t.tile}" stroke="${t.border}" stroke-width="1.5"/>
    <g transform="translate(${x + W / 2 - 23} 44) scale(${s.toFixed(4)})">
      <path d="${icon.path}" fill="${hex}"/>
    </g>
    <text x="${x + W / 2}" y="130" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="600" fill="${t.muted}">${label}</text>
  </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="170" viewBox="0 0 1200 170" role="img" aria-label="Tech stack: Swift, SwiftUI, Xcode, Python, C++, Arduino, Git">
<style>
  .tile{animation:f 9s ease-in-out infinite}
  @keyframes f{0%,100%{opacity:.86}50%{opacity:1}}
  ${REDUCED}
</style>${g}
</svg>`;
}

for (const [name, t] of Object.entries(THEMES)) {
  fs.writeFileSync(`${OUT}/banner-${name}.svg`, banner(t));
  fs.writeFileSync(`${OUT}/divider-${name}.svg`, divider(t));
  fs.writeFileSync(`${OUT}/stack-${name}.svg`, tiles(t, name));
}
console.log('wrote', fs.readdirSync(OUT).join(', '));
