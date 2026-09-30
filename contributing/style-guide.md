# Style guide

Who reads this help center: people who run or work at an education center in Uzbekistan —
owners, administrators, managers, teachers — and their students. They are not technical,
they are often busy, and many read on a phone. Write so that someone can follow a page
with the app open in the other hand.

## Page types

Every page is exactly one of these. Start from the matching file in [templates/](templates/).

| Type            | Answers                          | Title form (en / ru / uz)                                               |
| --------------- | -------------------------------- | ----------------------------------------------------------------------- |
| How-to          | "How do I …?" — one task         | "Add a student" / "Добавление ученика" / "Oʻquvchi qoʻshish"            |
| Concept         | "What is …? How does … work?"    | "Branches" / "Филиалы" / "Filiallar"                                    |
| Troubleshooting | "Why doesn't … work?"            | The symptom: "I can't sign in" / "Не удаётся войти" / "Tizimga kira olmayapman" |
| Reference       | "Which …?" — tables to look up   | "Roles and permissions" / "Роли и права" / "Rollar va ruxsatlar"        |

One task per how-to page. If a page needs a second `## Steps`, it is two pages.

## Voice

- Address the reader directly. **uz:** formal *siz*, imperative plural (*bosing*, *tanlang*).
  **ru:** *вы* (lowercase), imperative (*нажмите*, *выберите*). **en:** plain imperative
  (*select*, *enter*).
- Short sentences. One action per step.
- Say what the reader sees, not how the system works inside. Never write *tenant*, *API*,
  *endpoint*, *JWT*, *RLS*, *database*, *seed* — say *education center*, *branch*, *account*.
- No marketing language. The reader already bought the product.

## UI labels

- Put every UI label in **bold**, copied exactly from the product's catalog for that
  language (see [glossary.md](glossary.md) for where to look). Never paraphrase a label.
- Bold is only for UI labels. For emphasis, use *italics*. `pnpm check:labels`
  checks every bold phrase against the product catalogs, so bold used for anything else
  shows up as a broken label. It proves the label exists somewhere in the product, not
  that it's the right one for that screen. That part is still on you.
- Leave out the required-field asterisk the UI adds: the label `Ism *` is written **Ism**.
- Icon-only buttons have no visible label. Describe them instead ("select the ⋯ button")
  and don't bold them.
- Quote error messages exactly as they appear, inside quotes and not bold. Many come from
  the backend, whose Uzbek text uses a plain `'` where the UI uses `ʻ`
  ("noto'g'ri", not "notoʻgʻri"), so copy them rather than retyping.
- Navigation paths use an arrow: **Sozlamalar → Filiallar**.
- Use *select* / *tanlang* / *выберите* for clicking or tapping, since readers may be on touch
  screens. Use *enter* / *kiriting* / *введите* for typing.

## Numbers, money, dates

Match the app, which formats them the same way everywhere:

- Money: `1 500 000 UZS` (space as the thousands separator, `UZS` after the amount).
- Dates: day, short month, year — `15 Jun 2024` — with the month in the page's language,
  spelled the way the app shows it.
- Phone numbers: `+998 90 123 45 67`. Only use obviously fake numbers in examples.

## Callouts

Use them rarely, or readers stop seeing them.

| Component   | Use for                                                                   |
| ----------- | ------------------------------------------------------------------------- |
| `<Note>`    | Context the reader needs, like who can do this or when a change applies    |
| `<Tip>`     | A faster or better way to do the same thing                               |
| `<Warning>` | Anything irreversible, anything touching money (invoices, payments, payroll) |

Who can do a task goes at the top of a how-to: the default roles in plain text, followed by
the `RoleHint` snippet (`snippets/<locale>/role-hint.mdx`). Don't pass the roles as a
snippet prop. Mintlify renders props in the browser, so they're missing from the HTML that
search engines and the AI assistant read.

## Links

- Always root-relative with the locale prefix: `/uz/admin/students/add-a-student`.
  Mintlify does not support relative links, and a page must never link into another locale.
- Link text says where it goes: "[add a branch](/en/…)", never "click [here](/en/…)".

## Frontmatter

Every page needs `title` and `description`. The description is the search-result
snippet: one sentence, under ~160 characters, in the page's language.

```yaml
---
title: "Add a student"
description: "Create a student profile so you can enroll them in groups and bill them."
---
```

Optional: `sidebarTitle` (shorter sidebar label), `icon` (a [Lucide](https://lucide.dev/icons)
name — the same icon set the product uses), `keywords` (synonyms people search for).

## What not to document

- The internal platform (`internal.cohort.uz`). It is staff-only.
- Screens or features that aren't live for customers yet. Check the product repos first.
- Workarounds for bugs. Report the bug instead.
