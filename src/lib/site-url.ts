/**
 * The deployment's own public origin.
 *
 * Needed anywhere an absolute URL has to be produced — link-preview images,
 * robots.txt, the sitemap.
 *
 * The order matters. VERCEL_URL is tempting and wrong as a primary source: it
 * is the generated URL of one specific deployment, so a site on a custom
 * domain still gets a project-xyz123.vercel.app address from it, and a sitemap
 * built that way lists URLs Google rejects as belonging to another host.
 * VERCEL_PROJECT_PRODUCTION_URL is the project's production domain — the
 * custom one when a custom one is attached — which is what a canonical URL
 * should say. VERCEL_URL is kept last so preview deployments still describe
 * themselves rather than falling back to localhost.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return new URL(`https://${production}`);

  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`);

  return new URL("http://localhost:3000");
}
