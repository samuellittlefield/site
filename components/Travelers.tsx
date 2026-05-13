'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Hiker({ offset = 0 }: { offset?: number }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = (state.clock.elapsedTime * 0.3 + offset) % 1
    const x = -5 + t * 4.5
    ref.current.position.x = x
    // Subtle bob
    ref.current.position.y = -1.72 + Math.sin(state.clock.elapsedTime * 3.5 + offset * 10) * 0.015
  })

  return (
    <group ref={ref} position={[-5, -1.72, -0.4]}>
      {/* Head */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.07, 0.07, 0.07]} />
        <meshPhongMaterial color="#c8956c" flatShading />
      </mesh>
      {/* Hat brim */}
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.015, 6]} />
        <meshPhongMaterial color="#4a3728" flatShading />
      </mesh>
      {/* Hat top */}
      <mesh position={[0, 0.305, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.05, 6]} />
        <meshPhongMaterial color="#4a3728" flatShading />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.09, 0.14, 0.07]} />
        <meshPhongMaterial color="#c0392b" flatShading />
      </mesh>
      {/* Pack */}
      <mesh position={[0.01, 0.12, -0.05]}>
        <boxGeometry args={[0.06, 0.1, 0.05]} />
        <meshPhongMaterial color="#7f8c8d" flatShading />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.025, -0.02, 0]}>
        <boxGeometry args={[0.035, 0.1, 0.04]} />
        <meshPhongMaterial color="#2c3e50" flatShading />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.025, -0.02, 0]}>
        <boxGeometry args={[0.035, 0.1, 0.04]} />
        <meshPhongMaterial color="#2c3e50" flatShading />
      </mesh>
      {/* Trekking pole */}
      <mesh position={[0.07, 0.06, 0.02]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.006, 0.006, 0.22, 4]} />
        <meshPhongMaterial color="#95a5a6" flatShading />
      </mesh>
    </group>
  )
}

function Cyclist({ offset = 0 }: { offset?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const wheelRef1 = useRef<THREE.Mesh>(null)
  const wheelRef2 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = (state.clock.elapsedTime * 0.55 + offset) % 1
    const x = -5 + t * 4.5
    groupRef.current.position.x = x

    const spin = state.clock.elapsedTime * 4
    if (wheelRef1.current) wheelRef1.current.rotation.z = spin
    if (wheelRef2.current) wheelRef2.current.rotation.z = spin
  })

  const wheelColor = '#2c3e50'
  const spokeColor = '#95a5a6'

  return (
    <group ref={groupRef} position={[-5, -1.66, -0.8]}>
      {/* Rear wheel */}
      <mesh ref={wheelRef1} position={[-0.14, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.012, 6, 12]} />
        <meshPhongMaterial color={wheelColor} flatShading />
      </mesh>
      {/* Front wheel */}
      <mesh ref={wheelRef2} position={[0.14, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.012, 6, 12]} />
        <meshPhongMaterial color={wheelColor} flatShading />
      </mesh>
      {/* Frame top tube */}
      <mesh position={[0, 0.08, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.28, 4]} />
        <meshPhongMaterial color={spokeColor} flatShading />
      </mesh>
      {/* Frame down tube */}
      <mesh position={[0.05, 0.0, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.007, 0.007, 0.22, 4]} />
        <meshPhongMaterial color={spokeColor} flatShading />
      </mesh>
      {/* Seat tube */}
      <mesh position={[-0.05, 0.02, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.007, 0.007, 0.18, 4]} />
        <meshPhongMaterial color={spokeColor} flatShading />
      </mesh>
      {/* Handlebar */}
      <mesh position={[0.14, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.04, 0.09]} />
        <meshPhongMaterial color={wheelColor} flatShading />
      </mesh>
      {/* Rider torso */}
      <mesh position={[0.02, 0.19, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.08, 0.13, 0.065]} />
        <meshPhongMaterial color="#27ae60" flatShading />
      </mesh>
      {/* Rider head */}
      <mesh position={[0.09, 0.28, 0]}>
        <boxGeometry args={[0.065, 0.065, 0.065]} />
        <meshPhongMaterial color="#c8956c" flatShading />
      </mesh>
      {/* Helmet */}
      <mesh position={[0.09, 0.33, 0]}>
        <boxGeometry args={[0.075, 0.04, 0.075]} />
        <meshPhongMaterial color="#f39c12" flatShading />
      </mesh>
    </group>
  )
}

export default function Travelers() {
  return (
    <group>
      <Hiker offset={0.1} />
      <Cyclist offset={0.6} />
    </group>
  )
}
