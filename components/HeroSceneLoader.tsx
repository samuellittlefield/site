'use client'

import dynamic from 'next/dynamic'

// SVG illustration — no Three.js, no SSR concerns, but keep dynamic
// to match the existing lazy-load pattern
const HeroIllustration = dynamic(() => import('./HeroIllustration'), { ssr: false })

export default function HeroSceneLoader() {
  return <HeroIllustration />
}
