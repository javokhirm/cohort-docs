#!/usr/bin/env node
// Every **bold** phrase in a page is a UI label (see contributing/style-guide.md), so each
// one must exist verbatim in the product's catalog for that page's locale. This catches
// docs that drifted after a product release renamed a button or menu item.
//
// Needs a checkout of cohort-ui next to this repo (or COHORT_UI=/path/to/cohort-ui).
// Skips with a notice when it isn't there, so CI without the sibling repo still passes.
//
// Usage: node scripts/check-labels.mjs [page.mdx ...]

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const UI = resolve(process.env.COHORT_UI ?? join(ROOT, '..', 'cohort-ui'));
const LOCALES = JSON.parse(readFileSync(join(ROOT, 'docs.json'), 'utf8')).navigation.languages.map(
	(l) => l.language,
);

if (!existsSync(join(UI, 'packages', 'i18n'))) {
	console.log(`check-labels: skipped — no cohort-ui checkout at ${UI} (set COHORT_UI to override)`);
	process.exit(0);
}

// Catalog strings are compared without the required-field marker and trailing
// punctuation the UI appends ("Ism *", "Kirilmoqda…").
const normalize = (s) => s.replace(/\s*\*$/, '').replace(/[:…]$/, '').trim();

function catalogFiles(locale) {
	const files = [join(UI, 'packages', 'i18n', 'src', 'messages', `${locale}.ts`)];
	const apps = join(UI, 'apps');
	for (const app of readdirSync(apps)) {
		const file = join(apps, app, 'src', 'locales', `${locale}.ts`);
		if (existsSync(file)) files.push(file);
	}
	return files.filter(existsSync);
}

function catalogStrings(locale) {
	const strings = new Set();
	for (const file of catalogFiles(locale)) {
		const source = readFileSync(file, 'utf8');
		for (const [, raw] of source.matchAll(/'((?:[^'\\\n]|\\.)*)'/g)) {
			strings.add(normalize(raw.replace(/\\(.)/g, '$1')));
		}
	}
	return strings;
}

function walk(dir) {
	if (!existsSync(dir)) return [];
	return readdirSync(dir).flatMap((name) => {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) return walk(full);
		return /\.mdx?$/.test(name) ? [full] : [];
	});
}

function boldPhrases(source) {
	const body = source
		.replace(/^---[\s\S]*?\n---/, '')
		.replace(/```[\s\S]*?```/g, '')
		.replace(/`[^`\n]*`/g, '');
	return [...body.matchAll(/\*\*([^*\n]+?)\*\*/g)].flatMap(([, phrase]) =>
		// A navigation path is several labels: **Sozlamalar → Filiallar**.
		phrase.split(/\s*→\s*/).map(normalize),
	);
}

const only = process.argv.slice(2).map((p) => resolve(p));
const problems = [];
let checked = 0;

for (const locale of LOCALES) {
	const known = catalogStrings(locale);
	for (const file of walk(join(ROOT, locale))) {
		if (only.length && !only.includes(file)) continue;
		for (const label of boldPhrases(readFileSync(file, 'utf8'))) {
			checked++;
			if (!known.has(label)) problems.push(`${relative(ROOT, file)}: **${label}** is not in the ${locale} catalog`);
		}
	}
}

for (const p of problems) console.error(`error ${p}`);
const uiShown = relative(ROOT, UI).startsWith('../..') ? UI : relative(ROOT, UI);
console.log(`\ncheck-labels: ${checked} bold labels checked against ${uiShown} — ${problems.length} not found`);
if (problems.length) {
	console.log('Fix the label to match the product, or unbold it if it is not a UI label.');
}
process.exit(problems.length ? 1 : 0);
