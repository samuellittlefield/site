'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { fbm, smoothNoise } from '@/lib/noise'
import { makeToonGradient } from '@/lib/toonGradient'

function terrainHeight(x: number, y: number): number {
  const base   = fbm(x * 0.18 + 4, y * 0.18 + 6, 4) * 0.55
  const detail = smoothNoise(x * 0.7 + 1, y * 0.7 + 2) * 0.18
  const slope  = Math.max(0, -y) * 0.04
  return base + detail + slope - 0.3
}

export default function Terrain() {
  const gradientMap = useMemo(() => makeToonGradient(), [])

  const geo = useMemo(() => {
    const segsX = 120, segsY = 80
    const w = 55, d = 32

    const g = new THREE.PlaneGeometry(w, d, segsX, segsY)
    const pos = g.attributes.position as THREE.BufferAttribute

    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, terrainHeight(pos.getX(i), pos.getY(i)))
    }
    pos.needsUpdate = true
    g.computeVertexNormals()

    // Vertex colors: illustrated greens — warm in light, deep in shadow
    const ni = g.toNonIndexed()
    ni.computeVertexNormals()

    const niPos  = ni.attributes.position as THREE.BufferAttribute
    const niNorm = ni.attributes.normal   as THREE.BufferAttribute
    const col    = new Float32Array(niPos.count * 3)

    const grassLight = new THREE.Color('#5A9A3A')
    const grassMid   = new THREE.Color('#3A7825')
    const grassDark  = new THREE.Color('#285A18')
    const dirtWarm   = new THREE.Color('#806040')

    for (let i = 0; i < niPos.count; i += 3) {
      const h  = (niPos.getZ(i) + niPos.getZ(i+1) + niPos.getZ(i+2)) / 3
      const nz = (niNorm.getZ(i) + niNorm.getZ(i+1) + niNorm.getZ(i+2)) / 3
      const steep = 1 - Math.abs(nz)

      let c: THREE.Color
      if (steep > 0.55)   c = dirtWarm.clone()
      else if (h > 0.20)  c = grassDark.clone()
      else if (h > 0.00)  c = grassMid.clone()
      else                c = grassLight.clone()

      for (let j = 0; j < 3; j++) {
        col[(i+j)*3]   = c.r
        col[(i+j)*3+1] = c.g
        col[(i+j)*3+2] = c.b
      }
    }
    ni.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return ni
  }, [])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.82, 0]} geometry={geo}>
      <meshToonMaterial vertexColors gradientMap={gradientMap} />
    </mesh>
  )
}
