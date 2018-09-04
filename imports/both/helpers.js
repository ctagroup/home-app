export function translateString(str, translations) {
  if (typeof str !== 'string') return str;
  return Object.keys(translations).reduce((translated, key) => {
    const parts = translated.split(key);
    return parts.join(translations[key]);
  }, str);
}
