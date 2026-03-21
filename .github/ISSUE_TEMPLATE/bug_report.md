---
name: Bug report
about: Report a bug with the API or MCP server
title: ''
labels: bug
assignees: ''
---

**Describe the bug**
A clear description of what the bug is.

**To reproduce**
Steps or API request to reproduce:
```bash
curl -X POST https://ukbusinessintel.com/api/v1/enrich \
  -H "X-API-Key: your-key" \
  -H "Content-Type: application/json" \
  -d '{"business_name": "...", "location": "..."}'
```

**Expected behavior**
What you expected to happen.

**Actual response**
Paste the JSON response or error message.

**Environment**
- Using: [API / MCP Server / Both]
- MCP client (if applicable): [Claude Desktop / Cursor / Other]
