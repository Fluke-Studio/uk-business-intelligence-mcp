---
title: "Companies House API Is Painful — Here's What I Built on Top of It"
published: false
tags: api, typescript, tutorial, webdev
canonical_url: https://ukbusinessintel.com
---

The Companies House API is free, publicly available, and gives you access to data on over 5 million UK companies. It's also one of the most frustrating APIs I've ever worked with.

I spent a weekend trying to build a simple "look up a UK business and tell me everything about it" feature. By Sunday evening I had a working prototype, a mounting list of complaints, and a strong conviction that someone needed to build a better abstraction on top of this thing.

So I did.

## The Pain Points

### 1. Fuzzy Search Returns Too Many Results

The search endpoint is generous with matches. Search for "Greggs" and you'll get back 50+ results:

```
GREGGS PLC
GREGGS PROPERTIES LIMITED
GREGGS FOUNDATION
GREGGS (NOMINEES) LIMITED
MRS GREGGS BAKERY LTD
GREGGS CONSULTING LTD
...
```

There's no relevance scoring in the response. The results aren't sorted by how well they match your query, or by whether the company is active vs dissolved. You have to implement your own ranking logic, which means fetching extra data just to figure out which result is the one you actually wanted.

### 2. Three API Calls Per Company (Minimum)

Want a complete picture of a company? You need at least three sequential requests:

```
1. GET /search/companies?q=greggs    → get the company number
2. GET /company/01752681             → get company details
3. GET /company/01752681/officers    → get directors
```

The search endpoint doesn't return directors. The company profile endpoint doesn't include officers. The officers endpoint doesn't include company details. Every piece of data lives behind a different URL, and you're stitching them together yourself.

```typescript
// What you have to do with raw Companies House API:
const searchRes = await fetch(
  'https://api.company-information.service.gov.uk/search/companies?q=greggs&items_per_page=1',
  { headers: { Authorization: `Basic ${btoa(apiKey + ':')}` } }
);
const searchData = await searchRes.json();
const companyNumber = searchData.items[0].company_number;

const profileRes = await fetch(
  `https://api.company-information.service.gov.uk/company/${companyNumber}`,
  { headers: { Authorization: `Basic ${btoa(apiKey + ':')}` } }
);
const profile = await profileRes.json();

const officersRes = await fetch(
  `https://api.company-information.service.gov.uk/company/${companyNumber}/officers`,
  { headers: { Authorization: `Basic ${btoa(apiKey + ':')}` } }
);
const officers = await officersRes.json();

// Now manually combine profile + officers into something useful...
```

That's three round-trips just for Companies House data. And you still don't have a phone number, a Google rating, a website status, or social media links.

### 3. Rate Limits Are Poorly Documented

The official documentation mentions a rate limit of 600 requests per 5 minutes. In practice, the behavior is inconsistent. I've hit 429s well before the stated limit during peak hours, and the response headers don't always include the retry-after info you'd expect. You need to build your own backoff logic and hope for the best.

### 4. No Location Data, Ratings, or Contact Info

Companies House gives you the **registered office address** — which for many small businesses is their accountant's office, not where they actually operate. You don't get:

- Phone number
- Google Maps rating or reviews
- Trading address (where customers actually go)
- Website URL
- Social media links
- Whether the website is actually live

For most use cases — lead generation, CRM enrichment, local SEO, supplier vetting — you need all of that. Companies House alone is only one piece of the puzzle.

### 5. Response Format Is Inconsistent

Field names change between endpoints. The search response uses `company_number` but officer data uses `appointed_to.company_number`. Date formats vary. Some fields are nested objects on one endpoint and flat strings on another. Null values are sometimes omitted entirely rather than returned as `null`.

It's the kind of API that works fine when you're reading the docs, and then surprises you constantly when you're writing actual code against it.

## What I Actually Wanted

One function call. Give it a business name and location. Get back everything:

- Company registration details (status, directors, SIC codes, incorporation date)
- Google Places data (rating, reviews, phone number, website)
- Website status (is it live? valid SSL?)
- Social media links

Structured as a single JSON object, with consistent field names, null values where data isn't available (not missing keys), and metadata about which sources succeeded.

## What I Built

The [UK Business Intelligence API](https://ukbusinessintel.com) wraps Companies House and enriches it with three additional data sources: Google Places API, DNS/SSL checks, and web scraping for social links.

### The Architecture

The enrichment runs in two rounds of parallel execution:

```
Round 1 (parallel):
  ├── Companies House API → company records, directors, SIC codes
  └── Google Places API   → ratings, reviews, phone, website URL

Round 2 (parallel, uses website URL discovered in Round 1):
  ├── DNS/SSL Check       → is the site live? valid certificate?
  └── Web Scraper         → social media links from homepage
```

Round 2 depends on Round 1 because the business's website domain usually comes from the Google Places result. If the caller already provides a domain, both rounds fire immediately.

Here's the core orchestration:

```typescript
// Round 1: Companies House + Google Places in parallel
const [chResult, gpResult] = await Promise.allSettled([
  cachedFetch(companiesHouseAdapter, input),
  cachedFetch(googlePlacesAdapter, input),
]);

// Discover domain from Google Places
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

Each data source is an adapter with a consistent interface. If one source fails — say Google Places is down — the response still returns data from the sources that succeeded. You get partial results, not an error. The `meta` object tells you exactly which sources worked and which didn't.

### Caching Without Redis

Every response is cached in Postgres (via Supabase) with per-source TTLs:

- **Companies House**: 7 days — company registrations change slowly
- **Google Places**: 24 hours — ratings and reviews shift daily
- **DNS/SSL**: 24 hours
- **Web scraping**: 24 hours

Rate limiting also runs through Postgres using atomic `INSERT ... ON CONFLICT DO UPDATE` functions. No Redis to deploy, no separate cache layer to manage.

## One Call vs Three+

Here's the comparison. With the raw Companies House API, to get a reasonably complete picture of a UK business:

```bash
# Companies House: search
curl https://api.company-information.service.gov.uk/search/companies?q=greggs \
  -u YOUR_API_KEY:

# Companies House: company profile
curl https://api.company-information.service.gov.uk/company/01752681 \
  -u YOUR_API_KEY:

# Companies House: officers
curl https://api.company-information.service.gov.uk/company/01752681/officers \
  -u YOUR_API_KEY:

# And you STILL don't have a phone number, rating, website status, or social links.
# So now you need Google Places API, a DNS lookup, and a web scraper...
```

With the enrichment API:

```bash
curl -X POST https://ukbusinessintel.com/api/v1/enrich \
  -H "X-API-Key: ukb_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"business_name": "Greggs", "location": "Newcastle"}'
```

One call. The response includes everything:

```json
{
  "query": {
    "business_name": "Greggs",
    "location": "Newcastle"
  },
  "companies_house": {
    "company_number": "01752681",
    "company_name": "GREGGS PLC",
    "company_status": "active",
    "incorporation_date": "1983-09-21",
    "company_type": "plc",
    "sic_codes": ["10710", "47240"],
    "registered_address": {
      "address_line_1": "Greggs House",
      "locality": "Newcastle Upon Tyne",
      "postal_code": "NE12 8EX",
      "country": "England"
    },
    "directors": [
      { "name": "SHERWOOD, Matthew James", "role": "director", "appointed_on": "2019-05-22" },
      { "name": "SHERWOOD, Raymond Thomas", "role": "director", "appointed_on": "2013-01-02" }
    ]
  },
  "google_places": {
    "display_name": "Greggs",
    "formatted_address": "Northumberland St, Newcastle upon Tyne NE1 7AF",
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
    "instagram": "https://www.instagram.com/greggs_official",
    "linkedin": "https://www.linkedin.com/company/greggs",
    "twitter": "https://twitter.com/GreggsOfficial"
  },
  "meta": {
    "sources_successful": ["companies_house", "google_places", "dns", "scrape"],
    "sources_failed": [],
    "sources_skipped": [],
    "cached_sources": [],
    "enriched_at": "2026-03-21T14:30:00.000Z",
    "duration_ms": 847
  }
}
```

Consistent field names. Explicit nulls for missing data. Metadata showing exactly what happened behind the scenes.

## The MCP Server

This is also available as an open-source [MCP server on npm](https://www.npmjs.com/package/uk-business-intelligence-mcp). If you use Claude Desktop, Cursor, or any MCP-compatible client, you can add it to your config:

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

Then you can ask Claude "Tell me about Greggs in Newcastle" and it calls the enrichment tool directly — no HTTP, runs the adapters in-process. It exposes a single `enrich_uk_business` tool that returns the same unified profile.

There are a few other Companies House MCP servers out there, but they're thin wrappers around the CH API alone. This one combines four sources, caches results, and degrades gracefully when a source is unavailable.

## What I Learned Building This

**Google Places API pricing is a trap.** The new Places API has tiered field pricing. Basic fields (name, address) are cheap. The fields you actually want — ratings, reviews, phone, website — are "Pro" tier at $20 per 1,000 requests. Plan your field masks carefully.

**Companies House auth is Basic auth with an empty password.** You Base64-encode `your_api_key:` (note the trailing colon). It's not documented clearly and trips up a lot of people.

**Web scraping for social links works about 80% of the time.** Every site structures its footer differently. I scan `href` attributes for known social media domain patterns. It's not perfect, but when it's one of four data sources, 80% accuracy is acceptable.

**`Promise.allSettled` is the right choice over `Promise.all`.** If one adapter throws, you still want the results from the others. `Promise.all` would reject the entire batch.

## Try It

**Free tier**: 100 lookups/month. No credit card required.

- **Website**: [ukbusinessintel.com](https://ukbusinessintel.com)
- **npm**: `npx uk-business-intelligence-mcp`
- **GitHub**: [Fluke-Studio/uk-business-intelligence-mcp](https://github.com/Fluke-Studio/uk-business-intelligence-mcp)

If you've been fighting the Companies House API and wishing someone would just wrap it properly, this might save you a weekend. And if you need data points I haven't added yet, open an issue — I'm actively building this out.
