function h(xi: number, yi: number): number {
  const n = Math.sin(xi * 127.1 + yi * 311.7 + 43.758) * 43758.5453
  return Math.abs(n - Math.floor(n))
}

export function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y)
  const fx = x - ix, fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  return (
    h(ix,   iy)   * (1 - ux) * (1 - uy) +
    h(ix+1, iy)   * ux       * (1 - uy) +
    h(ix,   iy+1) * (1 - ux) * uy       +
    h(ix+1, iy+1) * ux       * uy
  )
}

export function fbm(x: number, y: number, octaves = 5): number {
  let v = 0, a = 0.5, f = 1, max = 0
  for (let i = 0; i < octaves; i++) {
    v += smoothNoise(x * f, y * f) * a
    max += a; a *= 0.5; f *= 2.1
  }
  return v / max
}

// Deterministic integer hash for placement (returns 0..1)
export function seededRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}
