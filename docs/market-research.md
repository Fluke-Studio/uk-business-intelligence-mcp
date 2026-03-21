# Market Research: UK Local Business Intelligence API

**Date:** March 2026
**Purpose:** Internal reference for product positioning, pricing, and distribution strategy.

---

## 1. MCP Server Landscape (2025-2026)

### Market Overview

MCP (Model Context Protocol) adoption exploded in 2025. The term gained widespread attention in the AI tool development community in early 2025, and by mid-2026 MCP compatibility is expected to be table stakes for any B2B SaaS tool.

Key stats:
- Remote MCP servers are up nearly 4x since May 2025.
- The top 10 MCP servers by GitHub stars account for ~45.7% of all stars given to MCP servers.
- Context7 (by Upstash) leads with 44,000+ stars and 240,000+ weekly npm downloads.
- The dominant categories are agentic browsing (Browser Use: 61k stars, Playwright MCP: 18.4k stars) and developer tooling.

### Existing Business Data / CRM MCP Servers

| Server | Focus | Notes |
|--------|-------|-------|
| HubSpot MCP | CRM operations | Official. Contact/company/deal management. |
| Salesforce MCP | CRM operations | Official. Record CRUD + activity logging. |
| Apollo.io MCP | Sales prospecting | Lead enrichment, email/phone reveal. Released Feb 2026. |
| Fiber AI MCP | Contact enrichment | Company search, contact enrichment, email reveal. |
| Databar MCP | Aggregated enrichment | 100+ data providers via single connection. |
| Windsor MCP | Business analytics | Query full-stack business data, no SQL needed. |
| Odoo MCP | ERP/CRM access | Connect to Odoo ERP systems. |
| Swiss MCP | Swiss open data | 68 tools for Swiss transport, weather, companies, parliament data. Zero API keys. |

Sources:
- [Databar: Best MCP Servers for Sales Teams](https://databar.ai/blog/article/best-mcp-servers-for-sales-teams-in-2026)
- [HubSpot MCP Server](https://developers.hubspot.com/mcp)
- [Apollo.io MCP on PulseMCP](https://www.pulsemcp.com/servers/lkm1developer-apollo-io)

### Existing Companies House MCP Servers

There are already **3 Companies House MCP servers** on GitHub:

| Repo | Stars | Language | Scope |
|------|-------|----------|-------|
| [stefanoamorelli/companies-house-mcp](https://github.com/stefanoamorelli/companies-house-mcp) | ~15 | TypeScript | 45+ endpoints. Most comprehensive. Covers full CH API surface. |
| [aicayzer/companies-house-mcp](https://github.com/aicayzer/companies-house-mcp) | ~5 | TypeScript | Core endpoints with built-in rate limiting and caching. |
| [elankeeran/Companies-House-MCP-Server](https://github.com/elankeeran/Companies-House-MCP-Server) | Low | Unknown | Basic company search, profiles, officers, due diligence reports. |

### The Gap

**No existing MCP server combines UK company registry data with location intelligence, web presence, or social media data.** All three Companies House MCP servers are thin wrappers around the CH API alone. None of them:

- Merge Google Places data (ratings, reviews, opening hours, photos)
- Check DNS/domain status or tech stack
- Scrape or link social media profiles
- Produce a unified "business profile" JSON

The closest analogue in the broader MCP ecosystem is Swiss MCP (zero-key Swiss open data), but nothing exists for **UK local business intelligence** specifically. This is a clear gap.

### Key MCP Directories to List On

- [awesome-mcp-servers (punkpeye)](https://github.com/punkpeye/awesome-mcp-servers) - largest list
- [awesome-mcp-servers (wong2)](https://github.com/wong2/awesome-mcp-servers) - well-curated
- [Glama MCP directory](https://glama.ai/mcp)
- [PulseMCP](https://www.pulsemcp.com/)
- [MCP Hub](https://mcphub.io/)
- [mcpmarket.com](https://mcpmarket.com/)

---

## 2. Competing UK Business Data APIs

### Competitive Landscape

| Provider | Data Scope | Pricing Model | Developer-Friendly? | Notes |
|----------|-----------|---------------|---------------------|-------|
| **Companies House API** | UK company registry only | Free (600 req/5min) | Yes | Government API. No enrichment. |
| **Endole** | CH + credit scores, financials, shareholders | Pay-per-call: £0.60-£3.00/call. Platform from £39/mo | Moderate | UK-focused. Sandbox testing available. Volume pricing on request. |
| **Creditsafe** | Credit reports, 200k+ customers globally | Enterprise only. Avg ~$49k/yr. Min ~$3,500/yr | No | No public API pricing. Sales-led. UK gov doc shows £0.20/transaction minimum. |
| **OpenCorporates** | 220M+ companies, 140+ jurisdictions | £2,250/yr (500 calls/mo) to £12,000/yr (5,000 calls/mo) | No | Expensive per call. Calls count even on errors/no-match. |
| **FullCircl (fka DueDil)** | UK company data + CLI platform | Custom/enterprise pricing only | No | Merged DueDil + Artesian in 2021. Targets regulated industries (banks, insurers). |
| **Moody's Analytics** | Global corporate data, credit risk | Enterprise only | No | Acquired DueDil heritage. API Hub available. |
| **Global Database** | Company data + contacts | From ~$49/mo | Moderate | Positioned as CH alternative. |
| **Zephira.ai** | Registry + UBO + KYB | From $49/mo, free tier available | Yes | Newer entrant. Usage-based pricing. |

Sources:
- [Endole API Pricing](https://www.endole.co.uk/api/Endole-Company-API-Pricing.pdf)
- [OpenCorporates Pricing](https://opencorporates.com/pricing/)
- [Creditsafe Pricing on G2](https://www.g2.com/products/creditsafe/pricing)
- [Top 5 Companies House API Alternatives](https://www.globaldatabase.com/top-5-companies-house-api-alternatives-for-uk-company-data)
- [FullCircl](https://www.fullcircl.com/)

### The Pricing Gap

The market splits into two tiers with nothing in between:

1. **Free but raw:** Companies House API gives you registry data only. No enrichment, no location data, no web presence, no ratings.
2. **Enterprise and expensive:** Creditsafe ($3.5k-$238k/yr), OpenCorporates (£2,250+/yr for 500 calls/mo), FullCircl (custom enterprise).

**The gap is a developer-friendly, pay-as-you-go API at the $29-99/mo tier that enriches UK business data beyond just Companies House.** Endole comes closest at £39/mo but doesn't include Google Places data, DNS, or social media. Zephira targets KYB/compliance, not local business intelligence.

No existing product combines: CH company data + Google Places location intelligence + web/DNS presence + social media links into a single API call.

---

## 3. Companies House API

### Overview

The Companies House API is a free REST API provided by the UK government. No API key cost, but registration required at [developer.company-information.service.gov.uk](https://developer.company-information.service.gov.uk/).

### Rate Limits

| Metric | Value |
|--------|-------|
| Default rate limit | **600 requests per 5-minute window** (~2/sec) |
| HTTP status on exceed | `429 Too Many Requests` |
| Reset | After the 5-minute window expires |
| Higher limits | Available on request (contact CH directly) |
| Streaming API | Max 2 concurrent connections per account |
| Streaming 429 | Must wait 1 minute before reconnect; period increases on repeat violation |
| Abuse policy | CH reserves right to ban without notice |

### Available Endpoints

| Category | Endpoints |
|----------|-----------|
| **Company** | Profile, registered office address, registers, insolvency, exemptions, UK establishments |
| **Search** | Companies (by name/number), officers, disqualified officers, alphabetical, dissolved companies |
| **Officers** | List officers, appointment details, appointment history, disqualifications |
| **Filing History** | List filings, individual filing items, document download |
| **Charges** | List charges/mortgages, individual charge details |
| **PSC** | Persons with significant control (individuals, corporate entities, legal persons), PSC statements |

### Data Freshness

- REST API data is described as "live and real-time" by CH.
- The **Streaming API** pushes changes as they happen (same data as REST, but push-based).
- In practice, there can be delays between a filing being submitted and appearing in the API. Annual accounts and confirmation statements may take days to process.

### Known Gotchas for Integration

1. **Company number format:** Must be 8 characters, zero-padded (e.g., `"01234567"`). Older companies may have shorter numbers.
2. **No financial data in the API:** The API provides filing metadata and links to PDF documents, but does **not** parse accounts into structured financial data. You get the filing history entry, not the balance sheet.
3. **Enumerated types:** Many fields use coded values (e.g., company type, officer role). You need the CH enumeration mappings to display human-readable labels.
4. **Authentication:** Basic HTTP auth with API key as username, empty password.
5. **No webhook/callback support:** You must poll or use the Streaming API for updates.
6. **Rate limit headers:** Documentation does not specify response headers indicating remaining quota—you must track this client-side.
7. **Dissolved companies:** Search may or may not return dissolved companies depending on the endpoint used. Use the dedicated dissolved search endpoint for comprehensive coverage.

Sources:
- [Companies House Rate Limiting](https://developer-specs.company-information.service.gov.uk/guides/rateLimiting)
- [Companies House API Getting Started](https://developer-specs.company-information.service.gov.uk/guides/gettingStarted)
- [Companies House Developer Guidelines](https://developer.company-information.service.gov.uk/developer-guidelines)
- [API Specification Summary](https://developer-specs.company-information.service.gov.uk/companies-house-public-data-api/reference)
- [Streaming API Overview](https://developer-specs.company-information.service.gov.uk/streaming-api/guides/overview)
- [CH Developer Forum: Rate Limit Increase](https://forum.companieshouse.gov.uk/t/api-limit-increase/5490)

---

## 4. Google Places API (New) - Pricing (Post March 2025)

### Pricing Model Change (1 March 2025)

Google replaced the old recurring **$200/month credit** with **free monthly usage caps per SKU**. Pricing is now organized around three tiers: **Essentials**, **Pro**, and **Enterprise**.

### Free Monthly Allowances

| Tier | Free Requests/Month |
|------|---------------------|
| **Essentials** | 10,000 |
| **Pro** | 5,000 |
| **Enterprise** | 1,000 |

### Per-Request Pricing (after free tier, 0-100k volume)

| SKU | Tier | Price per 1,000 requests | Per-request cost |
|-----|------|-------------------------|-----------------|
| Place Details Essentials (IDs Only) | Essentials | ~$0 (IDs only) | ~$0 |
| Place Details Essentials | Essentials | ~$5.00 | ~$0.005 |
| Place Details Pro | Pro | **$17.00** | ~$0.017 |
| Place Details Enterprise | Enterprise | **$20.00** | ~$0.020 |
| Text Search Essentials (IDs Only) | Essentials | ~$0 (IDs only) | ~$0 |
| Text Search Pro | Pro | ~$17-32 | ~$0.017-0.032 |
| Text Search Enterprise | Enterprise | **$35.00** | ~$0.035 |
| Nearby Search Pro | Pro | **$32.00** | ~$0.032 |
| Nearby Search Enterprise | Enterprise | ~$35.00 | ~$0.035 |

*Note: Prices decrease at higher volume tiers (100k-500k, 500k-1M, 1M-5M, 5M+). At 5M+, Place Details Pro drops to $1.28/1000.*

### Field-to-SKU Mapping (FieldMask Approach)

**You are billed at the highest SKU triggered by any field in your FieldMask.** This is critical for cost control.

#### Essentials Fields (cheapest)
`addressComponents`, `adrFormatAddress`, `formattedAddress`, `location`, `plusCode`, `postalAddress`, `shortFormattedAddress`, `types`, `viewport`

#### Pro Fields
`businessStatus`, `containingPlaces`, `displayName`, `googleMapsLinks`, `googleMapsUri`, `iconBackgroundColor`, `iconMaskBaseUri`, `openingDate`, `primaryType`, `primaryTypeDisplayName`, `pureServiceAreaBusiness`, `subDestinations`, `timeZone`, `utcOffsetMinutes`

#### Enterprise Fields (most expensive)
`currentOpeningHours`, `currentSecondaryOpeningHours`, `internationalPhoneNumber`, `nationalPhoneNumber`, `priceLevel`, `priceRange`, `rating`, `regularOpeningHours`, `regularSecondaryOpeningHours`, `userRatingCount`, `websiteUri`

#### Enterprise + Atmosphere Fields (same Enterprise price, more data)
`reviews`, `reviewSummary`, `editorialSummary`, `generativeSummary`, `delivery`, `dineIn`, `takeout`, `curbsidePickup`, `reservable`, `servesBreakfast`, `servesLunch`, `servesDinner`, `servesBeer`, `servesWine`, `servesCoffee`, `parkingOptions`, `paymentOptions`, `accessibilityOptions`, `outdoorSeating`, `liveMusic`, `goodForChildren`, `goodForGroups`, `restroom`, `allowsDogs`, `fuelOptions`, `evChargeOptions`

### Cost Control Strategy for This Product

1. **Split requests by tier.** Make one Essentials-only call for address/location, and a separate Pro or Enterprise call only when the user needs those fields.
2. **Cache aggressively.** Google's ToS allows caching for up to 30 days. Business data changes infrequently—cache ratings, hours, phone numbers.
3. **Use the 5,000 free Pro requests/month** as a baseline. At ~167 enrichments/day, this covers early-stage usage without cost.
4. **Avoid Atmosphere fields unless explicitly requested.** They trigger the same Enterprise billing but add significant response size.

Sources:
- [Places API Usage and Billing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing)
- [Google Maps Platform Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)
- [Place Data Fields (New)](https://developers.google.com/maps/documentation/places/web-service/data-fields)
- [Google Maps Platform March 2025 Changes](https://developers.google.com/maps/billing-and-pricing/march-2025)
- [Google Maps API Pricing 2026 Guide](https://nicolalazzari.ai/articles/understanding-google-maps-apis-a-comprehensive-guide-to-uses-and-costs)

---

## 5. Distribution Strategy Validation

### MCP Server Distribution: What Works

Based on analysis of successful MCP servers (source: [What Makes an MCP Server Successful](https://handsonarchitects.com/blog/2026/what-makes-mcp-server-successful/)):

**Five patterns of successful MCP servers:**

1. **Solve one critical pain point exceptionally well.** Narrow focus beats breadth. Context7 does one thing (fresh docs for AI) and dominates.
2. **Hide complexity behind simplicity.** Expose 2-3 tools, not 45. Users want elegance; infrastructure is invisible.
3. **Eliminate friction from adoption.** Setup must be a single line in MCP client config. Every extra step costs users.
4. **Respect privacy as a feature.** Stateless, query-only designs build trust. "Your code never leaves your machine."
5. **Implement the protocol meticulously.** Tool descriptions should embed behavioral guidance for LLMs (call-frequency limits, examples, privacy warnings).

**Key insight for this product:** The existing CH MCP servers have ~5-15 stars. They're thin wrappers. An enriched MCP server that returns a complete business profile (not just CH data) in one tool call would be meaningfully differentiated.

### Platform-Specific Distribution Data

| Channel | Type | Expected Performance | Notes |
|---------|------|---------------------|-------|
| **Indie Hackers** | Compounding | 23.1% conversion per engaged post | Requires 4-6 months sustained engagement. 3-8x better than Product Hunt. |
| **Product Hunt** | Spike | 3.1% conversion per launch | No longer the indie founder paradise. Algorithm favours PR-backed products. Still worth doing for backlinks/credibility. |
| **Hacker News (Show HN)** | Spike | High for dev tools | Developer tools perform well. One-shot opportunity. |
| **Reddit** | Compounding | Highly targeted | r/SideProject, r/SaaS, r/webdev, r/ukbusiness, r/startups. Niche subreddits outperform broad platforms. |
| **Dev.to** | Compounding | SEO + community | Technical posts with code examples. Good for long-tail organic traffic. |
| **DevHunt** | Spike | Good for dev tools | Product Hunt alternative specifically for developer tools. |
| **MCP Directories** | Passive/SEO | Ongoing discovery | Glama, PulseMCP, awesome-mcp-servers repos. Low effort, high leverage. |

Source: [Indie Hackers Launch Strategy 2025](https://awesome-directories.com/blog/indie-hackers-launch-strategy-guide-2025/)

### Recommended Launch Sequence

Based on the "two spike channels, two compounding channels, one consistent community" framework:

**Pre-launch (weeks 1-4):**
- Ship MCP server to npm, list on all MCP directories (Glama, PulseMCP, awesome-mcp-servers PRs)
- Write technical blog post on Dev.to: "Building a UK Business Intelligence MCP Server"
- Start engaging on r/SideProject and Indie Hackers

**Spike 1 (week 5):**
- Show HN post with live demo
- Cross-post to r/webdev, r/ukbusiness

**Compounding (weeks 5-12):**
- Weekly Dev.to posts (integration guides, use-case walkthroughs)
- Consistent Reddit engagement (helpful comments, not spam)
- Indie Hackers build-in-public updates

**Spike 2 (week 8-10):**
- Product Hunt launch (coordinate with any early users for upvotes)
- DevHunt submission

**Ongoing:**
- GitHub README as a landing page
- SEO-optimized docs site
- Twitter/X build-in-public thread

### Solo Founder Context

- Share of new startups with a solo founder has risen from 23.7% (2019) to 36.3% (H1 2025). Source: [Carta Solo Founders Report](https://carta.com/data/solo-founders-report/).
- API/micro-SaaS products are well-suited to solo founders. The solo dev SaaS stack powering $10K/month micro-SaaS tools is well-documented. Source: [Dev.to Solo Dev SaaS Stack](https://dev.to/dev_tips/the-solo-dev-saas-stack-powering-10kmonth-micro-saas-tools-in-2025-pl7).
- Product-led distribution turns users into marketers—focus on making the free tier genuinely useful so developers share it organically.

---

## 6. Summary: Strategic Positioning

### The Opportunity

| Dimension | Current Market | This Product |
|-----------|---------------|-------------|
| **Data breadth** | CH-only or enterprise-priced enrichment | CH + Google Places + DNS + social in one call |
| **Pricing** | Free (raw CH) or £2,250+/yr (enriched) | Developer-friendly: free tier + $29-99/mo |
| **MCP support** | 3 thin CH wrappers (5-15 stars) | Enriched business profile MCP server |
| **Target user** | Enterprise compliance teams | Developers, indie hackers, SMB tools, AI agents |
| **Integration effort** | Multiple APIs to stitch together | Single API key, single JSON response |

### Key Risks

1. **Google Places API cost at scale.** Enterprise-tier fields (phone, website, ratings) cost $20/1000 requests. At 10k enrichments/month, that's ~$200/month in Google costs alone. Caching and tiered field selection are essential.
2. **Companies House rate limits.** 600 req/5min is workable for early stage but needs planning for batch operations. Request a limit increase early.
3. **Existing CH MCP servers.** Three exist already, though none are enriched. Differentiation must be clear: "one call, complete business profile" vs "thin CH wrapper."
4. **Web scraping fragility.** Social media scraping (LinkedIn, Facebook, Instagram) is inherently fragile and may violate ToS. Consider using official APIs where available or making social data a best-effort feature.

### Defensibility

- **Data combination** is the moat, not any single data source. Anyone can wrap Companies House; few will maintain the multi-source stitching, caching, and normalisation.
- **MCP server** provides distribution leverage into the AI tooling ecosystem at a critical adoption inflection point.
- **Developer experience** (clean docs, generous free tier, one-line MCP setup) creates switching costs through integration stickiness.
