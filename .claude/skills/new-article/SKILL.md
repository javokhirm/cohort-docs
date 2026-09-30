---
name: new-article
description: Write a new customer-facing Cohort help article in uz, ru and en. Researches the real feature in ../cohort-ui and ../cohort-be, writes all three locales from a template, adds the page to docs.json, and runs the checks. Use when asked to document a feature, a screen, or a task.
argument-hint: "<what to document, e.g. 'how an admin adds a student'>"
---

# New help article

Topic: $ARGUMENTS

Read `CLAUDE.md` and `contributing/style-guide.md` first if you haven't this session.

## 1. Scope it

- Decide the **audience** (which app and role), the **page type** (how-to, concept,
  troubleshooting, reference), and the **section** it belongs in. See the IA table in
  `CLAUDE.md`.
- Check the page doesn't already exist: search `uz/` for the topic. If it does, update that
  page instead of creating a second one.
- Pick an English kebab-case slug. It is the same in all three locales.

## 2. Research the real behavior (read-only)

Never write from memory or from what the feature "probably" does.

1. **Screen and flow:** find the route and components in `../cohort-ui/apps/<app>/src/`.
   Note what the reader clicks, which fields are required, validation messages, and what
   success and empty states look like. If the route is missing or is a placeholder, the
   feature isn't shipped. Stop and tell the user.
2. **Labels:** look up every label you'll quote in
   `../cohort-ui/packages/i18n/src/messages/{uz,ru,en}.ts` and copy it verbatim for each
   locale. Confirm terms against `contributing/glossary.md`.
3. **Rules:** read the matching `../cohort-be/docs/business-rules/*.md` for behavior
   (limits, what happens after an action, who is allowed). Restate it in plain words.
   Never mention internal terms.
4. **Permissions:** if the action is permission-gated, find the permission's UI label so
   the `RequiresPermission` snippet can name it.

Write down anything you couldn't confirm. Ask the user rather than guess.

## 3. Write all three locales

- Copy `contributing/templates/<type>.mdx` to `uz/…`, `ru/…` and `en/…` at the same
  relative path. Write natively in each language. Don't translate word for word from
  English.
- Snippet imports and image paths use the page's own locale (`/snippets/ru/…`,
  `/images/ru/…`).
- If a screenshot is warranted (see `contributing/screenshots.md`), don't invent one. Leave
  `{/* TODO screenshot: <what to capture> */}` where it goes and list it in your report.

## 4. Add it to the navigation

In `docs.json`, add the page to the same group, at the same position, in all three
`navigation.languages` entries. For a new group, translate the group label in each locale.

## 5. Verify

Run `pnpm check`. Fix everything it reports. If `pnpm check:labels` is available (it needs
`../cohort-ui`), run it too.

## 6. Report back

- The files you created or changed.
- Any label or rule you couldn't confirm, and open questions.
- Screenshots to capture, if any.
- A reminder that the uz and ru text needs a fluent speaker's review before merge.
