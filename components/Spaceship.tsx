'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Launch from bottom-left ground → top-right sky
const START = new THREE.Vector3(-9, -1.2, 3.5)
const END   = new THREE.Vector3(18,  16, -18)

// Direction the nose points (along flight path)
const FLIGHT_DIR = END.clone().sub(START).normalize()
const UP = new THREE.Vector3(0, 1, 0)
const LAUNCH_QUAT = new THREE.Quaternion().setFromUnitVectors(
  new THREE.Vector3(0, 1, 0), // geometry's "up" = nose
  FLIGHT_DIR
)

const _pos = new THREE.Vector3()

export default function Spaceship() {
  const ref       = useRef<THREE.Group>(null)
  const exhaustRef = useRef<THREE.Mesh>(null)
  const glowRef   = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return

    // 30-second loop: accelerates off fast, pause, reappear at ground
    const t = (state.clock.elapsedTime * 0.033) % 1
    // Ease-in: slow off the ground, then accelerate
    const ease = t < 0.05 ? t / 0.05 * 0.1 : 0.1 + (t - 0.05) / 0.95 * 0.9

    _pos.lerpVectors(START, END, ease)
    ref.current.position.copy(_pos)
    ref.current.quaternion.copy(LAUNCH_QUAT)

    // Exhaust flicker
    if (exhaustRef.current) {
      const flicker = 0.9 + Math.sin(state.clock.elapsedTime * 28) * 0.12
      exhaustRef.current.scale.setScalar(flicker)
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 22) * 0.4
    }
  })

  return (
    <group ref={ref} scale={0.22}>

      {/* ── Hull ─────────────────────────────────── */}
      {/* Main body — dark metallic */}
      <mesh>
        <cylinderGeometry args={[0.30, 0.38, 2.2, 12]} />
        <meshStandardMaterial color="#1E1B2E" roughness={0.25} metalness={0.85} />
      </mesh>

      {/* Mid-band accent stripe — purple */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.315, 0.315, 0.22, 12]} />
        <meshStandardMaterial color="#6D28D9" roughness={0.2} metalness={0.6}
          emissive="#7C3AED" emissiveIntensity={0.6} />
      </mesh>

      {/* Upper shoulder ring */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.305, 0.305, 0.1, 12]} />
        <meshStandardMaterial color="#10B981" roughness={0.2} metalness={0.5}
          emissive="#059669" emissiveIntensity={0.5} />
      </mesh>

      {/* ── Nose ─────────────────────────────────── */}
      <mesh position={[0, 1.45, 0]}>
        <coneGeometry args={[0.30, 1.0, 12]} />
        <meshStandardMaterial color="#2D1B69" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Nose tip — bright purple emissive */}
      <mesh position={[0, 2.05, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#A78BFA" emissive="#8B5CF6"
          emissiveIntensity={1.8} roughness={0.1} metalness={0.3} />
      </mesh>

      {/* ── Windows ──────────────────────────────── */}
      {/* Main viewport — teal glow */}
      <mesh position={[0.32, 0.35, 0]}>
        <circleGeometry args={[0.13, 10]} />
        <meshStandardMaterial color="#A7F3D0" emissive="#34D399"
          emissiveIntensity={1.0} roughness={0.05} metalness={0} />
      </mesh>

      {/* Small sensor dot — green */}
      <mesh position={[0.325, -0.15, 0.15]}>
        <circleGeometry args={[0.055, 8]} />
        <meshStandardMaterial color="#6EE7B7" emissive="#10B981"
          emissiveIntensity={0.8} roughness={0.05} metalness={0} />
      </mesh>

      {/* ── Side thruster pods ───────────────────── */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[side * 0.52, -0.3, 0]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.12, 0.7, 8]} />
            <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Pod accent ring */}
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.105, 0.105, 0.08, 8]} />
            <meshStandardMaterial color="#10B981" emissive="#059669"
              emissiveIntensity={0.6} roughness={0.2} metalness={0.4} />
          </mesh>
          {/* Pod exhaust */}
          <mesh position={[0, -0.5, 0]}>
            <coneGeometry args={[0.075, 0.28, 7]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F97316"
              emissiveIntensity={1.6} transparent opacity={0.75} />
          </mesh>
        </group>
      ))}

      {/* ── Fins ─────────────────────────────────── */}
      {[0, 90, 180, 270].map((deg, i) => {
        const a = (deg * Math.PI) / 180
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.44, -0.9, Math.cos(a) * 0.44]}
            rotation={[0, -a, 0.42]}
          >
            <boxGeometry args={[0.07, 0.72, 0.45]} />
            <meshStandardMaterial color="#065F46" roughness={0.5} metalness={0.4} />
          </mesh>
        )
      })}

      {/* ── Engine bell ──────────────────────────── */}
      <mesh position={[0, -1.28, 0]}>
        <cylinderGeometry args={[0.20, 0.34, 0.32, 12]} />
        <meshStandardMaterial color="#6D28D9" roughness={0.2} metalness={0.8}
          emissive="#4C1D95" emissiveIntensity={0.4} />
      </mesh>

      {/* ── Main exhaust plume ───────────────────── */}
      <mesh ref={exhaustRef} position={[0, -1.78, 0]}>
        <coneGeometry args={[0.18, 0.9, 10]} />
        <meshStandardMaterial
          color="#FDE68A"
          emissive="#F97316"
          emissiveIntensity={2.0}
          transparent opacity={0.9}
        />
      </mesh>

      {/* Outer glow cone */}
      <mesh ref={glowRef} position={[0, -2.1, 0]}>
        <coneGeometry args={[0.28, 1.1, 10]} />
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#8B5CF6"
          emissiveIntensity={1.5}
          transparent opacity={0.35}
        />
      </mesh>

    </group>
  )
}
