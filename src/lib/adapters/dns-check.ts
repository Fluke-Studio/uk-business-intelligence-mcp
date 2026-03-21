import dns from 'dns/promises';
import tls from 'tls';
import { DataSourceAdapter, AdapterInput, AdapterResult } from './types';

interface DnsCheckData {
  is_live: boolean;
  http_status: number | null;
  ssl_valid: boolean;
  ssl_expiry: string | null;
}

async function checkDns(domain: string): Promise<boolean> {
  try {
    await dns.resolve(domain);
    return true;
  } catch {
    return false;
  }
}

async function checkHttp(domain: string): Promise<number | null> {
  try {
    const res = await fetch(`https://${domain}`, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
    });
    return res.status;
  } catch {
    // Try HTTP if HTTPS fails
    try {
      const res = await fetch(`http://${domain}`, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(5000),
      });
      return res.status;
    } catch {
      return null;
    }
  }
}

function checkSsl(domain: string): Promise<{ valid: boolean; expiry: string | null }> {
  return new Promise((resolve) => {
    let socket: tls.TLSSocket | null = null;

    const timeout = setTimeout(() => {
      socket?.destroy();
      resolve({ valid: false, expiry: null });
    }, 5000);

    try {
      socket = tls.connect(443, domain, { servername: domain }, () => {
        clearTimeout(timeout);
        const cert = socket!.getPeerCertificate();
        const valid = !socket!.authorizationError;
        const expiry = cert.valid_to
          ? new Date(cert.valid_to).toISOString()
          : null;
        socket!.destroy();
        resolve({ valid, expiry });
      });

      socket.on('error', () => {
        clearTimeout(timeout);
        socket?.destroy();
        resolve({ valid: false, expiry: null });
      });
    } catch {
      clearTimeout(timeout);
      socket?.destroy();
      resolve({ valid: false, expiry: null });
    }
  });
}

export const dnsCheckAdapter: DataSourceAdapter<DnsCheckData> = {
  source: 'dns',
  cacheTtlSeconds: 86400, // 24 hours

  getCacheKey(input: AdapterInput): string | null {
    if (input.domain) return `dns:${input.domain}`;
    return null;
  },

  async fetch(input: AdapterInput): Promise<AdapterResult<DnsCheckData>> {
    if (!input.domain) {
      return { success: false, data: null, source: 'dns', cached: false, error: 'No domain provided' };
    }

    try {
      const [dnsOk, httpStatus, sslInfo] = await Promise.all([
        checkDns(input.domain),
        checkHttp(input.domain),
        checkSsl(input.domain),
      ]);

      const data: DnsCheckData = {
        is_live: dnsOk && httpStatus !== null,
        http_status: httpStatus,
        ssl_valid: sslInfo.valid,
        ssl_expiry: sslInfo.expiry,
      };

      return { success: true, data, source: 'dns', cached: false };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, data: null, source: 'dns', cached: false, error: message };
    }
  },
};
