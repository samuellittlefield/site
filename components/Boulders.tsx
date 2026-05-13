'use client'

import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { seededRng, smoothNoise } from '@/lib/noise'
import { MTN_POS, mountainWorldHeight } from './Mountain'

interface BoulderSpec {
  x: number; y: number; z: number
  sx: number; sy: number; sz: number
  rotX: number; rotY: number; rotZ: number
  shade: number
}

function generateBoulders(): BoulderSpec[] {
  const rng = seededRng(99)
  const boulders: BoulderSpec[] = []

  function place(cx: number, cz: number, rMin: number, rMax: number, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2
      const r = rMin + rng() * (rMax - rMin)
      const x = cx + Math.cos(angle) * r
      const z = cz + Math.sin(angle) * r * 0.7
      const worldH = mountainWorldHeight(x, z)
      const mtnH = worldH - MTN_POS[1]
      // Place on mountain slopes (low-mid elevation) or on ground
      const y = mtnH > 0.5 ? worldH - 0.05 : -1.82 - 0.05
      if (mtnH > 6.5) continue
      const base = 0.03 + rng() * 0.06
      boulders.push({
        x, y, z,
        sx: base * (0.8 + rng() * 0.7),
        sy: base * (0.6 + rng() * 0.5),
        sz: base * (0.8 + rng() * 0.6),
        rotX: rng() * 0.8,
        rotY: rng() * Math.PI * 2,
        rotZ: rng() * 0.6,
        shade: 0.65 + rng() * 0.35,
      })
    }
  }

  // Boulders near mountain base and mid-slopes
  place(MTN_POS[0], MTN_POS[2] + 1, 1.0, 7.0, 30)
  // Scattered along the trail area
  place(0, -3, 0.5, 6.0, 18)
  // Cluster left-mid
  place(-4, -5, 0.5, 4.0, 12)

  return boulders
}

export default function Boulders() {
  const specs = useMemo(() => generateBoulders(), [])

  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, 1)
    // Roughen the vertices slightly for a natural rock shape
    const pos = g.attributes.position as THREE.BufferAttribute
    const rng = seededRng(7)
    for (let i = 0; i < pos.count; i++) {
      const n = 1 + (rng() - 0.5) * 0.35
      pos.setXYZ(i, pos.getX(i) * n, pos.getY(i) * n, pos.getZ(i) * n)
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [])

  const mat = useMemo(() => new THREE.MeshPhongMaterial({
    color: '#8A7A68',
    
    shininess: 3,
  }), [])

  const meshRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    specs.forEach((s, i) => {
      dummy.position.set(s.x, s.y, s.z)
      dummy.rotation.set(s.rotX, s.rotY, s.rotZ)
      dummy.scale.set(s.sx, s.sy, s.sz)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      // Per-instance color via shade
      meshRef.current!.setColorAt(i, new THREE.Color().setScalar(s.shade).multiply(new THREE.Color('#8A7A68')))
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  }, [specs])

  return (
    <instancedMesh ref={meshRef} args={[geo, mat, specs.length]} />
  )
}
