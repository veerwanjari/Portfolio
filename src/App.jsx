import { useState } from 'react'
import { MotionConfig } from 'motion/react'
import { Toaster } from 'sonner'
import Preloader from '@/components/layout/Preloader'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AmbientBackground from '@/components/ui/AmbientBackground'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'
import Contact from '@/components/sections/Contact'
import CustomCursor from './components/ui/CustomCursor'

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
      <Preloader onDone={() => setReady(true)} />
      
      {/* Background is fixed across the entire view */}
      <AmbientBackground />
      <CustomCursor />

      {/* Main content wrapper is completely transparent to let background show through */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:text-void"
      >
        Skip to content
      </a>

      <div className="relative z-10 bg-transparent">
        <Navbar />
        <main id="main" className="bg-transparent">
          <Hero ready={ready} />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>

      <Toaster
        theme="dark"
        position="bottom-center"
        offset="calc(1rem + env(safe-area-inset-bottom))"
        toastOptions={{
          style: {
            background: 'rgba(17,17,22,0.92)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#f2f2f0',
          },
        }}
      />
    </MotionConfig>
  )
}