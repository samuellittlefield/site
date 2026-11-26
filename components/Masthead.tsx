import Link from 'next/link'

export default function Masthead({
  left,
  right,
}: {
  left: React.ReactNode
  right: React.ReactNode
}) {
  return (
    <header className="masthead">
      <div className="masthead-top">
        <Link href="/" className="wordmark">
          Samuel Littlefield
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/#work">Work</Link>
          <Link href="/#about">About</Link>
        </nav>
      </div>
      <div className="double-rule" />
      <div className="dateline">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </header>
  )
}
