'use client'

import * as THREE from 'three'

// Simple low-poly cabin — walls, roof, chimney, warm window glow
export default function Cabin() {
  return (
    // Right side foreground — in front of tree line so it reads clearly
    <group position={[7.5, -1.82, -1.8]} rotation={[0, -0.5, 0]} scale={1.4}>

      {/* ── Walls ───────────────────────────────── */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.4, 1.1, 1.0]} />
        <meshStandardMaterial color="#7A5C3A" roughness={0.85} metalness={0} />
      </mesh>

      {/* Log texture band — darker horizontal stripe */}
      {[-0.22, 0.0, 0.22].map((y, i) => (
        <mesh key={i} position={[0, y + 0.55, 0]}>
          <boxGeometry args={[1.42, 0.06, 1.02]} />
          <meshStandardMaterial color="#5A3E22" roughness={0.9} metalness={0} />
        </mesh>
      ))}

      {/* ── Roof ────────────────────────────────── */}
      {/* Left slope — rises toward center */}
      <mesh position={[-0.42, 1.30, 0]} rotation={[0, 0, 0.72]}>
        <boxGeometry args={[0.96, 0.07, 1.12]} />
        <meshStandardMaterial color="#3A2810" roughness={0.9} metalness={0} />
      </mesh>
      {/* Right slope — rises toward center */}
      <mesh position={[0.42, 1.30, 0]} rotation={[0, 0, -0.72]}>
        <boxGeometry args={[0.96, 0.07, 1.12]} />
        <meshStandardMaterial color="#2E2008" roughness={0.9} metalness={0} />
      </mesh>
      {/* Ridge cap */}
      <mesh position={[0, 1.65, 0]}>
        <boxGeometry args={[0.14, 0.12, 1.14]} />
        <meshStandardMaterial color="#1E1208" roughness={0.95} metalness={0} />
      </mesh>

      {/* ── Chimney ─────────────────────────────── */}
      <mesh position={[0.38, 1.85, -0.2]}>
        <boxGeometry args={[0.18, 0.55, 0.18]} />
        <meshStandardMaterial color="#5A4835" roughness={0.9} metalness={0} />
      </mesh>
      {/* Chimney cap */}
      <mesh position={[0.38, 2.14, -0.2]}>
        <boxGeometry args={[0.23, 0.06, 0.23]} />
        <meshStandardMaterial color="#3A2A1A" roughness={0.9} metalness={0} />
      </mesh>

      {/* ── Window — warm glow ───────────────────── */}
      <mesh position={[-0.32, 0.60, 0.51]}>
        <boxGeometry args={[0.28, 0.28, 0.01]} />
        <meshStandardMaterial
          color="#FFD080"
          emissive="#FFA020"
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </mesh>

      {/* ── Door ────────────────────────────────── */}
      <mesh position={[0.25, 0.28, 0.505]}>
        <boxGeometry args={[0.26, 0.56, 0.01]} />
        <meshStandardMaterial color="#3A2410" roughness={0.9} metalness={0} />
      </mesh>

      {/* ── Front step ──────────────────────────── */}
      <mesh position={[0.25, -0.02, 0.62]}>
        <boxGeometry args={[0.32, 0.06, 0.22]} />
        <meshStandardMaterial color="#6A5A48" roughness={0.95} metalness={0} />
      </mesh>

      {/* ── Warm point light from window ────────── */}
      <pointLight
        position={[-0.32, 0.60, 0.8]}
        intensity={1.8}
        distance={4}
        color="#FFA030"
      />
    </group>
  )
}
