# Goal — JivaEnergy landing page redesign

Use `orchestrate-fleet` to build the JivaEnergy landing page in Editorial Energy style.

## Brand

JivaEnergy — manufacturer of AC and DC chargers for electric vehicles and plug-in hybrids. Spanish company. Sells to residential EV owners, commercial fleets, public-sector organizations, and authorized distributors.

## Tone & Language

- Spanish (es-ES) as primary; English for product model names.
- Confident, technical, B2B-credible. No "eco-friendly" buzzwords.

## Sections (one Worker per Section)

### 1. Hero

- Headline: "Energía sostenible para cada kilómetro"
- Subhead: 1–2 sentences positioning JivaEnergy as a serious European manufacturer of EV charging hardware.
- Primary CTA: "Ver cargadores" → `/vehiculo/cargadores`
- Secondary CTA: "Hablar con un distribuidor" → `/contacto`
- Visual: large product photograph slot (placeholder `<Image>` allowed).

**Acceptance:**
- Renders a level-1 heading with the headline text.
- Both CTAs are accessible by role (`getByRole('link', { name: ... })`).
- No `<img>` without `alt`.

### 2. Catalog

- Grid of 10 charger cards.
- Each card: model name, power rating (kW), connector type, residential/commercial badge, link to product page.
- Models: JC-DUO Premium, JC-DC TS Premium, JC-AC Wall, JC-DC Fast 60, JC-DC Fast 120, JC-AC Pole, JC-DC Modular, JC-AC Smart, JC-Portable, JC-Fleet Hub.
- Mock data file at `src/sections/catalog/chargers.ts` exporting a typed `chargers` array.

**Acceptance:**
- Renders exactly 10 cards from the mock data.
- Each card heading uses the `Heading` primitive.
- Residential/commercial badge is not color-only — must include text.

### 3. Sustainability

- Three-up metric block: CO₂ avoided (tons), charge sessions (count), partner countries (count).
- Short paragraph on circular-economy positioning.
- No stock photos of forests.

**Acceptance:**
- Renders 3 metric tiles, each with a numeric value and a label.
- Numbers are not generated client-side per render (no `Math.random`).
- Paragraph uses semantic `<p>`, not `<div>`.

### 4. FAQ

- Three questions, accordion pattern, keyboard-accessible:
  1. ¿Qué tipos de cargadores ofrecen?
  2. ¿Son compatibles con todos los vehículos eléctricos?
  3. ¿Cómo gestionan la garantía y el soporte?

**Acceptance:**
- Each question is a `<button>` that expands/collapses an answer panel.
- `aria-expanded` toggles on click and on Enter/Space.
- Tab order visits each question once.

### 5. Certifications

- Eight-logo grid: CB, CE, IEC, UN38.3, RoHS, FCC, TÜV, UKCA.
- Subhead: "Homologado para venta en Europa, Reino Unido y Norteamérica."
- Mock SVG placeholders allowed; one per certification.

**Acceptance:**
- Renders 8 logos.
- Every logo has a descriptive `aria-label` or visible text label.
- Grid is responsive (4×2 on desktop, 2×4 on mobile — verified via `Section` primitive).

### 6. Contact

- Newsletter signup: email input + submit, accessible label.
- Contact form: name, email, organization, message, legal-consent checkbox.
- Footer block: phone, email, Instagram, LinkedIn, copyright, legal page links.

**Acceptance:**
- Every form input has an associated `<label htmlFor>`.
- Submit buttons have visible text (no icon-only submit).
- The footer renders inside a `<footer>` landmark.

## Constraints (global, every Worker must respect)

- Each Section lives at `src/sections/<id>/` and owns nothing outside.
- Imports allowed only from `@/design-system/*`, `react`, and `next/*`.
- Every Section ships with a colocated `*.test.tsx`.
- Use the `Heading`, `Button`, `Card`, and `Section` primitives — do not reimplement them locally.
- No external UI library.
- Default to server components. Add `"use client"` only on the smallest interactive subcomponent.
