# CLAUDE.md

Guidance for Claude Code (and any AI assistant) working in this repository.

**cohort-docs** is the customer-facing help center for **Cohort**, a SaaS for running
education centers in Uzbekistan. It is a [Mintlify](https://mintlify.com/docs) site in
three languages: **uz** (default), **ru**, **en**. Readers are the people using the
product: center owners, admins and managers, teachers, and students. None of them are
technical.

The product lives in two sibling repos, which you can read but must never edit:
`../cohort-ui` (the apps and their UI text) and `../cohort-be` (API, business rules, server
messages).

---

## Working agreement

- **The product is the source of truth.** Document only what a customer can actually do
  in the shipped apps. Read the screen's code before describing it. Never write from
  memory, from roadmap docs, or from what a feature "probably" does. If the code and a
  backend doc disagree, the code wins, because the docs describe what the customer sees.
- **UI labels are quoted verbatim** from the product catalogs for that locale, in
  **bold**, and bold is used for nothing else. See
  [contributing/glossary.md](contributing/glossary.md).
- **Every change lands in all three languages at once.** A page, nav entry, snippet or
  screenshot never exists in only one locale. Mintlify 404s when a reader switches
  language on an untranslated page.
- **`pnpm check` must pass** before you say you're done.
- **Never touch `../cohort-ui` or `../cohort-be`.** If the product looks wrong (a bug, an
  untranslated label, a dead button), tell the user instead of documenting around it.
- **Never invent screenshots**, and never use real customer data in examples. Use
  obviously fake names and `+998 90 123 45 67`-style numbers.

### Stop and ask the user before

- Adding a new tab or top-level section, or changing the IA rules below.
- Changing branding, theme, navbar or footer in `docs.json`.
- Renaming, moving or deleting a published page (it needs redirects).
- Documenting anything in the "Known product gaps" list, or anything you're unsure is live.
- Adding a dependency.

---

## Where to look things up

| Question                                    | Look in                                                                           |
| ------------------------------------------- | --------------------------------------------------------------------------------- |
| Which screens exist, what they do           | `../cohort-ui/apps/<app>/src/router.tsx`, then `src/features/<area>/`             |
| Staff console sidebar, who sees each item   | `../cohort-ui/apps/admin/src/layouts/nav.ts` (the permission is on each item)      |
| Exact UI labels                             | the catalogs, see [contributing/glossary.md](contributing/glossary.md)            |
| Server error messages shown to users        | `../cohort-be/src/i18n/{uz,ru,en}/errors.json`                                    |
| Business rules (limits, what happens after) | `../cohort-be/docs/business-rules/*.md`, `../cohort-be/docs/project-overview.md`  |
| What each role can do by default            | `../cohort-be/src/infra/database/seeders/role-permissions.seeder.ts`              |

Apps: `admin` = Staff console (admin.cohort.uz, owner/admin/manager), `teacher` = Teacher
console (teach.cohort.uz), `student` = Student console (student.cohort.uz).
Not documented: `internal-platform` (Cohort staff only) and `parent` (a placeholder).

### Known product gaps (checked 2026-10-01; re-verify before relying on any of these)

These look like features in code or backend docs but are not available to customers. Don't
document them as working:

- Only **SMS** notifications are delivered. Telegram, email and push are not
  (`DISPATCHABLE_CHANNELS` in `cohort-be/src/domain/communication/entities/notification-enums.ts`).
- Students can't pay online. Click, Payme and Uzum are payment *methods* that staff record
  by hand.
- There are no screens to create assessments or report cards. Teachers give per-lesson marks.
- There's no self sign-up and no self-service password reset.
- Disabled or not-yet-wired controls:
  - invoice detail: send reminder and download PDF
  - student actions menu: send message and create invoice
  - staff: send message and the Activity tab
  - the header notification bell
- The Teacher console shows attendance statuses (Present/Absent/Late/Excused) in English in
  every language. It's a known bug, so don't quote or screenshot those labels until it's fixed.

---

## Repository layout

```
docs.json            Mintlify config + navigation (one entry per language)
uz/ ru/ en/          pages — identical relative paths in each locale
  index.mdx          help center home
  getting-started/   for everyone: apps and roles, signing in
  admin/<area>/      Staff console, one folder per sidebar item
  teacher/<area>/    Teacher console
  student/<area>/    Student console
snippets/<locale>/   reusable MDX blocks, same filenames in every locale
images/<locale>/     screenshots, mirroring page paths; images/brand/ = logo, favicon
contributing/        style guide, glossary, screenshot + translation guides, page templates
scripts/             check-i18n.mjs (locale parity), check-labels.mjs (labels vs product)
```

`contributing/`, `scripts/`, `CLAUDE.md` and `README.md` are not published
(`.mintignore`, plus Mintlify's defaults). Anything else with `.md`/`.mdx` **is** published.

### Navigation rules

- **Tabs = apps**, labelled with the app's name from its sign-in screen (`auth.staffConsole`,
  `auth.teacherConsole`, `auth.studentConsole`), plus a first "Get started" tab. Add an app's
  tab only once its first page exists.
- **Groups = sidebar items.** Inside an app tab, one group per sidebar item, in the app's
  sidebar order, labelled with the exact sidebar label (`nav.item.*`) for that locale.
- **Folders and slugs are English kebab-case**, identical in every locale:
  `admin/students/add-a-student.mdx`. The folder is the sidebar item (`students`,
  `staff`, `courses`, `rooms`, `groups`, `schedule`, `invoices`, `payments`, `fee-plans`,
  `discounts`, `expenses`, `payroll`, `notifications`, `branches`, `leads`, `dashboard`).
- The three `navigation.languages` entries list the same pages in the same order. Only
  tab and group labels differ.

---

## Writing pages

Full rules: [contributing/style-guide.md](contributing/style-guide.md). Templates:
[contributing/templates/](contributing/templates/). The essentials:

- One page = one type (how-to, concept, troubleshooting, reference) and one task.
- Frontmatter `title` and `description` in the page's language, always.
- Links are root-relative with the locale: `/ru/getting-started/sign-in`. Never link into
  another locale, and never use relative paths.
- Uzbek uses `ʻ` (U+02BB) in *oʻ/gʻ* and `ʼ` (U+02BC) in *maʼlumot*. Never type a plain `'`,
  except inside a quoted server error message, which uses `'`. Copy, don't retype.
- Who can do a task: default roles in plain text, then `<RoleHint />` from
  `/snippets/<locale>/role-hint.mdx`. Don't put searchable content in snippet props:
  Mintlify renders them client-side, so search and the AI assistant don't see them.
- Components in use: `Steps`, `Tabs`, `AccordionGroup`, `Note`/`Tip`/`Warning`, `Frame`,
  `CardGroup`/`Card`. Icons are [Lucide](https://lucide.dev/icons) names, the same set as
  the product. For anything else, check the Mintlify docs
  (https://www.mintlify.com/docs/llms.txt) before using it. Don't guess component props.
- Screenshots: rarely, per locale, demo data only. See
  [contributing/screenshots.md](contributing/screenshots.md).
- Translation: write each locale natively. See
  [contributing/translation.md](contributing/translation.md). Flag that uz and ru need a
  fluent speaker's review.

---

## Commands

Package manager is **pnpm**. Node 22 (`.nvmrc`).

```bash
pnpm install          # installs the pinned Mintlify CLI (mint)
pnpm dev              # local preview at http://localhost:5179
pnpm check            # everything below except a11y; must pass
pnpm check:i18n       # uz/ru/en parity: pages, nav, snippets, screenshots, cross-locale links
pnpm check:labels     # every **bold** label exists in the product catalogs (needs ../cohort-ui)
pnpm check:build      # mint validate (strict build)
pnpm check:links      # mint broken-links, incl. anchors, redirects, snippets
pnpm check:a11y       # contrast + missing alt text
pnpm format           # mint format — rewrites MDX in place; run on a clean tree
```

CI (`.github/workflows/docs-checks.yml`) runs `pnpm check` on every PR. There is no
`../cohort-ui` in CI, so `check:labels` skips there. Run it locally.

---

## Workflows

- **New page:** `/new-article <topic>` (`.claude/skills/new-article`).
- **Page changed in one language:** `/sync-translations [path]`.
- **Rename or move a page:** move it in all three locales, update `docs.json`, and add a
  redirect per locale under `redirects` in `docs.json` (`/uz/old` → `/uz/new`, and the
  same for `/ru` and `/en`). Then run `pnpm check`.
- **After a product release:** run `pnpm check:labels` to catch renamed labels, and check
  whether any "Known product gaps" item has shipped.
