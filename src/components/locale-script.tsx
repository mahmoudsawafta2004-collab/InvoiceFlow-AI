const LOCALES = ["en", "es", "ar", "fr", "de"];
const RTL = ["ar"];

/**
 * Sets <html lang/dir> before first paint, mirroring ThemeScript. Falls back
 * to the browser's language only when it is one of the five we ship —
 * anything else defaults to English rather than showing a half-translated
 * page.
 */
const script = `
(function () {
  try {
    var LOCALES = ${JSON.stringify(LOCALES)};
    var RTL = ${JSON.stringify(RTL)};
    var stored = localStorage.getItem('invoiceflow.locale');
    var locale = stored;
    if (!locale || LOCALES.indexOf(locale) === -1) {
      var nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
      locale = LOCALES.indexOf(nav) !== -1 ? nav : 'en';
    }
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL.indexOf(locale) !== -1 ? 'rtl' : 'ltr';
  } catch (e) {}
})();
`;

export function LocaleScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
