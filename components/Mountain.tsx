'use client'

import { useRef, useMemo } from 'react'
import * as THREE from 'three'

export default function Mountain() {
  const vertices = useMemo(() => {
    // Hand-crafted low-poly mountain with multiple peaks
    const v = new Float32Array([
      // Main peak
      0, 4.2, 0,
      -2.0, 0, 0.4,
      -0.6, 0, -0.2,

      0, 4.2, 0,
      -0.6, 0, -0.2,
      0.8, 0, -0.3,

      0, 4.2, 0,
      0.8, 0, -0.3,
      2.2, 0, 0.2,

      0, 4.2, 0,
      2.2, 0, 0.2,
      -2.0, 0, 0.4,

      // Left shoulder sub-peak
      -1.1, 2.4, 0.1,
      -2.8, 0, 0.5,
      -2.0, 0, 0.4,

      -1.1, 2.4, 0.1,
      -2.0, 0, 0.4,
      -0.6, 0, -0.2,

      -1.1, 2.4, 0.1,
      -0.6, 0, -0.2,
      0, 4.2, 0,

      // Right shoulder sub-peak
      1.4, 2.8, -0.1,
      0.8, 0, -0.3,
      2.2, 0, 0.2,

      1.4, 2.8, -0.1,
      2.2, 0, 0.2,
      3.0, 0, 0.3,

      1.4, 2.8, -0.1,
      0, 4.2, 0,
      0.8, 0, -0.3,

      // Far right slope
      1.4, 2.8, -0.1,
      3.0, 0, 0.3,
      3.8, 0, 0,

      // Snow cap top triangle
      0, 4.2, 0,
      -0.3, 3.1, 0.05,
      0.4, 3.2, -0.05,
    ])
    return v
  }, [])

  const snowVertices = useMemo(() => {
    return new Float32Array([
      0, 4.2, 0,
      -0.3, 3.1, 0.05,
      0.4, 3.2, -0.05,
    ])
  }, [])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    g.computeVertexNormals()
    return g
  }, [vertices])

  const snowGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(snowVertices, 3))
    g.computeVertexNormals()
    return g
  }, [snowVertices])

  return (
    <group position={[3.5, -1.8, -6]}>
      <mesh geometry={geo}>
        <meshPhongMaterial color="#5a6b7a" flatShading shininess={0} />
      </mesh>
      <mesh geometry={snowGeo}>
        <meshPhongMaterial color="#e8eef2" flatShading shininess={10} />
      </mesh>
    </group>
  )
}
