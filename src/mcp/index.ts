#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server';
import { validateEnv } from '@/lib/config/env';

async function main() {
  const { valid, missing } = validateEnv();
  if (!valid) {
    console.error(`Warning: Missing env vars: ${missing.join(', ')}. Some lookups will fail.`);
  }

  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('UK Business Intelligence MCP server running on stdio');
}

main().catch((err) => {
  console.error('Fatal error starting MCP server:', err);
  process.exit(1);
});
