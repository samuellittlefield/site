'use client'

import { useRef, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, useScroll } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'
import Mountain from './Mountain'
import Mountain2 from './Mountain2'
import Moon from './Moon'
import Planet from './Planet'
import Spaceship from './Spaceship'
import Terrain from './Terrain'
import Trees from './Trees'
import Boulders from './Boulders'
import Trail from './Trail'
import Travelers from './Travelers'

const SKY_DEEP    = '#1A0A4E'   // deep indigo-purple
const SKY_MID     = '#4A3A8C'   // purple-blue mid
const SKY_HORIZON = '#C878A0'   // warm rose-purple horizon
const FOG_COLOR   = '#C0A8C8'   // soft purple-gray fog

// ── Sky backdrop with warm gradient ──────────────────────────────────────────
function Sky() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(160, 50, 1, 12)
    const deep    = new THREE.Color(SKY_DEEP)
    const mid     = new THREE.Color(SKY_MID)
    const horizon = new THREE.Color(SKY_HORIZON)
    const pos = g.attributes.position as THREE.BufferAttribute
    const colors = new Float32Array(pos.count * 3)
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      const t = Math.max(0, Math.min(1, (y + 25) / 50))
      const c = t > 0.5
        ? mid.clone().lerp(deep, (t - 0.5) * 2)
        : horizon.clone().lerp(mid, t * 2)
      colors[i*3]   = c.r
      colors[i*3+1] = c.g
      colors[i*3+2] = c.b
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  }, [])

  return (
    <mesh position={[5, 8, -20]} geometry={geo}>
      <meshBasicMaterial vertexColors side={THREE.FrontSide} />
    </mesh>
  )
}

// ── Parallax + scroll scene ───────────────────────────────────────────────────
function SceneContents({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const bgRef = useRef<THREE.Group>(null)
  const mgRef = useRef<THREE.Group>(null)
  const fgRef = useRef<THREE.Group>(null)

  const scroll = useScroll()
  const { camera, scene } = useThree()

  useEffect(() => {
    scene.fog = new THREE.FogExp2(FOG_COLOR, 0.020)
    return () => { scene.fog = null }
  }, [scene])

  useFrame(() => {
    const [mx, my] = mouse.current
    const so = scroll.offset

    const targetX = -1.5 + mx * 1.0
    const targetY =  3.2 - my * 0.4 + so * 0.8
    const targetZ =  7.0 - so * 2.2
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.055)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.055)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.055)
    camera.lookAt(2.0, 1.0 + so * 0.4, -2)

    if (bgRef.current) {
      bgRef.current.position.x = THREE.MathUtils.lerp(bgRef.current.position.x, mx * -0.18, 0.05)
      bgRef.current.position.y = THREE.MathUtils.lerp(bgRef.current.position.y, my *  0.08, 0.05)
    }
    if (mgRef.current) {
      mgRef.current.position.x = THREE.MathUtils.lerp(mgRef.current.position.x, mx * -0.55, 0.05)
      mgRef.current.position.y = THREE.MathUtils.lerp(mgRef.current.position.y, my *  0.20, 0.05)
    }
    if (fgRef.current) {
      fgRef.current.position.x = THREE.MathUtils.lerp(fgRef.current.position.x, mx * -1.10, 0.05)
      fgRef.current.position.y = THREE.MathUtils.lerp(fgRef.current.position.y, my *  0.38, 0.05)
    }
  })

  return (
    <>
      <group ref={bgRef}>
        <Sky />
        <Moon />
        <Planet />
        <Mountain />
        <Mountain2 />
        <Spaceship />
      </group>

      <group ref={mgRef}>
        <Trees />
        <Boulders />
      </group>

      <group ref={fgRef}>
        <Terrain />
        <Trail />
        <Travelers />
      </group>

      <EffectComposer>
        <Bloom luminanceThreshold={0.55} intensity={0.4} mipmapBlur />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette eskil={false} offset={0.28} darkness={0.52} />
      </EffectComposer>
    </>
  )
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function HeroScene() {
  const mouse = useRef<[number, number]>([0, 0])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / window.innerWidth)  * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      ]
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -10 }}>
      <Canvas
        camera={{ position: [-1.5, 3.2, 7.0], fov: 58 }}
        gl={{ antialias: true, toneMappingExposure: 1.1 }}
        style={{ background: '#C878A0' }}
      >
        {/* Warm golden-hour sun from the right */}
        <directionalLight position={[8, 6, 2]}  intensity={2.2} color="#FFD580" />
        {/* Soft warm fill from the left */}
        <directionalLight position={[-4, 3, 4]} intensity={0.4} color="#C8A860" />
        {/* Hemisphere: warm sky above, amber ground bounce */}
        <hemisphereLight args={['#87BBFF', '#C8901A', 0.6]} />

        <ScrollControls pages={3} damping={0.28}>
          <Suspense fallback={null}>
            <SceneContents mouse={mouse} />
          </Suspense>
        </ScrollControls>
      </Canvas>
    </div>
  )
}
