'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { makeToonGradient } from '@/lib/toonGradient'

// Trail curve — exported so Travelers can follow it
export const TRAIL_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-10.0, -1.75, 2.5),
  new THREE.Vector3( -7.0, -1.76, 1.4),
  new THREE.Vector3( -4.2, -1.77, 0.2),
  new THREE.Vector3( -1.5, -1.78, -1.0),
  new THREE.Vector3(  1.2, -1.79, -2.5),
  new THREE.Vector3(  3.8, -1.80, -4.2),
  new THREE.Vector3(  6.5, -1.81, -6.0),
  new THREE.Vector3(  8.5, -1.82, -8.5),
])

function buildTrailGeo(curve: THREE.CatmullRomCurve3, width: number, segments: number): THREE.BufferGeometry {
  const pts = curve.getPoints(segments)
  const positions: number[] = []
  const normals: number[] = []
  const indices: number[] = []

  const up = new THREE.Vector3(0, 1, 0)
  const tangent = new THREE.Vector3()
  const binormal = new THREE.Vector3()

  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]
    if (i < pts.length - 1) {
      tangent.subVectors(pts[i + 1], p).normalize()
    } else {
      tangent.subVectors(p, pts[i - 1]).normalize()
    }
    binormal.crossVectors(tangent, up).normalize()

    // Widen slightly at near end, narrow at far
    const t = i / (pts.length - 1)
    const w = width * (1.0 + (1 - t) * 0.5)

    const L = p.clone().addScaledVector(binormal, -w / 2)
    const R = p.clone().addScaledVector(binormal,  w / 2)

    positions.push(L.x, L.y, L.z, R.x, R.y, R.z)
    normals.push(0, 1, 0, 0, 1, 0)

    if (i < pts.length - 1) {
      const b = i * 2
      indices.push(b, b+1, b+2, b+1, b+3, b+2)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
  geo.setAttribute('normal',   new THREE.BufferAttribute(new Float32Array(normals), 3))
  geo.setIndex(indices)
  return geo
}

export default function Trail() {
  const geo         = useMemo(() => buildTrailGeo(TRAIL_CURVE, 0.38, 80), [])
  const gradientMap = useMemo(() => makeToonGradient(), [])

  return (
    <mesh geometry={geo}>
      <meshToonMaterial color="#C8A86A" gradientMap={gradientMap} />
    </mesh>
  )
}
