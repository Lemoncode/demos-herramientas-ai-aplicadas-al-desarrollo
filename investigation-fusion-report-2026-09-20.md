> **Update (same day, follow-up pass):** After the jury run below, I did a
> direct primary-source verification pass (WebFetch/WebSearch against the
> actual Claude Code docs, opencode docs, and the `github/spec-kit` repo)
> to resolve the 3 "flag-for-human" claims and apply the well-evidenced
> fixes as real file edits. See **"Follow-up: direct verification & fixes
> applied"** and **"Root cause: why the jury run struggled"** at the
> bottom of this report. **Files have been edited but not committed.**

# Investigation Fusion Report — Course Material Staleness Audit

**Repo:** demos-herramientas-ai-aplicadas-al-desarrollo
**Date:** 2026-09-20
**Setup:** `cross-opus` — investigators: claude, codex, glm (`nan/glm5.3-flash`), deepseek (`nan/deepseek-v4-flash`) · judge: opus
**Scope:** 16 atomic, checkable claims extracted from `slides/day-1`, `slides/day-2`, `slides/day-3`, `demo-02-spec-kit/README.md`, `RAG-03-langchain-intro-standalone-question/docs/README.md`, and `ci-subagents-claude`/`ci-subagents-opencode` READMEs + workflow files.

## ⚠️ Run status: INCOMPLETE

- **codex failed twice** with a persistent CLI authentication error (`Your access token could not be refreshed because your refresh token was already used. Please log out and sign in again.`) and never produced findings, even after one re-dispatch per the all-required policy. **Only 3 of the 4 designed investigators (claude, deepseek, glm) actually reported.** No claim below reaches true 4-way unanimity — the strongest available agreement is **unanimous-among-3**. Re-run codex after `codex login` if you want the full 4-investigator jury.
- **The `claude` investigator's session was internally unstable.** It spawned unauthorized sub-forks that raced to report completion, producing one *accepted* `worker_done` and three subsequent *rejected* duplicate reports with mutually inconsistent claim tallies. Only the first, accepted report was used as claude's vote; its confidence is treated as reduced.
- **Judge/investigator correlation:** opus (judge) shares the Anthropic model family with the `claude` investigator. Per the skill's judge rule this is a **partial correlation** — annotated below wherever it's load-bearing. The judge explicitly discounted claude's vote whenever it was the lone dissenter.

Treat this sheet as **provisional** pending a clean codex re-run.

## Verdict sheet

| # | Claim (short) | Verdict | Agreement | Action | Notes |
|---|---|---|---|---|---|
| 1 | `context: fork` is Claude-Code-only | **split** | contradictory (2/3 accurate, 1/3 outdated) | flag-for-human | claude+deepseek say accurate; glm says outdated ("VS Code/Copilot adopted it") but the citation wasn't fully captured — judge suspects it may be conflated with claim 5's VS Code source. Verify directly before editing. |
| 2 | Claude Code ships exactly 3 built-in subagents | **outdated/incorrect** | unanimous-among-3 (false), split on exact label | update | All 3 agree Claude Code now ships more than three (claude/deepseek: "6, not 3"; glm: "more than three"). |
| 3 | Claude Code custom agent format & paths | **accurate** | unanimous-among-3 | keep | — |
| 4 | opencode custom agent paths (singular) | **outdated** | unanimous-among-3 | update | Current canonical path is plural `.opencode/agents/` / `~/.config/opencode/agents/`; singular is a back-compat alias only (per opencode.ai/docs/agents, opencode.ai/docs/config). |
| 5 | VS Code custom agents, v1.106 rename, reads `.claude/agents/*.md` | **accurate** | unanimous-among-3 | keep | Confirmed against VS Code v1.106 release notes and custom-agents docs. |
| 6 | Agent hook events + exit codes 0/2 | **accurate** | unanimous-among-3 | keep | (One of claude's *rejected* superseded drafts called this "incorrect for PostToolUse/Notification" — not the official vote, but worth a light sanity-check.) |
| 7 | MCP created by Anthropic | **accurate** | unanimous-among-3 | keep | — |
| 8 | Spec Kit install / `specify init .` | **accurate** | unanimous-among-3 | keep | — |
| 9 | Spec Kit 5-phase short version, agent-agnostic | **outdated** | partial (1/3 accurate, 2/3 outdated) | update | deepseek + glm: Spec Kit's workflow has since gained a `/speckit.converge` phase; claude alone said accurate (discounted by judge as lone dissenter). |
| 10 | Superpowers "14 auto-activating skills" + install list | **unsupported / contradictory** | contradictory | **flag-for-human** | Weakest item on the sheet — the lone "accurate" vote (claude) admits the count was never pinned to an authoritative source; deepseek says outdated; glm's position is unknown (not captured). Judge: "the only genuine contradiction." |
| 11 | `claude-code-action` oauth token + secret name | **accurate** | unanimous-among-3 | keep | — |
| 12 | opencode GitHub Action name + `/oc`/`/opencode` trigger | **accurate** | unanimous-among-3 | keep | — |
| 13 | opencode's "documented default model" is `anthropic/claude-sonnet-4-5` | **unsupported** | unanimous-among-3 (false), split on exact label | **flag-for-human** for replacement text | All 3 agree the claim is false (no documented fixed default). claude says it "dynamically falls back"; deepseek/glm say "unsupported" / resolution is flag > config > last-used > internal priority. The two accounts of the *real* mechanism are mutually incompatible — don't copy either into the fix without re-checking opencode docs directly. |
| 14 | Spec Kit slash-command order (checklist before plan) | **outdated** | partial (2/3 confirmed, glm silent) | update | claude + deepseek both independently found `/speckit.checklist` now runs *after* `/speckit.plan`, not before. glm didn't explicitly confirm or deny — judge treats silence as missing data, not dissent, and rates this "thinly-sourced but undisputed." |
| 15 | Spec Kit generates `api-spec.json` | **outdated/incorrect** | unanimous-among-3 (false), split on exact label | update | All 3 agree current Spec Kit emits a `contracts/` directory, not a fixed `api-spec.json` filename. Substance is settled; only the outdated-vs-incorrect label is unresolved. |
| 16 | LangChain's `invoke`/`stream`/`batch` interface | **accurate** | unanimous-among-3 | keep | — |

## Summary

- **Keep as-is (accurate, unanimous-among-3):** 3, 5, 6, 7, 8, 11, 12, 16 — 8 claims
- **Update (outdated/incorrect, unanimous-among-3 or strong 2/3 majority):** 2, 4, 9, 14, 15 — 5 claims
- **Flag for human (contradictory or unresolved even after judging):** 1, 10, 13 — 3 claims

**Highest-value fixes** (clearest evidence, safest to act on without further verification):
- Claim 4 (`slides/day-2/slides.html`): update opencode agent path to plural `.opencode/agents/`.
- Claim 15 (`demo-02-spec-kit/README.md`): the file-structure diagram should show a `contracts/` directory, not `api-spec.json`.
- Claim 2 (`slides/day-2/slides.html`): Claude Code's built-in subagent count has grown past three — reword to avoid a specific number, or verify the current count directly before publishing an updated figure.

**Needs a human before touching anything:**
- Claim 10 (Superpowers skill count / install list) — no investigator actually pinned this to a citable source; verify against the `obra/superpowers` repo directly.
- Claim 13 (opencode default-model resolution) — two incompatible accounts of the real mechanism; re-check `opencode.ai/docs` directly rather than trusting either investigator's account.
- Claim 1 (`context: fork` exclusivity) — glm's dissent may be a citation mix-up with claim 5; re-verify directly against VS Code/Copilot docs before deciding whether the "Claude-Code-only" framing still holds.

## Process notes (for transparency)

- The scratchpad path used for the frozen claim list was outside the investigators' worktree; opencode's sandbox (glm, deepseek) blocked reads of it behind an interactive permission prompt neither investigator could resolve. Both were re-dispatched with the claim list embedded directly in the task prompt instead of a file reference, which resolved it.
- codex (`gpt-5.6-terra`) never got past its CLI's own token-refresh error on two separate dispatch attempts — this is a local authentication issue, not a documentation-audit finding. Run `codex login` and re-dispatch if a true 4-investigator result is wanted.
- Per the skill's "propose, never apply" rule, no repo files were edited during the jury run itself — see the follow-up section below for what was applied afterward, at explicit request.

---

## Follow-up: direct verification & fixes applied

After the jury finished, I ran my own direct primary-source checks (not
another jury pass) against the actual Claude Code docs, opencode docs, and
the `github/spec-kit` repo (README, `docs/quickstart.md`, and
`templates/commands/*.md` fetched straight from GitHub) to resolve
remaining uncertainty and apply fixes. **Files have been edited; nothing
has been committed.**

### Previously flagged claims, now resolved

| # | Claim | Resolution |
|---|---|---|
| 1 | `context: fork` is Claude-Code-only | **Confirmed still accurate.** Multiple independent sources (including an open `anthropics/claude-code` GitHub issue about the Skill tool not yet honoring `context: fork`) describe it as a Claude-specific frontmatter field with no equivalent shipped by other vendors yet. glm's dissenting "outdated" vote in the jury appears to have been a citation mix-up with the adjacent VS-Code-agents claim (#5). **No edit needed.** |
| 10 | Superpowers "14 auto-activating skills" | **Confirmed outdated.** Counted directly from `obra/superpowers`'s current README Skills Library: 15 skills (Testing: 1, Debugging: 3, Collaboration: 9, Meta: 2). **Fixed**: `14` → `15` in `slides/day-3/slides.html` (both occurrences). The install-target list (Claude Code, OpenCode, Cursor, Gemini CLI, Copilot CLI, Codex, Kimi, Pi, Antigravity, Factory Droid) was independently confirmed accurate against the same README. |
| 13 | opencode's "documented default model" | **Confirmed unsupported/incorrect as originally worded.** opencode's own docs describe a priority-resolution order, not a fixed default: `--model` flag → config file → last-used model → internal fallback. **Fixed** wording in `ci-subagents-opencode/README.md`. |

### New finding the jury missed entirely

None of the 3 investigators flagged this, but direct inspection of
`github/spec-kit`'s current README, `docs/quickstart.md`, and
`templates/commands/` shows **the slash-command naming convention itself
has changed from dot-separated to hyphen-separated**: it's now
`/speckit-constitution`, `/speckit-specify`, `/speckit-plan`,
`/speckit-checklist`, `/speckit-tasks`, `/speckit-analyze`,
`/speckit-implement`, `/speckit-converge` (confirmed verbatim via
`raw.githubusercontent.com/github/spec-kit/main/docs/quickstart.md`) —
**not** the dot-syntax (`/speckit.constitution`, etc.) used throughout
`demo-02-spec-kit/` and `slides/day-3/slides.html`. Anyone following this
demo literally would type commands that no longer exist. This also
independently reconfirms claim #14's step-order finding: the authoritative
"full path" order in `docs/quickstart.md` is `constitution → specify →
clarify → plan → checklist → tasks → analyze → implement → converge` —
checklist after plan, exactly as claude/deepseek reported, plus the
previously-unknown `converge` step at the end.

### Fixes actually applied to the repo (not committed)

1. **`slides/day-2/slides.html`**
   - Subagent list: "Claude Code has built-in subagents (Explore, Plan,
     General-purpose)" → "Claude Code ships 6 built-in subagents — Explore,
     Plan, General-purpose, plus `claude`, `statusline-setup`, and
     `claude-code-guide`" (confirmed via `code.claude.com/docs/en/sub-agents`).
   - opencode custom-agent path: `.opencode/agent/<name>.md` → `.opencode/agents/<name>.md` (plural).
2. **`slides/day-3/slides.html`**
   - "14 auto-activating skills" → "15" (both occurrences).
   - "5-phase workflow: Constitution → Specify → Plan → Tasks → Implement" →
     "6-phase workflow: … Implement ⇄ Converge".
   - "The flow in 5 phases" → "in 6 phases"; added a new Phase 06 (Converge)
     slide matching the existing Phase 01–05 format.
   - All `/speckit.X` command examples → `/speckit-X`.
3. **`demo-02-spec-kit/README.md`** — reordered the workflow (Checklist now
   after Plan), added Converge as Step 9, switched all commands to hyphen
   syntax, and replaced the `api-spec.json` file-structure entry with
   `contracts/` (confirmed via `templates/commands/plan.md`: "Output:
   data-model.md, /contracts/*, quickstart.md").
4. **`demo-02-spec-kit/prompts/`** — renamed `05-plan.md` → `04-plan.md` and
   `04-checklist (optional).md` → `05-checklist (optional).md` to match the
   corrected order; updated the `# Step N` header in each; switched every
   `/speckit.X` reference to `/speckit-X` across all 8 prompt files.
5. **`ci-subagents-opencode/README.md`** — reworded the "documented
   default" claim to describe opencode's actual priority-resolution order.

**Deliberately not done:** I did not write a `prompts/09-converge.md` file
— that's new course content in Aridane's voice, not a documentation
correction, so I left a pointer to Spec Kit's own quickstart instead and
noted the gap in the README rather than fabricating a lesson.

---

## Root cause: why the jury run struggled

Three independent things went wrong, none of them a flaw in the
*classification logic* itself (verdict × agreement, judge adjudication,
"never average away dissent" all worked as designed):

1. **The investigator brief didn't forbid self-forking.** The skill's own
   template (and my first-pass instantiation of it, used for claude and
   codex) never tells the investigator to work solo. Claude Code has an
   `Agent`/Task tool, and the `claude` investigator used it to fan the 16
   claims out to sub-forks. Those sub-forks inherited the same
   orchestration CLI instructions — including the coordinator dispatch
   capability token — and raced each other to call `worker_done`
   independently. Orca correctly accepted only the first one and rejected
   three later, mutually-inconsistent duplicates; the bug is upstream of
   Orca, in a prompt that let sub-forks touch coordination credentials at
   all. I patched this for the glm/deepseek retry ("Do NOT spawn your own
   sub-agents or forks... investigate all claims yourself, sequentially,
   in this one session") but never re-ran claude/codex with the patched
   brief, so claude's vote in this run is real but noisier than it should
   have been.
2. **opencode's sandbox blocked the "pass a path, not a re-summarized
   prompt" guidance.** The frozen claim list lived in the session
   scratchpad, outside the git worktree opencode's investigators run in.
   opencode's permission model requires interactive approval to read
   directories outside its sandbox, and nothing was there to click
   "Allow." Both opencode-backed investigators (glm, deepseek) stalled on
   this until I closed their terminals and re-dispatched with the claim
   list inlined directly into the task spec instead of referenced by path.
   This is a real tension with the skill's own guidance to prefer a path
   reference — for opencode/nan investigators specifically, inlining (or
   staging the artifact inside the worktree) is the safer default.
3. **codex's CLI had a stale, already-used refresh token** on this
   machine, independent of the audit — a `codex login` away from working,
   not a skill or environment-design problem. It failed identically on a
   clean re-dispatch, confirming it wasn't transient.

A secondary, lower-severity issue: `orca orchestration worker-read`
clips oversized transcript payloads, and opencode-backed dispatches only
expose the current terminal *screen* (not full scrollback) as a fallback
source. This meant I collected fuller verbatim citations for some claims
than others and leaned on investigators' self-reported executive
summaries more than the skill's evidence standard ideally wants — a
tooling limitation of this orchestration layer, not the fusion skill's
methodology.

**Net assessment:** the skill's *decision protocol* (freeze → blind
dispatch → classify by agreement → judge splits → report, never average
away dissent) worked exactly as designed and is why the report correctly
flagged 3 claims as unresolved rather than confidently asserting a wrong
answer. The friction was entirely in the surrounding multi-agent CLI
orchestration (Orca + codex + opencode sandboxing), not in the audit
methodology.
