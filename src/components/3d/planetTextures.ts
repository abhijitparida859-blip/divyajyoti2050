import * as THREE from 'three';

function createCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D | null] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  return [canvas, ctx];
}

const textureLoader = new THREE.TextureLoader();

export function loadRealPlanetTexture(body: string): THREE.Texture {
  let path = '/textures/earth_day_4096.jpg';
  const b = body.toLowerCase();

  if (b.includes('rahu') || b.includes('ketu') || b.includes('node')) {
    return createRahuKetuTexture();
  }

  if (b.includes('sun') || b.includes('surya')) path = '/textures/sun.jpg';
  else if (b.includes('mercury') || b.includes('budha')) path = '/textures/mercury.jpg';
  else if (b.includes('venus') || b.includes('shukra')) path = '/textures/venus.jpg';
  else if (b.includes('moon') || b.includes('chandra')) path = '/textures/moon.jpg';
  else if (b.includes('mars') || b.includes('mangala')) path = '/textures/mars.jpg';
  else if (b.includes('jupiter') || b.includes('guru') || b.includes('brihaspati')) path = '/textures/jupiter.jpg';
  else if (b.includes('saturn') || b.includes('shani')) path = '/textures/saturn.jpg';
  else if (b.includes('uranus') || b.includes('aruna')) path = '/textures/uranus.jpg';
  else if (b.includes('neptune') || b.includes('varuna')) path = '/textures/neptune.jpg';
  else if (b.includes('earth') || b.includes('prithvi')) path = '/textures/earth_day_4096.jpg';

  const tex = textureLoader.load(path, undefined, undefined, (err) => console.warn('Texture load failed:', path, err));
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createRahuKetuTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 256);
  if (!ctx) return new THREE.CanvasTexture(canvas);
  
  const grad = ctx.createLinearGradient(0, 0, 512, 256);
  grad.addColorStop(0, '#0f0c29');
  grad.addColorStop(0.5, '#302b63');
  grad.addColorStop(1, '#24243e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);
  
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = Math.random() * 2 + 0.5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function loadEarthCloudsTexture(): THREE.Texture {
  const tex = textureLoader.load('/textures/earth_clouds_1024.png');
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function loadEarthSpecularTexture(): THREE.Texture {
  const tex = textureLoader.load('/textures/earth_specular_2048.jpg');
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSunTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.15, '#fff9c4');
  grad.addColorStop(0.35, '#fbc02d');
  grad.addColorStop(0.6, '#f57c00');
  grad.addColorStop(0.85, '#d84315');
  grad.addColorStop(1, '#bf360c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Solar flares and turbulence
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 7 + 1.5;
    ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 245, 157, 0.45)' : 'rgba(230, 81, 0, 0.35)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createEarthTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(2048, 1024);
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep Ocean Blue Gradient (NASA Blue Marble style)
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  oceanGrad.addColorStop(0, '#0a1d37');
  oceanGrad.addColorStop(0.2, '#0f3156');
  oceanGrad.addColorStop(0.5, '#124170');
  oceanGrad.addColorStop(0.8, '#0f3156');
  oceanGrad.addColorStop(1, '#0a1d37');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Continental Shelf Shallow Waters (Cyan-Aqua Glow around coasts)
  ctx.fillStyle = '#164e63';
  // Eurasia / Asia shelf
  ctx.beginPath();
  ctx.ellipse(1350, 360, 360, 200, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // 1. ASIA & EURASIA MAINLAND
  ctx.fillStyle = '#2d6a4f'; // Temperate Green
  ctx.beginPath();
  ctx.ellipse(1320, 340, 320, 170, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Himalayan Mountain Range & Tibetan Plateau (Snow & Alpine Brown)
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(1380, 370, 140, 45, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f1f5f9'; // Snow crests of Himalayas
  ctx.beginPath();
  ctx.ellipse(1380, 365, 120, 18, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // 2. INDIAN SUBCONTINENT (Triangular Peninsula extending into Indian Ocean)
  ctx.fillStyle = '#40916c'; // Fertile Deccan & Gangetic plains
  ctx.beginPath();
  ctx.moveTo(1310, 380); // North-West (Indus valley)
  ctx.lineTo(1460, 390); // North-East (Bengal & Odisha coast)
  ctx.lineTo(1390, 560); // Cape Comorin (Kanyakumari tip)
  ctx.closePath();
  ctx.fill();

  // Thar Desert / Western India Arid Zone
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.ellipse(1330, 420, 40, 35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sri Lanka
  ctx.fillStyle = '#1b4332';
  ctx.beginPath();
  ctx.ellipse(1405, 595, 14, 22, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // 3. AFRICA (Distinct continental horn, Sahara desert & Congo rainforest)
  // Sahara Desert
  ctx.fillStyle = '#c27803';
  ctx.beginPath();
  ctx.ellipse(1060, 460, 180, 100, 0, 0, Math.PI * 2);
  ctx.fill();
  // Central & Southern Africa (Tropical green)
  ctx.fillStyle = '#1e5f38';
  ctx.beginPath();
  ctx.ellipse(1090, 620, 110, 140, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Madagascar
  ctx.fillStyle = '#2d6a4f';
  ctx.beginPath();
  ctx.ellipse(1250, 680, 16, 45, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // 4. EUROPE
  ctx.fillStyle = '#2d6a4f';
  ctx.beginPath();
  ctx.ellipse(1040, 270, 130, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  // Mediterranean Sea cutout
  ctx.fillStyle = '#0f3156';
  ctx.beginPath();
  ctx.ellipse(1050, 340, 110, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // 5. NORTH AMERICA
  ctx.fillStyle = '#2d6a4f';
  ctx.beginPath();
  ctx.ellipse(500, 310, 180, 150, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Rocky Mountains / Arid West
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.ellipse(440, 310, 40, 120, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // Greenland
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(750, 140, 80, 100, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // 6. SOUTH AMERICA
  ctx.fillStyle = '#1b4332'; // Amazon rainforest
  ctx.beginPath();
  ctx.ellipse(640, 650, 120, 190, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Andes mountain spine
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(560, 660, 20, 180, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // 7. AUSTRALIA
  ctx.fillStyle = '#b45309'; // Red Outback
  ctx.beginPath();
  ctx.ellipse(1680, 680, 110, 75, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e5f38'; // Eastern coastline greenery
  ctx.beginPath();
  ctx.ellipse(1760, 680, 25, 70, 0, 0, Math.PI * 2);
  ctx.fill();

  // 8. POLAR ICE CAPS (Arctic & Antarctica)
  ctx.fillStyle = '#f8fafc';
  // North Pole Ice
  ctx.beginPath();
  ctx.ellipse(1024, 25, 1000, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  // Antarctica Solid Ice Sheet
  ctx.beginPath();
  ctx.ellipse(1024, 995, 1024, 60, 0, 0, Math.PI * 2);
  ctx.fill();

  // 9. SUBTLE REALISTIC CLOUD STREAMS (Fine feather-like streams, no blurry circles)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  for (let y = 180; y < 850; y += 120) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(500, y + 40, 1000, y - 40, 1500, y + 30);
    ctx.bezierCurveTo(1800, y + 10, 1950, y - 20, 2048, y);
    ctx.lineWidth = 14 + (y % 10);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createMoonTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 256);
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, 512, 256);

  // Lunar Maria
  ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  const maria = [
    { x: 180, y: 100, rx: 70, ry: 50 },
    { x: 300, y: 130, rx: 90, ry: 60 },
    { x: 120, y: 160, rx: 50, ry: 40 },
    { x: 390, y: 90, rx: 60, ry: 45 }
  ];
  for (const m of maria) {
    ctx.beginPath();
    ctx.ellipse(m.x, m.y, m.rx, m.ry, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Craters
  for (let i = 0; i < 250; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = Math.random() * 5 + 1;
    ctx.fillStyle = 'rgba(248, 250, 252, 0.75)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createMarsTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 256);
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.fillStyle = '#b91c1c'; // rust red
  ctx.fillRect(0, 0, 512, 256);

  // Dark canyon and dusty basaltic regions
  ctx.fillStyle = 'rgba(69, 10, 10, 0.6)';
  for (let i = 0; i < 20; i++) {
    const y = 70 + Math.random() * 120;
    ctx.fillRect(0, y, 512, Math.random() * 18 + 6);
  }

  // Polar Ice Caps
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(256, 10, 120, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(256, 246, 110, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createJupiterTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 256);
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const bands = [
    '#fef08a', '#d97706', '#ffedd5', '#b45309',
    '#ffedd5', '#92400e', '#fde68a', '#78350f',
    '#fffbeb', '#b45309', '#fed7aa', '#fef08a'
  ];
  const bandHeight = 256 / bands.length;
  bands.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * bandHeight, 512, bandHeight);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    for (let x = 0; x < 512; x += 16) {
      const offset = Math.sin((x / 512) * Math.PI * 8) * 4;
      ctx.fillRect(x, i * bandHeight + offset, 8, bandHeight * 0.5);
    }
  });

  // Great Red Spot
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.ellipse(340, 175, 46, 24, -Math.PI / 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fca5a5';
  ctx.lineWidth = 3;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSaturnTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 256);
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const bands = ['#fef3c7', '#fde68a', '#fef08a', '#fcd34d', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24'];
  const bh = 256 / bands.length;
  bands.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, i * bh, 512, bh);
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSaturnRingTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 32);
  if (!ctx) return new THREE.CanvasTexture(canvas);
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.12, 'rgba(217, 119, 6, 0.35)');
  grad.addColorStop(0.28, 'rgba(254, 240, 138, 0.95)');
  grad.addColorStop(0.65, 'rgba(253, 230, 138, 0.98)');
  grad.addColorStop(0.67, 'rgba(0,0,0,0.05)'); // Cassini Division Gap
  grad.addColorStop(0.71, 'rgba(0,0,0,0.02)');
  grad.addColorStop(0.73, 'rgba(252, 211, 77, 0.88)');
  grad.addColorStop(0.95, 'rgba(217, 119, 6, 0.4)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 32);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createVenusTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 256);
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.fillStyle = '#fef9c3';
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = 'rgba(234, 179, 8, 0.35)';
  for (let i = 0; i < 25; i++) {
    ctx.beginPath();
    ctx.ellipse(Math.random() * 512, Math.random() * 256, 140, 35, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createMercuryTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 256);
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(0, 0, 512, 256);

  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = Math.random() * 5 + 1;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}