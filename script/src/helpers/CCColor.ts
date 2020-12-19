export function CCColor(r: number, g: number, b: number, a: number) {
  return cc.Color(r, g, b, a);
}

export function CCColorHex(hex: string) {
  return cc.hexToColor(hex);
}


export function Hex2RGB(hex: string) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

 return [r, g, b];
}
