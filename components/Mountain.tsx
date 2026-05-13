'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { smoothNoise, fbm } from '@/lib/noise'

// Mountain sits at this world position — exported so Trees can use it
export const MTN_POS: [number, number, number] = [14.0, -1.82, -13]

// Half-extents of the mountain plane geometry
const MTN_HALF_W = 18, MTN_HALF_D = 14

function mountainHeight(lx: number, ly: number): number {
  const peakX = 0.5, peakY = -0.5
  const dx = lx - peakX, dy = ly - peakY
  const dist = Math.sqrt(dx * dx + dy * dy)
  const cone = Math.max(0, (1 - dist / 9.0) * 14.0)
  const detail = fbm(lx * 0.35 + 2, ly * 0.35 + 5, 5) * 3.2
  const fine   = smoothNoise(lx * 1.2 + 9, ly * 1.2 + 3) * 0.8
  const env    = Math.max(0, 1 - dist / 12)
  const height = cone + (detail + fine) * env * Math.sqrt(cone / 14.0 + 0.15)
  // Smooth taper to 0 at plane edges so geometry blends into terrain
  const edgeX = Math.max(0, 1 - (Math.abs(lx) / (MTN_HALF_W - 1)) ** 3)
  const edgeY = Math.max(0, 1 - (Math.abs(ly) / (MTN_HALF_D - 1)) ** 3)
  return height * edgeX * edgeY
}

// Exported so boulders/trees can query ground height on the mountain
export function mountainWorldHeight(wx: number, wz: number): number {
  const lx = wx - MTN_POS[0]
  const ly = -(wz - MTN_POS[2])
  return MTN_POS[1] + mountainHeight(lx, ly)
}

function buildMountainGeo(): THREE.BufferGeometry {
  const segsX = 36, segsY = 28
  const w = MTN_HALF_W * 2, d = MTN_HALF_D * 2

  let geo = new THREE.PlaneGeometry(w, d, segsX, segsY)
  const pos = geo.attributes.position as THREE.BufferAttribute

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    pos.setZ(i, mountainHeight(x, y))
  }
  pos.needsUpdate = true

  const ni = geo.toNonIndexed()
  ni.computeVertexNormals()

  // Per-face vertex colors
  const niPos  = ni.attributes.position as THREE.BufferAttribute
  const niNorm = ni.attributes.normal   as THREE.BufferAttribute
  const colorArr = new Float32Array(niPos.count * 3)

  const C = {
    snow:        new THREE.Color('#F0E8D0'),
    snowShad:    new THREE.Color('#D0C8B0'),
    upperRock:   new THREE.Color('#A89070'),
    midRockWarm: new THREE.Color('#9A7848'),
    midRockCool: new THREE.Color('#8A6858'),
    lowerWarm:   new THREE.Color('#8A6840'),
    lowerDark:   new THREE.Color('#6A4830'),
    earthWarm:   new THREE.Color('#9A8060'),
    earthDark:   new THREE.Color('#5A4028'),
    forest:      new THREE.Color('#3A6020'),
    forestDark:  new THREE.Color('#284A18'),
  }

  for (let i = 0; i < niPos.count; i += 3) {
    const h = (niPos.getZ(i) + niPos.getZ(i+1) + niPos.getZ(i+2)) / 3

    // local-space normal Z ≈ 1 means flat, 0 means vertical
    const nz = (niNorm.getZ(i) + niNorm.getZ(i+1) + niNorm.getZ(i+2)) / 3
    const nx = (niNorm.getX(i) + niNorm.getX(i+1) + niNorm.getX(i+2)) / 3
    const steepness = 1 - Math.abs(nz)
    // faces tilted toward +x and +z are sun-facing
    const sun = Math.max(0, nx * 0.5 + nz * 0.3)

    let c: THREE.Color
    if (h > 11.5) {
      c = sun > 0.25 ? C.snow.clone() : C.snowShad.clone()
    } else if (h > 9.0) {
      const t = (h - 9) / 2.5
      c = C.upperRock.clone().lerp(C.snow, t * 0.6)
      if (sun < 0.2) c.multiplyScalar(0.82)
    } else if (h > 6.5) {
      c = steepness > 0.55
        ? C.midRockCool.clone()
        : C.midRockWarm.clone()
      c.multiplyScalar(0.75 + sun * 0.5)
    } else if (h > 4.0) {
      c = steepness > 0.6
        ? C.lowerDark.clone()
        : C.lowerWarm.clone()
      c.multiplyScalar(0.78 + sun * 0.45)
    } else if (h > 1.8) {
      c = steepness > 0.55
        ? C.earthDark.clone()
        : C.earthWarm.clone()
      c.multiplyScalar(0.8 + sun * 0.35)
    } else {
      c = steepness > 0.5
        ? C.forestDark.clone()
        : C.forest.clone()
      c.multiplyScalar(0.85 + sun * 0.25)
    }

    // micro texture variation
    const mx = (niPos.getX(i) + niPos.getX(i+1) + niPos.getX(i+2)) / 3
    const my = (niPos.getY(i) + niPos.getY(i+1) + niPos.getY(i+2)) / 3
    const micro = (smoothNoise(mx * 4.5 + 13, my * 4.5 + 7) - 0.5) * 0.07
    c.r = Math.max(0, Math.min(1, c.r + micro))
    c.g = Math.max(0, Math.min(1, c.g + micro * 0.7))
    c.b = Math.max(0, Math.min(1, c.b + micro * 0.4))

    for (let j = 0; j < 3; j++) {
      colorArr[(i+j)*3]   = c.r
      colorArr[(i+j)*3+1] = c.g
      colorArr[(i+j)*3+2] = c.b
    }
  }

  ni.setAttribute('color', new THREE.BufferAttribute(colorArr, 3))
  return ni
}

export default function Mountain() {
  const geo = useMemo(() => buildMountainGeo(), [])

  const [rockDiff, rockNor, rockRough] = useLoader(THREE.TextureLoader, [
    '/textures/rock_diff.jpg',
    '/textures/rock_nor.jpg',
    '/textures/rock_rough.jpg',
  ])

  useMemo(() => {
    for (const tex of [rockDiff, rockNor, rockRough]) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(6, 5)
    }
  }, [rockDiff, rockNor, rockRough])

  return (
    <group position={MTN_POS}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={geo}>
        <meshStandardMaterial
          vertexColors
          map={rockDiff}
          normalMap={rockNor}
          roughnessMap={rockRough}
          roughness={1.0}
          metalness={0.0}
          normalScale={new THREE.Vector2(1.5, 1.5)}
        />
      </mesh>
    </group>
  )
}
