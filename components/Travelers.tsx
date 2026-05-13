'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TRAIL_CURVE } from './Trail'

const _pos    = new THREE.Vector3()
const _tangent = new THREE.Vector3()
const _quat   = new THREE.Quaternion()
const _up     = new THREE.Vector3(0, 1, 0)
const _fwd    = new THREE.Vector3(0, 0, -1)

function useCurveTravel(speed: number, startT: number) {
  const tRef = useRef(startT)
  return (delta: number) => {
    tRef.current = (tRef.current + delta * speed) % 1
    TRAIL_CURVE.getPointAt(tRef.current, _pos)
    TRAIL_CURVE.getTangentAt(tRef.current, _tangent)
    _quat.setFromUnitVectors(_fwd, _tangent)
    return { pos: _pos.clone(), quat: _quat.clone() }
  }
}

// ── Hiker ─────────────────────────────────────────────────────────────────────
function Hiker() {
  const ref  = useRef<THREE.Group>(null)
  const travel = useCurveTravel(0.022, 0.08)

  useFrame((_, delta) => {
    if (!ref.current) return
    const { pos, quat } = travel(delta)
    ref.current.position.copy(pos)
    ref.current.quaternion.copy(quat)
    // Subtle walking bob
    ref.current.position.y += Math.sin(performance.now() * 0.004) * 0.008
  })

  return (
    <group ref={ref} scale={0.38}>
      {/* Head */}
      <mesh position={[0, 0.24, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshPhongMaterial color="#D4A070" />
      </mesh>
      {/* Hat */}
      <mesh position={[0, 0.30, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.04, 6]} />
        <meshPhongMaterial color="#7A4E28" />
      </mesh>
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.038, 0.042, 0.055, 6]} />
        <meshPhongMaterial color="#7A4E28" />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.13, 0]}>
        <boxGeometry args={[0.095, 0.145, 0.072]} />
        <meshPhongMaterial color="#E03520" />
      </mesh>
      {/* Pack */}
      <mesh position={[0, 0.14, -0.055]}>
        <boxGeometry args={[0.07, 0.11, 0.05]} />
        <meshPhongMaterial color="#7A8A6A" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.028, -0.02, 0]}>
        <boxGeometry args={[0.036, 0.105, 0.042]} />
        <meshPhongMaterial color="#2C3E50" />
      </mesh>
      <mesh position={[0.028, -0.02, 0]}>
        <boxGeometry args={[0.036, 0.105, 0.042]} />
        <meshPhongMaterial color="#2C3E50" />
      </mesh>
      {/* Pole */}
      <mesh position={[0.08, 0.07, 0.02]} rotation={[0, 0, 0.22]}>
        <cylinderGeometry args={[0.006, 0.006, 0.24, 4]} />
        <meshPhongMaterial color="#A0A8A0" />
      </mesh>
    </group>
  )
}

// ── Cyclist ───────────────────────────────────────────────────────────────────
function Cyclist() {
  const ref      = useRef<THREE.Group>(null)
  const wRef1    = useRef<THREE.Mesh>(null)
  const wRef2    = useRef<THREE.Mesh>(null)
  const travel   = useCurveTravel(0.048, 0.55)

  useFrame((_, delta) => {
    if (!ref.current) return
    const { pos, quat } = travel(delta)
    ref.current.position.copy(pos)
    ref.current.quaternion.copy(quat)

    const spin = performance.now() * 0.005
    if (wRef1.current) wRef1.current.rotation.x = spin
    if (wRef2.current) wRef2.current.rotation.x = spin
  })

  return (
    <group ref={ref} scale={0.38}>
      {/* Rear wheel */}
      <mesh ref={wRef1} position={[-0.16, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.1, 0.014, 6, 14]} />
        <meshPhongMaterial color="#2C3E50" />
      </mesh>
      {/* Front wheel */}
      <mesh ref={wRef2} position={[0.16, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.1, 0.014, 6, 14]} />
        <meshPhongMaterial color="#2C3E50" />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.32, 0.018, 0.012]} />
        <meshPhongMaterial color="#9AA0A8" />
      </mesh>
      <mesh position={[-0.04, 0.17, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.008, 0.008, 0.2, 4]} />
        <meshPhongMaterial color="#9AA0A8" />
      </mesh>
      {/* Handlebar */}
      <mesh position={[0.16, 0.20, 0]}>
        <boxGeometry args={[0.016, 0.06, 0.1]} />
        <meshPhongMaterial color="#2C3E50" />
      </mesh>
      {/* Rider torso */}
      <mesh position={[0.03, 0.30, 0]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[0.085, 0.14, 0.068]} />
        <meshPhongMaterial color="#2ECC40" />
      </mesh>
      {/* Rider head */}
      <mesh position={[0.12, 0.40, 0]}>
        <boxGeometry args={[0.068, 0.068, 0.068]} />
        <meshPhongMaterial color="#D4A070" />
      </mesh>
      {/* Helmet */}
      <mesh position={[0.12, 0.455, 0]}>
        <boxGeometry args={[0.078, 0.042, 0.078]} />
        <meshPhongMaterial color="#F4A820" />
      </mesh>
    </group>
  )
}

export default function Travelers() {
  return (
    <>
      <Hiker />
      <Cyclist />
    </>
  )
}
