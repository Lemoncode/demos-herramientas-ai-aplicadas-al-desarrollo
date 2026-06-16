---
name: accessibility-review
description: Reviews frontend PRs for accessibility risks.
compatibility: claude-code
metadata:
  workflow: github-jira-qa
---

## Purpose

Use this skill when evaluating a frontend PR for accessibility issues.

## Review Instructions

Focus on frontend changes. Check:
- Semantic HTML.
- Keyboard navigation.
- Focus management.
- Dialog/modal behavior.
- ARIA usage.
- Form labels and error messages.
- Button/link semantics.
- Loading and disabled states.
- Screen-reader friendly dynamic content.
- Accessible names for icons.
- Tests that cover accessibility-critical behavior.

Do not suggest ARIA when native HTML is better.

**Color contrast:** Do not evaluate contrast ratios yourself. If the diff touches colors, backgrounds, design tokens, SVG fill/stroke, or Tailwind color classes, delegate to the `contrast-review` skill and include its findings in your output under a "Color Contrast" subsection.

## Output format

Produce:
1. Blocking accessibility issues.
2. Non-blocking accessibility risks.
3. Color Contrast findings (from contrast-review skill).
4. Manual keyboard and vision test scenarios.
5. Suggested PR comments.
