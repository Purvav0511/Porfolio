import PitchBackground from './components/PitchBackground'
import Header from './components/Header'
import Hero from './components/Hero'
import Summary from './components/Summary'
import Squad from './components/Squad'
import Highlights from './components/Highlights'
import Scout from './components/Scout'
import Resume from './components/Resume'
import Contact from './components/Contact'
import { profile } from './data/content'
import { useReveal } from './hooks/usePageEffects'

export default function App() {
  useReveal()
  return (
    <>
      <PitchBackground />
      <Header />
      <main>
        <Hero />
        <Summary />
        <Squad />
        <Highlights />
        <Scout />
        <Resume />
        <Contact />
      </main>
      <footer>
        <div className="wrap">
          <span>© {new Date().getFullYear()} {profile.first} {profile.last}</span>
          <span>Brooklyn, NY · Built with React &amp; Three.js</span>
        </div>
      </footer>
    </>
  )
}
