---
name: sync-translations
description: Carry edits made to Cohort help pages in one language over to the other two (uz/ru/en), keeping structure identical and UI labels verbatim from the product catalogs. Use after a page was changed in one locale, or when pnpm check:i18n reports missing pages.
argument-hint: "[page path, e.g. ru/admin/students/add-a-student.mdx] — defaults to pages changed on this branch"
---

# Sync translations

Target: $ARGUMENTS

## 1. Find what changed

- If a path was given, that file is the source.
- Otherwise run `git diff --name-only main...HEAD -- uz ru en snippets` and
  `git status --porcelain -- uz ru en snippets`. For each changed file, the locale that
  was edited is the source. If the same page was edited in two locales, ask the user
  which one wins.
- Also run `pnpm check:i18n` and include any page it reports missing.

## 2. Update the counterparts

For each source file, open the same relative path in the other two locales and:

- Apply only the change: the added step, the rewritten paragraph, the removed callout.
  Don't rewrite text that didn't change in the source.
- Keep the structure identical: same headings, same number of `<Step>`s, same components
  in the same order, same frontmatter keys.
- Swap locale-bound paths: `/uz/…` links, `/images/uz/…` and `/snippets/uz/…` become the
  target locale's.
- UI labels: copy from `../cohort-ui/packages/i18n/src/messages/<locale>.ts`. Never
  translate a label yourself.
- Terms: follow `contributing/glossary.md`.
- If the source added a screenshot, add the same `<Frame>` pointing at the target locale's
  path, and list the screenshot as one to capture if the file doesn't exist yet.

For a page that's missing entirely in a locale, write it in full from the source.

## 3. Navigation

If the change added, moved or renamed a page, make the same change in every
`navigation.languages` entry in `docs.json`. Translate new group labels.

## 4. Verify and report

Run `pnpm check` and fix what it reports. Then list the files updated, the screenshots
still to capture, and remind the user that the uz and ru changes need a fluent speaker's
review.
