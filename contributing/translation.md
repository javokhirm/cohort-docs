# Translation

The help center ships in three languages: **uz** (default), **ru** and **en**, the same
three the product supports.

## The rule: every change lands in all three languages

Mintlify shows a 404 when a reader switches language on a page that doesn't exist in that
language. So a page, nav entry, snippet or screenshot is never added, renamed or removed
in one locale only. `pnpm check:i18n` enforces this, and CI runs it on every PR.

You may *draft* in whichever language you write best. The PR that publishes the page
contains all three.

## Layout

```
uz/admin/students/add-a-student.mdx     ← same relative path…
ru/admin/students/add-a-student.mdx     ← …in every locale
en/admin/students/add-a-student.mdx
```

- File and folder names are English slugs in every locale. They are URLs, and matching
  names are what let the checker pair pages up.
- `docs.json` has one entry per language under `navigation.languages`. The three
  entries list the same pages in the same order. Only the group and tab labels are
  translated.
- Localized snippets live in `snippets/<locale>/` with matching filenames.

## Language-specific rules

**Uzbek (uz)**

- Latin script, the same as the product.
- Use the same apostrophes as the product catalog:
  - `ʻ` (U+02BB) in *oʻ* and *gʻ*: *Oʻquvchi*, *toʻlov*
  - `ʼ` (U+02BC) for the separator in words like *maʼlumot*, *taʼlim*

  A plain `'` looks the same in most fonts, but it breaks search and fails
  `pnpm check:labels`. Copy labels from the catalog rather than typing them.
- The exception is error messages from the server, which use a plain `'`. Quote those
  exactly as they appear (see the style guide).
- Formal register (*siz*).

**Russian (ru)**

- *Вы* lowercase in running text. Use *ё* only where the product catalog does.
- Keep UI labels exactly as the Russian catalog has them, even where you'd phrase it
  differently.

**English (en)**

- US spelling. Sentence case for titles and headings ("Add a student", not "Add A Student").

## Terminology

Use the terms in [glossary.md](glossary.md). They match the product's own translations. If
the product calls something *Guruh*, the docs never call it *Sinf*. When a term is
missing, look it up in the product catalog first, then add it to the glossary in the same
PR.

## Review

Machine translation (including Claude's) is a first draft. Before merge:

- A fluent speaker reads the **uz** and **ru** versions in full.
- Every bold UI label is checked against the product catalog for that language.
- The PR description says who reviewed which language.
