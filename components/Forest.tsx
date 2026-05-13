'use client'

import { useMemo } from 'react'

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 0.24, 5]} />
        <meshPhongMaterial color="#5c3d1e" />
      </mesh>
      {/* Bottom layer */}
      <mesh position={[0, 0.42, 0]}>
        <coneGeometry args={[0.28, 0.5, 6]} />
        <meshPhongMaterial color="#1A4A18" />
      </mesh>
      {/* Mid layer */}
      <mesh position={[0, 0.72, 0]}>
        <coneGeometry args={[0.21, 0.44, 6]} />
        <meshPhongMaterial color="#206025" />
      </mesh>
      {/* Top layer */}
      <mesh position={[0, 0.98, 0]}>
        <coneGeometry args={[0.14, 0.38, 6]} />
        <meshPhongMaterial color="#2A7530" />
      </mesh>
    </group>
  )
}

export default function Forest() {
  const trees = useMemo(() => [
    [-5.5, -1.82, -2.2],
    [-4.6, -1.82, -2.6],
    [-3.9, -1.82, -2.1],
    [-3.1, -1.82, -2.5],
    [-2.3, -1.82, -2.0],
    [-1.5, -1.82, -2.4],
    [-0.7, -1.82, -2.1],
    [0.2, -1.82, -2.5],
    [1.0, -1.82, -2.0],
    [1.8, -1.82, -2.6],
    [2.6, -1.82, -2.2],
    [3.3, -1.82, -2.5],
    // Second row, slightly behind
    [-5.0, -1.82, -3.2],
    [-4.0, -1.82, -3.5],
    [-2.8, -1.82, -3.1],
    [-1.6, -1.82, -3.4],
    [-0.4, -1.82, -3.0],
    [0.8, -1.82, -3.3],
    [2.0, -1.82, -3.0],
    [3.1, -1.82, -3.4],
  ] as [number, number, number][], [])

  return (
    <group>
      {trees.map((pos, i) => (
        <Tree key={i} position={pos} />
      ))}
    </group>
  )
}
