import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://effitaxes.com';
    const locales = ['fr', 'en'];

    // Base routes
    const routes = [
        '',
        '/inscription',
        '/about',
        '/contact',
        '/projets',
    ];

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
    });

    return entries;
}
