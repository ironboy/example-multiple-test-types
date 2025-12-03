import { currentLang } from "./routeLocalize";

const langToCurrency: any = {
  'en': { country: 'US', decimals: 2, options: { currency: 'USD' } },
  'sv': { country: 'SE', decimals: 0, options: { currency: 'SEK' } },
  'no': { country: 'NO', decimals: 0, options: { currency: 'NOK' } }
};

export async function getExchangeRates() {
  // Get the exchange rates (with usd as base unit)
  const rates = (await (await fetch('/api/exchange-rates')).json()).usd;
  // Update langToCurrency with more info
  for (let key in langToCurrency) {
    const settings = langToCurrency[key];
    const { country, decimals } = settings;
    const { currency } = settings.options;
    const multiplier = rates[currency.toLowerCase()] || 1;
    langToCurrency[key] = {
      country,
      decimals,
      multiplier,
      options: {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }
    };
  }
}

// Update the exchange rates once an hour
setInterval(getExchangeRates, 60 * 60 * 1000);

// Convert and format a price
export default function priceFormatter(price$: number) {
  const lang = currentLang();
  const settings = langToCurrency[lang];
  const { options, country, multiplier } = settings;
  const formatter = new Intl.NumberFormat(lang + '-' + country, options);
  return formatter.format(price$ * multiplier);
}