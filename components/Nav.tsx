'use client'

import Link from 'next/link'
import { useState } from 'react'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '#blog' },
  { label: 'Professional', href: '#professional' },
]

export default function Nav() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <nav className="fixed top-0 left-0 z-50 p-8 flex flex-col gap-1">
      <span className="text-[11px] tracking-[0.2em] uppercase text-sky-800/60 mb-3 font-light select-none">
        Samuel Littlefield
      </span>
      {links.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          onMouseEnter={() => setActive(label)}
          onMouseLeave={() => setActive(null)}
          className={`
            text-[15px] tracking-wide font-light transition-all duration-200
            ${active === label
              ? 'text-sky-900 translate-x-1'
              : active !== null
                ? 'text-sky-700/50'
                : 'text-sky-900/80'
            }
          `}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}
