'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, useScroll } from '@react-three/drei'
import * as THREE from 'three'
import Mountain from './Mountain'
import Forest from './Forest'
import Travelers from './Travelers'

const GROUND_COLOR = '#8fa87a'
const SKY_TOP = '#6ba3d6'
const SKY_HORIZON = '#c4dff0'

// Ground plane
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.82, 0]}>
      <planeGeometry args={[40, 20]} />
      <meshPhongMaterial color={GROUND_COLOR} flatShading />
    </mesh>
  )
}

// Gradient sky background (drawn as a large vertical plane)
function Sky() {
  return (
    <mesh position={[0, 2, -14]}>
      <planeGeometry args={[60, 20]} />
      <meshBasicMaterial color={SKY_HORIZON} />
    </mesh>
  )
}

// Parallax scene wrapper — responds to mouse + scroll
function ParallaxScene({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const sceneRef = useRef<THREE.Group>(null)
  const bgRef = useRef<THREE.Group>(null)
  const mgRef = useRef<THREE.Group>(null)
  const fgRef = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const { camera } = useThree()

  useFrame(() => {
    const [mx, my] = mouse.current
    const scrollOffset = scroll.offset // 0–1

    // Camera drift on scroll — gentle forward + upward tilt
    camera.position.z = 5.5 - scrollOffset * 1.8
    camera.position.y = 1.2 + scrollOffset * 0.6
    camera.lookAt(0, 0 + scrollOffset * 0.4, 0)

    // Mouse parallax: bg moves least, fg moves most
    if (bgRef.current) {
      bgRef.current.rotation.y = THREE.MathUtils.lerp(bgRef.current.rotation.y, mx * 0.04, 0.05)
      bgRef.current.rotation.x = THREE.MathUtils.lerp(bgRef.current.rotation.x, -my * 0.02, 0.05)
    }
    if (mgRef.current) {
      mgRef.current.rotation.y = THREE.MathUtils.lerp(mgRef.current.rotation.y, mx * 0.09, 0.05)
      mgRef.current.rotation.x = THREE.MathUtils.lerp(mgRef.current.rotation.x, -my * 0.04, 0.05)
    }
    if (fgRef.current) {
      fgRef.current.rotation.y = THREE.MathUtils.lerp(fgRef.current.rotation.y, mx * 0.15, 0.05)
      fgRef.current.rotation.x = THREE.MathUtils.lerp(fgRef.current.rotation.x, -my * 0.06, 0.05)
    }
  })

  return (
    <group ref={sceneRef}>
      {/* Background layer: sky + mountain */}
      <group ref={bgRef}>
        <Sky />
        <Mountain />
      </group>
      {/* Midground: forest */}
      <group ref={mgRef}>
        <Forest />
      </group>
      {/* Foreground: ground + travelers */}
      <group ref={fgRef}>
        <Ground />
        <Travelers />
      </group>
    </group>
  )
}

export default function HeroScene() {
  const mouse = useRef<[number, number]>([0, 0])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1..1
      mouse.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      ]
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 1.2, 5.5], fov: 58 }}
        gl={{ antialias: true }}
        style={{ background: `linear-gradient(to bottom, ${SKY_TOP} 0%, ${SKY_HORIZON} 60%, ${GROUND_COLOR} 100%)` }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 3]} intensity={1.1} castShadow />
        <directionalLight position={[-4, 6, -2]} intensity={0.3} color="#a8c8e8" />

        <ScrollControls pages={3} damping={0.25}>
          <ParallaxScene mouse={mouse} />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
