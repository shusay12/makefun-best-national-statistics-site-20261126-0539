// StatAtlas bootstrap: render the route, wire the controls, and — only
// behind ?test=1 — run the scripted self-checks and write their result to
// the page title so a headless run can read it. Read-only handle for those
// checks: window.__statatlas exposes live state and sets nothing.

import { render, bindControls, route } from './views.js';
import { COUNTRIES } from './data.js';

const errors = [];
window.addEventListener('error', (e) => errors.push(String(e.message)));

bindControls();
render();
window.addEventListener('hashchange', render);

window.__statatlas = {
  countries: COUNTRIES.length,
  route: () => route().view,
  errors: () => [...errors],
};

function runSelfChecks() {
  const out = {};
  try {
    // Home: eight rows in the table.
    window.location.hash = '#/';
    render();
    out.homeRows = document.querySelectorAll('#country-table tbody tr').length;
    // Search narrows the table to one row.
    const q = document.getElementById('q');
    q.value = 'japan';
    q.dispatchEvent(new Event('input', { bubbles: true }));
    out.searchJapanRows = document.querySelectorAll('#country-table tbody tr').length;
    out.searchJapanText = document.querySelector('#country-table tbody tr td').textContent;
    q.value = '';
    q.dispatchEvent(new Event('input', { bubbles: true }));
    // Sort by GDP: the United States must come first.
    document.querySelector('[data-sort="gdp"]').click();
    out.sortGdpFirst = document.querySelector('#country-table tbody tr td').textContent;
    // Country page: KPI cards and a chart render.
    window.location.hash = '#/country/jpn';
    render();
    out.countryKpis = document.querySelectorAll('.country-hero .kpi').length;
    out.countrySvg = document.querySelectorAll('#view svg').length;
    out.countryTitle = document.querySelector('#view h1').textContent;
    // Metric switch changes the chart heading.
    document.querySelector('[data-metric="population"]').click();
    out.metricSwitched = document.querySelector('#view h2').textContent.includes('Population');
    // Compare page: three picked by default; dropping one works.
    window.location.hash = '#/compare';
    render();
    out.compareSvg = document.querySelectorAll('#view svg').length;
    document.querySelector('[data-compare="usa"]').click();
    out.compareAfterDrop =
      document.querySelectorAll('[data-compare].on').length === 2 &&
      !document.querySelector('#view table thead').textContent.includes('United States');
    // Indicators and About render.
    window.location.hash = '#/indicators';
    render();
    out.indicatorCards = document.querySelectorAll('#view .card').length;
    window.location.hash = '#/about';
    render();
    out.aboutSections = document.querySelectorAll('#view h2').length;
    out.pass =
      out.homeRows === 8 &&
      out.searchJapanRows === 1 &&
      out.searchJapanText.includes('Japan') &&
      out.sortGdpFirst.includes('United States') &&
      out.countryKpis === 4 &&
      out.countrySvg >= 1 &&
      out.countryTitle === 'Japan' &&
      out.metricSwitched === true &&
      out.compareSvg >= 1 &&
      out.compareAfterDrop === true &&
      out.indicatorCards === 7 &&
      out.aboutSections >= 2;
  } catch (e) {
    out.exception = String(e && e.message ? e.message : e);
    out.pass = false;
  }
  out.errors = errors;
  window.location.hash = '#/';
  render();
  document.title = JSON.stringify(out);
  return out;
}

if (new URLSearchParams(window.location.search).has('test')) {
  runSelfChecks();
}
