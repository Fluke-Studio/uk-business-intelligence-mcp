# UK Business Intelligence API & MCP Server

[![npm version](https://img.shields.io/npm/v/uk-business-intelligence-mcp)](https://www.npmjs.com/package/uk-business-intelligence-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)

Know everything about any UK business in one API call. Company records, Google reviews, website health, and social profiles — unified into a single JSON response.

Also available as an **MCP server** for Claude Desktop and Cursor.

### Why this over existing Companies House MCP servers?

There are 3 Companies House MCP servers on GitHub — all are thin wrappers around the CH API alone. This is different:

- **4 data sources in one call** — Companies House + Google Places + DNS/SSL + social media
- **Intelligent matching** — automatically links company records to their Google Places listing
- **Built-in caching** — 7-day cache on company data, 24hr on everything else
- **Production-ready** — rate limiting, usage tracking, graceful degradation when sources fail

## Quick Start

### Option 1: MCP Server (for Claude Desktop / Cursor)

Add this to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "uk-business-intel": {
      "command": "npx",
      "args": ["-y", "uk-business-intelligence-mcp"],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your-key",
        "COMPANIES_HOUSE_API_KEY": "your-key",
        "GOOGLE_PLACES_API_KEY": "your-key",
        "API_KEY_SALT": "your-random-32-char-string"
      }
    }
  }
}
```

Then ask Claude: *"Look up Greggs in Newcastle"* — it returns the full enriched profile.

### Option 2: REST API

```bash
# 1. Create an API key
curl -X POST https://your-domain.com/api/v1/keys \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'

# 2. Enrich a business
curl -X POST https://your-domain.com/api/v1/enrich \
  -H "Content-Type: application/json" \
  -H "x-api-key: ukb_your_key_here" \
  -d '{"business_name": "Greggs", "location": "Newcastle"}'
```

## Data Sources

| Source | Data Returned | Cache TTL |
|--------|--------------|-----------|
| Companies House API | Company number, status, directors, SIC codes, registered address | 7 days |
| Google Places API (New) | Rating, review count, phone, website, Google Maps link | 24 hours |
| DNS/HTTP Check | Website live status, SSL certificate, HTTP status | 24 hours |
| Homepage Scraper | Facebook, Instagram, LinkedIn, Twitter links | 24 hours |

## MCP Server

The MCP server exposes a single tool: `enrich_uk_business`.

**Tool parameters:**
| Parameter | Required | Description |
|-----------|----------|-------------|
| `business_name` | Yes | Business name to look up |
| `location` | Yes | City, town, or area in the UK |
| `company_number` | No | 8-digit Companies House number |
| `domain` | No | Business website domain |

**How it works:** The MCP server calls the enrichment orchestrator directly (no HTTP round-trip). It runs locally on your machine via stdio transport.

**Supported clients:** Claude Desktop, Cursor, any MCP-compatible client.

## API Reference

### `POST /api/v1/keys`

Create an API key. No authentication required. Max 3 active keys per email.

**Request:**
```json
{
  "email": "developer@example.com",
  "plan": "free"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "api_key": "ukb_a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5",
    "key_prefix": "ukb_a3f8b2c1...",
    "plan": "free",
    "message": "Store this API key securely. It will not be shown again."
  }
}
```

### `POST /api/v1/enrich`

Enrich a UK business. Requires `x-api-key` header.

**Request:**
```json
{
  "business_name": "Greggs",
  "location": "Newcastle",
  "company_number": "00502851",
  "domain": "greggs.co.uk"
}
```

Only `business_name` and `location` are required. `company_number` and `domain` are optional — if omitted, they'll be discovered automatically.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "query": {
      "business_name": "Greggs",
      "location": "Newcastle",
      "company_number": null,
      "domain": null
    },
    "companies_house": {
      "company_number": "00502851",
      "company_name": "GREGGS PLC",
      "company_status": "active",
      "incorporation_date": "1951-09-22",
      "company_type": "plc",
      "sic_codes": ["10710", "47240"],
      "registered_address": {
        "address_line_1": "Greggs House",
        "address_line_2": "Quorum Business Park",
        "locality": "Newcastle Upon Tyne",
        "region": "Tyne and Wear",
        "postal_code": "NE12 8BU",
        "country": "England"
      },
      "directors": [
        {
          "name": "SHERWOOD, Roisin",
          "role": "director",
          "appointed_on": "2019-05-01",
          "resigned_on": null
        }
      ]
    },
    "google_places": {
      "place_id": "ChIJx9k5WQ1yfkgRnx-XPkd9DGw",
      "display_name": "Greggs",
      "formatted_address": "Northumberland St, Newcastle upon Tyne NE1 7DE",
      "rating": 4.1,
      "review_count": 1847,
      "phone": "0191 232 7749",
      "website": "https://www.greggs.co.uk",
      "google_maps_url": "https://maps.google.com/?cid=7771234567890"
    },
    "website": {
      "domain": "greggs.co.uk",
      "is_live": true,
      "http_status": 200,
      "ssl_valid": true,
      "ssl_expiry": "2027-01-15T00:00:00Z"
    },
    "social": {
      "facebook": "https://facebook.com/GreggsFans",
      "instagram": null,
      "linkedin": "https://linkedin.com/company/greggs",
      "twitter": "https://twitter.com/GreggsOfficial"
    },
    "meta": {
      "sources_successful": ["companies_house", "google_places", "dns", "scrape"],
      "sources_failed": [],
      "sources_skipped": [],
      "cached_sources": [],
      "enriched_at": "2026-03-21T14:30:00.000Z",
      "duration_ms": 1247
    }
  }
}
```

### `GET /api/v1/usage`

Check your current month's usage. Requires `x-api-key` header.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "plan": "free",
    "month": "2026-03",
    "lookups_used": 47,
    "lookups_limit": 100,
    "lookups_remaining": 53,
    "overage_count": 0,
    "rate_limit_per_minute": 10
  }
}
```

### `DELETE /api/v1/keys`

Revoke your API key. Requires `x-api-key` header (the key being revoked).

### `GET /api/v1/health`

Service health check. No authentication required.

## Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Invalid request body |
| 401 | Missing or invalid API key |
| 403 | Monthly quota exceeded |
| 429 | Rate limit exceeded (retry after 60s) |
| 500 | Internal server error |

All errors return:
```json
{ "success": false, "error": "Description of the error" }
```

## Pricing

| Plan | Lookups/Month | Rate Limit | Price |
|------|--------------|------------|-------|
| Free | 100 | 10/min | Free |
| Starter | 1,000 | 60/min | £29/mo |
| Growth | 5,000 | 120/min | £79/mo |
| Scale | 20,000 | 120/min | £199/mo |

Paid plans allow overage at £0.03 per additional lookup. Free tier hard-stops at 100.

## Self-Hosting Setup

### Prerequisites

- Node.js 18+
- Supabase project (free tier works)
- Companies House API key (free — register at [developer.company-information.service.gov.uk](https://developer.company-information.service.gov.uk))
- Google Cloud project with Places API (New) enabled

### Installation

```bash
git clone https://github.com/Fluke-Studio/uk-business-intelligence-mcp.git
cd uk-business-intelligence-mcp
npm install
cp .env.example .env.local
# Fill in your API keys in .env.local
```

### Database Setup

1. Go to your Supabase dashboard > SQL Editor
2. Paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Click "Run"

This creates all tables, indexes, RPC functions, and cleanup jobs.

### Environment Variables

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
COMPANIES_HOUSE_API_KEY=your-ch-api-key
GOOGLE_PLACES_API_KEY=your-google-api-key
API_KEY_SALT=random-32-character-string
```

### Local Development

```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Production build (Next.js)
npm run build:mcp    # Build MCP server to dist/
npm start            # Production server
```

### Deploy to Vercel

1. Push repo to GitHub
2. Import in [Vercel](https://vercel.com) — it auto-detects Next.js
3. Add environment variables in Vercel dashboard (Settings > Environment Variables)
4. Deploy — Vercel handles the rest

### Publish MCP Server to npm

```bash
# Update package.json with your GitHub username in repository/bugs/homepage URLs
npm run build:mcp    # Builds to dist/
npm publish          # Publishes to npm (prepublishOnly auto-runs build:mcp)
```

After publishing, anyone can use your MCP server with:
```
npx uk-business-intelligence-mcp
```

## Architecture

```
POST /api/v1/enrich
  → Validate body (Zod)
  → Authenticate (x-api-key → SHA-256 hash → DB lookup)
  → Rate limit (fixed-window, DB-backed)
  → Quota check (monthly counter)
  → Enrichment orchestrator
      Round 1 (parallel): Companies House + Google Places
      Round 2 (parallel, if domain found): DNS/SSL Check + Social Scraper
  → Return merged JSON profile

MCP Server (stdio)
  → Receives enrich_uk_business tool call
  → Calls enrichment orchestrator directly (no HTTP)
  → Returns JSON profile to MCP client
```

- **Partial results**: If one source fails, the rest still return data
- **Smart caching**: Supabase-backed with per-source TTLs
- **Rate limiting**: Atomic Postgres RPC functions (no Redis needed)
- **Security**: API keys SHA-256 hashed with salt, never stored raw

## Tech Stack

- **Next.js 14** (App Router, API routes)
- **TypeScript** (strict mode)
- **Supabase** (Postgres, auth, caching)
- **MCP SDK** (Model Context Protocol server)
- **Vercel** (serverless deployment, London region)
- **Zod** (request validation)
- **Tailwind CSS** (landing page)

## License

MIT — see [LICENSE](LICENSE).
