import HeroSceneLoader from '@/components/HeroSceneLoader'
import Nav from '@/components/Nav'

const inspirations = [
  {
    label: 'Nietzsche, Camus, Sartre',
    note: 'The examined life. Absurdity as starting point, not destination.',
  },
  {
    label: 'Music',
    note: 'The one language that bypasses the filter.',
  },
  {
    label: 'Books',
    note: 'Other people\'s inner lives, made portable.',
  },
  {
    label: 'Art',
    note: 'What gets said when words aren\'t enough.',
  },
  {
    label: 'Hikes',
    note: 'Where most of the good thinking happens.',
  },
]

export default function Home() {
  return (
    <main>
      <HeroSceneLoader />
      <Nav />

      <div className="relative z-10 mt-[100vh]">

        {/* ── About ──────────────────────────────────────── */}
        <section id="about" className="bg-white/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-10 py-24">

            {/* Header */}
            <p className="text-xs tracking-[0.25em] uppercase text-purple-400 mb-3 font-light">
              About
            </p>
            <h1 className="text-4xl font-extralight tracking-tight text-slate-800 mb-12 leading-snug">
              Bay Area Dad&nbsp;/ Cyclist&nbsp;/ Hiker&nbsp;/<br />
              Product Manager&nbsp;/ Musician
            </h1>

            {/* Bio */}
            <p className="text-slate-600 leading-relaxed text-lg font-light mb-14 max-w-2xl">
              I&apos;m Samuel. This space is a collection of artifacts that resonate
              with me. From hiking routes I&apos;ve enjoyed to Arduino weather stations
              I&apos;ve built. Let&apos;s build something together.
            </p>

            {/* Photo placeholder */}
            <div className="mb-16">
              <div
                className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-slate-100 flex items-center justify-center"
                style={{ aspectRatio: '16/7' }}
              >
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm font-light">Photo coming soon</p>
                </div>
              </div>
            </div>

            {/* Core Inspirations */}
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-purple-400 mb-8 font-light">
                Core Inspiration
              </p>
              <ol className="space-y-0">
                {inspirations.map(({ label, note }, i) => (
                  <li
                    key={label}
                    className="flex gap-6 py-5 border-t border-slate-100 group"
                  >
                    <span className="text-[11px] text-purple-300 font-light mt-1 w-4 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-slate-800 font-light text-base mb-0.5 group-hover:text-purple-700 transition-colors duration-200">
                        {label}
                      </p>
                      <p className="text-slate-400 text-sm font-light leading-relaxed">
                        {note}
                      </p>
                    </div>
                  </li>
                ))}
                <li className="border-t border-slate-100" />
              </ol>
            </div>

          </div>
        </section>

        {/* ── Projects ───────────────────────────────────── */}
        <section id="projects" className="bg-slate-50/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-10 py-24">
            <p className="text-xs tracking-[0.25em] uppercase text-purple-400 mb-3 font-light">Projects</p>
            <h2 className="text-3xl font-extralight tracking-tight text-slate-800 mb-12">Things I&apos;ve built</h2>

            <div className="flex flex-col gap-4">
            <a
              href="/circlesnap"
              className="group block border border-slate-200 rounded-2xl p-8 hover:border-purple-200 hover:bg-white transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-purple-400 mb-2 font-light">WIP</p>
                  <h3 className="text-xl font-light text-slate-800 group-hover:text-purple-700 transition-colors duration-200">
                    CircleSnap
                  </h3>
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-purple-400 transition-colors duration-200 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
              <p className="text-slate-500 font-light text-sm leading-relaxed mb-6">
                A timeline-based social app for recording and sharing events — hikes, shows, trips, anything worth remembering. Invite-only, photo-first.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'PostgreSQL', 'Prisma', 'Vercel Blob'].map(tag => (
                  <span key={tag} className="text-[11px] tracking-wide text-purple-400 border border-purple-100 rounded-full px-3 py-1 font-light">
                    {tag}
                  </span>
                ))}
              </div>
            </a>

            <a
              href="https://news-site-aggregator.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block border border-slate-200 rounded-2xl p-8 hover:border-purple-200 hover:bg-white transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-purple-400 mb-2 font-light">Live</p>
                  <h3 className="text-xl font-light text-slate-800 group-hover:text-purple-700 transition-colors duration-200">
                    Situation Monitor
                  </h3>
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-purple-400 transition-colors duration-200 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
              <p className="text-slate-500 font-light text-sm leading-relaxed mb-6">
                A real-time dashboard surfacing what&apos;s happening right now — trending topics, weather, politics, astronomy, and internet service health. Pulls from Google Trends, Wikipedia velocity, Reddit, and more, enriched with AI summaries.
              </p>
              <div className="flex flex-wrap gap-2">
                {['FastAPI', 'React', 'PostgreSQL', 'APScheduler', 'Groq'].map(tag => (
                  <span key={tag} className="text-[11px] tracking-wide text-purple-400 border border-purple-100 rounded-full px-3 py-1 font-light">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
            </div>
          </div>
        </section>

        {/* ── Blog ───────────────────────────────────────── */}
        <section id="blog" className="bg-white/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-10 py-24 min-h-[50vh]">
            <p className="text-xs tracking-[0.25em] uppercase text-purple-400 mb-3 font-light">Blog</p>
            <h2 className="text-3xl font-extralight tracking-tight text-slate-800 mb-8">Thoughts</h2>
            <p className="text-slate-400 font-light">Coming soon.</p>
          </div>
        </section>

        {/* ── Professional ───────────────────────────────── */}
        <section id="professional" className="bg-slate-50/95 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-10 py-24 min-h-[50vh]">
            <p className="text-xs tracking-[0.25em] uppercase text-purple-400 mb-3 font-light">Professional</p>
            <h2 className="text-3xl font-extralight tracking-tight text-slate-800 mb-8">Work</h2>
            <p className="text-slate-400 font-light">Coming soon.</p>
          </div>
        </section>

      </div>
    </main>
  )
}
