import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        default: 'Verdify - Enterprise Satellite Analysis',
        template: '%s | Verdify',
    },
    description: 'Enterprise-grade satellite analysis platform for vegetation monitoring and geospatial intelligence.',
    keywords: ['satellite analysis', 'NDVI', 'vegetation monitoring', 'geospatial', 'enterprise'],
    authors: [{ name: 'Verdify' }],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://verdify.com',
        siteName: 'Verdify',
        title: 'Verdify - Enterprise Satellite Analysis',
        description: 'Enterprise-grade satellite analysis platform for vegetation monitoring and geospatial intelligence.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Verdify - Enterprise Satellite Analysis',
        description: 'Enterprise-grade satellite analysis platform for vegetation monitoring and geospatial intelligence.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
