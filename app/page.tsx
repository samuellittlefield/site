import HeroSceneLoader from '@/components/HeroSceneLoader'
import Nav from '@/components/Nav'

export default function Home() {
  return (
    <main>
      <HeroSceneLoader />
      <Nav />

      <div className="relative z-10 mt-[100vh]">
        <section id="about" className="min-h-screen bg-white/90 backdrop-blur-sm px-16 py-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-light tracking-wide text-slate-800 mb-6">About</h2>
          <p className="text-slate-600 leading-relaxed text-lg font-light">
            Hi, I&apos;m Samuel. This is my corner of the internet — a mix of things I&apos;m building,
            writing, and exploring.
          </p>
        </section>

        <section id="projects" className="min-h-screen bg-slate-50/90 backdrop-blur-sm px-16 py-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-light tracking-wide text-slate-800 mb-6">Projects</h2>
          <p className="text-slate-500 font-light">Coming soon.</p>
        </section>

        <section id="blog" className="min-h-screen bg-white/90 backdrop-blur-sm px-16 py-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-light tracking-wide text-slate-800 mb-6">Blog</h2>
          <p className="text-slate-500 font-light">Coming soon.</p>
        </section>

        <section id="professional" className="min-h-screen bg-slate-50/90 backdrop-blur-sm px-16 py-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-light tracking-wide text-slate-800 mb-6">Professional</h2>
          <p className="text-slate-500 font-light">Coming soon.</p>
        </section>
      </div>
    </main>
  )
}
