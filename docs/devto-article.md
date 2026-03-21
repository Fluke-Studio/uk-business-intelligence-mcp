---
title: I Built a UK Business Intelligence MCP Server — Here's How
published: false
tags: mcp, api, typescript, nextjs
canonical_url: https://ukbusinessintel.com
---

Last month I needed UK business data for a project I was building. Company records, Google ratings, whether their website was actually live, social media links — the full picture.

The options were grim. Wire up 4 separate APIs yourself (Companies House, Google Places, DNS lookups, web scraping), each with different auth methods, rate limits, and response formats. Or pay an enterprise vendor like Creditsafe or OpenCorporates — starting at £2,250/year for API access.

I wanted something in between. A single API call that returns everything, at a price a solo dev can afford.

So I built it.

## What It Does

Send a business name and location. Get back a complete profile from 4 data sources:

```bash
curl -X POST https://ukbusinessintel.com/api/v1/enrich \
  -H "X-API-Key: ukb_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"business_name": "Greggs", "location": "Newcastle"}'
```

The response combines data from Companies House, Google Places, DNS/SSL checks, and social media scraping into a single JSON object:

```json
{
  "companies_house": {
    "company_number": "01752681",
    "company_name": "GREGGS PLC",
    "company_status": "active",
    "incorporation_date": "1983-09-21",
    "sic_codes": ["10710", "47240"],
    "directors": [
      { "name": "SHERWOOD, Matthew James", "role": "director" },
      { "name": "SHERWOOD, Raymond Thomas", "role": "director" }
    ]
  },
  "google_places": {
    "display_name": "Greggs",
    "rating": 4.1,
    "review_count": 1847,
    "phone": "+44 191 281 7721",
    "website": "https://www.greggs.co.uk/"
  },
  "website": {
    "domain": "www.greggs.co.uk",
    "is_live": true,
    "http_status": 200,
    "ssl_valid": true,
    "ssl_expiry": "2026-04-15T23:59:59.000Z"
  },
  "social": {
    "facebook": "https://www.facebook.com/GreggsBakery",
    "instagram": "https://www.instagram.com/greaborggs_official",
    "linkedin": "https://www.linkedin.com/company/greggs",
    "twitter": "https://twitter.com/GreggsOfficial"
  },
  "meta": {
    "sources_successful": ["companies_house", "google_places", "dns", "scrape"],
    "duration_ms": 847
  }
}
```

One call. Four sources. Under 2 seconds.

## Architecture

The enrichment runs in two rounds of parallel execution:

```
Round 1 (parallel):
  ├── Companies House API → company records, directors, SIC codes
  └── Google Places API   → ratings, reviews, phone, website

Round 2 (parallel, only if domain discovered):
  ├── DNS/SSL Check       → is the site live? cert valid?
  └── Web Scraper         → social media links from homepage
```

Round 2 depends on Round 1 because the business's website domain often comes from the Google Places result. If the user already provides a domain, both rounds run immediately.

Here's the core orchestration:

```typescript
// Round 1: Companies House + Google Places in parallel
const [chResult, gpResult] = await Promise.allSettled([
  cachedFetch(companiesHouseAdapter, input),
  cachedFetch(googlePlacesAdapter, input),
]);

// Discover domain from Google Places website
if (!input.domain && gp.website) {
  input.domain = extractDomain(gp.website);
}

// Round 2: DNS + Web Scraper (only if domain available)
if (input.domain) {
  const [dnsResult, scrapeResult] = await Promise.allSettled([
    cachedFetch(dnsCheckAdapter, input),
    cachedFetch(webScraperAdapter, input),
  ]);
}
```

Every adapter returns a consistent shape with `success`, `data`, and `cached` fields. If a source fails, the response still returns data from the sources that succeeded — you get partial results instead of an error.

### Caching Without Redis

I didn't want to add Redis to the stack. Instead, all caching goes through Supabase (Postgres) with different TTLs per source:

- **Companies House**: 7 days (company data changes slowly)
- **Google Places**: 24 hours (ratings and reviews change more often)
- **DNS/SSL**: 24 hours
- **Web scraping**: 24 hours

Rate limiting also uses Postgres — atomic RPC functions handle the fixed-window counters instead of Redis INCR. One fewer service to manage.

## The MCP Angle

This is also published as an [MCP server](https://modelcontextprotocol.io/) on npm. If you use Claude Desktop or Cursor, you can add it to your config and ask Claude to look up any UK business:

```json
{
  "mcpServers": {
    "uk-business-intelligence": {
      "command": "npx",
      "args": ["-y", "uk-business-intelligence-mcp"],
      "env": {
        "SUPABASE_URL": "your-url",
        "SUPABASE_SERVICE_ROLE_KEY": "your-key",
        "COMPANIES_HOUSE_API_KEY": "your-ch-key",
        "GOOGLE_PLACES_API_KEY": "your-google-key"
      }
    }
  }
}
```

Then you can say "Tell me about Greggs in Newcastle" and Claude calls the tool, gets the enriched profile, and summarises it conversationally.

The MCP server exposes a single tool — `enrich_uk_business` — and calls the same enrichment orchestrator as the REST API. No HTTP round-trip, it runs the adapters directly.

Why MCP matters: there are a few Companies House MCP servers already out there, but they're thin wrappers around the Companies House API alone. This one combines 4 sources, handles caching, and degrades gracefully. That's the difference between "here's a company number lookup" and "here's everything you need to know about this business."

## What I Learned

**Google Places API pricing is a trap.** The new Places API (post-2025) has tiered pricing. Basic fields like name and address are cheap. But the fields you actually want — ratings, reviews, phone number, website — are in the "Pro" tier at $20/1,000 requests. Plan your field masks carefully or you'll burn through budget fast.

**Companies House API is free but quirky.** The search endpoint returns fuzzy matches, so "Greggs" might return "Greggs PLC", "Greggs Properties Ltd", and "Mrs Greggs Bakery Ltd." I sort results by active companies first and match by name similarity.

**Web scraping for social links is fragile.** Every site structures their footer differently. I look for `href` patterns matching known social media domains (facebook.com, instagram.com, etc.) in the homepage HTML. It works for ~80% of businesses, which is good enough when it's one of four data sources.

**You don't need Redis for rate limiting.** A Postgres function with `INSERT ... ON CONFLICT DO UPDATE` and a timestamp check handles fixed-window rate limiting atomically. One fewer dependency, and it's fast enough for the throughput I need.

## Try It

**Free tier**: 100 lookups/month, no credit card required.

- **Website**: [ukbusinessintel.com](https://ukbusinessintel.com)
- **GitHub**: [Fluke-Studio/uk-business-intelligence-mcp](https://github.com/Fluke-Studio/uk-business-intelligence-mcp)
- **npm**: `npx uk-business-intelligence-mcp`
- **Official MCP Registry**: `io.github.Fluke-Studio/uk-business-intelligence`

If you work with UK business data — lead gen, CRM enrichment, due diligence, local SEO — I'd love to hear what data points you'd want added next. Open an issue or just try the free tier and let me know.
