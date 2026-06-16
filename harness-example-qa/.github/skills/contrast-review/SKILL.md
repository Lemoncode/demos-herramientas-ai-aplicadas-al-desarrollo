---
name: contrast-review
description: Review frontend code changes for color contrast accessibility issues against WCAG 2.1 AA and AAA thresholds (SC 1.4.3, 1.4.6, 1.4.11, 1.4.1).
compatibility: claude-code
metadata:
  workflow: github-jira-qa
  reference: https://webaim.org/articles/contrast/
---

## Purpose

Use this skill when the PR diff includes changes to colors, backgrounds, text styles, UI components, icons, charts, or design tokens.

## WCAG contrast requirements

### Text contrast — SC 1.4.3 (AA) and 1.4.6 (AAA)

| Text type | AA minimum | AAA minimum |
|-----------|-----------|-------------|
| Normal text | **4.5:1** | 7:1 |
| Large text | **3:1** | 4.5:1 |

**Large text definition:**
- 18pt (≈ 24px) or larger, any weight.
- 14pt bold (≈ 18.67px bold) or larger.

Do not round up. A ratio of 4.47:1 does **not** pass 4.5:1 AA.

### Non-text contrast — SC 1.4.11 (AA)

UI components (inputs, buttons, checkboxes, focus rings, sliders) and informational graphics (icons, charts, diagrams) must have **at least 3:1** contrast against adjacent colors.

This applies to:
- Input borders against background.
- Focus ring against adjacent background.
- Icon fill or stroke against adjacent background when the icon conveys meaning.
- Chart lines, bars, segments when they carry data.
- Toggle, radio and checkbox visuals in unchecked state.

### Use of color — SC 1.4.1 (A)

Color alone must never be the sole means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.

Check for:
- Error states shown only in red without an icon or text label.
- Required fields marked only with color.
- Charts that distinguish categories by color alone with no pattern, label or legend.
- Status indicators (green/red) with no accessible alternative.

## Exceptions — do not flag these

- **Disabled / inactive UI** — elements in a disabled state are exempt from contrast requirements (SC 1.4.3 exception).
- **Purely decorative content** — images or backgrounds that carry no information.
- **Logotypes and brand marks** — text within logos or brand names.
- **Incidental text** — text in an image that is not important to the content.

## Review method

1. Identify all color-related changes in the diff: CSS custom properties, Tailwind classes, inline styles, design token references, SVG fill/stroke values.
2. For each change, determine what element it applies to (text, background, border, icon, chart).
3. Classify the element: normal text, large text, UI component, or graphic.
4. Estimate or calculate the contrast ratio between foreground and background.
   - If exact hex values are available, calculate the ratio using the WCAG relative luminance formula.
   - If values come from design tokens or CSS variables not resolved in the diff, flag as "cannot verify — token value unknown".
5. Apply the correct threshold from the table above.
6. Flag failures and near-misses (within 0.5 of a threshold).
7. Check 1.4.1 for color-only communication patterns.

## WCAG relative luminance formula (for inline calculation)

For an sRGB color `(R, G, B)` in 0–255:

```
c_lin = c/255
if c_lin <= 0.04045: c = c_lin / 12.92
else: c = ((c_lin + 0.055) / 1.055) ^ 2.4

L = 0.2126 * R_lin + 0.7152 * G_lin + 0.0722 * B_lin

ratio = (L_lighter + 0.05) / (L_darker + 0.05)
```

## Output format

### Blocking contrast issues

List each failure with:
- Element and context (e.g. "Button label on primary background").
- Colors involved (hex or token name).
- Estimated ratio.
- Required ratio and criterion.
- Suggested fix.

### Non-blocking contrast risks

List near-misses or cases where the ratio cannot be verified because token values are unresolved.

### Color-only communication issues

List any SC 1.4.1 violations found.

### Cannot verify

List cases where color values depend on runtime theme, CSS variables not resolved in the diff, or third-party components whose styles are not visible.

### Manual QA scenarios

- [ ] Open the changed UI in Chrome DevTools → Rendering → Emulate vision deficiencies (Protanopia, Deuteranopia, Tritanopia, Achromatopsia). Verify information is still distinguishable.
- [ ] Use the WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/) with the exact colors to confirm ratios.
- [ ] Tab through all changed interactive elements and verify the focus ring has at least 3:1 contrast against its background.
- [ ] Check disabled states are visually distinct but understand they are exempt from contrast minimums.
- [ ] If charts or data visualizations changed, verify each series is distinguishable without relying on color alone.

### Suggested PR comments

Provide precise file/line references for each finding, ready to post as inline GitHub PR comments.
