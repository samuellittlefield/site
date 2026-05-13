'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BIRD_MAT = new THREE.MeshToonMaterial({ color: '#1A1830' })

function Wing({ side }: { side: 1 | -1 }) {
  return (
    <mesh position={[side * 0.22, 0, 0]} rotation={[0, 0, side * 0.4]}>
      <boxGeometry args={[0.38, 0.04, 0.12]} />
      <primitive object={BIRD_MAT} attach="material" />
    </mesh>
  )
}

function Bird({ seed, baseX, baseY, baseZ, speed, phase }: {
  seed: number; baseX: number; baseY: number; baseZ: number
  speed: number; phase: number
}) {
  const ref = useRef<THREE.Group>(null)
  const wL  = useRef<THREE.Group>(null)
  const wR  = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    // Slow glide across the sky
    ref.current.position.x = baseX + Math.sin(t * speed * 0.4 + phase) * 4
    ref.current.position.y = baseY + Math.sin(t * speed + phase) * 0.3
    ref.current.position.z = baseZ
    // Wing flap
    const flap = Math.sin(t * 2.2 + phase) * 0.35
    if (wL.current) wL.current.rotation.z =  flap + 0.3
    if (wR.current) wR.current.rotation.z = -flap - 0.3
  })

  return (
    <group ref={ref}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.12, 0.06, 0.22]} />
        <primitive object={BIRD_MAT} attach="material" />
      </mesh>
      <group ref={wL}><Wing side={-1} /></group>
      <group ref={wR}><Wing side={1} /></group>
    </group>
  )
}

export default function Birds() {
  return (
    <group>
      <Bird seed={1} baseX={-4} baseY={7.5} baseZ={-15} speed={0.5} phase={0.0} />
      <Bird seed={2} baseX={-2} baseY={8.5} baseZ={-16} speed={0.4} phase={1.8} />
      <Bird seed={3} baseX={ 3} baseY={7.0} baseZ={-14} speed={0.6} phase={3.5} />
      <Bird seed={4} baseX={ 6} baseY={8.0} baseZ={-17} speed={0.45} phase={5.2} />
    </group>
  )
}
