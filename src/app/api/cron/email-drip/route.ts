import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Missing RESEND_API_KEY');
  _resend = new Resend(key);
  return _resend;
}

const FROM = 'UK Business Intel <noreply@ukbusinessintel.com>';

// Brand email wrapper matching existing email.ts style
function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090b; color: #fafafa; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto;">
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 32px;">
      <div style="width: 32px; height: 32px; background: #10b981; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #000; font-weight: bold; font-size: 12px;">UK</div>
      <span style="font-weight: 600; font-size: 14px;">Business Intel API</span>
    </div>

    ${content}

    <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;">
    <p style="color: #52525b; font-size: 11px; text-align: center;">
      UK Business Intel API &mdash; <a href="https://ukbusinessintel.com" style="color: #52525b;">ukbusinessintel.com</a>
    </p>
  </div>
</body>
</html>`;
}

// --- Email templates ---

function day1Email(): { subject: string; html: string } {
  return {
    subject: 'Quick check — have you tried your first lookup?',
    html: emailWrapper(`
      <h1 style="font-size: 24px; margin-bottom: 8px;">Did you make your first API call?</h1>
      <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">
        You signed up yesterday but haven't made a lookup yet. It only takes a few seconds to try it out.
      </p>

      <h2 style="font-size: 16px; margin-bottom: 12px;">Try it now</h2>
      <div style="background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <pre style="margin: 0; font-size: 12px; color: #d4d4d8; white-space: pre-wrap; word-break: break-all;">curl -X POST https://ukbusinessintel.com/api/v1/enrich \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{"business_name": "Greggs", "location": "Newcastle"}'</pre>
      </div>

      <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">
        Replace <code style="color: #34d399;">YOUR_API_KEY</code> with the key from your signup email. You'll get back company data, Google reviews, website health, and social links — all in one call.
      </p>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="https://ukbusinessintel.com/#docs" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">View API Documentation</a>
      </div>
    `),
  };
}

function day3Email(): { subject: string; html: string } {
  return {
    subject: '5 things you can build with UK Business Intel',
    html: emailWrapper(`
      <h1 style="font-size: 24px; margin-bottom: 8px;">5 things you can build</h1>
      <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">
        Here are the most popular ways developers and agencies use the API:
      </p>

      <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <ol style="color: #d4d4d8; font-size: 14px; padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 12px;"><strong style="color: #fafafa;">CRM Enrichment</strong><br><span style="color: #a1a1aa;">Auto-fill company details, directors, and reviews when a lead enters your pipeline.</span></li>
          <li style="margin-bottom: 12px;"><strong style="color: #fafafa;">Lead Scoring</strong><br><span style="color: #a1a1aa;">Score prospects by company age, review count, SSL status, and social presence.</span></li>
          <li style="margin-bottom: 12px;"><strong style="color: #fafafa;">Due Diligence</strong><br><span style="color: #a1a1aa;">Instant company checks — directors, SIC codes, incorporation date, live status.</span></li>
          <li style="margin-bottom: 12px;"><strong style="color: #fafafa;">Local SEO Audits</strong><br><span style="color: #a1a1aa;">Check if a business has a live website, valid SSL, and Google presence in one call.</span></li>
          <li style="margin-bottom: 0;"><strong style="color: #fafafa;">Competitor Monitoring</strong><br><span style="color: #a1a1aa;">Track ratings, review counts, and website status for competitors over time.</span></li>
        </ol>
      </div>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="https://ukbusinessintel.com/#docs" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">Explore the Docs</a>
      </div>
    `),
  };
}

function day7Email(lookupCount: number): { subject: string; html: string } {
  return {
    subject: 'Your first week with UK Business Intel',
    html: emailWrapper(`
      <h1 style="font-size: 24px; margin-bottom: 8px;">Your first week in review</h1>
      <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">
        Here's a quick snapshot of your usage so far.
      </p>

      <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
        <p style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Lookups this month</p>
        <p style="color: #34d399; font-size: 36px; font-weight: 700; margin: 0;">${lookupCount} <span style="font-size: 16px; color: #71717a;">/ 100</span></p>
      </div>

      <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">
        ${lookupCount > 0
          ? 'Great start! Keep going — you have plenty of free lookups left this month.'
          : "You haven't used any lookups yet. Give the API a try — it's free to start."}
      </p>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="https://ukbusinessintel.com/#docs" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">View Documentation</a>
      </div>
    `),
  };
}

function day14Email(): { subject: string; html: string } {
  return {
    subject: 'Ready to scale your business lookups?',
    html: emailWrapper(`
      <h1 style="font-size: 24px; margin-bottom: 8px;">Ready to scale up?</h1>
      <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 24px;">
        You've been using UK Business Intel for two weeks now. If you're finding it useful, the Starter plan unlocks more power.
      </p>

      <div style="background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="color: #71717a; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0;">Starter Plan</p>
        <p style="color: #fafafa; font-size: 28px; font-weight: 700; margin: 0 0 16px 0;">&pound;29<span style="font-size: 14px; color: #71717a;">/mo</span></p>
        <ul style="color: #d4d4d8; font-size: 14px; padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 8px;"><strong>1,000 lookups/month</strong> (10x the free plan)</li>
          <li style="margin-bottom: 8px;"><strong>Higher rate limits</strong> — 30 requests/min</li>
          <li style="margin-bottom: 8px;"><strong>Overage support</strong> — keep going past your limit</li>
          <li style="margin-bottom: 0;"><strong>Priority support</strong> via email</li>
        </ul>
      </div>

      <div style="text-align: center; margin-bottom: 32px;">
        <a href="https://ukbusinessintel.com/#pricing" style="display: inline-block; background: #10b981; color: #000; font-weight: 600; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px;">View Pricing</a>
      </div>

      <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 0;">
        No pressure — the free plan isn't going anywhere. But if you're building something serious, the Starter plan is built for you.
      </p>
    `),
  };
}

// --- Helpers ---

/** Get the date string for N days ago in YYYY-MM-DD format (UTC) */
function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().split('T')[0];
}

interface DripUser {
  id: string;
  email: string;
  plan: string;
  lookup_count: number;
}

/** Query users who signed up on a specific date */
async function getUsersSignedUpOn(dateStr: string): Promise<DripUser[]> {
  const dayStart = `${dateStr}T00:00:00.000Z`;
  const dayEnd = `${dateStr}T23:59:59.999Z`;

  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, plan, created_at')
    .gte('created_at', dayStart)
    .lte('created_at', dayEnd);

  if (error || !users || users.length === 0) return [];

  // Get lookup counts for these users
  const userIds = users.map((u: { id: string }) => u.id);

  const { data: apiKeys } = await supabase
    .from('api_keys')
    .select('id, user_id')
    .in('user_id', userIds);

  if (!apiKeys || apiKeys.length === 0) {
    return users.map((u: { id: string; email: string; plan: string }) => ({
      id: u.id,
      email: u.email,
      plan: u.plan,
      lookup_count: 0,
    }));
  }

  const apiKeyIds = apiKeys.map((k: { id: string }) => k.id);

  // Get current month usage
  const now = new Date();
  const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

  const { data: usageRows } = await supabase
    .from('usage')
    .select('api_key_id, lookup_count')
    .in('api_key_id', apiKeyIds)
    .eq('month', currentMonth);

  // Map api_key_id -> user_id
  const keyToUser = new Map<string, string>();
  for (const k of apiKeys) {
    keyToUser.set(k.id, k.user_id);
  }

  // Sum lookup counts per user
  const userUsage = new Map<string, number>();
  if (usageRows) {
    for (const row of usageRows) {
      const userId = keyToUser.get(row.api_key_id);
      if (userId) {
        userUsage.set(userId, (userUsage.get(userId) || 0) + (row.lookup_count || 0));
      }
    }
  }

  return users.map((u: { id: string; email: string; plan: string }) => ({
    id: u.id,
    email: u.email,
    plan: u.plan,
    lookup_count: userUsage.get(u.id) || 0,
  }));
}

async function sendDripEmail(
  to: string,
  email: { subject: string; html: string }
): Promise<boolean> {
  try {
    const resend = getResend();
    await resend.emails.send({
      from: FROM,
      to,
      subject: email.subject,
      html: email.html,
    });
    return true;
  } catch (err) {
    console.error(`[email-drip] Failed to send to ${to}:`, err);
    return false;
  }
}

// --- Main handler ---

export async function GET(request: NextRequest) {
  // Verify this is a legitimate Vercel cron request
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET ?? '';

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const results = { day1: 0, day3: 0, day7: 0, day14: 0, errors: 0 };

  try {
    // Day 1: signed up yesterday, 0 usage — nudge to make first call
    const day1Users = await getUsersSignedUpOn(daysAgo(1));
    for (const user of day1Users) {
      if (user.lookup_count === 0) {
        const ok = await sendDripEmail(user.email, day1Email());
        if (ok) { results.day1++; } else { results.errors++; }
      }
    }

    // Day 3: signed up 3 days ago — use case inspiration
    const day3Users = await getUsersSignedUpOn(daysAgo(3));
    for (const user of day3Users) {
      const ok = await sendDripEmail(user.email, day3Email());
      if (ok) { results.day3++; } else { results.errors++; }
    }

    // Day 7: signed up 7 days ago — usage summary
    const day7Users = await getUsersSignedUpOn(daysAgo(7));
    for (const user of day7Users) {
      const ok = await sendDripEmail(user.email, day7Email(user.lookup_count));
      if (ok) { results.day7++; } else { results.errors++; }
    }

    // Day 14: signed up 14 days ago, free plan, usage > 0 — upgrade nudge
    const day14Users = await getUsersSignedUpOn(daysAgo(14));
    for (const user of day14Users) {
      if (user.plan === 'free' && user.lookup_count > 0) {
        const ok = await sendDripEmail(user.email, day14Email());
        if (ok) { results.day14++; } else { results.errors++; }
      }
    }

    const totalSent = results.day1 + results.day3 + results.day7 + results.day14;
    console.log(`[email-drip] Sent ${totalSent} emails, ${results.errors} errors`, results);

    return Response.json({
      success: true,
      sent: totalSent,
      breakdown: results,
    });
  } catch (err) {
    console.error('[email-drip] Cron job failed:', err);
    return Response.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}
