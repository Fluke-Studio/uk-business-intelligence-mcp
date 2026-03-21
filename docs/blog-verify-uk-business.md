---
title: "How to Verify If a UK Business Is Legitimate (Programmatically)"
published: false
tags: api, uk, business, typescript
canonical_url: https://ukbusinessintel.com
---

You're about to sign a contract with a new supplier. Or onboard a business customer. Or partner with a company you found online.

Before you do any of that, you need to answer one question: **is this business actually legitimate?**

In the UK, anyone can register a company for 12 quid. There are over 5 million companies on the register, and a significant chunk of them are dormant, dissolved, or outright fraudulent. If you're building software that deals with UK businesses — whether that's a marketplace, a lending platform, or a CRM — you need a way to verify them programmatically.

Here's how.

## The Manual Way (5 Steps)

If you're doing this by hand, the typical process looks like this:

**1. Check Companies House**
Go to [find-and-update.company-information.service.gov.uk](https://find-and-update.company-information.service.gov.uk/), search for the company name, check if it's active, look at the directors, note the incorporation date.

**2. Google them**
Search for the business name + location. Look at the Google rating, read some reviews, check that they have a real address and phone number.

**3. Check their website**
Visit their website. Does it load? Is it a real site or a placeholder? Does the SSL certificate look valid?

**4. Look for social media**
Check if they have a Facebook page, LinkedIn company profile, Instagram, or Twitter/X account. Legitimate businesses almost always have at least one of these.

**5. Cross-reference**
Do the directors on Companies House match the "About" page on their website? Does the registered address match the Google Maps listing? Are the SIC codes consistent with what the business actually does?

This works. But it has problems.

## Why Manual Verification Doesn't Scale

Each lookup takes **10-15 minutes** if you're being thorough. If you need to verify 50 businesses, that's an entire workday gone. If you're onboarding hundreds of customers per month, it's completely impractical.

It's also **easy to miss things**. A company that was dissolved last week will still have a working website for months. A fraudulent business might have a real Companies House registration but no physical presence. You need to check multiple sources and cross-reference them — and humans are bad at doing that consistently.

What you actually want is a single function call that does all five steps and returns a structured result.

## The Programmatic Way

The [UK Business Intelligence API](https://ukbusinessintel.com) lets you do the entire verification in one request:

```bash
curl -X POST https://ukbusinessintel.com/api/v1/enrich \
  -H "X-API-Key: ukb_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"business_name": "Greggs", "location": "Newcastle"}'
```

This hits four data sources in parallel — Companies House, Google Places, DNS/SSL verification, and web scraping for social links — and returns a unified profile:

```json
{
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
    "duration_ms": 847
  }
}
```

One call. Four sources. Under two seconds.

## How to Interpret the Results

Not every field matters equally for verification. Here's what to look for:

### Strong Legitimacy Signals

- **`company_status: "active"`** — The company is currently registered and in good standing with Companies House. If this is `"dissolved"` or `"liquidation"`, that's a red flag.
- **`incorporation_date`** — How long has this company existed? A company registered last week is riskier than one that's been around since 1983.
- **`directors` array is non-empty** — Real companies have directors. If the officers list is empty, something is off.
- **`is_live: true` and `ssl_valid: true`** — The business has a working website with a valid SSL certificate. Not every legitimate business has a website, but a dodgy SSL cert on one that does is a warning sign.

### Moderate Signals

- **`rating` and `review_count`** — A Google rating of 4.0+ with hundreds of reviews is a strong indicator of a real, operating business. No Google presence at all could just mean they're B2B, but it's worth noting.
- **Social media presence** — At least one non-null social link (Facebook, LinkedIn, etc.) adds confidence. A business with zero social presence in 2026 is unusual.
- **`sic_codes`** — Do these match what the business claims to do? A "plumbing company" with SIC code 64110 (Central banking) would be suspicious.

### Building a Verification Score

You can turn these signals into a simple scoring function:

```typescript
function getVerificationScore(profile: EnrichedBusinessProfile): number {
  let score = 0;

  // Companies House signals
  if (profile.companies_house.company_status === 'active') score += 25;
  if (profile.companies_house.directors.length > 0) score += 15;
  if (profile.companies_house.incorporation_date) {
    const years = (Date.now() - new Date(profile.companies_house.incorporation_date).getTime())
      / (365.25 * 24 * 60 * 60 * 1000);
    if (years > 2) score += 10;
  }

  // Web presence signals
  if (profile.website.is_live) score += 15;
  if (profile.website.ssl_valid) score += 10;

  // Google signals
  if (profile.google_places.rating && profile.google_places.rating >= 3.5) score += 15;
  if (profile.google_places.review_count && profile.google_places.review_count > 10) score += 5;

  // Social signals
  const socialLinks = Object.values(profile.social).filter(Boolean).length;
  score += Math.min(socialLinks * 2.5, 5);

  return score; // Max: 100
}
```

A score above 70 is likely legitimate. Below 40 warrants manual review.

## For Claude Desktop Users

If you use Claude Desktop or Cursor, you can install the [MCP server](https://www.npmjs.com/package/uk-business-intelligence-mcp) and verify businesses conversationally:

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

Then just ask: *"Is 'ABC Trading Ltd' in Manchester a legitimate business?"* — Claude will call the enrichment tool, pull the data, and give you a plain-English assessment.

## Get Started

The API has a **free tier: 100 lookups per month, no credit card required**.

- **Website**: [ukbusinessintel.com](https://ukbusinessintel.com)
- **npm**: `npx uk-business-intelligence-mcp`
- **GitHub**: [Fluke-Studio/uk-business-intelligence-mcp](https://github.com/Fluke-Studio/uk-business-intelligence-mcp)

Whether you're building KYB checks into an onboarding flow, vetting suppliers in a procurement tool, or just want to automate the due diligence you're currently doing by hand — one API call beats five browser tabs.
