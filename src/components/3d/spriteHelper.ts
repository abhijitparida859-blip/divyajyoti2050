import * as THREE from 'three';

/**
 * Creates a floating 3D canvas billboard sprite with crisp glowing text
 */
export function createTextSprite(
  text: string,
  subText: string = '',
  bgColor: string = 'rgba(2, 6, 23, 0.85)',
  borderColor: string = '#eab308',
  textColor: string = '#f8fafc'
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Sprite();

  // Rounded rectangle background
  ctx.fillStyle = bgColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 4;
  
  const x = 8, y = 8, w = 240, h = 112, radius = 24;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Text formatting
  ctx.textAlign = 'center';
  ctx.fillStyle = textColor;
  ctx.font = 'bold 36px "Noto Sans", "Noto Sans Odia", "Noto Sans Devanagari", sans-serif';
  ctx.fillText(text, 128, subText ? 56 : 72);

  if (subText) {
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 26px "Noto Sans", "Noto Sans Odia", "Noto Sans Devanagari", monospace';
    ctx.fillText(subText, 128, 96);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(2.2, 1.1, 1);
  return sprite;
}

export function createZodiacSignSprite(
  signName: string,
  signNumber: string
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Sprite();

  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
  ctx.lineWidth = 3;

  // roundRect polyfill for older browsers
  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };
  roundRect(ctx, 4, 4, 152, 72, 16);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 26px "Noto Sans", "Noto Sans Odia", "Noto Sans Devanagari", sans-serif';
  ctx.fillText(signName, 80, 38);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 18px monospace';
  ctx.fillText(signNumber, 80, 62);

  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2.0, 1.0, 1);
  return sprite;
}