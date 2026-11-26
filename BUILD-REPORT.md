# Build Report — StatAtlas (best-national-statistics-site-20261126-0539)

## What was built
StatAtlas, an original national statistics site in vanilla JS + hand-rolled
SVG charts, no libraries, no assets, no network requests. Eight countries
(Indonesia, India, China, United States, Japan, Germany, Brazil, Nigeria)
across seven indicators, every figure labelled with its source and year.

- **Dashboard** (`#/`) — searchable, sortable table of all eight countries;
  KPI strip (8 countries, 4.15B people, $64.1T GDP, 51% of world population);
  population and GDP bar charts; Indonesia 2015–2024 population line chart.
- **Country pages** (`#/country/<code>`) — KPI cards with ranks, GDP per
  capita 2019–2024 line chart (switchable to population 2015 vs 2024),
  urban/rural donuts, facts (capital, currency, language, land area, median
  age), full indicator table with source and year, prev/next pager.
- **Compare** (`#/compare`) — pick up to three countries; diverging bar
  chart of GDP-per-capita change since 2019 plus a lined-up indicator table.
- **Indicators** (`#/indicators`) — what each number means, unit, year, source.
- **Sources** (`#/about`) — method, rounding, exchange-rate caveat, citation.

## Design decisions
- Paper-and-ink "atlas" identity (warm paper, navy ink, teal/amber accents,
  Georgia display type, system fonts only) — original, no copied brand.
- Data is the site's own files (`app/data.js`): World Bank WDI 2024 for GDP,
  GDP per capita, life expectancy (2023), inflation and urban share; UN World
  Population Prospects 2024 for population and median age. Values rounded to
  the precision shown; the Sources page states the method. Only Indonesia
  carries a full 2015–2024 yearly population series (smooth, confident);
  other countries show the 2015 vs 2024 anchors only — no invented yearly
  precision. Nigeria's 2024 dollar-GDP fall is explained as a currency effect.
- Source split into one-job files, named for what they do: `data.js`
  (dataset), `format.js` (number formatting), `charts.js` (SVG bar / line /
  diverging-bar / donut builders), `views.js` (router + five pages),
  `main.js` (bootstrap + self-checks). First load: 7 files, 14,967 bytes
  gzip-9 (46,170 raw).
- `?test=1` runs scripted self-checks and writes the result to the page
  title (see Test evidence). `window.__statatlas` is a read-only handle for
  those checks.

## Files
- `main.ts` — entry program (written this session)
- `serve.ts` — dev static server on port 8080 (written this session)
- `vendor/makefun-frontend.ts` — kit copy, byte-identical (sha256 below)
- `LICENSE` — MIT, kit copy (SPDX-License-Identifier: MIT)
- `app/index.html` (1,290 B) + `app/data.js`, `app/format.js`,
  `app/charts.js`, `app/views.js`, `app/main.js`, `app/style.css`
- `screenshots/` — 1-cover.jpg, 2-country.jpg, 3-compare.jpg, 4-phone.jpg
  (1280×800 JPEG; phone 390×844; genuine renders of the final build)
- `README.md`, `shots.json`, `.gitignore`
- `BUILD-REPORT.md` — this file

## Test evidence
Headless Chrome (chrome-headless-shell from the Playwright cache) served via
`node serve.ts` on port 8091.

Scripted self-checks (`?test=1`, result written to the page title):
`{"homeRows":8,"searchJapanRows":1,"searchJapanText":"Japan East Asia","sortGdpFirst":"United States North America","countryKpis":4,"countrySvg":3,"countryTitle":"Japan","metricSwitched":true,"compareSvg":1,"compareAfterDrop":true,"indicatorCards":7,"aboutSections":3,"pass":true,"errors":[]}` — 8 table rows, search narrows to Japan, GDP sort puts the
United States first, country page renders 4 KPIs and 3 SVGs, metric switch
works, compare drop works, 7 indicator cards, 3 About sections, zero page
errors. One check was fixed during the run (compare-after-drop first asserted
on page text, which legitimately still names the United States in the prose;
it now asserts on the table header and the selected chips).

Render determinism: the cover screenshot rendered twice from `#/`; sha256
identical per pair (269678ce918d455136c82f9e2f2659ed569bc57ae305ad5e50e386822f1e0976).

All four screenshots were visually inspected at full size. Defects found and
fixed: the hero claimed 55% of world population (the eight hold 4.15B of
~8.16B, so 51%) and a stale $59.3T combined-GDP figure (actual $64.1T);
the compare chart's grouped bars made Indonesia/India unreadable next to
the United States (replaced with a diverging % change chart, absolute values
kept in the table below); compare value labels clipped at the chart edge
(shortened to the percentage, dollars kept in the tooltip and table).
Final renders show the dashboard, Indonesia country page, compare page and
phone layout clean, with charts, tables and sources legible.

## Kit check result — `makefun check --worktree` (MAKEFUN_OFFLINE=1)
- pass: competition_open (now 2026-11-26T06:04:59Z is between opening 2026-11-26T05:39:00Z and deadline 2026-11-29T05:39:00Z)
- pass: snapshot (18 files, 467,297 bytes, within intake caps)
- pass: license_osi (SPDX-License-Identifier: MIT)
- pass: entrypoint (main.ts at root selects node22)
- FAIL: transcripts_present — no transcripts were uploaded (expected: bundling is the parent's step, per the task; every other transcript check skipped on that)
- at submission: repo_public, repo_owner, repo_created_after_open, commit_in_repo, duplicate_snapshot (all need the GitHub repo + push, the parent's step)
- Note: no local grade exists for this competition — the server grades every entry.

## Hand-in verification
- `mkdir -p out out2 && MAKEFUN_OUTPUT_DIR=out node main.ts` and same for out2: `diff -r out out2` clean — deterministic, byte-identical outputs.
- `out/dossier.json` 485,743 B (≤1.5 MiB), sha256 `b3d0a76c56b93084cdcc0d9ee9bb92afbdeacda6eb7b8065309511d497ec3952`
- `out/` total 859,030 B (≤64 MiB); app/: 7 files, 46,170 B (≤993 files, ≤16 MiB); index.html 1,290 B (≤1 MiB)
- screenshots: 4 files, each ≤256 KiB, 1280×800 (long ≤1280, short ≥480) and 390×844 phone (short ≥360)
- No external references in app/ (grep for http://, https://, fetch(, XMLHttpRequest, WebSocket, eval, new Function, document.cookie, service worker, localStorage, @import, url(): none found); no `fetch()` at all — the data ships in `data.js`
- vendor/makefun-frontend.ts byte-identical to the kit copy: sha256 `4c8da1c8e76490b3a847670f49137d3ec23953e3c988fe6a6cb320fce5739240`
- All app modules load and run in headless Chrome (renders, self-checks above); `?test=1` exercised.

## Bundle path + sha256 manifest
- `app/index.html` — 56fc39d2de39baa037ec10a8c4cf9d3340badfdcaae44ce67654fd141f29a2fe
- `app/data.js` — c5130b773c034f6b2a208b00f796219ce624c5fcaedcf8069b2611caf3428ed0
- `app/format.js` — 8d39f1acceb19d05b014ab795b4940e7037cb600887316967aa8ece093ecc406
- `app/charts.js` — 3e621e7e983683671ffc82dfa84a1e069bb83f60a12e36a6e08a0d86111fe65b
- `app/views.js` — a4fcaa3c2f4f7d32e140d20402548ff9e93af3d8fd5abd1cf9dc5519cf938178
- `app/main.js` — 184981f18ee8a5477d28ad5569660c120c8f9ebf1d6a56bb9861c6e88d924a8f
- `app/style.css` — a303ee3c0ba57a37fba052a427ecc3c5ca5de0e4ee12f1ea2e7e454a82f82bb4
- `main.ts` — eee4e6bdfae20cebf95970d936e319c4ca13c9186c528c5f986dfe78a622430a
- `serve.ts` — 878a00ce1ab45dc79359ea1c695322723594dca3165592018b9cfff120456080
- `screenshots/1-cover.jpg` — 269678ce918d455136c82f9e2f2659ed569bc57ae305ad5e50e386822f1e0976
- `screenshots/2-country.jpg` — 705e501250beab62d03fd5509613e216847eac462bb2ae6f4e0af393b47468e8
- `screenshots/3-compare.jpg` — 00ec2c58ec416f7930552915caaa5b00b77172f05c8e3fa7c685bf80ac1c651c
- `screenshots/4-phone.jpg` — 6a0cb2d26ff6ddbc83ce23a3010da03614bd9b09cd2664d46956a50dffbd53f2
- `dossier.json` (from main.ts) — b3d0a76c56b93084cdcc0d9ee9bb92afbdeacda6eb7b8065309511d497ec3952

## Bundle
- Path: `~/workspace/makefun/transcripts/best-national-statistics-site-20261126-0539-bundle.tar.gz`
- Size: 258,512 bytes; sha256 `8e3978debf3c033d993e04a707539db5478d053267cc26e527b3a379e6bee48c`
- Contents: 1 session (this builder session fe4b266c, 60 turns, 226 lines),
  parent context-session ea9b1076, system prompt (uploaded), AGENTS.md
  (collected), run record (scheduled prompt, via "scheduled cron
  makefun-new-bounty-watch", harness muse/hosted, model muse-spark-1.3,
  provider meta, effort default, no MCP servers).
- Kit check WITH this bundle: transcripts_present, transcripts_recorded,
  thinking_wellformed, thinking_in_window, thinking_reproduces (97.6%
  authored, 1088/1114 lines; main.ts 18 authored lines), thinking_turns
  (51), thinking_revised, transcripts_run_record, thinking_own_work — all
  pass. ONLY failure: thinking_priced — 0 usage rows attached.
- BLOCKER (parent's step, cannot be fixed inside this turn): the Muse app
  writes a session's token-usage rows to muse.db only when its messages are
  delivered, i.e. after this run completes. The parent must re-run the
  muse.db SELECT for agent_id fe4b266c-5ba0-497c-8209-e64bc9426ce8, write the
  rows to `~/workspace/goals/make-fun-free-bounty-entries/hidden_files/muse-usage-20261126-1250.jsonl`
  (one JSON object per line; the empty file is refused by bundle), re-run
  bundle with `--muse-usage` on that file (same flags as the bundle above),
  and re-run `makefun check --transcripts` on the new bundle before
  submitting. Do NOT submit the current bundle as-is: thinking_priced fails
  and the entry would be rejected where transcripts are required.

## Git
- Entry commit `26d741af3be579b7cbbd111280dff3b61248a94e` — "StatAtlas: national statistics site for best-national-statistics-site-20261126-0539" (all site files, screenshots, main.ts, README, LICENSE)
- This report added in the follow-up commit (see `git log`); the submitter should use the latest HEAD sha at submit time.

## Notes / limits
- No GitHub repo was created, no submission was made, per the task. `~/.makefun/credentials` was not touched and `makefun record` was not run.
- The kit's `makefun check` FAIL on transcripts_present is expected at this stage: the parent runs the bundle/submit chain with this session's transcripts.
- Prize correction vs the task brief: the kit pays $5 each to places 1–10 (total $50), not $50 to 1st place only. Verified from the competition API and competition.yaml.
- Blind rounds are on: nothing is judged at submit time; the next round cutoff is 2026-11-26T23:39:00Z — submit before then to be judged in round 1.
- Screenshots were rendered with the headless shell, not a headed Chrome; no headed browser was available in this VM. The renders are genuine runs of the final code (same serve.ts, same files the grader will run).
