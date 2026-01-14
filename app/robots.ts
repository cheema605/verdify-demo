import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            disallow: ['/login', '/dashboard', '/api'],
        },
        sitemap: 'https://verdify.com/sitemap.xml',
    };
}
