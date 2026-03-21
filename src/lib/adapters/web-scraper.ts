import { DataSourceAdapter, AdapterInput, AdapterResult } from './types';

interface SocialLinksData {
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null;
}

const SOCIAL_PATTERNS: Array<{ key: keyof SocialLinksData; pattern: RegExp }> = [
  { key: 'facebook', pattern: /https?:\/\/(?:www\.)?facebook\.com\/[a-zA-Z0-9._-]+/i },
  { key: 'instagram', pattern: /https?:\/\/(?:www\.)?instagram\.com\/[a-zA-Z0-9._-]+/i },
  { key: 'linkedin', pattern: /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[a-zA-Z0-9._-]+/i },
  { key: 'twitter', pattern: /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+/i },
];

function extractSocialLinks(html: string): SocialLinksData {
  const result: SocialLinksData = {
    facebook: null,
    instagram: null,
    linkedin: null,
    twitter: null,
  };

  for (const { key, pattern } of SOCIAL_PATTERNS) {
    const match = html.match(pattern);
    if (match) {
      result[key] = match[0];
    }
  }

  return result;
}

export const webScraperAdapter: DataSourceAdapter<SocialLinksData> = {
  source: 'scrape',
  cacheTtlSeconds: 86400, // 24 hours

  getCacheKey(input: AdapterInput): string | null {
    if (input.domain) return `scrape:${input.domain}`;
    return null;
  },

  async fetch(input: AdapterInput): Promise<AdapterResult<SocialLinksData>> {
    if (!input.domain) {
      return { success: false, data: null, source: 'scrape', cached: false, error: 'No domain provided' };
    }

    try {
      const res = await fetch(`https://${input.domain}`, {
        headers: {
          'User-Agent': 'UKBusinessAPI/1.0 (Business Data Enrichment)',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        return { success: false, data: null, source: 'scrape', cached: false, error: `HTTP ${res.status}` };
      }

      // Limit response size to 512KB to prevent memory exhaustion on huge pages
      const contentLength = res.headers.get('content-length');
      const MAX_SIZE = 512 * 1024;
      if (contentLength && parseInt(contentLength, 10) > MAX_SIZE) {
        return { success: false, data: null, source: 'scrape', cached: false, error: 'Page too large' };
      }

      const html = (await res.text()).slice(0, MAX_SIZE);
      const data = extractSocialLinks(html);

      return { success: true, data, source: 'scrape', cached: false };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, data: null, source: 'scrape', cached: false, error: message };
    }
  },
};
