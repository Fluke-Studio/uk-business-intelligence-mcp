# MCP Directory Submissions — Status Tracker

## Submission Status (as of 2026-03-21)

| Directory | Status | Link/Notes |
|-----------|--------|------------|
| **Official MCP Registry** | **LIVE** | `io.github.Fluke-Studio/uk-business-intelligence` v0.1.3 |
| awesome-mcp-servers (punkpeye) | PR open | [PR #3655](https://github.com/punkpeye/awesome-mcp-servers/pull/3655) — em-dash fixed, awaiting merge (~1.1k open PRs) |
| awesome-mcp-servers (wong2) | BLOCKED | Repo has disabled pull requests entirely |
| Glama | Listed | [glama.ai](https://glama.ai/mcp/servers/Fluke-Studio/uk-business-intelligence-mcp) — shows "cannot be installed" (stdio limitation), badge works |
| MCP.so | Submitted | Server created, awaiting moderation |
| PulseMCP | Pending | Auto-ingests from official MCP registry weekly |
| MCP Hub | Not submitted | https://mcphub.io/ — JS-rendered, needs manual submission |
| mcpmarket.com | Not submitted | Was rate-limited, retry later |

---

## 1. awesome-mcp-servers (punkpeye) — LARGEST LIST

**Status:** PR #3655 open, labels: `valid-name` (green), `has-glama` (green), `has-emoji` (green — was triggered by em-dash, now fixed)

**PR:** https://github.com/punkpeye/awesome-mcp-servers/pull/3655

---

## 2. awesome-mcp-servers (wong2) — BLOCKED

**Status:** Repository owner has disabled pull requests. Cannot submit.

Fork with branch ready at: https://github.com/Fluke-Studio/awesome-mcp-servers-1/tree/add-uk-business-intelligence

---

## 3. Official MCP Registry — LIVE

**Published via:** `mcp-publisher` CLI with GitHub auth

**Server name:** `io.github.Fluke-Studio/uk-business-intelligence`

**Verify:** `curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.Fluke-Studio/uk-business-intelligence"`

**Files added:** `server.json` (manifest), `mcpName` field in `package.json`

---

## 4. Glama MCP Directory — LISTED

**URL:** https://glama.ai/mcp/servers/Fluke-Studio/uk-business-intelligence-mcp

**Notes:** Listed but shows "cannot be installed" with security/quality "not tested". This is expected for stdio-based servers. The badge SVG works and is used in the punkpeye PR.

---

## 5. MCP.so — SUBMITTED

**Status:** Server created via web form (logged in as Fluke-Studio). Got green tick on submission but doesn't appear in "My Servers" dashboard yet. Likely in moderation queue.

---

## 6. PulseMCP — PENDING

**How it works:** PulseMCP ingests from the official MCP registry daily and processes entries weekly. Since we're now in the official registry, this should auto-list within a week. No manual submission needed.

**Verify:** Check https://www.pulsemcp.com/servers in a few days.

---

## 7. MCP Hub — NOT SUBMITTED

**URL:** https://mcphub.io/

**Notes:** Site is JS-rendered (WebFetch couldn't read it). Needs manual browser submission. Low priority.

---

## 8. mcpmarket.com — NOT SUBMITTED

**URL:** https://mcpmarket.com/

**Notes:** Was rate-limited (HTTP 429) when checking. Try again later.

**Submission details:**
- **Name:** UK Business Intelligence
- **GitHub:** https://github.com/Fluke-Studio/uk-business-intelligence-mcp
- **npm:** uk-business-intelligence-mcp
- **Website:** https://ukbusinessintel.com

---

## Next Actions

- [ ] Check punkpeye PR #3655 in a few days — if `has-emoji` label persists, investigate further
- [ ] Check PulseMCP in ~1 week for auto-listing from official registry
- [ ] Retry mcpmarket.com submission
- [ ] Try MCP Hub submission via browser
- [ ] Check MCP.so moderation status
