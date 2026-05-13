'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Spaceship() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    // Slow drift right-to-left across the sky, looping
    const t = (state.clock.elapsedTime * 0.04) % 1
    ref.current.position.x = 18 - t * 38        // right to left
    ref.current.position.y = 9 + Math.sin(t * Math.PI * 2) * 0.8  // gentle arc
    ref.current.position.z = -14
    // Slight nose-down tilt in direction of travel
    ref.current.rotation.z = 0.08
    ref.current.rotation.y = -Math.PI / 2        // pointing left
  })

  return (
    <group ref={ref} scale={0.18}>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.28, 0.35, 2.0, 10]} />
        <meshStandardMaterial color="#E8E4F0" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Nose cone — purple */}
      <mesh position={[0, 1.3, 0]}>
        <coneGeometry args={[0.28, 0.8, 10]} />
        <meshStandardMaterial color="#7C3AED" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Nose tip accent */}
      <mesh position={[0, 1.75, 0]}>
        <coneGeometry args={[0.06, 0.25, 8]} />
        <meshStandardMaterial color="#A78BFA" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Porthole window */}
      <mesh position={[0.29, 0.3, 0]}>
        <circleGeometry args={[0.14, 12]} />
        <meshStandardMaterial color="#6EE7B7" roughness={0.1} metalness={0.2} emissive="#34D399" emissiveIntensity={0.4} />
      </mesh>

      {/* Fins — green, 3 evenly spaced */}
      {[0, 120, 240].map((deg, i) => {
        const angle = (deg * Math.PI) / 180
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * 0.42, -0.85, Math.cos(angle) * 0.42]}
            rotation={[0, -angle, 0.35]}
          >
            <boxGeometry args={[0.08, 0.65, 0.38]} />
            <meshStandardMaterial color="#10B981" roughness={0.5} metalness={0.2} />
          </mesh>
        )
      })}

      {/* Engine bell */}
      <mesh position={[0, -1.15, 0]}>
        <cylinderGeometry args={[0.22, 0.30, 0.28, 10]} />
        <meshStandardMaterial color="#7C3AED" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Exhaust glow */}
      <mesh position={[0, -1.55, 0]}>
        <coneGeometry args={[0.14, 0.55, 8]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F97316"
          emissiveIntensity={1.2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  )
}
