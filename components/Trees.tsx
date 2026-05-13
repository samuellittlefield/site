'use client'

import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { seededRng } from '@/lib/noise'
import { MTN_POS, mountainWorldHeight } from './Mountain'

// ── Shared geometry builders ──────────────────────────────────────────────────

function concatNonIndexed(...geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const pos: number[] = [], nrm: number[] = []
  for (const g of geos) {
    const ni = g.index ? g.toNonIndexed() : g.clone()
    ni.computeVertexNormals()
    const p = ni.attributes.position.array
    const n = ni.attributes.normal.array
    for (let i = 0; i < p.length; i++) pos.push(p[i])
    for (let i = 0; i < n.length; i++) nrm.push(n[i])
    ni.dispose()
  }
  const out = new THREE.BufferGeometry()
  out.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3))
  out.setAttribute('normal',   new THREE.BufferAttribute(new Float32Array(nrm), 3))
  return out
}

function makeSpruceGeo(): THREE.BufferGeometry {
  const trunk = new THREE.CylinderGeometry(0.032, 0.065, 0.55, 6)
  trunk.translate(0, 0.275, 0)

  // 8 tiers: wide at base, tapering tightly to a spire
  const tiers: THREE.BufferGeometry[] = [
    new THREE.ConeGeometry(0.72, 0.72, 9),   // ground skirt — widest
    new THREE.ConeGeometry(0.60, 0.78, 9),
    new THREE.ConeGeometry(0.50, 0.76, 9),
    new THREE.ConeGeometry(0.40, 0.72, 9),
    new THREE.ConeGeometry(0.30, 0.66, 8),
    new THREE.ConeGeometry(0.20, 0.58, 8),
    new THREE.ConeGeometry(0.11, 0.48, 7),
    new THREE.ConeGeometry(0.05, 0.36, 6),   // top spire
  ]
  const offsets = [0.62, 1.16, 1.66, 2.12, 2.52, 2.86, 3.14, 3.36]
  tiers.forEach((t, i) => t.translate(0, offsets[i], 0))

  return concatNonIndexed(trunk, ...tiers)
}

function makePineGeo(): THREE.BufferGeometry {
  const trunk = new THREE.CylinderGeometry(0.045, 0.08, 0.45, 6)
  trunk.translate(0, 0.225, 0)

  // Rounder, fuller silhouette — 5 tiers
  const tiers: THREE.BufferGeometry[] = [
    new THREE.ConeGeometry(0.90, 0.82, 9),
    new THREE.ConeGeometry(0.72, 0.78, 9),
    new THREE.ConeGeometry(0.54, 0.72, 8),
    new THREE.ConeGeometry(0.36, 0.62, 8),
    new THREE.ConeGeometry(0.18, 0.48, 7),
  ]
  const offsets = [0.62, 1.18, 1.68, 2.10, 2.44]
  tiers.forEach((t, i) => t.translate(0, offsets[i], 0))

  return concatNonIndexed(trunk, ...tiers)
}

// ── Tree placement ────────────────────────────────────────────────────────────

interface TreeSpec {
  x: number; y: number; z: number
  scale: number; rotY: number
  type: 'spruce' | 'pine'
}

function generateTrees(): TreeSpec[] {
  const rng = seededRng(42)
  const trees: TreeSpec[] = []

  function place(
    cx: number, cz: number,
    radiusMin: number, radiusMax: number,
    count: number,
    type: 'spruce' | 'pine',
    scaleMin: number, scaleMax: number,
    yBase: number
  ) {
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2
      const r = radiusMin + rng() * (radiusMax - radiusMin)
      const x = cx + Math.cos(angle) * r
      const z = cz + Math.sin(angle) * r * 0.65
      const worldH = mountainWorldHeight(x, z)
      // Only place where the mountain is low (slope/base) or on flat ground
      const mtnLocalH = worldH - MTN_POS[1]
      const onMtn = mtnLocalH > 0.4
      const y = onMtn ? worldH : yBase + (rng() - 0.5) * 0.04
      if (onMtn && mtnLocalH > 5.5) continue  // skip high-altitude placement
      trees.push({
        x, y, z,
        scale: scaleMin + rng() * (scaleMax - scaleMin),
        rotY: rng() * Math.PI * 2,
        type,
      })
    }
  }

  // Dense cluster at mountain base (left slope, where the mountain meets the valley)
  place(MTN_POS[0] - 6, MTN_POS[2] + 3, 1.0, 5.5, 30, 'spruce', 0.8, 1.4, -1.82)
  place(MTN_POS[0] - 5, MTN_POS[2] + 3, 1.5, 5.0, 20, 'pine',   0.7, 1.1, -1.82)

  // Main forest band — center and left-center
  place(0,  -6, 1.0, 6.0, 25, 'spruce', 0.85, 1.3, -1.82)
  place(-2, -7, 1.0, 6.0, 18, 'pine',   0.75, 1.1, -1.82)
  place(3,  -8, 1.0, 5.0, 15, 'spruce', 0.7,  1.2, -1.82)

  // Left edge forest — frames the nav/sky side
  place(-6, -4, 0.5, 4.0, 16, 'spruce', 0.9, 1.4, -1.82)
  place(-7, -6, 0.5, 3.5, 10, 'pine',   0.8, 1.2, -1.82)

  // Foreground framing trees — larger, close to camera
  place(-5, -1.5, 0.5, 2.5, 8, 'spruce', 1.1, 1.6, -1.82)
  place(-3, -2.0, 0.5, 2.0, 5, 'pine',   1.0, 1.4, -1.82)

  // Right-side trees — behind and around cabin, not in front of it
  place(8,  -6, 1.5, 5.5, 18, 'spruce', 0.8, 1.3, -1.82)
  place(10, -8, 1.0, 4.5, 14, 'pine',   0.7, 1.1, -1.82)
  place(8,  -4, 2.0, 4.5, 10, 'spruce', 0.9, 1.3, -1.82)
  place(11, -5, 1.0, 4.0, 10, 'pine',   0.7, 1.2, -1.82)

  return trees
}

// ── Component ─────────────────────────────────────────────────────────────────

const TRUNK_COLOR  = new THREE.Color('#6A4020')
const FOLIAGE_DARK = new THREE.Color('#254E1A')
const FOLIAGE_MID  = new THREE.Color('#2D6820')
const FOLIAGE_LITE = new THREE.Color('#3A7A25')

export default function Trees() {
  const specs    = useMemo(() => generateTrees(), [])
  const spruceGeo = useMemo(() => makeSpruceGeo(), [])
  const pineGeo   = useMemo(() => makePineGeo(),   [])

  const spruceCount = specs.filter(s => s.type === 'spruce').length
  const pineCount   = specs.filter(s => s.type === 'pine').length

  const spruceRef = useRef<THREE.InstancedMesh>(null)
  const pineRef   = useRef<THREE.InstancedMesh>(null)

  const spruceMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: FOLIAGE_DARK, roughness: 0.95, metalness: 0,
  }), [])

  const pineMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: FOLIAGE_MID, roughness: 0.95, metalness: 0,
  }), [])

  useEffect(() => {
    const dummy = new THREE.Object3D()
    let si = 0, pi = 0

    for (const spec of specs) {
      dummy.position.set(spec.x, spec.y, spec.z)
      dummy.rotation.y = spec.rotY
      dummy.scale.setScalar(spec.scale)
      dummy.updateMatrix()

      if (spec.type === 'spruce' && spruceRef.current) {
        spruceRef.current.setMatrixAt(si++, dummy.matrix)
      } else if (spec.type === 'pine' && pineRef.current) {
        pineRef.current.setMatrixAt(pi++, dummy.matrix)
      }
    }

    if (spruceRef.current) spruceRef.current.instanceMatrix.needsUpdate = true
    if (pineRef.current)   pineRef.current.instanceMatrix.needsUpdate   = true
  }, [specs])

  return (
    <group>
      <instancedMesh ref={spruceRef} args={[spruceGeo, spruceMat, spruceCount]} />
      <instancedMesh ref={pineRef}   args={[pineGeo,   pineMat,   pineCount]}   />
    </group>
  )
}
