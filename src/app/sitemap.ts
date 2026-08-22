import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/**
 * Resolved per request. Statically generated, these URLs would be fixed to
 * whatever origin was configured at build time — so a deployment that sets its
 * domain only in the runtime environment would publish a sitemap full of
 * localhost links.
 */
export const dynamic = "force-dynamic";

/**
 * Only the pages a stranger should be able to land on cold. The workspace,
 * dashboard, history and admin screens are behind a session and say nothing
 * useful to a crawler, and the password-reset screens are meaningless without
 * the token that leads to them.
 *
 * Deliberately just locations. `lastmod` would have to be invented here —
 * rendering per request, any date built at call time claims every page changed
 * this second, every time a crawler looks, and Google discards lastmod it
 * cannot trust. `changefreq` and `priority` are ignored outright. Stating only
 * what is true leaves nothing to be disbelieved.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl().origin;

  return ["/", "/signup", "/login", "/terms", "/privacy"].map((path) => ({
    url: `${base}${path}`,
  }));
}
