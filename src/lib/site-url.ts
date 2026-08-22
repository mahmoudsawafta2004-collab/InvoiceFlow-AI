/**
 * The deployment's own public origin.
 *
 * Needed anywhere an absolute URL has to be produced — link-preview images,
 * robots.txt, the sitemap. Set NEXT_PUBLIC_SITE_URL to the production domain;
 * on Vercel, VERCEL_URL covers preview deployments with no configuration, and
 * localhost keeps `next dev` working out of the box.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`);
  return new URL("http://localhost:3000");
}
