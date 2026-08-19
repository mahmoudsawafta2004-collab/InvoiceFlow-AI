/**
 * Applies the stored theme before first paint so the page never flashes the
 * wrong palette. Runs blocking in <head>, so it is kept deliberately tiny.
 */
const script = `
(function () {
  try {
    // Light is the default for everyone, including visitors whose OS is dark —
    // dark is opt-in through the toggle only.
    if (localStorage.getItem('invoiceflow.theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
