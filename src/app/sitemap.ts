import type { MetadataRoute } from 'next';
import { UK_CITIES } from '@/lib/data/uk-cities';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ukbusinessintel.com';

  // Core pages
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/docs`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tools/company-lookup`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools/business-checker`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/dashboard`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/data`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/compare`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compare/endole-alternative`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compare/opencorporates-alternative`, changeFrequency: 'monthly', priority: 0.8 },
  ];

  // City data pages
  const cityPages: MetadataRoute.Sitemap = UK_CITIES.map((city) => ({
    url: `${baseUrl}/data/businesses-in-${city.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...corePages, ...cityPages];
}
