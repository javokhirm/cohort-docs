#!/usr/bin/env node
// Keeps the uz/ru/en trees in lockstep. Mintlify 404s when a reader switches language on a
// page that has no translation, so every page, nav entry, snippet and localized image must
// exist in all locales. Zero dependencies on purpose: it runs before `pnpm install` in CI.
//
// Usage: node scripts/check-i18n.mjs

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE_LOCALE = 'uz';

const errors = [];
const warnings = [];
const rel = (p) => relative(ROOT, p).split('\\').join('/');

function walk(dir, exts) {
	if (!existsSync(dir)) return [];
	return readdirSync(dir).flatMap((name) => {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) return walk(full, exts);
		return exts.some((e) => name.endsWith(e)) ? [full] : [];
	});
}

function frontmatter(source) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return null;
	const fields = {};
	for (const line of match[1].split(/\r?\n/)) {
		const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
		if (kv) fields[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
	}
	return fields;
}

// Collects every page path under any `pages` array, however deeply groups/tabs are nested.
function navPages(node, out = []) {
	if (Array.isArray(node)) node.forEach((n) => navPages(n, out));
	else if (node && typeof node === 'object') {
		for (const [key, value] of Object.entries(node)) {
			if (key === 'pages' && Array.isArray(value)) {
				for (const item of value) typeof item === 'string' ? out.push(item) : navPages(item, out);
			} else if (typeof value === 'object') navPages(value, out);
		}
	}
	return out;
}

// --- docs.json -----------------------------------------------------------------------------

const config = JSON.parse(readFileSync(join(ROOT, 'docs.json'), 'utf8'));
const languages = config.navigation?.languages ?? [];
const locales = languages.map((l) => l.language);

if (!locales.length) errors.push('docs.json: navigation.languages is empty');
const defaultLocale = (languages.find((l) => l.default) ?? languages[0])?.language;
if (defaultLocale !== SOURCE_LOCALE) {
	errors.push(`docs.json: default language is "${defaultLocale}", expected "${SOURCE_LOCALE}"`);
}

const navByLocale = {};
for (const entry of languages) {
	const lang = entry.language;
	const pages = navPages(entry);
	navByLocale[lang] = pages;
	const seen = new Set();
	for (const page of pages) {
		if (!page.startsWith(`${lang}/`)) {
			errors.push(`docs.json [${lang}]: "${page}" is outside the ${lang}/ folder`);
		}
		if (seen.has(page)) errors.push(`docs.json [${lang}]: "${page}" is listed twice`);
		seen.add(page);
		if (!existsSync(join(ROOT, `${page}.mdx`)) && !existsSync(join(ROOT, `${page}.md`))) {
			errors.push(`docs.json [${lang}]: "${page}" has no ${page}.mdx file`);
		}
	}
}

// Same pages in the same order in every locale, so the sidebars mirror each other.
const strip = (lang, pages) => pages.map((p) => p.slice(lang.length + 1));
const sourceNav = strip(SOURCE_LOCALE, navByLocale[SOURCE_LOCALE] ?? []);
for (const lang of locales.filter((l) => l !== SOURCE_LOCALE)) {
	const nav = strip(lang, navByLocale[lang]);
	const missing = sourceNav.filter((p) => !nav.includes(p));
	const extra = nav.filter((p) => !sourceNav.includes(p));
	missing.forEach((p) => errors.push(`docs.json [${lang}]: missing "${lang}/${p}" (present in ${SOURCE_LOCALE})`));
	extra.forEach((p) => errors.push(`docs.json [${lang}]: "${lang}/${p}" is not in the ${SOURCE_LOCALE} navigation`));
	if (!missing.length && !extra.length && nav.join() !== sourceNav.join()) {
		errors.push(`docs.json [${lang}]: pages are in a different order than in ${SOURCE_LOCALE}`);
	}
}

// --- page files ----------------------------------------------------------------------------

const pagesByLocale = {};
for (const lang of locales) {
	pagesByLocale[lang] = walk(join(ROOT, lang), ['.mdx', '.md']).map((f) =>
		rel(f).slice(lang.length + 1),
	);
}

const allPages = new Set(Object.values(pagesByLocale).flat());
for (const page of allPages) {
	const missingIn = locales.filter((l) => !pagesByLocale[l].includes(page));
	if (missingIn.length) {
		errors.push(`${page}: missing in ${missingIn.map((l) => `${l}/`).join(', ')}`);
	}
}

const localePrefix = new RegExp(`^/(${locales.join('|')})/`);

for (const lang of locales) {
	const navSet = new Set(navByLocale[lang]);
	for (const page of pagesByLocale[lang]) {
		const file = join(ROOT, lang, page);
		const path = `${lang}/${page}`;
		const source = readFileSync(file, 'utf8');
		const fm = frontmatter(source);

		if (!fm) errors.push(`${path}: no frontmatter`);
		else {
			if (!fm.title) errors.push(`${path}: frontmatter has no title`);
			if (!fm.description) errors.push(`${path}: frontmatter has no description`);
		}
		if (!navSet.has(path.replace(/\.mdx?$/, '')) && fm?.hidden !== 'true') {
			errors.push(`${path}: not in docs.json navigation (add it, or set hidden: true)`);
		}

		// Internal links must stay inside the page's own locale.
		for (const [, target] of source.matchAll(/(?:\]\(|href=["'])(\/[^)"'\s#?]*)/g)) {
			const m = target.match(localePrefix);
			if (m && m[1] !== lang) errors.push(`${path}: links to another locale: ${target}`);
		}

		// Images: must exist; localized screenshots must come from this page's locale.
		for (const [, src] of source.matchAll(/(?:\]\(|src=["'])(\/images\/[^)"'\s]+)/g)) {
			if (!existsSync(join(ROOT, src))) errors.push(`${path}: image not found: ${src}`);
			const m = src.match(/^\/images\/([^/]+)\//);
			if (m && locales.includes(m[1]) && m[1] !== lang) {
				errors.push(`${path}: uses a ${m[1]} screenshot: ${src}`);
			}
		}

		// Snippets: must exist and come from this page's locale folder.
		for (const [, from] of source.matchAll(/^import\s+[\s\S]*?\s+from\s+["']([^"']+)["']/gm)) {
			if (!from.startsWith('/')) continue;
			if (!existsSync(join(ROOT, from))) errors.push(`${path}: snippet not found: ${from}`);
			const m = from.match(/^\/snippets\/([^/]+)\//);
			if (m && locales.includes(m[1]) && m[1] !== lang) {
				errors.push(`${path}: imports a ${m[1]} snippet: ${from}`);
			}
		}
	}
}

// --- snippets & images ---------------------------------------------------------------------

for (const kind of ['snippets', 'images']) {
	const byLocale = {};
	for (const lang of locales) {
		byLocale[lang] = walk(join(ROOT, kind, lang), ['']).map((f) =>
			rel(f).slice(kind.length + lang.length + 2),
		);
	}
	const all = new Set(
		Object.values(byLocale)
			.flat()
			.filter((f) => !f.split('/').pop().startsWith('.')),
	);
	for (const file of all) {
		const missingIn = locales.filter((l) => !byLocale[l].includes(file));
		if (!missingIn.length) continue;
		const msg = `${kind}/*/${file}: missing in ${missingIn.map((l) => `${kind}/${l}/`).join(', ')}`;
		// A missing snippet breaks the page; a missing screenshot is translation debt.
		(kind === 'snippets' ? errors : warnings).push(msg);
	}
}

// --- report --------------------------------------------------------------------------------

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
const pageCount = pagesByLocale[SOURCE_LOCALE]?.length ?? 0;
console.log(
	`\ncheck-i18n: ${pageCount} pages × ${locales.length} locales (${locales.join(', ')}) — ` +
		`${errors.length} error(s), ${warnings.length} warning(s)`,
);
process.exit(errors.length ? 1 : 0);
