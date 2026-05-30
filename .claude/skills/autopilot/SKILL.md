---
name: autopilot
description: >-
  Drive autonomously toward a stated vision until it is actually met, instead of
  doing one round and stopping. Use when the user says things like "keep going
  until it's done", "one-shot this", "build this out without me re-prompting",
  "hit the vision", "autopilot", or otherwise wants sustained autonomous
  execution against a goal rather than a single-step answer. Turns a fuzzy vision
  into a verifiable definition-of-done, confirms it once, then grinds: implement →
  verify → commit → repeat, pausing only at milestones, when blocked, or before
  anything irreversible.
---

# Autopilot

Your job is to **drive a fuzzy vision all the way to "done" with minimal re-prompting.**
The user is tired of babysitting prompts. They point you at a goal; you make it real.

Autonomy fails for two reasons, and this skill exists to prevent both:
1. **No target** — "the vision" is fuzzy, so there's no way to know when it's met.
2. **No self-correction** — work is marked done without ever being checked.

So the whole discipline is: **make the target explicit and checkable, then loop until every check is green.**

---

## The engine

This skill is the *discipline*. The *engine* that keeps it running without re-prompting is
the `/loop` skill in autonomous mode. The intended invocation is:

```
/loop autopilot <the vision>
```

Each loop iteration you do ONE meaningful unit of progress (see The Loop below), update the
ledger, and either schedule the next iteration or stop. If invoked WITHOUT `/loop` (just
`autopilot <vision>`), still follow the same lifecycle — just keep working across turns until a
stop condition, and tell the user they can wrap you in `/loop` for unattended runs.

---

## Lifecycle

### 1. Crystallize the vision  → `VISION.md`
Before building anything, convert the vision into a written **definition-of-done**.
Create `VISION.md` at the repo root with:

- **Vision** — one paragraph restating the goal in your words.
- **Acceptance criteria** — a numbered checklist of concrete, testable statements. Each is
  small enough to finish in roughly one iteration. Each has:
  - `id` (e.g. `AC-03`)
  - `statement` — what must be true
  - `verify` — exactly how it's confirmed:
    - a **runnable check** wherever possible (a command, a test, a build, a script that exits 0), OR
    - **self-assessed** for genuinely subjective things (prose quality, UX feel) — these get done by you and explicitly flagged **`[review]`** for the user.
  - `status` — `todo | doing | done | blocked`
- **Milestones** — group criteria into natural review boundaries (e.g. per feature/topic).
- **Guardrails** — anything the user said is off-limits or must be confirmed.

Keep a machine-readable ledger too: a `## Ledger` section (or `VISION.md` table) listing each
criterion id + status, so progress survives context resets. Update it as the single source of truth.

### 2. Spec gate (confirm ONCE)
Show the user the criteria + milestones and get a one-time sign-off. This is the only mandatory
upfront pause. Adjust per their feedback, then proceed autonomously. Do **not** re-confirm the
whole spec again later — only checkpoint at milestones.

### 3. The loop
Repeat until done:
1. Pick the next `todo` criterion (respect dependencies; go in milestone order).
2. Set it `doing`. Implement the smallest change that satisfies it.
3. **Verify** — run its `verify` check. For `[review]` criteria, self-assess honestly.
4. Only mark `done` when the check is green. If it fails, fix and re-verify.
5. **Commit** — one focused commit per green criterion (message references the id), so every
   step is a safe rollback point.
6. Update the ledger. Move on.

### 4. Milestone checkpoints
When all criteria in a milestone are `done`, **pause** and give the user a tight summary: what
shipped, anything flagged `[review]`, and what's next. Continue after they look (in `/loop`
autonomous mode, a brief pause + continue is fine; surface review items clearly).

### 5. Stuck handling
If a criterion's check keeps failing, make a **bounded number of attempts (default 3)** with
genuinely different approaches. If still failing: set it `blocked`, record what you tried and the
specific obstacle, and **stop and ask the user** rather than thrashing. Don't silently skip.

### 6. Stop conditions
- **Done:** every criterion is `done` → stop, summarize, and report. Don't invent new scope.
- **Blocked:** a criterion is stuck after bounded retries → stop and ask.
- **Ambiguous:** a real decision the spec doesn't answer and you can't infer a sensible default
  for → stop and ask (use AskUserQuestion). Prefer sensible defaults over interrupting for trivia.

---

## Hard guardrails (always, no exceptions without explicit OK)

- **Never do irreversible or outward-facing actions unattended:** file/dir deletion, `git push`,
  deploys, publishing, sending messages, external API calls with side effects, spending money.
  These require an explicit go-ahead from the user, every time.
- **Commit, don't push.** Local commits are your safety net; pushing is the user's call.
- **Verify before claiming done.** A criterion is only `done` when its check actually ran green
  (or, for `[review]` items, you honestly self-assessed and flagged it). Never report success you
  didn't verify.
- **Keep the ledger truthful.** It reflects what's actually verified, not what you intend.
- **Don't expand scope.** Build the agreed spec. New ideas go to a "Possible follow-ups" list for
  the user, not into the autonomous run.

---

## Output discipline

Between iterations, keep the user oriented with short status lines, not walls of text: what you
just verified, what's next, and anything needing their eye. Save the detail for `VISION.md` and
commit messages.
