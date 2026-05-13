import * as THREE from 'three'

// 4-step toon gradient: dark shadow → mid shadow → mid light → highlight
// Gives the illustrated flat-band look from Japanese woodblock / concept art
export function makeToonGradient(): THREE.DataTexture {
  const data = new Uint8Array([48, 108, 168, 220])
  const tex = new THREE.DataTexture(data, 4, 1, THREE.RedFormat)
  tex.needsUpdate = true
  return tex
}
