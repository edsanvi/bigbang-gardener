// Genera los íconos PWA (PNG) sin dependencias: cielo índigo con neblinas
// y una estrella dorada de 4 puntas. Uso: node gen-icons.js
'use strict';
const zlib = require('zlib'), fs = require('fs');

function crc32(buf){
  let table = crc32.table;
  if (!table){
    table = crc32.table = new Int32Array(256);
    for (let n=0;n<256;n++){
      let c = n;
      for (let k=0;k<8;k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let c = ~0;
  for (let i=0;i<buf.length;i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return ~c >>> 0;
}
function chunk(type, data){
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
function png(w, h, rgba){
  const raw = Buffer.alloc((w*4 + 1) * h);
  for (let y=0;y<h;y++){
    raw[y*(w*4+1)] = 0; // filtro none
    rgba.copy(raw, y*(w*4+1)+1, y*w*4, (y+1)*w*4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, {level:9})),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function hash(x, y){
  let h = (x*374761393 + y*668265263) | 0;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

function drawIcon(s){
  const px = Buffer.alloc(s*s*4);
  const cx = s/2, cy = s/2;
  for (let y=0;y<s;y++) for (let x=0;x<s;x++){
    const dx = x-cx, dy = y-cy, r = Math.hypot(dx,dy)/(s/2);
    // fondo índigo con viñeta
    let R = 6 + 6*(1-Math.min(1,r)), G = 5 + 5*(1-Math.min(1,r)), B = 15 + 15*(1-Math.min(1,r));
    // neblinas violeta y cian
    const n1 = Math.exp(-(((x-s*0.30)**2 + (y-s*0.32)**2))/(2*(s*0.28)**2));
    R += 157*0.11*n1; G += 123*0.11*n1; B += 255*0.11*n1;
    const n2 = Math.exp(-(((x-s*0.72)**2 + (y-s*0.70)**2))/(2*(s*0.26)**2));
    R += 127*0.09*n2; G += 227*0.09*n2; B += 239*0.09*n2;
    // estrellitas de fondo (grilla pseudoaleatoria)
    const cell = s/16, gx = Math.floor(x/cell), gy = Math.floor(y/cell);
    const hh = hash(gx, gy);
    if (hh > 0.55){
      const sx = (gx + hash(gx, gy+99)*0.8 + 0.1)*cell;
      const sy = (gy + hash(gx+7, gy)*0.8 + 0.1)*cell;
      const sd = Math.hypot(x-sx, y-sy);
      const si = Math.exp(-(sd*sd)/(2*(s*0.004+0.6)**2)) * (0.25 + hh*0.4);
      R += 232*si; G += 228*si; B += 255*si;
    }
    // estrella central dorada de 4 puntas con núcleo blanco
    const core = Math.exp(-(r*r)/(2*0.10*0.10)) * 1.5;
    const spike = Math.exp(-Math.abs(dx*dy)/(s*s*0.0018)) * Math.exp(-(r*r)/(2*0.40*0.40)) * 0.95;
    const i = Math.min(1.6, core + spike);
    R += 255*i; G += (217 + 30*Math.min(1,core))*i; B += (138 + 100*Math.min(1,core))*i;
    const o = (y*s + x)*4;
    px[o] = Math.min(255, R); px[o+1] = Math.min(255, G);
    px[o+2] = Math.min(255, B); px[o+3] = 255;
  }
  return png(s, s, px);
}

for (const [f, s] of [['icon-512.png',512], ['icon-192.png',192], ['apple-touch-icon.png',180]]){
  fs.writeFileSync(__dirname + '/' + f, drawIcon(s));
  console.log('✓', f);
}
