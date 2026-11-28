import Link from 'next/link'
import Masthead from '@/components/Masthead'
import Plate from '@/components/Plate'
import { projects } from '@/lib/projects'

export default function Home() {
  const [lead, ...rest] = projects

  return (
    <div className="wrap">
      <Masthead left="Vol. I · 2026 · Richmond, California" right="Public data · Energy · Civic information" />

      <main>
        <section className="intro" aria-label="Introduction">
          <div>
            <h1 className="display">
              I build small, careful tools out of <em>public data.</em>
            </h1>
            <p className="lede">
              Product manager. Recent work covers federal energy permitting, residential electricity rates and
              election polling. Each project says what its numbers are and where they came from.
            </p>
          </div>
          <nav className="toc" aria-label="Contents">
            <p className="label" style={{ margin: 0 }}>
              Contents
            </p>
            <ol>
              {projects.map((p) => (
                <li key={p.slug}>
                  <span className="mono accent" style={{ fontSize: 12 }}>
                    {p.no}
                  </span>
                  <Link href={`/work/${p.slug}`}>{p.title}</Link>
                  <span className="leader" aria-hidden="true" />
                  <span className="label" style={{ letterSpacing: '0.04em', textTransform: 'none' }}>
                    {p.field}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        <section id="work" className="section" aria-labelledby="lead-title">
          <p className="label" style={{ margin: '0 0 40px' }}>
            <span className="no">No. {lead.no}</span> · Lead project · Permitting and the grid · {lead.year}
          </p>
          <div className="feature">
            <div>
              <h2 id="lead-title" className="h-feature">
                <Link href={`/work/${lead.slug}`} style={{ textDecoration: 'none' }}>
                  {lead.title}
                </Link>
              </h2>
              <p className="deck">{lead.summary}</p>
              <figure className="stat">
                <div className="stat-row">
                  <span className="stat-num">36%</span>
                  <span className="mono" style={{ fontSize: 20, color: 'var(--muted)' }}>
                    to
                  </span>
                  <span className="stat-num accent">12%</span>
                </div>
                <figcaption>
                  Share of BLM solar right-of-way applications decided within 12 months: filed 2016 to 2020, versus
                  filed 2021 to 2025.
                </figcaption>
              </figure>
              <div className="links" style={{ marginTop: 32 }}>
                {lead.links.map((l) => (
                  <a key={l.href} href={l.href}>
                    {l.label} ↗
                  </a>
                ))}
                <Link href={`/work/${lead.slug}`}>Read the case study →</Link>
              </div>
            </div>
            {lead.image && <Plate {...lead.image} numeral="I" priority />}
          </div>
        </section>

        <section className="section" aria-labelledby="work-title">
          <div className="section-head">
            <h2 id="work-title" className="label" style={{ margin: 0 }}>
              Selected work
            </h2>
            <span className="label">
              Nos. {rest[0].no} to {rest[rest.length - 1].no}
            </span>
          </div>
          <div className="work-grid">
            {rest.map((p) => (
              <article key={p.slug} className="work">
                {p.image ? (
                  <Link href={`/work/${p.slug}`} aria-hidden="true" tabIndex={-1}>
                    <Plate src={p.image.src} alt="" />
                  </Link>
                ) : (
                  <div className="plate-text">
                    <p className="label">Internal tool · No public build</p>
                    <p className="plate-quote">One shared record of a project, handed straight to engineering.</p>
                  </div>
                )}
                <p className="label">
                  <span className="no">No. {p.no}</span> · {p.field} · {p.year}
                </p>
                <h3>
                  <Link href={`/work/${p.slug}`}>{p.title}</Link>
                </h3>
                <p className="body">{p.summary}</p>
                <p className="stack">{p.stack}</p>
                <div className="links">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href}>
                      {l.label} ↗
                    </a>
                  ))}
                  <Link href={`/work/${p.slug}`}>Case study →</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" style={{ borderTopColor: 'var(--rule)', paddingBottom: 88 }} aria-labelledby="progress-title">
          <div className="row">
            <h2 id="progress-title" className="label" style={{ margin: 0 }}>
              In progress
            </h2>
            <div className="span-2">
              <p style={{ margin: 0, fontSize: 30, lineHeight: 1.2 }}>True Grade</p>
              <p className="body" style={{ margin: '8px 0 0', maxWidth: '36rem' }}>
                Bike route sheets you can read at a glance: the map, the climbs, and where to find water and
                bathrooms along the way.
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="section" aria-labelledby="about-title">
          <h2 id="about-title" className="label" style={{ margin: '0 0 40px' }}>
            About
          </h2>
          <div className="about-grid">
            <p className="about-text">
              Product manager in Richmond, California, with a degree in English. I run complex projects from first
              conversation to shipped product, and keep them tied to what real users need.
            </p>
            <dl className="contact">
              <dt className="label">GitHub</dt>
              <dd>
                <a href="https://github.com/samuellittlefield">samuellittlefield</a>
              </dd>
              <dt className="label">LinkedIn</dt>
              <dd>
                <a href="https://www.linkedin.com/in/samuellittlefield/">samuellittlefield</a>
              </dd>
            </dl>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Set in Newsreader and IBM Plex Mono.</span>
        <span>© 2026 Samuel Littlefield</span>
      </footer>
    </div>
  )
}
