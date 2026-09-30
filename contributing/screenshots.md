# Screenshots

Default: **no screenshot.** A bold UI label and a clear step are enough for most tasks,
and every screenshot has to be captured three times (uz/ru/en) and re-captured whenever
the screen changes.

Add one only when:

- the thing to click is hard to find from the text alone (an icon-only button, a menu
  hidden in a row), or
- the layout itself is the point (what a report or a schedule view shows).

Never use a screenshot to replace text. The steps must work without the image.

## Where files go

```
images/<locale>/<section>/<page-slug>-<what>.png
```

The same filename in every locale. The page `uz/admin/students/add-a-student.mdx` uses
`/images/uz/admin/add-a-student-form.png`, and the ru and en pages use the same path with
`ru` and `en`. `pnpm check:i18n` warns when a screenshot exists in one locale but not the
others, and fails if a page points at another locale's screenshot.

Brand assets and language-neutral images go in `images/brand/`.

## How to capture

1. **Use demo data only.** Never capture a real customer's center — names, phone numbers
   and payments are personal data. Use a local or staging center filled with made-up data.
2. **Switch the app to the page's language** before capturing, so labels match the text.
3. Light theme, browser zoom 100%, window about 1440×900.
4. Crop to the part that matters, plus enough surrounding UI to find it. No full-screen
   captures of an empty page.
5. Save as PNG. Keep files under ~300 KB (compress with ImageOptim or `pngquant` if needed).
   Mintlify's hard limit is 20 MB, but large images slow the page down on mobile.

## How to embed

```mdx
<Frame>
  <img
    src="/images/en/admin/add-a-student-form.png"
    alt="The Add student form with the first name, last name and phone fields"
  />
</Frame>
```

- Always wrap it in `<Frame>`, and always write `alt` in the page's language. Describe
  what the image shows. `pnpm check:a11y` flags missing alt text.
- Paths are root-relative (`/images/…`). Mintlify does not support `./` image paths.
- Add `caption="…"` to `<Frame>` only if the image needs explaining. Usually that
  means the step text needs fixing instead.
