import type { MetadataRoute } from 'next';
import { UK_CITIES } from '@/lib/data/uk-cities';
import { INDUSTRIES } from '@/lib/data/industries';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ukbusinessintel.com';
  const now = new Date();

  // Core pages
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/docs`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/tools/company-lookup`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools/business-checker`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/dashboard`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/data`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    // Comparison pages
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compare/endole-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compare/opencorporates-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compare/duedil-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compare/companycheck-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/compare/cognism-alternative`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  // City data pages
  const cityPages: MetadataRoute.Sitemap = UK_CITIES.map((city) => ({
    url: `${baseUrl}/data/businesses-in-${city.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Industry pages
  const industryPages: MetadataRoute.Sitemap = INDUSTRIES.map((ind) => ({
    url: `${baseUrl}/data/${ind.slug}-companies-uk`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...corePages, ...cityPages, ...industryPages];
}
