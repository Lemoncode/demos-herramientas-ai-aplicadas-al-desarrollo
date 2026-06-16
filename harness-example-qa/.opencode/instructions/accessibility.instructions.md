---
applyTo: "**/*.{tsx,jsx,html,css,scss}"
---

For frontend files, review accessibility carefully:

- Prefer semantic HTML.
- Buttons must be buttons; links must navigate.
- Inputs must have accessible labels.
- Validation errors must be announced and associated with fields.
- Modal/dialog changes must handle focus.
- Icon-only buttons need accessible names.
- Do not add ARIA when native HTML solves the problem.
