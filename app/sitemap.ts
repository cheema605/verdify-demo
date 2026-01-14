import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    // Since all pages are behind authentication, we don't include any pages in the sitemap
    // In the future, add public pages here if any exist
    return [];
}
