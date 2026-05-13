'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { smoothNoise, fbm } from '@/lib/noise'
import { makeToonGradient } from '@/lib/toonGradient'

// Second peak — positioned left-of-center, further back, slightly shorter
export const MTN2_POS: [number, number, number] = [2.0, -1.82, -18]

function mountain2Height(lx: number, ly: number): number {
  const peakX = -0.5, peakY = 0.5
  const dx = lx - peakX, dy = ly - peakY
  const dist = Math.sqrt(dx * dx + dy * dy)
  const cone = Math.max(0, (1 - dist / 7.0) * 10.5)   // shorter than main
  const detail = fbm(lx * 0.40 + 8, ly * 0.40 + 12, 4) * 2.5
  const fine   = smoothNoise(lx * 1.4 + 20, ly * 1.4 + 16) * 0.7
  const env    = Math.max(0, 1 - dist / 9.5)
  const height = cone + (detail + fine) * env * Math.sqrt(cone / 10.5 + 0.15)
  // Edge taper
  const edgeX = Math.max(0, 1 - (Math.abs(lx) / 13) ** 3)
  const edgeY = Math.max(0, 1 - (Math.abs(ly) / 11) ** 3)
  return height * edgeX * edgeY
}

function buildMtn2Geo(): THREE.BufferGeometry {
  const segsX = 30, segsY = 24
  const g = new THREE.PlaneGeometry(26, 22, segsX, segsY)
  const pos = g.attributes.position as THREE.BufferAttribute

  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, mountain2Height(pos.getX(i), pos.getY(i)))
  }
  pos.needsUpdate = true

  const ni = g.toNonIndexed()
  ni.computeVertexNormals()

  // Vertex colors — cooler/more purple palette than main mountain
  const niPos  = ni.attributes.position as THREE.BufferAttribute
  const niNorm = ni.attributes.normal   as THREE.BufferAttribute
  const colorArr = new Float32Array(niPos.count * 3)

  const C = {
    snow:      new THREE.Color('#C8D8F0'),  // lighter blue — further peak reads softer
    snowShad:  new THREE.Color('#8898C0'),
    upper:     new THREE.Color('#5068A8'),
    midCool:   new THREE.Color('#384888'),
    midWarm:   new THREE.Color('#485898'),
    lower:     new THREE.Color('#2C3870'),
    earth:     new THREE.Color('#384830'),
    forest:    new THREE.Color('#2A6020'),
    forestDk:  new THREE.Color('#184010'),
  }

  for (let i = 0; i < niPos.count; i += 3) {
    const h  = (niPos.getZ(i) + niPos.getZ(i+1) + niPos.getZ(i+2)) / 3
    const nz = (niNorm.getZ(i) + niNorm.getZ(i+1) + niNorm.getZ(i+2)) / 3
    const nx = (niNorm.getX(i) + niNorm.getX(i+1) + niNorm.getX(i+2)) / 3
    const steepness = 1 - Math.abs(nz)
    const sun = Math.max(0, nx * 0.4 + nz * 0.3)

    let c: THREE.Color
    if (h > 9.0)      c = sun > 0.2 ? C.snow.clone()   : C.snowShad.clone()
    else if (h > 7.0) c = C.upper.clone().lerp(C.snow, (h - 7) / 2 * 0.5)
    else if (h > 4.5) c = steepness > 0.5 ? C.midCool.clone() : C.midWarm.clone()
    else if (h > 2.5) c = C.lower.clone()
    else if (h > 1.0) c = C.earth.clone()
    else              c = steepness > 0.4 ? C.forestDk.clone() : C.forest.clone()

    c.multiplyScalar(0.78 + sun * 0.44)

    for (let j = 0; j < 3; j++) {
      colorArr[(i+j)*3]   = c.r
      colorArr[(i+j)*3+1] = c.g
      colorArr[(i+j)*3+2] = c.b
    }
  }

  ni.setAttribute('color', new THREE.BufferAttribute(colorArr, 3))
  return ni
}

export default function Mountain2() {
  const geo         = useMemo(() => buildMtn2Geo(), [])
  const gradientMap = useMemo(() => makeToonGradient(), [])

  return (
    <group position={MTN2_POS}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={geo}>
        <meshToonMaterial vertexColors gradientMap={gradientMap} />
      </mesh>
    </group>
  )
}
