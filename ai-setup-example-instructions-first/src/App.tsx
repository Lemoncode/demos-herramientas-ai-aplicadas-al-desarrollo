import { Hero } from './components/Hero.tsx'

// Only the hero exists today. The next step is written up in docs/feature-request.md:
// add a "Features" section and a Footer, following the rules in .claude/rules/.
export default function App() {
  return (
    <main>
      <Hero
        title="Ship your next product faster"
        subtitle="Acme gives small teams the tooling big teams take for granted."
        ctaLabel="Get started"
        ctaHref="#features"
      />
    </main>
  )
}
