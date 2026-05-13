'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

export default function Moon() {
  // Procedural crater normal-map via canvas
  const normalMap = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#8080ff'  // flat normal baseline
    ctx.fillRect(0, 0, size, size)

    // Paint ~25 random craters as normal-map bumps
    const rng = (n: number) => Math.abs(Math.sin(n * 127.1 + 311.7) * 43758.5453 % 1)
    for (let i = 0; i < 25; i++) {
      const cx = rng(i * 3)     * size
      const cy = rng(i * 3 + 1) * size
      const r  = 6 + rng(i * 3 + 2) * 20
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      grad.addColorStop(0,   '#6868cc')  // depression centre
      grad.addColorStop(0.6, '#9090ff')  // rim highlight
      grad.addColorStop(1,   '#8080ff')  // flat surround
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [])

  return (
    // Positioned to peek above/behind the main mountain peak
    <group position={[10, 8.5, -22]}>
      <mesh>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshStandardMaterial
          color="#D8D0E8"          // warm-purple tinted white
          roughness={0.92}
          metalness={0.0}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.6, 0.6)}
          emissive="#9080B0"
          emissiveIntensity={0.12}
        />
      </mesh>
    </group>
  )
}
