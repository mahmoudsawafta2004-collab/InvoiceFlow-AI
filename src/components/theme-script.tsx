/**
 * Applies the stored theme before first paint so the page never flashes the
 * wrong palette. Runs blocking in <head>, so it is kept deliberately tiny.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem('invoiceflow.theme');
    var dark = stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
