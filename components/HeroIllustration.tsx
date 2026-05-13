'use client'

import { useEffect, useRef } from 'react'

// ── Deterministic tree-line silhouette ────────────────────────────────────────
function treeLine(
  x0: number, x1: number, baseY: number,
  minH: number, maxH: number, seed: number
): string {
  let s = seed >>> 0
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff }

  let d = `M ${x0} ${baseY}`
  let x = x0

  while (x < x1) {
    const w  = 42 + r() * 34
    const h  = minH + r() * (maxH - minH)
    const cx = x + w / 2
    const py = baseY - h

    d += ` L ${x + w * 0.12} ${baseY - h * 0.10}`
    d += ` L ${cx - w * 0.09} ${py + h * 0.09}`
    d += ` L ${cx} ${py}`
    d += ` L ${cx + w * 0.09} ${py + h * 0.09}`
    d += ` L ${x + w * 0.88} ${baseY - h * 0.10}`
    x += w * 0.82   // slight overlap for dense canopy
  }

  return d + ` L ${x1} ${baseY} Z`
}

const FOREST_FAR  = treeLine(-60, 1100, 648, 100, 185, 13)
const FOREST_NEAR = treeLine(-80, 1080, 645,  168, 295, 42)

// ── Wing path for birds ───────────────────────────────────────────────────────
const wing = (f: number) => `M -18 0 Q -9 ${f} 0 0 Q 9 ${f} 18 0`

// ── Component ─────────────────────────────────────────────────────────────────
export default function HeroIllustration() {
  // Parallax layer refs
  const farRef  = useRef<SVGGElement>(null)
  const midRef  = useRef<SVGGElement>(null)
  const nearRef = useRef<SVGGElement>(null)
  const fgRef   = useRef<SVGGElement>(null)

  // Bird refs — group for position, path for wing shape
  const b1g = useRef<SVGGElement>(null);    const b1p = useRef<SVGPathElement>(null)
  const b2g = useRef<SVGGElement>(null);    const b2p = useRef<SVGPathElement>(null)
  const b3g = useRef<SVGGElement>(null);    const b3p = useRef<SVGPathElement>(null)
  const b4g = useRef<SVGGElement>(null);    const b4p = useRef<SVGPathElement>(null)

  // Character and spaceship refs
  const hikerRef   = useRef<SVGGElement>(null)
  const cyclistRef = useRef<SVGGElement>(null)
  const shipRef    = useRef<SVGGElement>(null)

  useEffect(() => {
    let tx = 0, ty = 0   // target mouse
    let cx = 0, cy = 0   // current (lerped)
    let raf: number
    let t0 = 0

    const onMouse = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth  - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }

    // Trail path for character following
    const trail = document.getElementById('il-trail') as SVGPathElement | null
    const tLen  = trail?.getTotalLength() ?? 0

    const tick = (ts: number) => {
      if (!t0) t0 = ts
      const t = (ts - t0) * 0.001   // seconds

      // Smooth mouse lerp
      cx += (tx - cx) * 0.055
      cy += (ty - cy) * 0.055

      // Layer translations
      farRef.current?.setAttribute('transform',  `translate(${cx * -12},${cy * -4})`)
      midRef.current?.setAttribute('transform',  `translate(${cx * -30},${cy * -9})`)
      nearRef.current?.setAttribute('transform', `translate(${cx * -52},${cy * -15})`)
      fgRef.current?.setAttribute('transform',   `translate(${cx * -80},${cy * -22})`)

      // ── Birds ──────────────────────────────────────────────────────────────
      const moveBird = (
        gr: React.RefObject<SVGGElement | null>,
        pr: React.RefObject<SVGPathElement | null>,
        bx: number, by: number, drift: number,
        bob: number, bobSpd: number,
        flapAmp: number, flapSpd: number
      ) => {
        gr.current?.setAttribute('transform',
          `translate(${bx + Math.sin(t * drift) * 90},${by + Math.sin(t * bobSpd) * bob})`)
        pr.current?.setAttribute('d', wing(Math.sin(t * flapSpd) * flapAmp))
      }

      moveBird(b1g, b1p,  260, 175, 0.48, 22, 0.80, -7, 2.8)
      moveBird(b2g, b2p,  390, 152, 0.38, 18, 0.65, -6, 2.4)
      moveBird(b3g, b3p,  690, 198, 0.55, 24, 0.90, -7, 3.1)
      moveBird(b4g, b4p,  840, 168, 0.42, 20, 0.72, -6, 2.6)

      // ── Hiker follows trail ────────────────────────────────────────────────
      if (trail && tLen > 0 && hikerRef.current) {
        const ht  = (t * 0.028) % 1
        const pt  = trail.getPointAtLength(ht * tLen)
        const pt2 = trail.getPointAtLength(Math.min((ht + 0.008) * tLen, tLen))
        const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI
        hikerRef.current.setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${ang})`)
      }

      // ── Cyclist follows trail (faster) ────────────────────────────────────
      if (trail && tLen > 0 && cyclistRef.current) {
        const ct  = ((t * 0.068) + 0.38) % 1
        const pt  = trail.getPointAtLength(ct * tLen)
        const pt2 = trail.getPointAtLength(Math.min((ct + 0.008) * tLen, tLen))
        const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI
        cyclistRef.current.setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${ang})`)
      }

      // ── Spaceship diagonal launch ──────────────────────────────────────────
      if (shipRef.current) {
        const st   = (t * 0.032) % 1
        const ease = st < 0.06 ? (st / 0.06) * 0.05 : 0.05 + ((st - 0.06) / 0.94) * 0.95
        const sx   = -140 + ease * 1720
        const sy   = 860  - ease * 820
        shipRef.current.setAttribute('transform', `translate(${sx},${sy}) rotate(-36)`)
      }

      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouse)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky */}
          <linearGradient id="il-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7AAEC8" />
            <stop offset="48%"  stopColor="#B8D4E4" />
            <stop offset="100%" stopColor="#EFCAA8" />
          </linearGradient>

          {/* Mountains */}
          <linearGradient id="il-mtn-main" x1="0.35" y1="0" x2="0.65" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#8898C8" />
            <stop offset="40%"  stopColor="#5568A8" />
            <stop offset="100%" stopColor="#333A6A" />
          </linearGradient>
          <linearGradient id="il-mtn-sec" x1="0.35" y1="0" x2="0.65" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#9AAAC8" />
            <stop offset="100%" stopColor="#6070A0" />
          </linearGradient>
          <linearGradient id="il-mtn-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#B8C8DC" />
            <stop offset="100%" stopColor="#8090B0" />
          </linearGradient>

          {/* Ground */}
          <linearGradient id="il-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#52922E" />
            <stop offset="100%" stopColor="#2A5A18" />
          </linearGradient>

          {/* Moon glow */}
          <radialGradient id="il-moon-glow" cx="50%" cy="50%" r="50%">
            <stop offset="70%"  stopColor="#D8D0EC" />
            <stop offset="100%" stopColor="#D8D0EC" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Sky background ──────────────────────────────────────────────── */}
        <rect width="1440" height="900" fill="url(#il-sky)" />

        {/* ── Far layer ────────────────────────────────────────────────────── */}
        <g ref={farRef}>

          {/* Moon — between the two peaks */}
          <circle cx="822" cy="218" r="82" fill="url(#il-moon-glow)" opacity="0.55" />
          <circle cx="822" cy="218" r="60" fill="#D8D0EC" />
          <circle cx="800" cy="200" r="11" fill="#C4BCD8" opacity="0.45" />
          <circle cx="836" cy="230" r="7"  fill="#C4BCD8" opacity="0.38" />
          <circle cx="815" cy="238" r="4.5" fill="#C4BCD8" opacity="0.32" />

          {/* Planet — upper left near nav */}
          <g transform="translate(190,150) rotate(-16)">
            <ellipse cx="0" cy="0" rx="70" ry="13" fill="#7040B0" opacity="0.38" />
            <circle  cx="0" cy="0" r="36" fill="#6B3FA0" />
            <circle  cx="0" cy="0" r="36" fill="none" />
            <ellipse cx="0" cy="0" rx="62" ry="11" fill="none" stroke="#A070D8" strokeWidth="5.5" opacity="0.82" />
            <ellipse cx="0" cy="0" rx="50" ry="8.5" fill="none" stroke="#C8A0F0" strokeWidth="3"   opacity="0.62" />
            <ellipse cx="0" cy="0" rx="76" ry="13"  fill="none" stroke="#8050B8" strokeWidth="2"   opacity="0.35" />
          </g>

          {/* Distant hazy mountain */}
          <path
            d="M -50 658 C 60 622 170 572 275 500 C 358 440 415 374 462 318
               C 492 278 510 248 522 222 C 534 248 552 282 576 322
               C 618 390 672 462 738 530 C 796 588 858 628 910 652
               L 910 672 L -50 672 Z"
            fill="url(#il-mtn-far)"
          />

          {/* Cloud 1 — left of center */}
          <g opacity="0.90">
            <ellipse cx="228" cy="292" rx="72" ry="38" fill="#F4EEF8" />
            <ellipse cx="288" cy="280" rx="58" ry="35" fill="#FAFAFA" />
            <ellipse cx="168" cy="298" rx="50" ry="30" fill="#EDE8F4" />
            <ellipse cx="252" cy="268" rx="44" ry="28" fill="#FFFFFF" />
          </g>

          {/* Cloud 2 — right side */}
          <g opacity="0.84">
            <ellipse cx="1092" cy="252" rx="78" ry="40" fill="#F4EEF8" />
            <ellipse cx="1158" cy="240" rx="60" ry="36" fill="#FFFFFF" />
            <ellipse cx="1026" cy="260" rx="54" ry="32" fill="#EDE8F4" />
            <ellipse cx="1118" cy="232" rx="46" ry="29" fill="#FFFFFF" />
          </g>

          {/* Cloud 3 — upper center */}
          <g opacity="0.70">
            <ellipse cx="592" cy="165" rx="58" ry="28" fill="#F4EEF8" />
            <ellipse cx="642" cy="156" rx="44" ry="24" fill="#FFFFFF" />
            <ellipse cx="542" cy="172" rx="40" ry="22" fill="#EDE8F4" />
          </g>

        </g>

        {/* ── Mid layer — illustrated mountains ────────────────────────────── */}
        <g ref={midRef}>

          {/* Secondary mountain — left of center, reads as background */}
          <path
            d="M 55 660
               C 118 614 192 554 268 478
               C 325 418 370 362 408 314
               C 433 278 450 250 464 222
               C 478 250 495 282 518 320
               C 554 376 598 444 648 510
               C 696 572 744 616 785 645
               L 785 668 L 55 668 Z"
            fill="url(#il-mtn-sec)"
          />
          {/* Shadow left face */}
          <path
            d="M 55 660 C 128 608 210 544 292 462
               C 348 400 393 348 424 312
               C 444 280 456 255 464 222
               C 456 252 440 280 420 312
               C 396 348 366 392 328 442
               C 286 496 238 550 188 598
               C 155 626 104 648 78 658 Z"
            fill="#4A5888" opacity="0.42"
          />

          {/* Main mountain — right, dominant, blue-indigo */}
          <path
            d="M 645 662
               C 708 610 772 548 844 472
               C 898 412 940 358 972 312
               C 998 272 1026 234 1052 196
               C 1068 170 1080 148 1088 128
               C 1097 148 1112 174 1130 202
               C 1158 248 1194 306 1234 366
               C 1278 432 1326 502 1378 562
               C 1416 610 1450 640 1468 658
               L 1468 678 L 645 678 Z"
            fill="url(#il-mtn-main)"
          />
          {/* Shadow left face — cool indigo */}
          <path
            d="M 645 662
               C 716 608 794 540 870 458
               C 924 396 964 344 994 304
               C 1020 268 1044 232 1066 200
               C 1076 180 1082 160 1088 128
               C 1080 155 1064 185 1046 218
               C 1024 256 998 298 965 344
               C 928 396 886 448 840 500
               C 796 550 748 596 704 630
               C 682 644 660 656 648 660 Z"
            fill="#242858" opacity="0.52"
          />
          {/* Sunlit right ridge highlight */}
          <path
            d="M 1088 128 C 1112 172 1148 226 1186 282 C 1212 318 1232 348 1244 378"
            fill="none" stroke="#A8B8D8" strokeWidth="2.5" strokeLinecap="round" opacity="0.55"
          />

        </g>

        {/* ── Near layer — forest ───────────────────────────────────────────── */}
        <g ref={nearRef}>

          {/* Background forest tier — darker, further */}
          <path d={FOREST_FAR}  fill="#184215" opacity="0.75" />

          {/* Main forest silhouette */}
          <path d={FOREST_NEAR} fill="#1E5018" />

          {/* Forest floor edge — lighter bright strip */}
          <path
            d="M -80 648 C 150 644 350 641 560 642
               C 770 643 960 645 1100 648 L 1100 662 L -80 662 Z"
            fill="#2A6820"
          />

        </g>

        {/* ── Foreground ───────────────────────────────────────────────────── */}
        <g ref={fgRef}>

          {/* Ground plane */}
          <path
            d="M -120 645
               C 0 638 200 632 420 635
               C 640 638 860 642 1080 644
               C 1260 646 1380 644 1560 640
               L 1560 900 L -120 900 Z"
            fill="url(#il-ground)"
          />
          {/* Ground highlight */}
          <path
            d="M -120 645 C 0 638 200 632 420 635
               C 640 638 860 642 1080 644 C 1260 646 1380 644 1560 640"
            fill="none" stroke="#62B238" strokeWidth="2.5" opacity="0.55"
          />

          {/* Trail — this is the path hiker/cyclist follow */}
          <path
            id="il-trail"
            d="M -100 872 C 80 808 190 764 330 726
               C 454 690 558 674 672 668
               C 790 662 894 664 1010 670
               C 1100 674 1180 680 1280 688"
            fill="none" stroke="#C8A868" strokeWidth="18" strokeLinecap="round"
          />
          {/* Trail worn-centre stripe */}
          <path
            d="M -100 872 C 80 808 190 764 330 726
               C 454 690 558 674 672 668
               C 790 662 894 664 1010 670
               C 1100 674 1180 680 1280 688"
            fill="none" stroke="#A88848" strokeWidth="6" strokeLinecap="round"
            strokeDasharray="28 20" opacity="0.48"
          />

          {/* Cabin — right of centre, nestled by trees */}
          <g transform="translate(1042, 634) scale(1.1)">
            {/* Ground shadow */}
            <ellipse cx="2" cy="9" rx="34" ry="9" fill="#0E2A08" opacity="0.30" />
            {/* Walls */}
            <rect x="-28" y="-34" width="56" height="42" rx="2" fill="#7A5C3A" />
            {/* Log lines */}
            <line x1="-28" y1="-21" x2="28" y2="-21" stroke="#5A3E22" strokeWidth="2.5" />
            <line x1="-28" y1="-9"  x2="28" y2="-9"  stroke="#5A3E22" strokeWidth="2.5" />
            {/* Roof — triangle pointing UP */}
            <polygon points="0,-62 -38,-34 38,-34" fill="#2C1E08" />
            {/* Roof shadow side */}
            <polygon points="0,-62 -38,-34 -26,-34" fill="#3E2C10" />
            {/* Chimney */}
            <rect x="14" y="-60" width="10" height="28" fill="#5A4835" />
            <rect x="12" y="-62" width="14" height="5"  fill="#3A2A1A" />
            {/* Warm window glow */}
            <rect x="-24" y="-26" width="14" height="11" rx="1.5" fill="#FFD080" />
            <rect x="-24" y="-26" width="14" height="11" rx="1.5" fill="#FF9020" opacity="0.35" />
            {/* Door */}
            <rect x="-7" y="-17" width="13" height="17" rx="1" fill="#3A2410" />
            {/* Step */}
            <rect x="-10" y="8"  width="20" height="4"  rx="1" fill="#6A5040" />
          </g>

          {/* Small boulders along trail */}
          <ellipse cx="430" cy="652" rx="15" ry="8"  fill="#607090" opacity="0.68" />
          <ellipse cx="460" cy="654" rx="10" ry="6"  fill="#506080" opacity="0.58" />
          <ellipse cx="768" cy="653" rx="13" ry="7"  fill="#607090" opacity="0.62" />
          <ellipse cx="797" cy="655" rx="8"  ry="5"  fill="#506080" opacity="0.55" />

          {/* Hiker */}
          <g ref={hikerRef}>
            <circle r="5.5" fill="#E03520" />
            <circle r="3.5" cy="-9" fill="#D4A070" />
            <rect x="2" y="-13" width="4" height="7" rx="1" fill="#7A8A6A" />
          </g>

          {/* Cyclist */}
          <g ref={cyclistRef}>
            <circle cx="-7" r="6.5" fill="none" stroke="#2C3E50" strokeWidth="1.8" />
            <circle cx=" 7" r="6.5" fill="none" stroke="#2C3E50" strokeWidth="1.8" />
            <ellipse cx="0" cy="-8" rx="7" ry="4.5" fill="#2ECC40" />
            <circle cy="-15" r="3.5" fill="#D4A070" />
          </g>

        </g>

        {/* ── Birds (live in sky, no parallax offset) ───────────────────────── */}
        <g ref={b1g}><path ref={b1p} stroke="#1A1A30" strokeWidth="2.8" fill="none" strokeLinecap="round" /></g>
        <g ref={b2g}><path ref={b2p} stroke="#1A1A30" strokeWidth="2.5" fill="none" strokeLinecap="round" /></g>
        <g ref={b3g}><path ref={b3p} stroke="#1A1A30" strokeWidth="2.8" fill="none" strokeLinecap="round" /></g>
        <g ref={b4g}><path ref={b4p} stroke="#1A1A30" strokeWidth="2.5" fill="none" strokeLinecap="round" /></g>

        {/* ── Spaceship ─────────────────────────────────────────────────────── */}
        <g ref={shipRef}>
          <rect x="-11" y="-26" width="22" height="36" rx="4" fill="#1E1B2E" />
          <polygon points="0,-44 -11,-26 11,-26" fill="#6D28D9" />
          <circle cy="-46" r="3" fill="#A78BFA" />
          <circle cy="-12" r="5" fill="#6EE7B7" opacity="0.9" />
          <polygon points="-11,10 -20,22 -11,22" fill="#10B981" />
          <polygon points=" 11,10  20,22  11,22" fill="#10B981" />
          <ellipse cy="14" rx="8" ry="5" fill="#F97316" opacity="0.88" />
          <ellipse cy="20" rx="5" ry="9" fill="#FDE68A" opacity="0.70" />
        </g>

      </svg>
    </div>
  )
}
