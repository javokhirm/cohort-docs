# cohort-docs

The Cohort help center: customer-facing guides for education center staff, teachers
and students, in Uzbek, Russian and English. Built with [Mintlify](https://mintlify.com).

## Quick start

```bash
nvm use            # Node 22
corepack enable    # provides the pinned pnpm
pnpm install
pnpm dev           # http://localhost:5179
```

Keep `cohort-ui` and `cohort-be` checked out next to this repo (`../cohort-ui`,
`../cohort-be`). Writers and Claude read them to get labels and behavior right, and
`pnpm check:labels` needs `cohort-ui`.

## Where things go

| Path                  | What                                                      |
| --------------------- | --------------------------------------------------------- |
| `uz/`, `ru/`, `en/`   | Pages. Same file at the same path in all three.            |
| `docs.json`           | Site config and navigation, one block per language.        |
| `snippets/<locale>/`  | Reusable blocks, e.g. `role-hint.mdx`.                      |
| `images/<locale>/`    | Screenshots, per language. `images/brand/` for the logo.   |
| `contributing/`       | How to write: style guide, glossary, screenshots, translation, templates. Not published. |
| `scripts/`            | The i18n and label checks. Not published.                  |

## Adding a page

1. Copy a template from `contributing/templates/` to `uz/…`, `ru/…` and `en/…`,
   using the same English slug in each.
2. Add it to the same group in all three `navigation.languages` entries in `docs.json`.
3. Run `pnpm check`.

With Claude Code, `/new-article how an admin adds a room` does all of this. It researches
the real screen in `cohort-ui` first. `/sync-translations` carries an edit in one
language over to the other two.

## Checks

`pnpm check` runs:

- **`check:i18n`**: every page, nav entry, snippet and screenshot exists in all three
  languages, with no links or images pointing at another language.
- **`check:labels`**: every **bold** UI label matches the product's catalogs (skipped
  when `../cohort-ui` is missing).
- **`check:build`** and **`check:links`**: Mintlify's strict build and link checks.

CI runs the same on every pull request. `pnpm check:a11y` checks contrast and alt text.

## Publishing (one-time setup)

1. In the [Mintlify dashboard](https://app.mintlify.com), create the project and
   connect this GitHub repo with the Mintlify GitHub app. Pushes to the default branch
   then deploy, and pull requests get preview links.
2. Add the custom domain (e.g. `help.cohort.uz`) under the dashboard's domain settings.
