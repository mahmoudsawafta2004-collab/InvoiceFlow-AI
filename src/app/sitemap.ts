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
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl().origin;
  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/signup`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/login`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
