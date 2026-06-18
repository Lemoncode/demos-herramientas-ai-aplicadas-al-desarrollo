# Color contrast review instructions

Apply this when a PR diff includes changes to colors, backgrounds, design tokens, SVG fill/stroke or Tailwind color classes.

## WCAG contrast requirements

### Text contrast — SC 1.4.3 (AA) and 1.4.6 (AAA)

| Text type | AA minimum | AAA minimum |
|-----------|-----------|-------------|
| Normal text | **4.5:1** | 7:1 |
| Large text | **3:1** | 4.5:1 |

Large text: 18pt (≈ 24px) any weight, or 14pt bold (≈ 18.67px). Do not round up — 4.47:1 does not pass 4.5:1.

### Non-text contrast — SC 1.4.11 (AA)

UI components and informational graphics must have **at least 3:1** contrast against adjacent colors.

Applies to: input borders, focus rings, meaningful icons, chart elements, toggles and checkboxes in unchecked state.

### Use of color — SC 1.4.1 (A)

Color alone must not be the sole means of conveying information.

Flag: error states in red only, required fields by color only, chart categories by color only, status indicators without text or icon alternative.

## Exceptions — do not flag

- Disabled / inactive elements (exempt from SC 1.4.3).
- Purely decorative images or backgrounds.
- Logotypes and brand marks.
- Incidental text in images.

## Review method

1. Identify all color-related changes: CSS properties, Tailwind classes, inline styles, design tokens, SVG fill/stroke.
2. Determine what each applies to: text, background, border, icon, chart.
3. Classify: normal text / large text / UI component / graphic.
4. Calculate or estimate the contrast ratio.
   - Known hex values: use the WCAG luminance formula below.
   - Unknown tokens or CSS variables: flag as "cannot verify — token value unknown".
5. Apply the correct threshold. Flag failures and near-misses (within 0.5).
6. Check SC 1.4.1 for color-only patterns.

## WCAG relative luminance formula

```
c_lin = c/255
if c_lin <= 0.04045: c_lin = c_lin / 12.92
else: c_lin = ((c_lin + 0.055) / 1.055) ^ 2.4

L = 0.2126 * R_lin + 0.7152 * G_lin + 0.0722 * B_lin

ratio = (L_lighter + 0.05) / (L_darker + 0.05)
```

## Output sections

### Blocking contrast issues
For each failure: element + context, colors (hex or token), estimated ratio, required ratio + criterion, suggested fix.

### Non-blocking contrast risks
Near-misses and unresolved token values.

### Color-only communication issues
SC 1.4.1 violations.

### Cannot verify
Runtime themes, unresolved CSS variables, third-party component styles.

### Manual QA scenarios
- [ ] Chrome DevTools → Rendering → Emulate vision deficiencies (Protanopia, Deuteranopia, Tritanopia, Achromatopsia).
- [ ] Verify all changed colors with WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/).
- [ ] Tab through changed interactive elements — confirm focus ring has ≥ 3:1 contrast.
- [ ] Disabled states visually distinct but exempt from contrast minimums.
- [ ] Charts/visualizations distinguishable without color alone.
