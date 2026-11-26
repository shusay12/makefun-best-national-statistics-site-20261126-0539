// StatAtlas views: one render function per page, all driven by hash routes.
// Every control on every page works: search and sorting on the dashboard,
// metric switching on a country page, country picking on the compare page.
// Each chart is followed by its figures in a table, so nothing is
// chart-only.

import { COUNTRIES, INDICATORS, SITE, countryByCode, rankOf, totals } from './data.js';
import { millions, billions, dollars, percent, years, plain, shortMoney, shortPeople, changePct } from './format.js';
import { barChart, changeBars, lineChart, donut } from './charts.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function countryLink(c) {
  return `<a href="#/country/${c.code}">${esc(c.name)}</a>`;
}

function sourceNote(text) {
  return `<p class="source">Source: ${esc(text)}</p>`;
}

// ---------- Dashboard ----------

let dashQuery = '';
let dashSort = 'population';
let dashDesc = true;

const SORTABLE = [
  ['name', 'Country'],
  ['population', 'Population'],
  ['gdp', 'GDP'],
  ['gdpPerCapita', 'GDP per capita'],
  ['lifeExpectancy', 'Life expectancy'],
  ['inflation', 'Inflation'],
];

function sortedRows() {
  const q = dashQuery.trim().toLowerCase();
  let rows = COUNTRIES.filter(
    (c) => !q || c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q),
  );
  rows = [...rows].sort((a, b) => {
    const av = a[dashSort];
    const bv = b[dashSort];
    if (typeof av === 'string') return dashDesc ? bv.localeCompare(av) : av.localeCompare(bv);
    return dashDesc ? bv - av : av - bv;
  });
  return rows;
}

export function renderHome() {
  const t = totals();
  const byPop = [...COUNTRIES].sort((a, b) => b.population - a.population);
  const byGdp = [...COUNTRIES].sort((a, b) => b.gdp - a.gdp);
  const idn = countryByCode('idn');
  const rows = sortedRows();
  const headers = SORTABLE.map(([key, label]) => {
    const arrow = dashSort === key ? (dashDesc ? ' ↓' : ' ↑') : '';
    return `<th><button class="sort" data-sort="${key}" aria-label="Sort by ${label}">${label}${arrow}</button></th>`;
  }).join('');
  const body = rows
    .map(
      (c) => `<tr>
        <td>${countryLink(c)} <span class="region">${esc(c.region)}</span></td>
        <td class="num">${millions(c.population)}</td>
        <td class="num">${billions(c.gdp)}</td>
        <td class="num">${dollars(c.gdpPerCapita)}</td>
        <td class="num">${years(c.lifeExpectancy)}</td>
        <td class="num">${percent(c.inflation)}</td>
      </tr>`,
    )
    .join('');
  return `<section class="hero">
    <p class="kicker">National statistics · Updated ${esc(SITE.updated)}</p>
    <h1>How big is a country, really?</h1>
    <p class="lede">StatAtlas puts the numbers that describe a nation — how many people, how much
    it produces, how long they live — side by side, with the source and the year on every figure.
    Start with a country below, or compare them head to head.</p>
    <div class="kpis">
      <div class="kpi"><span class="kpi-num">${t.countries}</span><span class="kpi-label">countries covered</span></div>
      <div class="kpi"><span class="kpi-num">${shortPeople(t.population)}</span><span class="kpi-label">people in total (2024)</span></div>
      <div class="kpi"><span class="kpi-num">${shortMoney(t.gdp)}</span><span class="kpi-label">combined GDP (2024)</span></div>
      <div class="kpi"><span class="kpi-num">51%</span><span class="kpi-label">of the world’s people</span></div>
    </div>
  </section>

  <section class="panel">
    <h2>All eight countries</h2>
    <p>Search the table, or sort it by any column. Click a country name for its full page.</p>
    <div class="toolbar">
      <label>Search <input id="q" type="search" placeholder="Try “Japan” or “Africa”" value="${esc(dashQuery)}" aria-label="Search countries"></label>
      <span class="count" id="row-count">${rows.length} of ${COUNTRIES.length} shown</span>
    </div>
    <div class="table-wrap"><table id="country-table">
      <thead><tr>${headers}</tr></thead>
      <tbody>${body || `<tr><td colspan="6">No country matches “${esc(dashQuery)}”. Clear the search to see all eight.</td></tr>`}</tbody>
    </table></div>
    ${sourceNote('Population: UN World Population Prospects 2024. GDP and GDP per capita: World Bank, World Development Indicators 2024. Life expectancy: World Bank 2023. Inflation: World Bank 2024.')}
  </section>

  <div class="grid2">
    <section class="panel">
      <h2>Most people</h2>
      <p>Population, 2024. India passed China in 2023; together they hold 2.87 billion people.</p>
      ${barChart(byPop.map((c) => ({ label: c.name, value: c.population, text: millions(c.population) })), 'Population by country, 2024')}
      ${sourceNote('UN World Population Prospects 2024, mid-year estimates.')}
    </section>
    <section class="panel">
      <h2>Biggest economies</h2>
      <p>GDP, 2024, current US dollars. The United States alone is larger than the next three combined.</p>
      ${barChart(byGdp.map((c) => ({ label: c.name, value: c.gdp, text: billions(c.gdp) })), 'GDP by country, 2024')}
      ${sourceNote('World Bank, World Development Indicators 2024.')}
    </section>
  </div>

  <section class="panel">
    <h2>Featured: Indonesia’s growth</h2>
    <p>Indonesia added about 25 million people in a decade — roughly one Australia — while its
    output per person rose from ${dollars(4178)} in 2019 to ${dollars(4925)} in 2024.</p>
    ${lineChart(idn.populationYears, idn.populationSeries, (v) => `${v.toFixed(1)} million`, 'Indonesia population 2015 to 2024, millions')}
    ${sourceNote('UN World Population Prospects 2024, medium variant.')}
    <p><a class="btn" href="#/country/idn">Open Indonesia’s full page →</a></p>
  </section>`;
}

// ---------- Country page ----------

let countryMetric = 'gdpPerCapita';

export function renderCountry(code) {
  const c = countryByCode(code);
  if (!c) {
    return `<section class="panel"><h1>Country not found</h1>
      <p>There is no country with the code “${esc(code)}” on this site.
      <a href="#/">Back to the dashboard</a> to see the eight we cover.</p></section>`;
  }
  const idx = COUNTRIES.findIndex((x) => x.code === c.code);
  const prev = COUNTRIES[(idx - 1 + COUNTRIES.length) % COUNTRIES.length];
  const next = COUNTRIES[(idx + 1) % COUNTRIES.length];
  const metric =
    countryMetric === 'gdpPerCapita'
      ? { years: c.gdpPerCapitaYears, values: c.gdpPerCapitaSeries, fmt: (v) => dollars(v), title: 'GDP per capita, 2019–2024 (current US$)', src: 'World Bank, World Development Indicators.' }
      : { years: [2015, 2024], values: [c.population2015, c.population], fmt: (v) => `${v.toFixed(1)} million`, title: 'Population, 2015 vs 2024 (millions)', src: 'UN World Population Prospects 2024. Two anchor years only; the years between are not plotted.' };
  const metricButtons = [
    ['gdpPerCapita', 'GDP per capita'],
    ['population', 'Population'],
  ]
    .map(
      ([key, label]) =>
        `<button class="chip${countryMetric === key ? ' on' : ''}" data-metric="${key}">${label}</button>`,
    )
    .join('');
  const indicatorRows = INDICATORS.map((ind) => {
    const value =
      ind.id === 'population'
        ? millions(c.population)
        : ind.id === 'gdp'
          ? billions(c.gdp)
          : ind.id === 'gdpPerCapita'
            ? dollars(c.gdpPerCapita)
            : ind.id === 'lifeExpectancy'
              ? years(c.lifeExpectancy)
              : ind.id === 'inflation'
                ? percent(c.inflation)
                : ind.id === 'urbanShare'
                  ? percent(c.urbanShare)
                  : `${c.medianAge.toFixed(1)} years`;
    return `<tr><td>${esc(ind.name)}</td><td class="num">${value}</td>
      <td class="num">#${rankOf(c, ind.id)} of ${COUNTRIES.length}</td>
      <td>${esc(ind.year)}</td><td>${esc(ind.source)}</td></tr>`;
  }).join('');
  return `<section class="hero country-hero">
    <p class="kicker">${esc(c.region)} · Capital ${esc(c.capital)}</p>
    <h1>${esc(c.name)}</h1>
    <p class="lede">${esc(c.note)}</p>
    <div class="kpis">
      <div class="kpi"><span class="kpi-num">${millions(c.population)}</span><span class="kpi-label">people, 2024 · #${rankOf(c, 'population')} of ${COUNTRIES.length}</span></div>
      <div class="kpi"><span class="kpi-num">${billions(c.gdp)}</span><span class="kpi-label">GDP, 2024 · #${rankOf(c, 'gdp')} of ${COUNTRIES.length}</span></div>
      <div class="kpi"><span class="kpi-num">${dollars(c.gdpPerCapita)}</span><span class="kpi-label">GDP per capita, 2024 · #${rankOf(c, 'gdpPerCapita')} of ${COUNTRIES.length}</span></div>
      <div class="kpi"><span class="kpi-num">${years(c.lifeExpectancy)}</span><span class="kpi-label">life expectancy, 2023 · #${rankOf(c, 'lifeExpectancy')} of ${COUNTRIES.length}</span></div>
    </div>
  </section>

  <div class="grid2">
    <section class="panel">
      <h2>${esc(metric.title)}</h2>
      <div class="toolbar">${metricButtons}</div>
      ${lineChart(metric.years, metric.values, metric.fmt, metric.title)}
      ${sourceNote(metric.src)}
    </section>
    <section class="panel">
      <h2>Where people live</h2>
      <p>${percent(c.urbanShare)} of ${esc(c.name)}’s people live in urban areas (2024).
      The rest — ${percent(100 - c.urbanShare)} — live outside cities.</p>
      <div class="donut-row">
        ${donut(c.urbanShare, 'urban', '#0e7c6b')}
        ${donut(100 - c.urbanShare, 'rural', '#d98a1f')}
      </div>
      ${sourceNote('World Bank, World Development Indicators 2024. Urban is defined by each country.')}
      <dl class="facts">
        <dt>Capital</dt><dd>${esc(c.capital)}</dd>
        <dt>Currency</dt><dd>${esc(c.currency)}</dd>
        <dt>Language</dt><dd>${esc(c.language)}</dd>
        <dt>Land area</dt><dd>${plain(c.landAreaKm2)} km²</dd>
        <dt>Median age</dt><dd>${c.medianAge.toFixed(1)} years (2024)</dd>
      </dl>
    </section>
  </div>

  <section class="panel">
    <h2>Every indicator, with its source</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Indicator</th><th>Value</th><th>Rank here</th><th>Year</th><th>Source</th></tr></thead>
      <tbody>${indicatorRows}</tbody>
    </table></div>
  </section>

  <nav class="pager">
    <a href="#/country/${prev.code}">← ${esc(prev.name)}</a>
    <a href="#/">All countries</a>
    <a href="#/country/${next.code}">${esc(next.name)} →</a>
  </nav>`;
}

// ---------- Compare page ----------

let compareSet = ['idn', 'ind', 'usa'];

export function renderCompare() {
  const picked = COUNTRIES.filter((c) => compareSet.includes(c.code));
  const chips = COUNTRIES.map(
    (c) =>
      `<button class="chip${compareSet.includes(c.code) ? ' on' : ''}" data-compare="${c.code}" aria-pressed="${compareSet.includes(c.code)}">${esc(c.name)}</button>`,
  ).join('');
  const chartItems = picked.map((c) => ({
    label: c.name,
    pct: ((c.gdpPerCapita - c.gdpPerCapitaSeries[0]) / c.gdpPerCapitaSeries[0]) * 100,
    text: `${changePct(c.gdpPerCapitaSeries[0], c.gdpPerCapita)} (${dollars(c.gdpPerCapitaSeries[0])} to ${dollars(c.gdpPerCapita)})`,
    short: changePct(c.gdpPerCapitaSeries[0], c.gdpPerCapita),
  }));
  const rows = ['population', 'gdp', 'gdpPerCapita', 'lifeExpectancy', 'inflation', 'urbanShare', 'medianAge']
    .map((key) => {
      const ind = INDICATORS.find((i) => i.id === key);
      const cells = picked
        .map((c) => {
          const v =
            key === 'population'
              ? millions(c.population)
              : key === 'gdp'
                ? billions(c.gdp)
                : key === 'gdpPerCapita'
                  ? dollars(c.gdpPerCapita)
                  : key === 'lifeExpectancy'
                    ? years(c.lifeExpectancy)
                    : key === 'inflation'
                      ? percent(c.inflation)
                      : key === 'urbanShare'
                        ? percent(c.urbanShare)
                        : `${c.medianAge.toFixed(1)} years`;
          return `<td class="num">${v}</td>`;
        })
        .join('');
      return `<tr><td>${esc(ind.name)} <span class="region">${esc(ind.year)}</span></td>${cells}</tr>`;
    })
    .join('');
  const head = picked.map((c) => `<th>${countryLink(c)}</th>`).join('');
  return `<section class="hero">
    <p class="kicker">Side by side</p>
    <h1>Compare countries</h1>
    <p class="lede">Pick up to three countries. The chart shows how output per person moved
    between 2019 and 2024; the table lines up every indicator.</p>
    <div class="toolbar">${chips}</div>
    <p class="hint" id="compare-hint">${picked.length === 3 ? 'Three selected — tap one to drop it before adding another.' : 'Tap a country to add it.'}</p>
  </section>

  <section class="panel">
    <h2>GDP per capita: change since 2019</h2>
    ${changeBars(chartItems, 'Change in GDP per capita from 2019 to 2024')}
    <p>Five years of growth, in one picture. Nigeria’s dollar figure fell sharply in 2024 after
    the naira was floated — a currency effect, not a collapse in what Nigerians produce.
    The United States widened its lead by ${changePct(65330, 85809)} over the same five years.</p>
    ${sourceNote('World Bank, World Development Indicators, current US dollars.')}
  </section>

  <section class="panel">
    <h2>The numbers, lined up</h2>
    <div class="table-wrap"><table>
      <thead><tr><th>Indicator</th>${head}</tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    ${sourceNote('Population and median age: UN World Population Prospects 2024. GDP, GDP per capita, life expectancy (2023), inflation and urban share: World Bank, World Development Indicators.')}
  </section>`;
}

// ---------- Indicators page ----------

export function renderIndicators() {
  const cards = INDICATORS.map(
    (ind) => `<article class="card">
      <h3>${esc(ind.name)}</h3>
      <p>${esc(ind.about)}</p>
      <dl class="facts">
        <dt>Unit</dt><dd>${esc(ind.unit)}</dd>
        <dt>Year</dt><dd>${esc(ind.year)}</dd>
        <dt>Source</dt><dd>${esc(ind.source)}</dd>
      </dl>
    </article>`,
  ).join('');
  return `<section class="hero">
    <p class="kicker">What each number means</p>
    <h1>Indicators</h1>
    <p class="lede">Seven indicators, each with its unit, its year and where it comes from.
    If a figure here disagrees with another site, check the year and the definition first —
    that is where most disagreements live.</p>
  </section>
  <section class="cards">${cards}</section>`;
}

// ---------- Sources / about page ----------

export function renderAbout() {
  return `<section class="hero">
    <p class="kicker">Method &amp; sources</p>
    <h1>About StatAtlas</h1>
    <p class="lede">StatAtlas is a small, original statistics site: eight countries, seven
    indicators, every figure labelled with its source and year. It runs entirely from its
    own files — no network request, no tracking, no account.</p>
  </section>
  <section class="panel">
    <h2>Where the numbers come from</h2>
    <ul class="sources">
      <li><strong>Population, median age</strong> — United Nations, World Population Prospects 2024 (medium variant), mid-year estimates.</li>
      <li><strong>GDP, GDP per capita, life expectancy, inflation, urban share</strong> — World Bank, World Development Indicators, accessed November 2026. Life expectancy is the 2023 value; the rest are 2024.</li>
      <li><strong>Capitals, currencies, languages, land area</strong> — standard reference facts, as of 2024.</li>
    </ul>
    <h2>How figures are shown</h2>
    <ul class="sources">
      <li>Figures are rounded to the precision shown (population to 0.1 million, GDP to the nearest billion dollars, GDP per capita to the nearest dollar). Rounding can make a derived figure differ by a little from the two numbers it came from.</li>
      <li>GDP is in current US dollars, so exchange-rate moves show up in it — Nigeria’s 2024 fall is the clearest case here.</li>
      <li>“Urban” means what each country’s statistics office defines as urban; the definitions are not identical, so compare urban shares loosely.</li>
      <li>StatAtlas is not affiliated with the World Bank, the United Nations, or any national statistics office. Figures are reproduced for reference; check the source publication for the authoritative value.</li>
    </ul>
    <h2>How to cite a figure</h2>
    <p>Example: “Indonesia’s population was 283.5 million in 2024 (UN World Population Prospects 2024), via StatAtlas.”</p>
  </section>`;
}

// ---------- Router ----------

export function route() {
  const hash = window.location.hash || '#/';
  const parts = hash.replace(/^#\/?/, '').split('/');
  if (parts[0] === 'country' && parts[1]) return { view: 'country', code: parts[1] };
  if (parts[0] === 'compare') return { view: 'compare' };
  if (parts[0] === 'indicators') return { view: 'indicators' };
  if (parts[0] === 'about') return { view: 'about' };
  return { view: 'home' };
}

export function render() {
  const r = route();
  const main = document.getElementById('view');
  if (r.view === 'country') main.innerHTML = renderCountry(r.code);
  else if (r.view === 'compare') main.innerHTML = renderCompare();
  else if (r.view === 'indicators') main.innerHTML = renderIndicators();
  else if (r.view === 'about') main.innerHTML = renderAbout();
  else main.innerHTML = renderHome();
  document.querySelectorAll('nav a[data-route]').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('data-route') === r.view);
  });
  window.scrollTo(0, 0);
  return r.view;
}

// Delegated clicks: sort buttons, search input, metric chips, compare chips.
export function bindControls() {
  document.addEventListener('click', (e) => {
    const sortBtn = e.target.closest('[data-sort]');
    if (sortBtn) {
      const key = sortBtn.getAttribute('data-sort');
      if (dashSort === key) dashDesc = !dashDesc;
      else {
        dashSort = key;
        dashDesc = key !== 'name';
      }
      render();
      return;
    }
    const metricBtn = e.target.closest('[data-metric]');
    if (metricBtn) {
      countryMetric = metricBtn.getAttribute('data-metric');
      render();
      return;
    }
    const cmpBtn = e.target.closest('[data-compare]');
    if (cmpBtn) {
      const code = cmpBtn.getAttribute('data-compare');
      if (compareSet.includes(code)) compareSet = compareSet.filter((c) => c !== code);
      else if (compareSet.length < 3) compareSet = [...compareSet, code];
      render();
    }
  });
  document.addEventListener('input', (e) => {
    if (e.target && e.target.id === 'q') {
      dashQuery = e.target.value;
      const rows = sortedRows();
      const tbody = document.querySelector('#country-table tbody');
      const count = document.getElementById('row-count');
      if (tbody) {
        tbody.innerHTML = rows
          .map(
            (c) => `<tr>
              <td>${countryLink(c)} <span class="region">${esc(c.region)}</span></td>
              <td class="num">${millions(c.population)}</td>
              <td class="num">${billions(c.gdp)}</td>
              <td class="num">${dollars(c.gdpPerCapita)}</td>
              <td class="num">${years(c.lifeExpectancy)}</td>
              <td class="num">${percent(c.inflation)}</td>
            </tr>`,
          )
          .join('') || `<tr><td colspan="6">No country matches “${esc(dashQuery)}”. Clear the search to see all eight.</td></tr>`;
      }
      if (count) count.textContent = `${rows.length} of ${COUNTRIES.length} shown`;
    }
  });
}
