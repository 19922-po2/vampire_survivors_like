export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function angleBetween(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

export function randRange(rng, min, max) {
  return min + rng() * (max - min);
}

export function randInt(rng, min, maxInclusive) {
  return Math.floor(randRange(rng, min, maxInclusive + 1));
}

export function length(x, y) {
  return Math.hypot(x, y);
}

export function normalize(x, y) {
  const len = length(x, y) || 1;
  return { x: x / len, y: y / len };
}

export function circlesOverlap(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const r = a.r + b.r;
  return dx * dx + dy * dy <= r * r;
}


