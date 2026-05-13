'use client'

import { useState } from 'react'

const links = [
  { label: 'About',        href: '#about' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Blog',         href: '#blog' },
  { label: 'Professional', href: '#professional' },
]

export default function Nav() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <nav className="fixed top-0 left-0 z-50 p-8 flex flex-col gap-1">
      {/* Name — soft white with slight glow */}
      <span
        className="text-[11px] tracking-[0.22em] uppercase mb-4 font-light select-none"
        style={{ color: 'rgba(255,255,255,0.55)', textShadow: '0 0 12px rgba(180,130,255,0.4)' }}
      >
        Samuel Littlefield
      </span>

      {links.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          onMouseEnter={() => setActive(label)}
          onMouseLeave={() => setActive(null)}
          className="text-[15px] tracking-wide font-light transition-all duration-200"
          style={{
            color: active === label
              ? '#A8FF78'                         // neon green on hover
              : active !== null
                ? 'rgba(255,255,255,0.35)'         // dim siblings
                : 'rgba(255,255,255,0.88)',         // bright white default
            textShadow: active === label
              ? '0 0 14px #A8FF78, 0 0 28px rgba(168,255,120,0.4)'
              : '0 0 10px rgba(180,130,255,0.35)',
            transform: active === label ? 'translateX(4px)' : 'translateX(0)',
          }}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}
