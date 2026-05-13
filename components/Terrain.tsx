'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { fbm, smoothNoise } from '@/lib/noise'
import { useLoader } from '@react-three/fiber'

function terrainHeight(x: number, y: number): number {
  const base   = fbm(x * 0.18 + 4, y * 0.18 + 6, 4) * 0.55
  const detail = smoothNoise(x * 0.7 + 1, y * 0.7 + 2) * 0.18
  const slope  = Math.max(0, -y) * 0.04
  return base + detail + slope - 0.3
}

export default function Terrain() {
  const [grassDiff, grassNor, grassRough] = useLoader(THREE.TextureLoader, [
    '/textures/grass_diff.jpg',
    '/textures/grass_nor.jpg',
    '/textures/grass_rough.jpg',
  ])

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
    return g
  }, [])

  // Tile the texture across the terrain
  useMemo(() => {
    for (const tex of [grassDiff, grassNor, grassRough]) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(16, 10)
    }
  }, [grassDiff, grassNor, grassRough])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.82, 0]} geometry={geo}>
      <meshStandardMaterial
        map={grassDiff}
        normalMap={grassNor}
        roughnessMap={grassRough}
        roughness={0.9}
        metalness={0.0}
        normalScale={new THREE.Vector2(1.2, 1.2)}
      />
    </mesh>
  )
}
