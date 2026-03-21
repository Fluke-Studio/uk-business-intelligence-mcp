# Launch Posts — Ready to Publish

## 1. Show HN (Hacker News)

**Title:** Show HN: UK Business Intelligence API — 4 data sources in one call

**Post text:**
```
I built an API that enriches any UK business from 4 data sources in a single call:

- Companies House (company status, directors, SIC codes, registered address)
- Google Places (star ratings, review count, phone, website)
- DNS/SSL (is the website live? is the cert valid?)
- Social media (Facebook, Instagram, LinkedIn, Twitter links)

Send a business name and city, get back a complete JSON profile in under 2 seconds.

The problem I was solving: if you're building anything that needs UK business data (lead gen tools, CRM enrichment, due diligence checks), you currently have two options — stitch together 4+ APIs yourself, or pay enterprise vendors £2,250+/year. I wanted something in between.

It's also available as an MCP server, so Claude Desktop can look up any UK business natively.

Free tier: 100 lookups/month, no card required.

API: https://ukbusinessintel.com
GitHub: https://github.com/Fluke-Studio/uk-business-intelligence-mcp
npm: npx uk-business-intelligence-mcp
```

---

## 2. Reddit — r/SideProject

**Title:** I built a UK Business Intelligence API — 4 data sources, one call, under 2 seconds

**Post:**
```
Hey everyone,

Solo founder here. I built an API that lets you look up any UK business and get back a comprehensive profile from 4 different data sources in a single call.

What you get back:
- Companies House: company status, directors, SIC codes, registered address
- Google Places: star rating, review count, phone number, website
- Website health: is it live? SSL valid? When does the cert expire?
- Social media: Facebook, Instagram, LinkedIn, Twitter links

Why I built it:
I was building a CRM tool and needed UK business data. The options were: wire up 4 separate APIs with different auth methods and handle all the caching/matching yourself, or pay Creditsafe £3,500+/year for an enterprise contract. Neither made sense for a solo dev.

So I built a unified API that does it all in one POST request. It also works as an MCP server — add one line to your Claude Desktop config and you can ask Claude "tell me about Greggs in Newcastle" and get the full profile back.

Free tier: 100 lookups/month, no credit card.

https://ukbusinessintel.com

Would love feedback from anyone working with UK business data!
```

---

## 3. Reddit — r/webdev

**Title:** Built a business data enrichment API — Companies House + Google Places + DNS + social media in one call

**Post:**
```
Sharing a side project: a REST API that enriches UK businesses from 4 data sources in parallel.

POST /api/v1/enrich with {"business_name": "Greggs", "location": "Newcastle"} and you get back:

- Companies House record (company number, status, directors, SIC codes)
- Google Places data (4.1 stars, 1847 reviews, phone, website)
- Website health (HTTP 200, SSL valid, expires April 2026)
- Social links (Facebook, Instagram, Twitter found)

All in ~1 second, cached, with graceful degradation if any source fails.

Tech stack: Next.js 14, TypeScript, Supabase (Postgres), Vercel. No Redis — rate limiting uses atomic Postgres RPC functions.

Also published as an MCP server on npm for Claude Desktop/Cursor integration.

GitHub: https://github.com/Fluke-Studio/uk-business-intelligence-mcp
Live: https://ukbusinessintel.com
npm: uk-business-intelligence-mcp

Free tier available (100 lookups/month). Feedback welcome!
```

---

## 4. Reddit — r/ukbusiness

**Title:** Free API to look up any UK business — company records, Google reviews, website status, social links

**Post:**
```
Hi all,

I've built a free API for looking up UK business data. You send a business name and city, and it returns:

- Companies House data: is the company active? Who are the directors? What's the registered address?
- Google reviews: star rating, number of reviews, phone number
- Website check: is their site live? Is the SSL certificate valid?
- Social media: links to their Facebook, Instagram, LinkedIn, Twitter

It's aimed at developers building tools that need business data, but the free tier (100 lookups/month) is available to anyone.

https://ukbusinessintel.com

If you work with UK business data in any capacity, I'd love to hear what other data points would be useful to add.
```

---

## 5. Dev.to Article

**Title:** I Built a UK Business Intelligence MCP Server — Here's How

**Tags:** mcp, api, typescript, nextjs

**Article outline:**
```
1. The problem (3 paragraphs)
   - Need UK business data for [use case]
   - Current options: DIY with 4 APIs or pay enterprise prices
   - Gap in the market for developer-friendly enrichment

2. What I built (with screenshots)
   - One API call, four data sources
   - Show the curl request and response
   - Show the MCP server in Claude Desktop

3. Architecture (with diagram)
   - Two-round parallel execution
   - Cache strategy (7-day CH, 24hr everything else)
   - Rate limiting without Redis

4. The MCP angle
   - Why MCP matters for API distribution
   - How the MCP server works (stdio, single tool)
   - Claude Desktop config example

5. What I learned
   - Google Places API pricing gotchas (Enterprise tier fields)
   - Companies House API quirks
   - Solo founder lessons

6. Try it
   - Link to ukbusinessintel.com
   - Free tier, no card required
   - GitHub link
```

---

## Posting Schedule (Recommended)

| Day | Channel | Why |
|-----|---------|-----|
| Day 1 | Submit to awesome-mcp-servers (punkpeye) PR | Gets reviewed in 2-5 days |
| Day 1 | Submit to Glama + PulseMCP | Auto-indexed quickly |
| Day 2 | Post on r/SideProject | Warm, supportive community |
| Day 3 | Post Dev.to article | SEO + long-tail traffic |
| Day 5 | Post on r/webdev | Technical audience |
| Day 5 | Submit to awesome-mcp-servers (wong2) | Second PR |
| Day 7 | Show HN | Biggest spike potential |
| Day 7 | Post on r/ukbusiness | Niche but targeted |
| Day 10 | Submit remaining directories | MCP Hub, mcpmarket |

**Why this order:** Build up some social proof (directory listings, Dev.to article) before the Show HN post. HN is a one-shot opportunity — you want your GitHub repo to already have stars and your npm package to have downloads when HN readers check it out.
