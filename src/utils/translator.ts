import { currentLang } from "./routeLocalize";

interface Translations {
  [key: string]: { [lang: string]: string; };
}

interface TranslationEntry {
  original: string;
  regex: RegExp;
  translations: { [lang: string]: string; };
  length: number;
}

const baseLang = 'en';
const priceRegex = /^[\$€£¥₹₽]/;
const translationMap = new WeakMap<Text, { [lang: string]: string; }>();
let translationTable: Translations;
let translationEntries: TranslationEntry[] = [];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\d+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function longestTranslationsFirst(translations: Translations) {
  return Object.fromEntries(Object.entries(translations)
    .sort(([keyA], [keyB]) => keyB.length - keyA.length));
}

export async function getTranslations() {
  const translations = await (await fetch('/translations.json')).json();
  translationTable = longestTranslationsFirst(translations);
  translationEntries = Object.keys(translationTable).map(key => {
    const words = key.split(' ');
    const pattern = words.map(word =>
      word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    ).join('\\s*[\\W\\d]*\\s*');

    return {
      original: key,
      regex: new RegExp(pattern, 'gi'),
      translations: translationTable[key],
      length: normalize(key).length
    };
  });

  translationEntries.sort((a, b) => b.length - a.length);
}

function translatePhrase(text: string, targetLang: string): string {
  let result = text;

  for (const entry of translationEntries) {
    if (!entry.translations[targetLang]) continue;

    entry.regex.lastIndex = 0;

    result = result.replace(entry.regex, (match) => {
      const isCapitalized = /^[A-Z]/.test(match);
      const isAllCaps = match.toUpperCase() === match && /[A-Z]/.test(match);

      let translation = entry.translations[targetLang];

      if (isAllCaps) {
        translation = translation.toUpperCase();
      } else if (isCapitalized) {
        translation = translation.charAt(0).toUpperCase() + translation.slice(1);
      }

      return translation;
    });
  }

  return result;
}

function translate() {

  fixSelects();
  const to = currentLang();
  const textNodes = getTextNodes()
    .filter(x => x.textContent?.trim())
    .filter(x => !priceRegex.test(x.textContent || ''));

  textNodes.forEach(el => translationMap.get(el)
    || translationMap.set(el, { [baseLang]: el.textContent || '' }));

  textNodes.forEach(el => {
    const state = translationMap.get(el)!;
    if (!state[to]) {
      const originalText = state[baseLang];
      const phraseTranslation = translatePhrase(originalText, to);
      if (phraseTranslation !== originalText) {
        state[to] = phraseTranslation;
      } else {
        const exactTranslation = translationTable[originalText]?.[to];
        if (exactTranslation) {
          state[to] = exactTranslation;
        }
      }
    }
    state[to] && state[to] !== el.textContent && (el.textContent = state[to]);
  });
}

function fixSelects() {
  [...document.querySelectorAll('select')].forEach(select => {
    [...select.querySelectorAll('option')].forEach(option =>
      option.hasAttribute('value')
      || option.setAttribute('value', option.textContent?.trim() || '')
    );
  });
}

function getTextNodes(el: Element = document.body) {
  const children: Text[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    children.push(walker.currentNode as Text);
  }
  return children;
}

// Run the translator when the DOM changes
const observer = new MutationObserver(translate);
observer.observe(document.body, {
  childList: true,
  subtree: true
});