# StatAtlas — Make the best national statistics site

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/shusay12/makefun-best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/shusay12/makefun-best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

StatAtlas is an original national statistics site: eight countries, seven
indicators, every figure with its source and year. It runs entirely from its
own static files — no network request, no tracking, no account — on desktop
and on a phone.

- **Dashboard** — searchable, sortable table of all eight countries, KPI
  strip, population and GDP bar charts, and Indonesia's 2015–2024
  population line chart.
- **Country pages** (`#/country/<code>`) — KPI cards with ranks, GDP per
  capita 2019–2024 line chart (switchable to population), urban/rural
  donuts, facts, and a full indicator table with source and year.
- **Compare** (`#/compare`) — pick up to three countries; diverging bar
  chart of GDP-per-capita change since 2019 plus a lined-up indicator table.
- **Indicators** (`#/indicators`) — what each number means, its unit, year
  and source. **Sources** (`#/about`) — method, rounding and citation.

Figures: population and median age from the UN World Population Prospects
2024; GDP, GDP per capita, life expectancy (2023), inflation and urban
share from the World Bank, World Development Indicators 2024. All values
are rounded to the precision shown; the Sources page states the method.

## Run

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Open http://localhost:8080 in a browser. Self-checks behind `?test=1`
write their result to the page title (8 table rows, search, sort, country
page, metric switch, compare drop, indicators, about — all passing, zero
page errors).

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, stdlib only) copies `app/` and `screenshots/` to
`/output` and writes `/output/dossier.json` with the vendored
`vendor/makefun-frontend.ts` (kit copy, unchanged).

## Competition

[Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539) on make.fun — $50 shared by the 10 best entries ($5 each), judged pairwise by an AI judge on screenshots and source outline.

---
ref=susay21
