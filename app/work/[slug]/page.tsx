import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Masthead from '@/components/Masthead'
import Plate from '@/components/Plate'
import Blocks from '@/components/Blocks'
import { getProject, nextProject, projects } from '@/lib/projects'

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return { title: project.title, description: project.deck }
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) notFound()
  const next = nextProject(slug)

  return (
    <div className="wrap">
      <Masthead
        left={<Link href="/#work">← All work</Link>}
        right={`Case study · No. ${p.no} of ${String(projects.length).padStart(2, '0')}`}
      />

      <main>
        <section className="cs-head" aria-labelledby="cs-title">
          <p className="label accent">{p.field}</p>
          <h1 id="cs-title" className="cs-title">
            {p.title}
          </h1>
          <p className="cs-deck">{p.deck}</p>
          <dl className="meta">
            {p.meta.map((m) => (
              <div key={m.label}>
                <dt className="label">{m.label}</dt>
                <dd>{m.href ? <a href={m.href}>{m.value}</a> : m.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {p.image && <Plate {...p.image} numeral="I" priority className="cs-plate" />}

        {p.sections.map((s, i) => (
          <section key={s.id} className="cs-section" aria-labelledby={`s-${s.id}`}>
            <h2 id={`s-${s.id}`} className="label">
              <span className="no">§{i + 1}</span> · {s.title}
            </h2>
            <div className="cs-main">
              <Blocks blocks={s.blocks} />
            </div>
            {s.note ? <aside className="cs-note">{s.note}</aside> : <div className="cs-spacer" />}
          </section>
        ))}

        <nav aria-label="Next case study">
          <Link href={`/work/${next.slug}`} className="next">
            <span className="label">Next · No. {next.no}</span>
            <span className="next-title">{next.title} →</span>
          </Link>
        </nav>
      </main>

      <footer className="footer">
        <span>Set in Newsreader and IBM Plex Mono.</span>
        <span>© 2026 Samuel Littlefield</span>
      </footer>
    </div>
  )
}
