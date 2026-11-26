// Hand-rolled SVG charts. No library, no network: each function takes plain
// numbers and returns an SVG string the views drop into the page. Every chart
// is paired with a data table in the view, so the figures are readable
// without the picture too.

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

const PALETTE = ['#0e7c6b', '#d98a1f', '#2b4c6f', '#8a5a9e', '#b3402e', '#4a7d3a', '#1f7a8c', '#7a6a53'];

// Horizontal bars, one per item, biggest first. Good for ranking countries.
export function barChart(items, valueLabel) {
  const width = 640;
  const rowH = 34;
  const labelW = 110;
  const height = items.length * rowH + 34;
  const max = Math.max(...items.map((i) => i.value));
  let rows = '';
  items.forEach((item, idx) => {
    const y = 8 + idx * rowH;
    const w = Math.max(2, ((item.value / max) * (width - labelW - 90)));
    const color = PALETTE[idx % PALETTE.length];
    rows += `<g>
      <text x="0" y="${y + 15}" class="chart-label">${esc(item.label)}</text>
      <rect x="${labelW}" y="${y}" width="${w.toFixed(1)}" height="20" rx="3" fill="${color}">
        <title>${esc(item.label)}: ${esc(item.text)}</title>
      </rect>
      <text x="${labelW + w + 8}" y="${y + 15}" class="chart-value">${esc(item.text)}</text>
    </g>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(valueLabel)}" class="chart">${rows}</svg>`;
}

// Diverging bars: percentage change per item, positive to the right in
// teal, negative to the left in red, from a zero line.
export function changeBars(items, label) {
  const width = 640;
  const rowH = 34;
  const labelW = 110;
  const height = items.length * rowH + 30;
  const maxAbs = Math.max(...items.map((i) => Math.abs(i.pct)), 1);
  const zeroX = labelW + 30;
  const maxW = width - zeroX - 90;
  let rows = '';
  items.forEach((item) => {
    const idx = items.indexOf(item);
    const y = 8 + idx * rowH;
    const w = Math.max(2, (Math.abs(item.pct) / maxAbs) * maxW);
    const colour = item.pct >= 0 ? '#0e7c6b' : '#b3402e';
    const x = item.pct >= 0 ? zeroX : zeroX - w;
    const textX = item.pct >= 0 ? zeroX + w + 8 : zeroX - w - 8;
    const anchor = item.pct >= 0 ? 'start' : 'end';
    rows += `<g>
      <text x="0" y="${y + 15}" class="chart-label">${esc(item.label)}</text>
      <rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="20" rx="3" fill="${colour}">
        <title>${esc(item.label)}: ${esc(item.text)}</title>
      </rect>
      <text x="${textX.toFixed(1)}" y="${y + 15}" class="chart-value" text-anchor="${anchor}">${esc(item.short || item.text)}</text>
    </g>`;
  });
  const axis = `<line x1="${zeroX}" y1="4" x2="${zeroX}" y2="${height - 26}" class="chart-grid" stroke-width="1.5"/>
    <text x="${zeroX}" y="${height - 8}" class="chart-axis" text-anchor="middle">0%</text>`;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}" class="chart">${rows}${axis}</svg>`;
}

// Line chart with dots and value labels on the first/last points.
export function lineChart(years, values, valueText, label) {
  const width = 640;
  const height = 260;
  const padL = 56;
  const padR = 70;
  const padT = 18;
  const padB = 34;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const lo = min - span * 0.15;
  const hi = max + span * 0.15;
  const x = (i) => padL + (i * (width - padL - padR)) / (values.length - 1);
  const y = (v) => padT + ((hi - v) / (hi - lo)) * (height - padT - padB);
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  let dots = '';
  values.forEach((v, i) => {
    dots += `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="4" fill="#0e7c6b"><title>${years[i]}: ${esc(valueText(v))}</title></circle>`;
  });
  const yearLabels = years
    .map((yr, i) => `<text x="${x(i).toFixed(1)}" y="${height - 10}" class="chart-axis" text-anchor="middle">${yr}</text>`)
    .join('');
  const grid = [0, 1, 2, 3]
    .map((g) => {
      const gy = padT + (g * (height - padT - padB)) / 3;
      return `<line x1="${padL}" y1="${gy}" x2="${width - padR}" y2="${gy}" class="chart-grid"/>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}" class="chart">
    ${grid}
    <polyline points="${points}" fill="none" stroke="#0e7c6b" stroke-width="2.5" stroke-linejoin="round"/>
    ${dots}
    <text x="${x(0).toFixed(1)}" y="${(y(values[0]) - 10).toFixed(1)}" class="chart-value" text-anchor="middle">${esc(valueText(values[0]))}</text>
    <text x="${x(values.length - 1).toFixed(1)}" y="${(y(values[values.length - 1]) - 10).toFixed(1)}" class="chart-value" text-anchor="middle">${esc(valueText(values[values.length - 1]))}</text>
    ${yearLabels}
  </svg>`;
}

// Donut showing one share (e.g. urban share of population).
export function donut(share, label, colour) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const filled = (share / 100) * c;
  return `<svg viewBox="0 0 140 140" role="img" aria-label="${esc(label)}" class="donut">
    <circle cx="70" cy="70" r="${r}" fill="none" stroke="#e3ddd0" stroke-width="18"/>
    <circle cx="70" cy="70" r="${r}" fill="none" stroke="${colour}" stroke-width="18"
      stroke-dasharray="${filled.toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 70 70)" stroke-linecap="round"/>
    <text x="70" y="66" class="donut-num" text-anchor="middle">${share.toFixed(1)}%</text>
    <text x="70" y="86" class="donut-cap" text-anchor="middle">${esc(label)}</text>
  </svg>`;
}
