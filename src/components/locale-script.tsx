const LOCALES = ["en", "es", "ar", "fr", "de"];
const RTL = ["ar"];

/**
 * Sets <html lang/dir> before first paint, mirroring ThemeScript. English is
 * the default for every first-time visitor regardless of browser or OS
 * language — the same way the theme defaults to light regardless of OS dark
 * mode (see theme-script.tsx). A locale only changes once someone picks one
 * explicitly from the language switcher, which is what gets stored and
 * read back here on later visits.
 */
const script = `
(function () {
  try {
    var LOCALES = ${JSON.stringify(LOCALES)};
    var RTL = ${JSON.stringify(RTL)};
    var stored = localStorage.getItem('invoiceflow.locale');
    var locale = (stored && LOCALES.indexOf(stored) !== -1) ? stored : 'en';
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL.indexOf(locale) !== -1 ? 'rtl' : 'ltr';
  } catch (e) {}
})();
`;

export function LocaleScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
