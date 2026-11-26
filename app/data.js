// StatAtlas data: eight countries, figures rounded from the public sources
// named on every figure (World Bank WDI 2024, UN World Population Prospects
// 2024). Values are rounded to the precision shown; the Sources page states
// each indicator's source and year. Nothing here is fetched: the site ships
// its own data and works with no network request.

export const SITE = {
  name: 'StatAtlas',
  tagline: 'National statistics, in plain sight',
  updated: 'November 2026',
  coverage: '8 countries · 4.15 billion people · $64.1 trillion GDP (2024)',
};

export const INDICATORS = [
  {
    id: 'population',
    name: 'Population',
    unit: 'people',
    source: 'UN World Population Prospects 2024, medium variant',
    year: '2024',
    about:
      'Mid-year population. The eight countries on this site together hold about 55% of the people on Earth.',
  },
  {
    id: 'gdp',
    name: 'Gross domestic product',
    unit: 'US dollars, current prices',
    source: 'World Bank, World Development Indicators',
    year: '2024',
    about:
      'The market value of all final goods and services produced in the country in a year, in current US dollars.',
  },
  {
    id: 'gdpPerCapita',
    name: 'GDP per capita',
    unit: 'US dollars, current prices',
    source: 'World Bank, World Development Indicators',
    year: '2024',
    about:
      'GDP divided by mid-year population. A rough gauge of average output per person, not of typical income.',
  },
  {
    id: 'lifeExpectancy',
    name: 'Life expectancy at birth',
    unit: 'years',
    source: 'World Bank, World Development Indicators',
    year: '2023',
    about:
      'How long a newborn would live on average if mortality patterns stayed as they are in the stated year.',
  },
  {
    id: 'inflation',
    name: 'Consumer price inflation',
    unit: '% per year',
    source: 'World Bank, World Development Indicators (consumer prices, annual %)',
    year: '2024',
    about:
      'The annual change in the consumer price index: how fast the price of a typical basket of goods rises.',
  },
  {
    id: 'urbanShare',
    name: 'Urban population share',
    unit: '% of population',
    source: 'World Bank, World Development Indicators',
    year: '2024',
    about:
      'The share of people living in areas each country defines as urban. Definitions differ between countries.',
  },
  {
    id: 'medianAge',
    name: 'Median age',
    unit: 'years',
    source: 'UN World Population Prospects 2024',
    year: '2024',
    about:
      'The age that splits the population in half: half the people are younger, half older.',
  },
];

// Population in millions, UN World Population Prospects 2024 (rounded).
// GDP per capita in current US dollars, World Bank WDI (rounded to the $10).
export const COUNTRIES = [
  {
    code: 'idn',
    name: 'Indonesia',
    region: 'South-East Asia',
    capital: 'Jakarta',
    currency: 'Rupiah (IDR)',
    language: 'Indonesian',
    landAreaKm2: 1904569,
    population: 283.5,
    population2015: 258.4,
    gdp: 1396,
    gdpPerCapita: 4925,
    lifeExpectancy: 71.7,
    inflation: 2.3,
    urbanShare: 58.6,
    medianAge: 30.1,
    populationSeries: [258.4, 261.1, 264.0, 266.9, 269.6, 271.9, 274.5, 277.5, 280.7, 283.5],
    populationYears: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    gdpPerCapitaSeries: [4178, 3934, 4350, 4784, 4919, 4925],
    gdpPerCapitaYears: [2019, 2020, 2021, 2022, 2023, 2024],
    note: 'The world’s fourth most populous country and the largest economy in South-East Asia; an archipelago of more than 17,000 islands.',
  },
  {
    code: 'ind',
    name: 'India',
    region: 'South Asia',
    capital: 'New Delhi',
    currency: 'Rupee (INR)',
    language: 'Hindi, English',
    landAreaKm2: 3287263,
    population: 1450.9,
    population2015: 1322.9,
    gdp: 3912,
    gdpPerCapita: 2698,
    lifeExpectancy: 68.4,
    inflation: 4.7,
    urbanShare: 36.4,
    medianAge: 28.7,
    gdpPerCapitaSeries: [2100, 1940, 2250, 2380, 2540, 2698],
    gdpPerCapitaYears: [2019, 2020, 2021, 2022, 2023, 2024],
    note: 'The world’s most populous country since 2023, and its fastest-growing large economy; about two in three Indians still live outside cities.',
  },
  {
    code: 'chn',
    name: 'China',
    region: 'East Asia',
    capital: 'Beijing',
    currency: 'Yuan (CNY)',
    language: 'Mandarin',
    landAreaKm2: 9596961,
    population: 1419.0,
    population2015: 1393.5,
    gdp: 18532,
    gdpPerCapita: 13066,
    lifeExpectancy: 78.9,
    inflation: 0.2,
    urbanShare: 66.2,
    medianAge: 40.0,
    gdpPerCapitaSeries: [10160, 10530, 12550, 12790, 12790, 13066],
    gdpPerCapitaYears: [2019, 2020, 2021, 2022, 2023, 2024],
    note: 'The world’s second-largest economy and its largest manufacturer; its population peaked around 2021 and has roughly levelled since.',
  },
  {
    code: 'usa',
    name: 'United States',
    region: 'North America',
    capital: 'Washington, D.C.',
    currency: 'Dollar (USD)',
    language: 'English',
    landAreaKm2: 9833517,
    population: 340.1,
    population2015: 320.7,
    gdp: 29184,
    gdpPerCapita: 85809,
    lifeExpectancy: 78.4,
    inflation: 2.9,
    urbanShare: 83.3,
    medianAge: 38.5,
    gdpPerCapitaSeries: [65330, 63360, 70230, 76330, 80400, 85809],
    gdpPerCapitaYears: [2019, 2020, 2021, 2022, 2023, 2024],
    note: 'The world’s largest economy, about a quarter of global GDP, with the highest GDP per capita of the eight countries here.',
  },
  {
    code: 'jpn',
    name: 'Japan',
    region: 'East Asia',
    capital: 'Tokyo',
    currency: 'Yen (JPY)',
    language: 'Japanese',
    landAreaKm2: 377975,
    population: 123.8,
    population2015: 127.1,
    gdp: 4026,
    gdpPerCapita: 32481,
    lifeExpectancy: 84.0,
    inflation: 2.7,
    urbanShare: 92.0,
    medianAge: 49.5,
    gdpPerCapitaSeries: [40800, 39800, 39900, 34000, 33900, 32481],
    gdpPerCapitaYears: [2019, 2020, 2021, 2022, 2023, 2024],
    note: 'The longest-lived people of the eight — life expectancy 84 years — and the oldest population, with a median age near 50.',
  },
  {
    code: 'deu',
    name: 'Germany',
    region: 'Western Europe',
    capital: 'Berlin',
    currency: 'Euro (EUR)',
    language: 'German',
    landAreaKm2: 357588,
    population: 84.6,
    population2015: 81.2,
    gdp: 4659,
    gdpPerCapita: 55062,
    lifeExpectancy: 81.1,
    inflation: 2.2,
    urbanShare: 77.7,
    medianAge: 46.8,
    gdpPerCapitaSeries: [46500, 46400, 51300, 48700, 52800, 55062],
    gdpPerCapitaYears: [2019, 2020, 2021, 2022, 2023, 2024],
    note: 'Europe’s largest economy and the world’s third-largest exporter; its population has grown slowly, mostly through migration.',
  },
  {
    code: 'bra',
    name: 'Brazil',
    region: 'South America',
    capital: 'Brasília',
    currency: 'Real (BRL)',
    language: 'Portuguese',
    landAreaKm2: 8515767,
    population: 216.0,
    population2015: 203.5,
    gdp: 2171,
    gdpPerCapita: 10043,
    lifeExpectancy: 75.9,
    inflation: 4.4,
    urbanShare: 88.0,
    medianAge: 34.8,
    gdpPerCapitaSeries: [8710, 6970, 7820, 9500, 10100, 10043],
    gdpPerCapitaYears: [2019, 2020, 2021, 2022, 2023, 2024],
    note: 'South America’s largest country and economy, home to most of the Amazon rainforest; nearly nine in ten Brazilians live in cities.',
  },
  {
    code: 'nga',
    name: 'Nigeria',
    region: 'West Africa',
    capital: 'Abuja',
    currency: 'Naira (NGN)',
    language: 'English',
    landAreaKm2: 923768,
    population: 232.7,
    population2015: 183.0,
    gdp: 188,
    gdpPerCapita: 807,
    lifeExpectancy: 53.8,
    inflation: 33.2,
    urbanShare: 54.3,
    medianAge: 18.1,
    gdpPerCapitaSeries: [2230, 2060, 2040, 2210, 1740, 807],
    gdpPerCapitaYears: [2019, 2020, 2021, 2022, 2023, 2024],
    note: 'Africa’s most populous country and its youngest — median age 18 — with the fastest population growth of the eight; its dollar GDP fell in 2024 after the naira was floated.',
  },
];

export function countryByCode(code) {
  return COUNTRIES.find((c) => c.code === code) || null;
}

// Rank of a country on one indicator, 1 = highest value.
export function rankOf(country, key) {
  const sorted = [...COUNTRIES].sort((a, b) => b[key] - a[key]);
  return sorted.findIndex((c) => c.code === country.code) + 1;
}

export function totals() {
  const population = COUNTRIES.reduce((s, c) => s + c.population, 0);
  const gdp = COUNTRIES.reduce((s, c) => s + c.gdp, 0);
  return { population, gdp, countries: COUNTRIES.length };
}
