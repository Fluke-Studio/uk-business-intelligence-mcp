'use client';

import { useState } from 'react';

const SAMPLE_RESPONSE = {
  query: {
    business_name: 'Greggs',
    location: 'Newcastle',
    company_number: null,
    domain: null,
  },
  companies_house: {
    company_number: '00502851',
    company_name: 'GREGGS PLC',
    company_status: 'active',
    incorporation_date: '1951-09-22',
    company_type: 'plc',
    sic_codes: ['10710', '47240'],
    registered_address: {
      address_line_1: 'Greggs House',
      address_line_2: 'Quorum Business Park',
      locality: 'Newcastle Upon Tyne',
      region: 'Tyne and Wear',
      postal_code: 'NE12 8BU',
      country: 'England',
    },
    directors: [
      { name: 'SHERWOOD, Roisin', role: 'director', appointed_on: '2019-05-01', resigned_on: null },
      { name: 'SHERWOOD, Katie', role: 'director', appointed_on: '2022-09-05', resigned_on: null },
    ],
  },
  google_places: {
    place_id: 'ChIJx9k5WQ1yfkgRnx-XPkd9DGw',
    display_name: 'Greggs',
    formatted_address: 'Northumberland St, Newcastle upon Tyne NE1 7DE',
    rating: 4.1,
    review_count: 1847,
    phone: '0191 232 7749',
    website: 'https://www.greggs.co.uk',
    google_maps_url: 'https://maps.google.com/?cid=7771234567890',
  },
  website: {
    domain: 'greggs.co.uk',
    is_live: true,
    http_status: 200,
    ssl_valid: true,
    ssl_expiry: '2027-01-15T00:00:00Z',
  },
  social: {
    facebook: 'https://facebook.com/GreggsFans',
    instagram: 'https://instagram.com/greaboratorsuk',
    linkedin: 'https://linkedin.com/company/greggs',
    twitter: 'https://twitter.com/GreggsOfficial',
  },
  meta: {
    sources_successful: ['companies_house', 'google_places', 'dns', 'scrape'],
    sources_failed: [],
    sources_skipped: [],
    cached_sources: [],
    enriched_at: '2026-03-21T14:30:00.000Z',
    duration_ms: 1247,
  },
};

const SAMPLE_REQUEST = `curl -X POST https://ukbusinessintel.com/api/v1/enrich \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ukb_your_api_key_here" \\
  -d '{
    "business_name": "Greggs",
    "location": "Newcastle"
  }'`;

const MCP_CONFIG = `{
  "mcpServers": {
    "uk-business-intel": {
      "command": "npx",
      "args": ["-y", "uk-business-intelligence-mcp"]
    }
  }
}`;

export default function DemoSection() {
  const [activeTab, setActiveTab] = useState<'request' | 'response' | 'mcp'>('request');

  const tabs = [
    { id: 'request' as const, label: 'API Request' },
    { id: 'response' as const, label: 'Response' },
    { id: 'mcp' as const, label: 'MCP Setup' },
  ];

  return (
    <section id="demo" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">See It in Action</h2>
        <p className="text-zinc-400 text-center mb-10 max-w-xl mx-auto">
          Send a business name. Get back everything.
        </p>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="flex border-b border-zinc-800 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-emerald-400 border-b-2 border-emerald-400 bg-zinc-800/50'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-3 sm:p-6 overflow-x-auto">
            <pre className="text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
              <code className="text-zinc-300">
                {activeTab === 'request' && SAMPLE_REQUEST}
                {activeTab === 'response' && JSON.stringify(SAMPLE_RESPONSE, null, 2)}
                {activeTab === 'mcp' && MCP_CONFIG}
              </code>
            </pre>
          </div>
        </div>

        {activeTab === 'response' && (
          <p className="text-zinc-500 text-xs text-center mt-4">
            Sample response for illustration. Actual data comes from live APIs.
          </p>
        )}
        {activeTab === 'mcp' && (
          <p className="text-zinc-500 text-xs text-center mt-4">
            Add this to your Claude Desktop config. That&apos;s it &mdash; Claude can now look up any UK business.
          </p>
        )}
      </div>
    </section>
  );
}
