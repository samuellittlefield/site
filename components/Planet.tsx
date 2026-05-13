'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Planet() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    // Very slow axial rotation
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.04
  })

  return (
    // Upper-left sky — visible near the nav links
    <group position={[-9, 7.5, -16]} rotation={[0.25, 0, 0.18]}>
      <group ref={groupRef}>
        {/* Planet body */}
        <mesh>
          <sphereGeometry args={[1.1, 32, 32]} />
          <meshStandardMaterial
            color="#6B3FA0"
            roughness={0.6}
            metalness={0.1}
            emissive="#3B1060"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Atmosphere rim glow */}
        <mesh>
          <sphereGeometry args={[1.18, 32, 32]} />
          <meshStandardMaterial
            color="#9B6FD0"
            transparent
            opacity={0.12}
            roughness={1}
            metalness={0}
            side={THREE.BackSide}
            emissive="#7040C0"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Main ring */}
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[1.9, 0.22, 4, 64]} />
          <meshStandardMaterial
            color="#A070D8"
            roughness={0.5}
            metalness={0.2}
            transparent
            opacity={0.82}
            emissive="#6030A0"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Inner ring band */}
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[1.55, 0.10, 4, 64]} />
          <meshStandardMaterial
            color="#C8A0F0"
            roughness={0.4}
            metalness={0.1}
            transparent
            opacity={0.65}
            emissive="#9060C0"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Outer diffuse ring */}
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[2.3, 0.08, 4, 64]} />
          <meshStandardMaterial
            color="#8050B8"
            roughness={0.6}
            transparent
            opacity={0.35}
            emissive="#5020A0"
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>
    </group>
  )
}
