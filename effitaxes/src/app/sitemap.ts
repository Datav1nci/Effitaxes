import { MetadataRoute } from 'next';
import { getAllLandingPageSlugs } from '@/lib/landingPages';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.effitaxes.com';
    const locales = ['fr', 'en'];

    // Base routes
    const routes = [
        '',
        '/inscription',
        '/about',
        '/contact',
        '/projets',
        '/privacy',
        '/terms',
    ];

    // Get landing page slugs
    const landingPageSlugs = getAllLandingPageSlugs();

    // Generate sitemap entries for all locales and routes
    const entries: MetadataRoute.Sitemap = [];

    locales.forEach((locale) => {
        routes.forEach((route) => {
            entries.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1.0 : 0.8,
            });
        });

        // Add landing pages
        landingPageSlugs.forEach((slug) => {
            entries.push({
                url: `${baseUrl}/${locale}/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9, // High priority for SEO landing pages
            });
        });
    });

    return entries;
}
