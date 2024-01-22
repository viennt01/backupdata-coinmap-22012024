// {
//   a: 0.19
//   b: 161
//   g: 250
//   r: 237
// }

export function RGBAToHex(RGBA) {
  let hex = '#';
  hex += RGBA.r.toString(16);
  hex += RGBA.g.toString(16);
  hex += RGBA.b.toString(16);
  hex += Math.round(RGBA.a * 255).toString(16);
  return hex;
}
