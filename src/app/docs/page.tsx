import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation | UK Business Intelligence API',
  description:
    'Complete API documentation for the UK Business Intelligence API. Endpoints, authentication, request/response schemas, code examples in curl, Python, Node.js, and MCP setup.',
  keywords: [
    'UK business API documentation',
    'Companies House API docs',
    'business intelligence API reference',
    'UK company data API',
  ],
};

const sections = [
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'endpoints', label: 'Endpoints' },
  { id: 'request', label: 'Request' },
  { id: 'response', label: 'Response' },
  { id: 'code-examples', label: 'Code Examples' },
  { id: 'rate-limits', label: 'Rate Limits' },
  { id: 'pricing', label: 'Pricing' },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-[family-name:var(--font-geist-sans)] overflow-x-hidden w-full">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">
              UK
            </div>
            <span className="font-semibold text-sm hidden sm:block">Business Intel API</span>
          </a>
          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <a href="/" className="text-zinc-400 hover:text-white transition-colors">Home</a>
            <a href="/#demo" className="text-zinc-400 hover:text-white transition-colors">Demo</a>
            <a href="/#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a>
            <a href="/docs" className="text-white font-medium transition-colors">Docs</a>
          </div>
        </div>
      </nav>

      <div className="pt-24 max-w-6xl mx-auto px-6 flex gap-12">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-28">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-4">Documentation</h3>
            <nav className="space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 pb-24">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">API Documentation</h1>
          <p className="text-zinc-400 mb-12">
            Everything you need to integrate UK business intelligence into your application.
          </p>

          {/* Quick Start */}
          <section id="quick-start" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-zinc-800">Quick Start</h2>
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>Get up and running in under a minute:</p>
              <ol className="space-y-4 list-decimal list-inside">
                <li>
                  <strong className="text-zinc-200">Get your API key</strong> &mdash; Sign up on the{' '}
                  <a href="/#pricing" className="text-emerald-400 hover:underline">pricing page</a>. Free tier gives you 100 lookups/month.
                </li>
                <li>
                  <strong className="text-zinc-200">Make your first call</strong>
                  <div className="mt-3 bg-zinc-900 rounded-lg border border-zinc-800 p-4 overflow-x-auto">
                    <pre className="text-xs sm:text-sm font-mono text-zinc-300 whitespace-pre">{`curl -X POST https://ukbusinessintel.com/api/v1/enrich \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ukb_your_api_key_here" \\
  -d '{"business_name": "Greggs", "location": "Newcastle"}'`}</pre>
                  </div>
                </li>
                <li>
                  <strong className="text-zinc-200">Get back enriched data</strong> &mdash; Companies House records, Google Places ratings, website health, SSL status, and social media links in one JSON response.
                </li>
              </ol>
            </div>
          </section>

          {/* Authentication */}
          <section id="authentication" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-zinc-800">Authentication</h2>
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
              <p>
                All API requests require an API key passed via the <code className="text-emerald-400 bg-zinc-900 px-1.5 py-0.5 rounded text-xs">x-api-key</code> header.
              </p>
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm font-mono text-zinc-300 whitespace-pre">{`x-api-key: ukb_your_api_key_here`}</pre>
              </div>
              <p>
                API keys start with <code className="text-emerald-400 bg-zinc-900 px-1.5 py-0.5 rounded text-xs">ukb_</code> and are tied to your account. Keep them secret &mdash; do not commit them to version control or expose them in client-side code.
              </p>
              <p>
                Requests without a valid API key will return <code className="text-red-400 bg-zinc-900 px-1.5 py-0.5 rounded text-xs">401 Unauthorized</code>.
              </p>
            </div>
          </section>

          {/* Endpoints */}
          <section id="endpoints" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-zinc-800">Endpoints</h2>
            <div className="space-y-4">
              {/* Enrich */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded">POST</span>
                  <code className="text-sm font-mono text-zinc-200">/api/v1/enrich</code>
                </div>
                <p className="text-sm text-zinc-400">
                  Main enrichment endpoint. Send a business name and location, get back a comprehensive business profile from all data sources.
                </p>
              </div>

              {/* Keys */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded">POST</span>
                  <code className="text-sm font-mono text-zinc-200">/api/v1/keys</code>
                </div>
                <p className="text-sm text-zinc-400">
                  Create a new API key. Requires email address. Returns your API key (shown once, store it safely).
                </p>
              </div>

              {/* Usage */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2.5 py-1 rounded">GET</span>
                  <code className="text-sm font-mono text-zinc-200">/api/v1/usage</code>
                </div>
                <p className="text-sm text-zinc-400">
                  Check your current usage and remaining quota for the billing period.
                </p>
              </div>

              {/* Health */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2.5 py-1 rounded">GET</span>
                  <code className="text-sm font-mono text-zinc-200">/api/v1/health</code>
                </div>
                <p className="text-sm text-zinc-400">
                  Service health check. Returns status of the API and upstream data sources.
                </p>
              </div>
            </div>
          </section>

          {/* Request */}
          <section id="request" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-zinc-800">Request</h2>
            <p className="text-sm text-zinc-400 mb-6">
              Send a JSON body to <code className="text-emerald-400 bg-zinc-900 px-1.5 py-0.5 rounded text-xs">POST /api/v1/enrich</code> with the following fields:
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-left">
                    <th className="px-4 py-3 text-zinc-400 font-medium">Field</th>
                    <th className="px-4 py-3 text-zinc-400 font-medium">Type</th>
                    <th className="px-4 py-3 text-zinc-400 font-medium">Required</th>
                    <th className="px-4 py-3 text-zinc-400 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3"><code className="text-emerald-400">business_name</code></td>
                    <td className="px-4 py-3 text-zinc-500">string</td>
                    <td className="px-4 py-3"><span className="text-emerald-400 text-xs font-medium">Yes</span></td>
                    <td className="px-4 py-3 text-zinc-400">The name of the business to look up</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3"><code className="text-emerald-400">location</code></td>
                    <td className="px-4 py-3 text-zinc-500">string</td>
                    <td className="px-4 py-3"><span className="text-emerald-400 text-xs font-medium">Yes</span></td>
                    <td className="px-4 py-3 text-zinc-400">City, town, or region (e.g. &quot;Manchester&quot;, &quot;London&quot;)</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3"><code className="text-zinc-500">company_number</code></td>
                    <td className="px-4 py-3 text-zinc-500">string</td>
                    <td className="px-4 py-3"><span className="text-zinc-500 text-xs font-medium">No</span></td>
                    <td className="px-4 py-3 text-zinc-400">Companies House number for exact matching (e.g. &quot;00032954&quot;)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3"><code className="text-zinc-500">domain</code></td>
                    <td className="px-4 py-3 text-zinc-500">string</td>
                    <td className="px-4 py-3"><span className="text-zinc-500 text-xs font-medium">No</span></td>
                    <td className="px-4 py-3 text-zinc-400">Business website domain for SSL and social checks (e.g. &quot;greggs.co.uk&quot;)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-zinc-900 rounded-lg border border-zinc-800 p-4 overflow-x-auto">
              <p className="text-xs text-zinc-500 mb-2">Example request body:</p>
              <pre className="text-xs sm:text-sm font-mono text-zinc-300 whitespace-pre">{`{
  "business_name": "Greggs",
  "location": "Newcastle",
  "company_number": "00032954",
  "domain": "greggs.co.uk"
}`}</pre>
            </div>
          </section>

          {/* Response */}
          <section id="response" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-zinc-800">Response</h2>
            <p className="text-sm text-zinc-400 mb-6">
              A successful request returns a JSON object with the following top-level sections:
            </p>

            <div className="space-y-6">
              {/* companies_house */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h3 className="font-semibold text-emerald-400 mb-3 font-mono text-sm">companies_house</h3>
                <div className="space-y-2 text-sm text-zinc-400">
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">company_name</code>
                    <span>Official registered company name</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">company_number</code>
                    <span>Companies House registration number</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">company_status</code>
                    <span>Active, dissolved, liquidation, etc.</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">company_type</code>
                    <span>Type of company (ltd, plc, etc.)</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">registered_address</code>
                    <span>Full registered office address</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">date_of_creation</code>
                    <span>Date the company was incorporated</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">sic_codes</code>
                    <span>Array of SIC industry classification codes</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">officers</code>
                    <span>Array of directors and secretaries</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">filing_history</code>
                    <span>Recent filings with Companies House</span>
                  </div>
                </div>
              </div>

              {/* google_places */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h3 className="font-semibold text-emerald-400 mb-3 font-mono text-sm">google_places</h3>
                <div className="space-y-2 text-sm text-zinc-400">
                  <div className="grid grid-cols-[180px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">rating</code>
                    <span>Google star rating (1.0 &ndash; 5.0)</span>
                  </div>
                  <div className="grid grid-cols-[180px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">user_ratings_total</code>
                    <span>Total number of Google reviews</span>
                  </div>
                  <div className="grid grid-cols-[180px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">formatted_address</code>
                    <span>Google Maps address</span>
                  </div>
                  <div className="grid grid-cols-[180px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">formatted_phone_number</code>
                    <span>Business phone number</span>
                  </div>
                  <div className="grid grid-cols-[180px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">website</code>
                    <span>Business website URL from Google</span>
                  </div>
                  <div className="grid grid-cols-[180px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">google_maps_url</code>
                    <span>Direct link to Google Maps listing</span>
                  </div>
                  <div className="grid grid-cols-[180px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">opening_hours</code>
                    <span>Weekly opening hours (if available)</span>
                  </div>
                </div>
              </div>

              {/* website */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h3 className="font-semibold text-emerald-400 mb-3 font-mono text-sm">website</h3>
                <div className="space-y-2 text-sm text-zinc-400">
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">is_live</code>
                    <span>Boolean &mdash; whether the website is responding</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">status_code</code>
                    <span>HTTP status code (200, 301, 404, etc.)</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">url</code>
                    <span>Final resolved URL after redirects</span>
                  </div>
                </div>
              </div>

              {/* ssl */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h3 className="font-semibold text-emerald-400 mb-3 font-mono text-sm">ssl</h3>
                <div className="space-y-2 text-sm text-zinc-400">
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">valid</code>
                    <span>Boolean &mdash; whether the SSL certificate is valid</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">issuer</code>
                    <span>Certificate issuer (e.g. &quot;Let&apos;s Encrypt&quot;)</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">expires</code>
                    <span>Certificate expiration date</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">days_remaining</code>
                    <span>Days until certificate expires</span>
                  </div>
                </div>
              </div>

              {/* social_media */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h3 className="font-semibold text-emerald-400 mb-3 font-mono text-sm">social_media</h3>
                <div className="space-y-2 text-sm text-zinc-400">
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">facebook</code>
                    <span>Facebook page URL (or null)</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">instagram</code>
                    <span>Instagram profile URL (or null)</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">linkedin</code>
                    <span>LinkedIn page URL (or null)</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <code className="text-zinc-300 text-xs">twitter</code>
                    <span>Twitter/X profile URL (or null)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Code Examples */}
          <section id="code-examples" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-zinc-800">Code Examples</h2>

            {/* curl */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-zinc-300 mb-3">curl</h3>
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm font-mono text-zinc-300 whitespace-pre">{`curl -X POST https://ukbusinessintel.com/api/v1/enrich \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ukb_your_api_key_here" \\
  -d '{
    "business_name": "Greggs",
    "location": "Newcastle"
  }'`}</pre>
              </div>
            </div>

            {/* Python */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-zinc-300 mb-3">Python (requests)</h3>
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm font-mono text-zinc-300 whitespace-pre">{`import requests

response = requests.post(
    "https://ukbusinessintel.com/api/v1/enrich",
    headers={
        "Content-Type": "application/json",
        "x-api-key": "ukb_your_api_key_here"
    },
    json={
        "business_name": "Greggs",
        "location": "Newcastle"
    }
)

data = response.json()
print(f"Company: {data['companies_house']['company_name']}")
print(f"Status: {data['companies_house']['company_status']}")
print(f"Rating: {data['google_places']['rating']}/5")`}</pre>
              </div>
            </div>

            {/* Node.js */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-zinc-300 mb-3">Node.js (fetch)</h3>
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm font-mono text-zinc-300 whitespace-pre">{`const response = await fetch("https://ukbusinessintel.com/api/v1/enrich", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "ukb_your_api_key_here"
  },
  body: JSON.stringify({
    business_name: "Greggs",
    location: "Newcastle"
  })
});

const data = await response.json();
console.log(\`Company: \${data.companies_house.company_name}\`);
console.log(\`Status: \${data.companies_house.company_status}\`);
console.log(\`Rating: \${data.google_places.rating}/5\`);`}</pre>
              </div>
            </div>

            {/* MCP */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-zinc-300 mb-3">MCP Setup (Claude Desktop / Cursor)</h3>
              <p className="text-sm text-zinc-400 mb-3">
                Add this to your Claude Desktop or Cursor MCP config:
              </p>
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm font-mono text-zinc-300 whitespace-pre">{`{
  "mcpServers": {
    "uk-business-intel": {
      "command": "npx",
      "args": ["-y", "uk-business-intelligence-mcp"]
    }
  }
}`}</pre>
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Once configured, you can ask Claude: &quot;Look up Greggs in Newcastle&quot; and it will call the API automatically.
              </p>
            </div>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-zinc-800">Rate Limits</h2>
            <p className="text-sm text-zinc-400 mb-6">
              Rate limits are applied per API key. Exceeding the limit returns <code className="text-red-400 bg-zinc-900 px-1.5 py-0.5 rounded text-xs">429 Too Many Requests</code>.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-left">
                    <th className="px-4 py-3 text-zinc-400 font-medium">Plan</th>
                    <th className="px-4 py-3 text-zinc-400 font-medium">Rate Limit</th>
                    <th className="px-4 py-3 text-zinc-400 font-medium">Monthly Quota</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3">Free</td>
                    <td className="px-4 py-3 text-zinc-400">10 requests/min</td>
                    <td className="px-4 py-3 text-zinc-400">100 lookups</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3">Starter</td>
                    <td className="px-4 py-3 text-zinc-400">60 requests/min</td>
                    <td className="px-4 py-3 text-zinc-400">1,000 lookups</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3">Growth</td>
                    <td className="px-4 py-3 text-zinc-400">120 requests/min</td>
                    <td className="px-4 py-3 text-zinc-400">5,000 lookups</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Scale</td>
                    <td className="px-4 py-3 text-zinc-400">120 requests/min</td>
                    <td className="px-4 py-3 text-zinc-400">25,000 lookups</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Pricing */}
          <section id="pricing" className="mb-16 scroll-mt-28">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-zinc-800">Pricing</h2>
            <p className="text-sm text-zinc-400 mb-4">
              Start free with 100 lookups/month. No credit card required.
            </p>
            <p className="text-sm text-zinc-400">
              See the full pricing breakdown and sign up on the{' '}
              <a href="/#pricing" className="text-emerald-400 hover:underline">main pricing page</a>.
            </p>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-black font-bold text-xs">
              UK
            </div>
            <span className="text-sm text-zinc-400">Business Intelligence API</span>
          </a>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="/docs" className="hover:text-zinc-300 transition-colors">API Docs</a>
            <a href="/#pricing" className="hover:text-zinc-300 transition-colors">Pricing</a>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
