export const HEXtoHSV = (hex: string) => {
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  const r = parseInt(rgb?.[1] ?? 'FF', 16) / 255;
  const g = parseInt(rgb?.[2] ?? 'FF', 16) / 255;
  const b = parseInt(rgb?.[3] ?? 'FF', 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  let h = 0;
  switch (max) {
    case min:
      h = 0;
      break;
    case r:
      h = g - b + d * (g < b ? 6 : 0);
      h *= 60 / d;
      break;
    case g:
      h = b - r + d * 2;
      h *= 60 / d;
      break;
    case b:
      h = r - g + d * 4;
      h *= 60 / d;
      break;
  }

  return { h, s, v };
};

export const HSVtoHEX = ({ h, s, v }: { h: number; s: number; v: number }) => {
  const i = Math.floor((h / 360) * 6);
  const f = (h / 360) * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0;
  let g = 0;
  let b = 0;
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }

  // having obtained RGB, convert channels to hex
  let strR = Math.round(r * 255).toString(16);
  let strG = Math.round(g * 255).toString(16);
  let strB = Math.round(b * 255).toString(16);

  // prepend 0s, if necessary
  if (strR.length == 1) strR = '0' + strR;
  if (strG.length == 1) strG = '0' + strG;
  if (strB.length == 1) strB = '0' + strB;

  return `#${strR}${strG}${strB}`.toUpperCase();
};

export const generateVariantColors = (hexColor: string, level: number) => {
  const distance = 0.125;
  const { h, s, v } = HEXtoHSV(hexColor);
  const hsvLightEnd = {
    h,
    s: Math.max(s - distance * level, 0),
    v: Math.min(v + distance * level, 1),
  };
  const hsvDarkEnd = {
    h,
    s: Math.min(s + distance * level, 1),
    v: Math.max(v - distance * level, 0),
  };

  const light = [];
  const dark = [];
  for (let i = 0; i < level; i++) {
    const varianLight = {
      h,
      s: s - ((i + 1) * (s - hsvLightEnd.s)) / level,
      v: v + ((i + 1) * (hsvLightEnd.v - v)) / level,
    };
    const varianDark = {
      h,
      s: s + ((i + 1) * (hsvDarkEnd.s - s)) / level,
      v: v - ((i + 1) * (v - hsvDarkEnd.v)) / level,
    };
    light.push(HSVtoHEX(varianLight));
    dark.push(HSVtoHEX(varianDark));
  }

  return { base: hexColor, light, dark };
};
