import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { enrichBusiness } from '@/lib/services/enrichment';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'uk-business-intelligence',
    version: '0.1.0',
  });

  const inputSchema = {
    business_name: z.string().min(1).max(200)
      .describe('The business name to look up (e.g. "Greggs", "Nando\'s")'),
    location: z.string().min(1).max(200)
      .describe('City, town, or area in the UK (e.g. "Manchester", "Bristol")'),
    company_number: z.string()
      .regex(/^([0-9]{8}|[A-Za-z]{2}[0-9]{6})$/)
      .describe('Companies House number — 8 digits or 2 letters + 6 digits. Optional.')
      .optional(),
    domain: z.string().max(253)
      .regex(/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i)
      .describe('Business website domain without protocol (e.g. "greggs.co.uk"). Optional.')
      .optional(),
  };

  server.registerTool(
    'enrich_uk_business',
    {
      title: 'Enrich UK Business',
      description:
        'Get a comprehensive profile of any UK business. Returns Companies House data ' +
        '(company status, directors, SIC codes), Google Places ratings and reviews, ' +
        'website/SSL status, and social media links — all from a single lookup. ' +
        'Provide a business name and location (city or town). Optionally include a ' +
        'Companies House number or website domain for more precise results.',
      inputSchema,
    },
    async (args) => {
      try {
        const profile = await enrichBusiness({
          business_name: args.business_name,
          location: args.location,
          company_number: args.company_number,
          domain: args.domain,
        });

        return {
          content: [{ type: 'text' as const, text: JSON.stringify(profile, null, 2) }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error during enrichment';
        return {
          content: [{ type: 'text' as const, text: `Enrichment failed: ${message}` }],
          isError: true,
        };
      }
    }
  );

  return server;
}
