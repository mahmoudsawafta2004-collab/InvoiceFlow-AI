import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/** Same reason as the sitemap: the origin has to be read at request time. */
export const dynamic = "force-dynamic";

/**
 * Keeps crawlers on the marketing pages. The signed-in screens would only ever
 * render an empty shell to a crawler, /admin should not be advertised at all,
 * and the auth callbacks and password-reset screens carry one-time tokens that
 * have no business in an index.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl().origin;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/dashboard",
          "/history",
          "/workspace",
          "/auth/",
          "/update-password",
          "/forgot-password",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
