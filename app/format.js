// Small number formatters, one job each. All figures on the site pass
// through here so millions, billions and dollars read the same everywhere.

export function millions(n) {
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 1 })} million`;
}

export function billions(n) {
  return `$${n.toLocaleString('en-US')} billion`;
}

export function dollars(n) {
  return `$${n.toLocaleString('en-US')}`;
}

export function percent(n) {
  return `${n.toFixed(1)}%`;
}

export function years(n) {
  return `${n.toFixed(1)} years`;
}

export function plain(n) {
  return n.toLocaleString('en-US');
}

// Short axis label for a big number: 29,184 -> "$29.2T", 1,450.9 -> "1.45B".
export function shortMoney(n) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}T`;
  return `$${n}B`;
}

export function shortPeople(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(2)}B`;
  return `${n.toFixed(0)}M`;
}

export function changePct(from, to) {
  const pct = ((to - from) / from) * 100;
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}
