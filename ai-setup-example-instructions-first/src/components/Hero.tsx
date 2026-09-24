interface HeroProps {
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
}

export function Hero({ title, subtitle, ctaLabel, ctaHref }: HeroProps) {
  return (
    <section className="hero">
      <h1 className="hero__title">{title}</h1>
      <p className="hero__subtitle">{subtitle}</p>
      <a className="hero__cta" href={ctaHref}>
        {ctaLabel}
      </a>
    </section>
  )
}
