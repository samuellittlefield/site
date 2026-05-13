'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { seededRng } from '@/lib/noise'

interface CloudSpec {
  x: number; y: number; z: number
  puffs: { x: number; y: number; z: number; r: number }[]
}

function generateClouds(): CloudSpec[] {
  const rng = seededRng(77)
  const clouds: CloudSpec[] = []

  function makeCloud(cx: number, cy: number, cz: number, width: number, height: number): CloudSpec {
    const puffs = []
    const count = 6 + Math.floor(rng() * 5)
    for (let i = 0; i < count; i++) {
      puffs.push({
        x: (rng() - 0.5) * width,
        y: (rng() - 0.3) * height,
        z: (rng() - 0.5) * width * 0.35,
        r: 0.7 + rng() * 1.1,
      })
    }
    return { x: cx, y: cy, z: cz, puffs }
  }

  // Scatter clouds across the sky — favour the horizon line
  clouds.push(makeCloud(-8,  5.5, -16, 4.5, 1.4))
  clouds.push(makeCloud( 2,  6.5, -19, 5.0, 1.6))
  clouds.push(makeCloud(12,  5.0, -17, 4.0, 1.2))
  clouds.push(makeCloud(-3,  8.0, -20, 3.5, 1.0))
  clouds.push(makeCloud( 7,  7.5, -18, 3.8, 1.1))
  clouds.push(makeCloud(-14, 6.0, -15, 3.0, 1.0))

  return clouds
}

const CLOUD_MAT = new THREE.MeshToonMaterial({ color: '#F5EFF8', transparent: true, opacity: 0.92 })

function Cloud({ spec }: { spec: CloudSpec }) {
  return (
    <group position={[spec.x, spec.y, spec.z]}>
      {spec.puffs.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.r, 10, 8]} />
          <primitive object={CLOUD_MAT} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

export default function Clouds() {
  const clouds = useMemo(() => generateClouds(), [])
  return (
    <group>
      {clouds.map((c, i) => <Cloud key={i} spec={c} />)}
    </group>
  )
}
