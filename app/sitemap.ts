import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * XML sitemap, generated at /sitemap.xml.
 *
 * Lists every public, indexable page with a priority that reflects how
 * much we want it ranked. The editor (/app), auth, and account pages are
 * intentionally excluded — they're behind login and have no SEO value.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1.0, "weekly"),
    page("/about", 0.6, "monthly"),
    page("/changelog", 0.5, "weekly"),
    page("/contact", 0.4, "monthly"),
    page("/privacy", 0.3, "yearly"),
    page("/terms", 0.3, "yearly"),
    page("/refund", 0.3, "yearly"),
    page("/shipping", 0.3, "yearly"),
  ];
}
