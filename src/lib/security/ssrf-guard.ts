import dns from 'dns/promises';
import net from 'net';

const BLOCKED_IPV4_RANGES = [
  { prefix: [127], mask: 8 },         // 127.0.0.0/8  — loopback
  { prefix: [10], mask: 8 },          // 10.0.0.0/8   — private
  { prefix: [172, 16], mask: 12 },    // 172.16.0.0/12 — private
  { prefix: [192, 168], mask: 16 },   // 192.168.0.0/16 — private
  { prefix: [169, 254], mask: 16 },   // 169.254.0.0/16 — link-local / cloud metadata
  { prefix: [0], mask: 8 },           // 0.0.0.0/8    — current network
];

const BLOCKED_IPV6_PREFIXES = [
  '::1',      // loopback
  'fc',       // fc00::/7 — unique local (starts with fc or fd)
  'fd',
  'fe80',     // fe80::/10 — link-local
];

function isBlockedIPv4(ip: string): boolean {
  const octets = ip.split('.').map(Number);
  if (octets.length !== 4 || octets.some((o) => isNaN(o))) return true;

  for (const range of BLOCKED_IPV4_RANGES) {
    let match = true;
    for (let i = 0; i < range.prefix.length; i++) {
      if (octets[i] !== range.prefix[i]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }

  return false;
}

function isBlockedIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  return BLOCKED_IPV6_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function isBlockedIP(ip: string): boolean {
  if (net.isIPv4(ip)) return isBlockedIPv4(ip);
  if (net.isIPv6(ip)) return isBlockedIPv6(ip);
  return true; // block unrecognised formats
}

export async function validateDomainSafety(
  domain: string
): Promise<{ safe: boolean; error?: string }> {
  try {
    // Resolve IPv4 addresses
    let ipv4Addrs: string[] = [];
    try {
      ipv4Addrs = await dns.resolve4(domain);
    } catch {
      // No A records — might be IPv6-only, continue
    }

    // Resolve IPv6 addresses
    let ipv6Addrs: string[] = [];
    try {
      ipv6Addrs = await dns.resolve6(domain);
    } catch {
      // No AAAA records — might be IPv4-only, continue
    }

    const allIps = [...ipv4Addrs, ...ipv6Addrs];

    if (allIps.length === 0) {
      return { safe: false, error: 'Domain does not resolve' };
    }

    for (const ip of allIps) {
      if (isBlockedIP(ip)) {
        return { safe: false, error: 'Domain resolves to a private or reserved IP address' };
      }
    }

    return { safe: true };
  } catch {
    return { safe: false, error: 'DNS resolution failed' };
  }
}
